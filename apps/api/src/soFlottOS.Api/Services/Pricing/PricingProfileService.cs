using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Dtos.Pricing;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>Admin CRUD for pricing profiles plus the precedence lookup used by the engine (spec 9).</summary>
public interface IPricingProfileService
{
    Task<IReadOnlyList<PricingProfileResponse>> ListAsync(CancellationToken ct);

    Task<PricingProfileResponse> GetAsync(int id, CancellationToken ct);

    Task<PricingProfileResponse> CreateAsync(SavePricingProfileRequest request, CurrentUser user, CancellationToken ct);

    Task<PricingProfileResponse> UpdateAsync(int id, SavePricingProfileRequest request, CurrentUser user, CancellationToken ct);

    /// <summary>
    /// Finds the profile to use: client-specific for the service → default for the service →
    /// default for the business unit. Returns null when nothing is configured.
    /// </summary>
    Task<PricingProfile?> ResolveAsync(ServiceType serviceType, int? clientId, int? explicitProfileId, DateOnly today, CancellationToken ct);
}

public sealed class PricingProfileService(AppDbContext db, IPricingAuditService audit) : IPricingProfileService
{
    public async Task<IReadOnlyList<PricingProfileResponse>> ListAsync(CancellationToken ct) =>
        (await Query().OrderBy(p => p.BusinessUnit).ThenBy(p => p.ServiceType).ThenByDescending(p => p.IsDefault).ThenBy(p => p.Name).ToListAsync(ct))
        .Select(ToResponse).ToList();

    public async Task<PricingProfileResponse> GetAsync(int id, CancellationToken ct) =>
        ToResponse(await Query().FirstOrDefaultAsync(p => p.Id == id, ct) ?? throw new NotFoundException($"Pricing profile {id} was not found."));

    public async Task<PricingProfileResponse> CreateAsync(SavePricingProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateAsync(request, ct);
        var entity = new PricingProfile();
        Apply(entity, request);
        db.PricingProfiles.Add(entity);
        await ClearOtherDefaultsAsync(entity, ct);
        await db.SaveChangesAsync(ct);
        await audit.RecordAsync(nameof(PricingProfile), entity.Id, PricingAuditAction.Created, Describe(entity, "created"), user, ct);
        return await GetAsync(entity.Id, ct);
    }

    public async Task<PricingProfileResponse> UpdateAsync(int id, SavePricingProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateAsync(request, ct);
        var entity = await db.PricingProfiles.Include(p => p.Rates).FirstOrDefaultAsync(p => p.Id == id, ct)
                     ?? throw new NotFoundException($"Pricing profile {id} was not found.");
        var wasUsed = await db.PricingCalculations.AnyAsync(c => c.PricingProfileId == id && !c.IsSimulation, ct);
        Apply(entity, request);
        if (wasUsed)
        {
            entity.Version++;
        }

        await ClearOtherDefaultsAsync(entity, ct);
        await db.SaveChangesAsync(ct);
        await audit.RecordAsync(nameof(PricingProfile), entity.Id, wasUsed ? PricingAuditAction.NewVersion : PricingAuditAction.Updated,
            Describe(entity, wasUsed ? $"updated to version {entity.Version}" : "updated"), user, ct);
        return await GetAsync(entity.Id, ct);
    }

    public async Task<PricingProfile?> ResolveAsync(ServiceType serviceType, int? clientId, int? explicitProfileId, DateOnly today, CancellationToken ct)
    {
        var candidates = await Query().AsNoTracking()
            .Where(p => p.IsActive
                        && (p.EffectiveFrom == null || p.EffectiveFrom <= today)
                        && (p.EffectiveTo == null || p.EffectiveTo >= today))
            .Where(p => explicitProfileId != null ? p.Id == explicitProfileId : (p.ServiceType == serviceType || p.ServiceType == null))
            .ToListAsync(ct);

        if (explicitProfileId is not null)
        {
            return candidates.FirstOrDefault();
        }

        var unit = serviceType.BusinessUnit();
        return candidates.FirstOrDefault(p => p.ServiceType == serviceType && p.ClientId != null && p.ClientId == clientId)
               ?? candidates.Where(p => p.ServiceType == serviceType && p.ClientId == null).OrderByDescending(p => p.IsDefault).ThenBy(p => p.Id).FirstOrDefault()
               ?? candidates.Where(p => p.ServiceType == null && p.ClientId == null && p.BusinessUnit == unit).OrderByDescending(p => p.IsDefault).ThenBy(p => p.Id).FirstOrDefault();
    }

    private IQueryable<PricingProfile> Query() => db.PricingProfiles
        .Include(p => p.Rates)
        .Include(p => p.Client)
        .Include(p => p.CostProfile)!.ThenInclude(c => c!.VehicleProfile)
        .Include(p => p.CostProfile)!.ThenInclude(c => c!.LabourProfile)
        .Include(p => p.CostProfile)!.ThenInclude(c => c!.Items).ThenInclude(l => l.CostItem);

    private async Task ValidateAsync(SavePricingProfileRequest r, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(r.Name))
        {
            throw new ValidationException("Name is required.");
        }

        if (r.ServiceType is { } st && st.BusinessUnit() != r.BusinessUnit)
        {
            throw new ValidationException($"Service '{st}' belongs to the {st.BusinessUnit()} business unit.");
        }

