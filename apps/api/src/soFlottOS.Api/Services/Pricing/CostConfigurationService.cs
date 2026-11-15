using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Dtos.Pricing;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>Admin CRUD for the cost side: categories, cost items, vehicle, labour and cost profiles.</summary>
public interface ICostConfigurationService
{
    Task<IReadOnlyList<CostCategoryResponse>> ListCategoriesAsync(CancellationToken ct);
    Task<CostCategoryResponse> CreateCategoryAsync(SaveCostCategoryRequest request, CurrentUser user, CancellationToken ct);
    Task<CostCategoryResponse> UpdateCategoryAsync(int id, SaveCostCategoryRequest request, CurrentUser user, CancellationToken ct);

    Task<IReadOnlyList<CostItemResponse>> ListItemsAsync(CancellationToken ct);
    Task<CostItemResponse> CreateItemAsync(SaveCostItemRequest request, CurrentUser user, CancellationToken ct);
    Task<CostItemResponse> UpdateItemAsync(int id, SaveCostItemRequest request, CurrentUser user, CancellationToken ct);

    Task<IReadOnlyList<VehicleProfileResponse>> ListVehiclesAsync(CancellationToken ct);
    Task<VehicleProfileResponse> CreateVehicleAsync(SaveVehicleProfileRequest request, CurrentUser user, CancellationToken ct);
    Task<VehicleProfileResponse> UpdateVehicleAsync(int id, SaveVehicleProfileRequest request, CurrentUser user, CancellationToken ct);

    Task<IReadOnlyList<LabourProfileResponse>> ListLabourAsync(CancellationToken ct);
    Task<LabourProfileResponse> CreateLabourAsync(SaveLabourProfileRequest request, CurrentUser user, CancellationToken ct);
    Task<LabourProfileResponse> UpdateLabourAsync(int id, SaveLabourProfileRequest request, CurrentUser user, CancellationToken ct);

    Task<IReadOnlyList<CostProfileResponse>> ListCostProfilesAsync(CancellationToken ct);
    Task<CostProfileResponse> CreateCostProfileAsync(SaveCostProfileRequest request, CurrentUser user, CancellationToken ct);
    Task<CostProfileResponse> UpdateCostProfileAsync(int id, SaveCostProfileRequest request, CurrentUser user, CancellationToken ct);
}

public sealed class CostConfigurationService(AppDbContext db, IPricingAuditService audit) : ICostConfigurationService
{
    // --- Categories ------------------------------------------------------------------

