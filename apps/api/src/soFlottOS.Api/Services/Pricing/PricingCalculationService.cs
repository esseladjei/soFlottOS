using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Dtos.Pricing;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>What the order flow needs back from the engine for one booking.</summary>
public sealed record OrderQuote(
    decimal NetPrice,
    decimal VatAmount,
    decimal GrossPrice,
    TaxTreatment TaxTreatment,
    decimal VatRate,
    PricingResult Result);

/// <summary>
/// Facade over the engine (spec 10): loads configuration, resolves the profile and tax treatment,
/// runs the pure calculator and stores an immutable snapshot when asked.
/// </summary>
public interface IPricingCalculationService
{
    /// <summary>Real calculation: persisted as a snapshot so it can be referenced by quotes and orders.</summary>
    Task<PricingCalculationResponse> CalculateAsync(CalculatePriceRequest request, CurrentUser user, CancellationToken ct);

    /// <summary>What-if calculation: not persisted unless a scenario name is given.</summary>
    Task<PricingCalculationResponse> SimulateAsync(CalculatePriceRequest request, CurrentUser user, CancellationToken ct);

    Task<PricingCalculationResponse> GetAsync(int id, CancellationToken ct);

    Task<IReadOnlyList<PricingCalculationSummaryResponse>> ListAsync(bool? simulations, int take, CancellationToken ct);

    /// <summary>Prices an on-demand delivery through the engine; null when no profile is configured (caller falls back).</summary>
    Task<OrderQuote?> QuoteDeliveryAsync(decimal distanceKm, Client? client, CancellationToken ct);

    /// <summary>Persists the snapshot of a booked order and returns its id.</summary>
    Task<int> SaveOrderSnapshotAsync(OrderQuote quote, int orderId, int? clientId, int? userId, CancellationToken ct);

    Task<PricingReferenceResponse> GetReferenceAsync(CancellationToken ct);

    Task<PricingOverviewResponse> GetOverviewAsync(CancellationToken ct);
}