        switch (r.Strategy)
        {
            case PricingStrategyType.CostPlus when r.MarkupPercent is null or < 0:
                throw new ValidationException("Cost-plus needs a markup percentage (e.g. 25 for 25%).");
            case PricingStrategyType.TargetMargin when r.TargetMarginPercent is null or < 0 or >= 100:
                throw new ValidationException("Target margin needs a percentage between 0 and 99 (e.g. 20 for 20%).");
            case PricingStrategyType.FixedPrice when r.FixedPrice is null or < 0:
                throw new ValidationException("Fixed price needs a net price.");
            case PricingStrategyType.RateCard when r.Rates.Count == 0:
                throw new ValidationException("A rate card needs at least one rate line (e.g. 'Base fee' fixed + 'Per kilometre').");
        }

        if (r.Strategy is PricingStrategyType.CostPlus or PricingStrategyType.TargetMargin && r.CostProfileId is null)
        {
            throw new ValidationException("Cost-based strategies need a cost profile so the engine knows what the service costs.");
        }

        if (r.Rates.Any(x => string.IsNullOrWhiteSpace(x.Label) || x.Rate < 0 || x.IncludedQuantity < 0))
        {
            throw new ValidationException("Every rate line needs a label and non-negative rate / included quantity.");
        }

        if (r.EffectiveFrom is not null && r.EffectiveTo is not null && r.EffectiveTo < r.EffectiveFrom)
        {
            throw new ValidationException("Effective-to must not be before effective-from.");
        }

        if (r.ClientId is { } c && !await db.Clients.AnyAsync(x => x.Id == c, ct))
        {
            throw new ValidationException($"Client {c} does not exist.");
        }

        if (r.CostProfileId is { } cp && !await db.CostProfiles.AnyAsync(x => x.Id == cp, ct))
        {
            throw new ValidationException($"Cost profile {cp} does not exist.");
        }

        if (r.ClientId is not null && r.IsDefault)
        {
            throw new ValidationException("A client-specific profile cannot be the default; it already wins for that client.");
        }
    }

    private static void Apply(PricingProfile e, SavePricingProfileRequest r)
    {
        e.Name = r.Name.Trim();
        e.Description = string.IsNullOrWhiteSpace(r.Description) ? null : r.Description.Trim();
        e.BusinessUnit = r.BusinessUnit;
        e.ServiceType = r.ServiceType;
        e.ClientId = r.ClientId;
        e.CostProfileId = r.CostProfileId;
        e.Strategy = r.Strategy;
        e.MarkupPercent = r.MarkupPercent;
        e.TargetMarginPercent = r.TargetMarginPercent;
        e.FixedPrice = r.FixedPrice;
        e.MinimumPrice = r.MinimumPrice;
        e.MinimumMarginPercent = r.MinimumMarginPercent;
        e.Currency = string.IsNullOrWhiteSpace(r.Currency) ? "EUR" : r.Currency.Trim().ToUpperInvariant();
        e.IsDefault = r.IsDefault;
        e.EffectiveFrom = r.EffectiveFrom;
        e.EffectiveTo = r.EffectiveTo;
        e.IsActive = r.IsActive;

        e.Rates.Clear();
        var order = 0;
        foreach (var rate in r.Rates)
        {
            e.Rates.Add(new PricingProfileRate
            {
                Label = rate.Label.Trim(),
                Unit = rate.Unit,
                Rate = rate.Rate,
                IncludedQuantity = rate.IncludedQuantity,
                SortOrder = rate.SortOrder == 0 ? order : rate.SortOrder,
            });
            order++;
        }
    }

    /// <summary>Only one default per (business unit, service type) so the resolver is never ambiguous.</summary>
    private async Task ClearOtherDefaultsAsync(PricingProfile entity, CancellationToken ct)
    {
        if (!entity.IsDefault)
        {
            return;
        }

        var others = await db.PricingProfiles
            .Where(p => p.Id != entity.Id && p.IsDefault && p.BusinessUnit == entity.BusinessUnit && p.ServiceType == entity.ServiceType && p.ClientId == null)
            .ToListAsync(ct);
        foreach (var other in others)
        {
            other.IsDefault = false;
        }
    }

    private static string Describe(PricingProfile p, string verb)
    {
        var scope = p.ClientId is not null ? $"client #{p.ClientId}" : p.ServiceType?.ToString() ?? $"{p.BusinessUnit} fallback";
        var strategy = p.Strategy switch
        {
            PricingStrategyType.CostPlus => $"cost-plus {p.MarkupPercent:0.##}%",
            PricingStrategyType.TargetMargin => $"target margin {p.TargetMarginPercent:0.##}%",
            PricingStrategyType.FixedPrice => $"fixed {p.FixedPrice:0.00}",
            _ => $"rate card ({p.Rates.Count} lines)",
        };
        return $"Pricing profile '{p.Name}' {verb}: {scope}, {strategy}{(p.IsDefault ? ", default" : string.Empty)}.";
    }

    private static PricingProfileResponse ToResponse(PricingProfile p) => new(
        p.Id, p.Name, p.Description, p.BusinessUnit, p.ServiceType, p.ServiceType?.InvoiceCode(), p.ClientId, p.Client?.CompanyName,
        p.CostProfileId, p.CostProfile?.Name, p.Strategy, p.MarkupPercent, p.TargetMarginPercent, p.FixedPrice, p.MinimumPrice, p.MinimumMarginPercent,
        p.Currency, p.IsDefault, p.EffectiveFrom, p.EffectiveTo, p.Version, p.IsActive,
        p.Rates.OrderBy(r => r.SortOrder).ThenBy(r => r.Id).Select(r => new PricingRateResponse(r.Id, r.Label, r.Unit, r.Rate, r.IncludedQuantity, r.SortOrder)).ToList());
}