    public async Task<IReadOnlyList<CostCategoryResponse>> ListCategoriesAsync(CancellationToken ct) =>
        await db.CostCategories.AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new CostCategoryResponse(c.Id, c.Name, c.Description, c.BusinessUnit, c.IsActive, c.Items.Count))
            .ToListAsync(ct);

    public async Task<CostCategoryResponse> CreateCategoryAsync(SaveCostCategoryRequest request, CurrentUser user, CancellationToken ct)
    {
        RequireName(request.Name);
        var entity = new CostCategory();
        Apply(entity, request);
        db.CostCategories.Add(entity);
        await db.SaveChangesAsync(ct);
        await audit.RecordAsync(nameof(CostCategory), entity.Id, PricingAuditAction.Created, $"Cost category '{entity.Name}' created.", user, ct);
        return new CostCategoryResponse(entity.Id, entity.Name, entity.Description, entity.BusinessUnit, entity.IsActive, 0);
    }

    public async Task<CostCategoryResponse> UpdateCategoryAsync(int id, SaveCostCategoryRequest request, CurrentUser user, CancellationToken ct)
    {
        RequireName(request.Name);
        var entity = await db.CostCategories.Include(c => c.Items).FirstOrDefaultAsync(c => c.Id == id, ct)
                     ?? throw new NotFoundException($"Cost category {id} was not found.");
        Apply(entity, request);
        await db.SaveChangesAsync(ct);
        await audit.RecordAsync(nameof(CostCategory), entity.Id, PricingAuditAction.Updated, $"Cost category '{entity.Name}' updated.", user, ct);
        return new CostCategoryResponse(entity.Id, entity.Name, entity.Description, entity.BusinessUnit, entity.IsActive, entity.Items.Count);
    }

    private static void Apply(CostCategory entity, SaveCostCategoryRequest request)
    {
        entity.Name = request.Name.Trim();
        entity.Description = Clean(request.Description);
        entity.BusinessUnit = request.BusinessUnit;
        entity.IsActive = request.IsActive;
    }

    // --- Items -------------------------------------------------------------------------

    public async Task<IReadOnlyList<CostItemResponse>> ListItemsAsync(CancellationToken ct)
    {
        var items = await db.CostItems.AsNoTracking().Include(i => i.Category).OrderBy(i => i.Category.Name).ThenBy(i => i.Name).ToListAsync(ct);
        return items.Select(ToResponse).ToList();
    }

    public async Task<CostItemResponse> CreateItemAsync(SaveCostItemRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateItemAsync(request, ct);
        var entity = new CostItem();
        Apply(entity, request);
        db.CostItems.Add(entity);
        await db.SaveChangesAsync(ct);
        await db.Entry(entity).Reference(i => i.Category).LoadAsync(ct);
        await audit.RecordAsync(nameof(CostItem), entity.Id, PricingAuditAction.Created, $"Cost item '{entity.Name}' created: {entity.Amount:0.00} {entity.Currency} {entity.Frequency}, {entity.AllocationMethod}.", user, ct);
        return ToResponse(entity);
    }

    public async Task<CostItemResponse> UpdateItemAsync(int id, SaveCostItemRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateItemAsync(request, ct);
        var entity = await db.CostItems.Include(i => i.Category).FirstOrDefaultAsync(i => i.Id == id, ct)
                     ?? throw new NotFoundException($"Cost item {id} was not found.");
        var before = $"{entity.Amount:0.00} {entity.Frequency}";
        Apply(entity, request);
        await db.SaveChangesAsync(ct);
        await db.Entry(entity).Reference(i => i.Category).LoadAsync(ct);
        await BumpCostProfilesUsingItemAsync(entity.Id, ct);
        await audit.RecordAsync(nameof(CostItem), entity.Id, PricingAuditAction.Updated, $"Cost item '{entity.Name}' updated ({before} → {entity.Amount:0.00} {entity.Frequency}).", user, ct);
        return ToResponse(entity);
    }

    private async Task ValidateItemAsync(SaveCostItemRequest request, CancellationToken ct)
    {
        RequireName(request.Name);
        if (request.Amount < 0)
        {
            throw new ValidationException("Amount cannot be negative.");
        }

        var needsDenominator = request.Frequency < CostFrequency.PerHour
                               && request.AllocationMethod is not (AllocationMethod.WholeAmount or AllocationMethod.PercentageOfDirectCosts);
        if (needsDenominator && request.AllocationDenominator is not > 0)
        {
            throw new ValidationException("Allocation denominator is required: the yearly volume of the allocation driver, e.g. 240 working days or 60000 km.");
        }

        if (request.AllocationMethod == AllocationMethod.PercentageOfDirectCosts && request.AllocationDenominator is not > 0)
        {
            throw new ValidationException("Enter the percentage of direct costs (e.g. 10 for 10%) in the allocation denominator field.");
        }

        if (request.EffectiveFrom is not null && request.EffectiveTo is not null && request.EffectiveTo < request.EffectiveFrom)
        {
            throw new ValidationException("Effective-to must not be before effective-from.");
        }

        if (!await db.CostCategories.AnyAsync(c => c.Id == request.CostCategoryId, ct))
        {
            throw new ValidationException($"Cost category {request.CostCategoryId} does not exist.");
        }
    }

    private static void Apply(CostItem entity, SaveCostItemRequest request)
    {
        entity.Name = request.Name.Trim();
        entity.Description = Clean(request.Description);
        entity.CostCategoryId = request.CostCategoryId;
        entity.BusinessUnit = request.BusinessUnit;
        entity.CostType = request.CostType;
        entity.Amount = PricingCalculator.Round(request.Amount);
        entity.Currency = string.IsNullOrWhiteSpace(request.Currency) ? "EUR" : request.Currency.Trim().ToUpperInvariant();
        entity.Frequency = request.Frequency;
        entity.AllocationMethod = request.AllocationMethod;
        entity.AllocationDenominator = request.AllocationDenominator;
        entity.EffectiveFrom = request.EffectiveFrom;
        entity.EffectiveTo = request.EffectiveTo;
        entity.IsActive = request.IsActive;
    }

    private static CostItemResponse ToResponse(CostItem i)
    {
        decimal? annual = i.Frequency < CostFrequency.PerHour ? PricingCalculator.Annualise(i.Amount, i.Frequency) : null;
        decimal? unitCost = i.AllocationMethod switch
        {
            AllocationMethod.WholeAmount => i.Amount,
            AllocationMethod.PercentageOfDirectCosts => null,
            _ when annual is null => i.Amount,
            _ when i.AllocationDenominator is > 0 => decimal.Round(annual.Value / i.AllocationDenominator.Value, 4, MidpointRounding.AwayFromZero),
            _ => null,
        };
        return new CostItemResponse(i.Id, i.Name, i.Description, i.CostCategoryId, i.Category?.Name ?? string.Empty, i.BusinessUnit, i.CostType,
            i.Amount, i.Currency, i.Frequency, i.AllocationMethod, i.AllocationDenominator, i.EffectiveFrom, i.EffectiveTo, i.IsActive,
            annual is null ? null : PricingCalculator.Round(annual.Value), unitCost);
    }

    private async Task BumpCostProfilesUsingItemAsync(int itemId, CancellationToken ct)
    {
        var profiles = await db.CostProfiles.Where(p => p.Items.Any(l => l.CostItemId == itemId)).ToListAsync(ct);
        foreach (var profile in profiles)
        {
            profile.Version++;
        }

        if (profiles.Count > 0)
        {
            await db.SaveChangesAsync(ct);
        }
    }

    // --- Vehicles ----------------------------------------------------------------------

    public async Task<IReadOnlyList<VehicleProfileResponse>> ListVehiclesAsync(CancellationToken ct) =>
        (await db.VehicleProfiles.AsNoTracking().OrderBy(v => v.Name).ToListAsync(ct)).Select(ToResponse).ToList();

    public async Task<VehicleProfileResponse> CreateVehicleAsync(SaveVehicleProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        ValidateVehicle(request);
        var entity = new VehicleProfile();
        Apply(entity, request);
        db.VehicleProfiles.Add(entity);
        await db.SaveChangesAsync(ct);
        var response = ToResponse(entity);
        await audit.RecordAsync(nameof(VehicleProfile), entity.Id, PricingAuditAction.Created, $"Vehicle profile '{entity.Name}' created: {response.Derived.TotalCostPerKm:0.0000}/km.", user, ct);
        return response;
    }

    public async Task<VehicleProfileResponse> UpdateVehicleAsync(int id, SaveVehicleProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        ValidateVehicle(request);
        var entity = await db.VehicleProfiles.FirstOrDefaultAsync(v => v.Id == id, ct)
                     ?? throw new NotFoundException($"Vehicle profile {id} was not found.");
        Apply(entity, request);
        await db.SaveChangesAsync(ct);
        await BumpCostProfilesAsync(p => p.VehicleProfileId == id, ct);
        var response = ToResponse(entity);
        await audit.RecordAsync(nameof(VehicleProfile), entity.Id, PricingAuditAction.Updated, $"Vehicle profile '{entity.Name}' updated: now {response.Derived.TotalCostPerKm:0.0000}/km.", user, ct);
        return response;
    }

    private static void ValidateVehicle(SaveVehicleProfileRequest request)
    {
        RequireName(request.Name);
        if (request.ExpectedUsefulKilometres <= 0)
        {
            throw new ValidationException("Expected useful kilometres must be greater than zero.");
        }

        if (request.ExpectedResidualValue > request.PurchasePrice)
        {
            throw new ValidationException("Residual value cannot exceed the purchase price.");
        }

        if (request.OperatingDaysPerYear is <= 0 or > 366)
        {
            throw new ValidationException("Operating days per year must be between 1 and 366.");
        }

        if (request.ExpectedAnnualKilometres <= 0)
        {
            throw new ValidationException("Expected annual kilometres must be greater than zero.");
        }
    }

    private static void Apply(VehicleProfile e, SaveVehicleProfileRequest r)
    {
        e.Name = r.Name.Trim();
        e.Description = Clean(r.Description);
        e.PurchasePrice = r.PurchasePrice;
        e.PurchaseDate = r.PurchaseDate;
        e.ExpectedResidualValue = r.ExpectedResidualValue;
        e.ExpectedUsefulKilometres = r.ExpectedUsefulKilometres;
        e.FuelConsumptionPer100Km = r.FuelConsumptionPer100Km;
        e.FuelPricePerLitre = r.FuelPricePerLitre;
        e.TyreReplacementCost = r.TyreReplacementCost;
        e.TyreLifespanKm = r.TyreLifespanKm;
        e.BrakeReplacementCost = r.BrakeReplacementCost;
        e.BrakeLifespanKm = r.BrakeLifespanKm;
        e.ServiceCost = r.ServiceCost;
        e.ServiceIntervalKm = r.ServiceIntervalKm;
        e.AnnualInsurance = r.AnnualInsurance;
        e.AnnualVehicleTax = r.AnnualVehicleTax;
        e.MonthlyFinancingCost = r.MonthlyFinancingCost;
        e.AnnualOtherCosts = r.AnnualOtherCosts;
        e.OperatingDaysPerYear = r.OperatingDaysPerYear;
        e.ExpectedAnnualKilometres = r.ExpectedAnnualKilometres;
        e.IsActive = r.IsActive;
    }

    public static VehicleCostSummary Summarise(VehicleProfile v)
    {
        var depreciation = v.ExpectedUsefulKilometres > 0 ? (v.PurchasePrice - v.ExpectedResidualValue) / v.ExpectedUsefulKilometres : 0m;
        var fuel = v.FuelConsumptionPer100Km / 100m * v.FuelPricePerLitre;
        var tyres = v.TyreLifespanKm > 0 ? v.TyreReplacementCost / v.TyreLifespanKm : 0m;
        var brakes = v.BrakeLifespanKm > 0 ? v.BrakeReplacementCost / v.BrakeLifespanKm : 0m;
        var service = v.ServiceIntervalKm > 0 ? v.ServiceCost / v.ServiceIntervalKm : 0m;
        var distance = depreciation + fuel + tyres + brakes + service;
        var annualTime = v.AnnualInsurance + v.AnnualVehicleTax + v.MonthlyFinancingCost * 12m + v.AnnualOtherCosts;
        var timePerDay = v.OperatingDaysPerYear > 0 ? annualTime / v.OperatingDaysPerYear : 0m;
        var timePerKm = v.ExpectedAnnualKilometres > 0 ? annualTime / v.ExpectedAnnualKilometres : 0m;
        return new VehicleCostSummary(R4(depreciation), R4(fuel), R4(tyres), R4(brakes), R4(service), R4(distance),
            PricingCalculator.Round(annualTime), PricingCalculator.Round(timePerDay), R4(timePerKm), R4(distance + timePerKm));
    }

    private static VehicleProfileResponse ToResponse(VehicleProfile v) => new(
        v.Id, v.Name, v.Description, v.PurchasePrice, v.PurchaseDate, v.ExpectedResidualValue, v.ExpectedUsefulKilometres,
        v.FuelConsumptionPer100Km, v.FuelPricePerLitre, v.TyreReplacementCost, v.TyreLifespanKm, v.BrakeReplacementCost, v.BrakeLifespanKm,
        v.ServiceCost, v.ServiceIntervalKm, v.AnnualInsurance, v.AnnualVehicleTax, v.MonthlyFinancingCost, v.AnnualOtherCosts,
        v.OperatingDaysPerYear, v.ExpectedAnnualKilometres, v.IsActive, Summarise(v));

    // --- Labour ------------------------------------------------------------------------

    public async Task<IReadOnlyList<LabourProfileResponse>> ListLabourAsync(CancellationToken ct) =>
        (await db.LabourProfiles.AsNoTracking().OrderBy(l => l.Name).ToListAsync(ct)).Select(ToResponse).ToList();

    public async Task<LabourProfileResponse> CreateLabourAsync(SaveLabourProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        ValidateLabour(request);
        var entity = new LabourProfile();
        Apply(entity, request);
        db.LabourProfiles.Add(entity);
        await db.SaveChangesAsync(ct);
        var response = ToResponse(entity);
        await audit.RecordAsync(nameof(LabourProfile), entity.Id, PricingAuditAction.Created, $"Labour profile '{entity.Name}' created: {response.Derived.CostPerProductiveHour:0.00}/productive hour.", user, ct);
        return response;
    }

    public async Task<LabourProfileResponse> UpdateLabourAsync(int id, SaveLabourProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        ValidateLabour(request);
        var entity = await db.LabourProfiles.FirstOrDefaultAsync(l => l.Id == id, ct)
                     ?? throw new NotFoundException($"Labour profile {id} was not found.");
        Apply(entity, request);
        await db.SaveChangesAsync(ct);
        await BumpCostProfilesAsync(p => p.LabourProfileId == id, ct);
        var response = ToResponse(entity);
        await audit.RecordAsync(nameof(LabourProfile), entity.Id, PricingAuditAction.Updated, $"Labour profile '{entity.Name}' updated: now {response.Derived.CostPerProductiveHour:0.00}/productive hour.", user, ct);
        return response;
    }

    private static void ValidateLabour(SaveLabourProfileRequest request)
    {
        RequireName(request.Name);
        if (request.PaidHoursPerWeek <= 0)
        {
            throw new ValidationException("Paid hours per week must be greater than zero.");
        }

        if (request.BillableUtilisationPercent is <= 0 or > 100)
        {
            throw new ValidationException("Billable utilisation must be between 1 and 100%.");
        }

        if (request.EmployerContributionPercent < 0)
        {
            throw new ValidationException("Employer contribution cannot be negative.");
        }
    }

    private static void Apply(LabourProfile e, SaveLabourProfileRequest r)
    {
        e.Name = r.Name.Trim();
        e.Description = Clean(r.Description);
        e.BusinessUnit = r.BusinessUnit;
        e.ResourceType = string.IsNullOrWhiteSpace(r.ResourceType) ? "Employee" : r.ResourceType.Trim();
        e.AnnualGrossSalary = r.AnnualGrossSalary;
        e.EmployerContributionPercent = r.EmployerContributionPercent;
        e.AnnualAdditionalCosts = r.AnnualAdditionalCosts;
        e.PaidHoursPerWeek = r.PaidHoursPerWeek;
        e.AnnualLeaveDays = r.AnnualLeaveDays;
        e.PublicHolidayDays = r.PublicHolidayDays;
        e.TrainingAndSickDays = r.TrainingAndSickDays;
        e.BillableUtilisationPercent = r.BillableUtilisationPercent;
        e.IsActive = r.IsActive;
    }

    public static LabourCostSummary Summarise(LabourProfile l)
    {
        var annual = l.AnnualGrossSalary * (1 + l.EmployerContributionPercent / 100m) + l.AnnualAdditionalCosts;
        var hoursPerDay = l.PaidHoursPerWeek / 5m;
        var paid = l.PaidHoursPerWeek * 52m;
        var available = Math.Max(0m, paid - (l.AnnualLeaveDays + l.PublicHolidayDays + l.TrainingAndSickDays) * hoursPerDay);
        var productive = available * l.BillableUtilisationPercent / 100m;
        var perHour = productive > 0 ? annual / productive : 0m;
        return new LabourCostSummary(PricingCalculator.Round(annual), PricingCalculator.Round(paid), PricingCalculator.Round(available),
            PricingCalculator.Round(productive), R4(perHour), PricingCalculator.Round(perHour * hoursPerDay));
    }

    private static LabourProfileResponse ToResponse(LabourProfile l) => new(
        l.Id, l.Name, l.Description, l.BusinessUnit, l.ResourceType, l.AnnualGrossSalary, l.EmployerContributionPercent, l.AnnualAdditionalCosts,
        l.PaidHoursPerWeek, l.AnnualLeaveDays, l.PublicHolidayDays, l.TrainingAndSickDays, l.BillableUtilisationPercent, l.IsActive, Summarise(l));

    // --- Cost profiles -----------------------------------------------------------------

    public async Task<IReadOnlyList<CostProfileResponse>> ListCostProfilesAsync(CancellationToken ct) =>
        (await db.CostProfiles.AsNoTracking()
            .Include(p => p.VehicleProfile).Include(p => p.LabourProfile).Include(p => p.Items)
            .OrderBy(p => p.Name).ToListAsync(ct)).Select(ToResponse).ToList();

    public async Task<CostProfileResponse> CreateCostProfileAsync(SaveCostProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateCostProfileAsync(request, ct);
        var entity = new CostProfile();
        Apply(entity, request);
        db.CostProfiles.Add(entity);
        await db.SaveChangesAsync(ct);
        await LoadCostProfileRefsAsync(entity, ct);
        await audit.RecordAsync(nameof(CostProfile), entity.Id, PricingAuditAction.Created, $"Cost profile '{entity.Name}' created with {entity.Items.Count} cost items.", user, ct);
        return ToResponse(entity);
    }

    public async Task<CostProfileResponse> UpdateCostProfileAsync(int id, SaveCostProfileRequest request, CurrentUser user, CancellationToken ct)
    {
        await ValidateCostProfileAsync(request, ct);
        var entity = await db.CostProfiles.Include(p => p.Items).FirstOrDefaultAsync(p => p.Id == id, ct)
                     ?? throw new NotFoundException($"Cost profile {id} was not found.");
        Apply(entity, request);
        entity.Version++;
        await db.SaveChangesAsync(ct);
        await LoadCostProfileRefsAsync(entity, ct);
        await audit.RecordAsync(nameof(CostProfile), entity.Id, PricingAuditAction.NewVersion, $"Cost profile '{entity.Name}' updated to version {entity.Version}.", user, ct);
        return ToResponse(entity);
    }

    private async Task ValidateCostProfileAsync(SaveCostProfileRequest request, CancellationToken ct)
    {
        RequireName(request.Name);
        if (request.RiskAllowanceValue < 0)
        {
            throw new ValidationException("Risk allowance cannot be negative.");
        }

        if (request.VehicleProfileId is { } v && !await db.VehicleProfiles.AnyAsync(x => x.Id == v, ct))
        {
            throw new ValidationException($"Vehicle profile {v} does not exist.");
        }

        if (request.LabourProfileId is { } l && !await db.LabourProfiles.AnyAsync(x => x.Id == l, ct))
        {
            throw new ValidationException($"Labour profile {l} does not exist.");
        }

        var ids = request.CostItemIds.Distinct().ToList();
        if (ids.Count > 0)
        {
            var found = await db.CostItems.CountAsync(i => ids.Contains(i.Id), ct);
            if (found != ids.Count)
            {
                throw new ValidationException("One or more cost items do not exist.");
            }
        }
    }

    private static void Apply(CostProfile e, SaveCostProfileRequest r)
    {
        e.Name = r.Name.Trim();
        e.Description = Clean(r.Description);
        e.BusinessUnit = r.BusinessUnit;
        e.VehicleProfileId = r.VehicleProfileId;
        e.LabourProfileId = r.LabourProfileId;
        e.RiskAllowanceMethod = r.RiskAllowanceMethod;
        e.RiskAllowanceValue = r.RiskAllowanceValue;
        e.IsActive = r.IsActive;

        var wanted = r.CostItemIds.Distinct().ToHashSet();
        foreach (var link in e.Items.Where(l => !wanted.Contains(l.CostItemId)).ToList())
        {
            e.Items.Remove(link);
        }

        foreach (var id in wanted.Where(id => e.Items.All(l => l.CostItemId != id)))
        {
            e.Items.Add(new CostProfileItem { CostItemId = id });
        }
    }

    private async Task LoadCostProfileRefsAsync(CostProfile entity, CancellationToken ct)
    {
        await db.Entry(entity).Reference(p => p.VehicleProfile).LoadAsync(ct);
        await db.Entry(entity).Reference(p => p.LabourProfile).LoadAsync(ct);
    }

    private static CostProfileResponse ToResponse(CostProfile p) => new(
        p.Id, p.Name, p.Description, p.BusinessUnit, p.VehicleProfileId, p.VehicleProfile?.Name, p.LabourProfileId, p.LabourProfile?.Name,
        p.RiskAllowanceMethod, p.RiskAllowanceValue, p.Items.Select(l => l.CostItemId).OrderBy(x => x).ToList(), p.Version, p.IsActive);

    private async Task BumpCostProfilesAsync(System.Linq.Expressions.Expression<Func<CostProfile, bool>> predicate, CancellationToken ct)
    {
        var profiles = await db.CostProfiles.Where(predicate).ToListAsync(ct);
        foreach (var profile in profiles)
        {
            profile.Version++;
        }

        if (profiles.Count > 0)
        {
            await db.SaveChangesAsync(ct);
        }
    }

    // --- Helpers -----------------------------------------------------------------------

    private static void RequireName(string? name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ValidationException("Name is required.");
        }
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private static decimal R4(decimal value) => decimal.Round(value, 4, MidpointRounding.AwayFromZero);
}