public sealed class PricingCalculationService(
    AppDbContext db,
    IPricingProfileService profiles,
    PricingOptions pricingOptions,
    TimeProvider timeProvider) : IPricingCalculationService
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        Converters = { new JsonStringEnumConverter() },
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public Task<PricingCalculationResponse> CalculateAsync(CalculatePriceRequest request, CurrentUser user, CancellationToken ct) =>
        RunAsync(request, user, isSimulation: false, persist: true, ct);

    public Task<PricingCalculationResponse> SimulateAsync(CalculatePriceRequest request, CurrentUser user, CancellationToken ct) =>
        RunAsync(request, user, isSimulation: true, persist: !string.IsNullOrWhiteSpace(request.SaveAsScenarioName), ct);

    private async Task<PricingCalculationResponse> RunAsync(CalculatePriceRequest request, CurrentUser user, bool isSimulation, bool persist, CancellationToken ct)
    {
        var today = Today();
        var client = request.ClientId is { } id ? await db.Clients.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct) : null;
        if (request.ClientId is not null && client is null)
        {
            throw new NotFoundException($"Client {request.ClientId} was not found.");
        }

        var profile = await profiles.ResolveAsync(request.ServiceType, request.ClientId, request.PricingProfileId, today, ct);
        var treatment = request.TaxTreatmentOverride ?? TaxTreatmentResolver.Resolve(client);
        var result = PricingCalculator.Calculate(request.ToRequest(), profile, treatment, pricingOptions.VatRate, today,
            TaxTreatmentResolver.Warnings(client, treatment));

        if (!persist)
        {
            return new PricingCalculationResponse(null, null, request.SaveAsScenarioName, isSimulation, null, request.ClientId, null, result);
        }

        var snapshot = ToSnapshot(result, request.ToRequest(), isSimulation, request.SaveAsScenarioName?.Trim(), orderId: null, request.ClientId, user.UserId);
        db.PricingCalculations.Add(snapshot);
        await db.SaveChangesAsync(ct);
        return new PricingCalculationResponse(snapshot.Id, snapshot.CalculationId, snapshot.Name, isSimulation, null, request.ClientId, snapshot.CreatedAt, result);
    }

    public async Task<PricingCalculationResponse> GetAsync(int id, CancellationToken ct)
    {
        var snapshot = await db.PricingCalculations.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id, ct)
                       ?? throw new NotFoundException($"Calculation {id} was not found.");
        var result = JsonSerializer.Deserialize<PricingResult>(snapshot.BreakdownJson, JsonOptions)
                     ?? throw new InvalidOperationException("Stored calculation could not be read.");
        return new PricingCalculationResponse(snapshot.Id, snapshot.CalculationId, snapshot.Name, snapshot.IsSimulation, snapshot.OrderId, snapshot.ClientId, snapshot.CreatedAt, result);
    }

    public async Task<IReadOnlyList<PricingCalculationSummaryResponse>> ListAsync(bool? simulations, int take, CancellationToken ct)
    {
        var query = db.PricingCalculations.AsNoTracking();
        if (simulations is { } s)
        {
            query = query.Where(c => c.IsSimulation == s);
        }

        return await query.OrderByDescending(c => c.CreatedAt).Take(Math.Clamp(take, 1, 500)).Select(c => new PricingCalculationSummaryResponse(
            c.Id, c.CalculationId, c.Name, c.IsSimulation, c.ServiceType, c.ClientId, c.OrderId, c.TotalEstimatedCost, c.FinalNetSellingPrice,
            c.ExpectedMarginPercent, c.Status, c.CreatedAt)).ToListAsync(ct);
    }

    public async Task<OrderQuote?> QuoteDeliveryAsync(decimal distanceKm, Client? client, CancellationToken ct)
    {
        var today = Today();
        var profile = await profiles.ResolveAsync(ServiceType.OnDemandDelivery, client?.Id, null, today, ct);
        if (profile is null)
        {
            return null;
        }

        // Legacy per-client tariff overrides still win over the generic rate card lines.
        if (profile.Strategy == PricingStrategyType.RateCard && profile.ClientId is null && client is not null)
        {
            foreach (var rate in profile.Rates)
            {
                if (rate.Unit == PricingUnit.Fixed && client.DefaultBaseFee is { } baseFee)
                {
                    rate.Rate = baseFee;
                }
                else if (rate.Unit == PricingUnit.Kilometre && client.DefaultRatePerKilometer is { } perKm)
                {
                    rate.Rate = perKm;
                }
            }
        }

        var treatment = TaxTreatmentResolver.Resolve(client);
        var request = new PricingRequest(ServiceType.OnDemandDelivery, client?.Id, new PricingQuantities(Kilometres: distanceKm, Deliveries: 1));
        var result = PricingCalculator.Calculate(request, profile, treatment, pricingOptions.VatRate, today, TaxTreatmentResolver.Warnings(client, treatment));
        if (result.Status == CalculationStatus.Error)
        {
            throw new ValidationException("Pricing configuration error: " + string.Join(" ", result.Errors));
        }

        return new OrderQuote(result.FinalNetSellingPrice, result.VatAmount, result.FinalGrossSellingPrice, treatment, result.VatRate, result);
    }

    public async Task<int> SaveOrderSnapshotAsync(OrderQuote quote, int orderId, int? clientId, int? userId, CancellationToken ct)
    {
        var request = new PricingRequest(ServiceType.OnDemandDelivery, clientId);
        var snapshot = ToSnapshot(quote.Result, request, isSimulation: false, name: null, orderId, clientId, userId);
        db.PricingCalculations.Add(snapshot);
        await db.SaveChangesAsync(ct);
        return snapshot.Id;
    }

    public Task<PricingReferenceResponse> GetReferenceAsync(CancellationToken ct) => Task.FromResult(new PricingReferenceResponse(
        ServiceTypes.All.Select(s => new ServiceTypeInfo(s, s.BusinessUnit(), s.InvoiceCode(), s.Label())).ToList(),
        pricingOptions.VatRate,
        Enum.GetValues<TaxTreatment>().Select(t => new TaxTreatmentInfo(t, TaxTreatmentResolver.VatRateFor(t, pricingOptions.VatRate), TaxTreatmentResolver.NoteFor(t))).ToList()));

    public async Task<PricingOverviewResponse> GetOverviewAsync(CancellationToken ct)
    {
        var today = Today();
        var active = await db.PricingProfiles.AsNoTracking()
            .Where(p => p.IsActive && p.ClientId == null && (p.EffectiveFrom == null || p.EffectiveFrom <= today) && (p.EffectiveTo == null || p.EffectiveTo >= today))
            .ToListAsync(ct);

        var coverage = ServiceTypes.All.Select(s =>
        {
            var match = active.Where(p => p.ServiceType == s).OrderByDescending(p => p.IsDefault).FirstOrDefault()
                        ?? active.Where(p => p.ServiceType == null && p.BusinessUnit == s.BusinessUnit()).OrderByDescending(p => p.IsDefault).FirstOrDefault();
            return new ServiceCoverage(s, s.InvoiceCode(), match is not null, match?.Name, match?.Strategy);
        }).ToList();

        return new PricingOverviewResponse(
            await db.CostItems.CountAsync(i => i.IsActive, ct),
            await db.VehicleProfiles.CountAsync(v => v.IsActive, ct),
            await db.LabourProfiles.CountAsync(l => l.IsActive, ct),
            await db.CostProfiles.CountAsync(c => c.IsActive, ct),
            await db.PricingProfiles.CountAsync(p => p.IsActive, ct),
            coverage,
            await ListAsync(null, 10, ct));
    }

    private static PricingCalculation ToSnapshot(PricingResult result, PricingRequest request, bool isSimulation, string? name, int? orderId, int? clientId, int? userId) => new()
    {
        Name = name,
        IsSimulation = isSimulation,
        BusinessUnit = result.BusinessUnit,
        ServiceType = result.ServiceType,
        ClientId = clientId,
        OrderId = orderId,
        PricingProfileId = result.PricingProfileId,
        PricingProfileVersion = result.PricingProfileVersion,
        CostProfileId = result.CostProfileId,
        CostProfileVersion = result.CostProfileVersion,
        Currency = result.Currency,
        DirectCosts = result.DirectCosts,
        AllocatedOverhead = result.AllocatedOverhead,
        LabourCosts = result.LabourCosts,
        VehicleCosts = result.VehicleCosts,
        RiskAllowance = result.RiskAllowance,
        TotalEstimatedCost = result.TotalEstimatedCost,
        FinalNetSellingPrice = result.FinalNetSellingPrice,
        TaxTreatment = result.TaxTreatment,
        VatRate = result.VatRate,
        VatAmount = result.VatAmount,
        FinalGrossSellingPrice = result.FinalGrossSellingPrice,
        ExpectedProfit = result.ExpectedProfit,
        ExpectedMarginPercent = result.ExpectedMarginPercent,
        Status = result.Status,
        InputJson = JsonSerializer.Serialize(request, JsonOptions),
        BreakdownJson = JsonSerializer.Serialize(result, JsonOptions),
        CreatedByUserId = userId,
    };

    private DateOnly Today() => DateOnly.FromDateTime(timeProvider.GetUtcNow().UtcDateTime);
}
