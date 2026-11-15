using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Services.Pricing;

// Records exchanged between the API, the pure calculator and the persisted snapshots.
// They are deliberately plain so the admin UI can show every number.

/// <summary>What the caller knows about the job to be priced.</summary>
public sealed record PricingRequest(
    ServiceType ServiceType,
    int? ClientId = null,
    PricingQuantities? Quantities = null,
    IReadOnlyList<PricingExtraCost>? ExtraCosts = null,
    IReadOnlyList<PricingAdjustment>? Surcharges = null,
    IReadOnlyList<PricingAdjustment>? Discounts = null,
    decimal? ManualOverridePrice = null,
    string? ManualOverrideReason = null,
    TaxTreatment? TaxTreatmentOverride = null,
    int? PricingProfileId = null);

/// <summary>Volumes that drive the cost and the rate card. Leave what does not apply empty.</summary>
public sealed record PricingQuantities(
    decimal? Kilometres = null,
    decimal? Hours = null,
    decimal? Days = null,
    decimal? Deliveries = null,
    decimal? Stops = null,
    decimal? Parcels = null,
    decimal? Routes = null,
    decimal? Projects = null,
    decimal? Months = null)
{
    public decimal For(PricingUnit unit) => unit switch
    {
        PricingUnit.Kilometre => Kilometres ?? 0m,
        PricingUnit.Hour => Hours ?? 0m,
        PricingUnit.Day => Days ?? 0m,
        PricingUnit.Delivery => Deliveries ?? 0m,
        PricingUnit.Stop => Stops ?? 0m,
        PricingUnit.Parcel => Parcels ?? 0m,
        PricingUnit.Route => Routes ?? 0m,
        PricingUnit.Project => Projects ?? 0m,
        PricingUnit.Month => Months ?? 0m,
        PricingUnit.Fixed => 1m,
        _ => 0m,
    };

    public decimal For(AllocationMethod method) => method switch
    {
        AllocationMethod.PerKilometre => Kilometres ?? 0m,
        AllocationMethod.PerHour => Hours ?? 0m,
        AllocationMethod.PerWorkingDay => Days ?? 0m,
        AllocationMethod.PerDelivery => Deliveries ?? 0m,
        AllocationMethod.PerStop => Stops ?? 0m,
        AllocationMethod.PerParcel => Parcels ?? 0m,
        AllocationMethod.PerRoute => Routes ?? 0m,
        AllocationMethod.PerProject => Projects ?? 0m,
        AllocationMethod.PerMonth => Months ?? 0m,
        _ => 1m,
    };

    public decimal For(CostFrequency frequency) => frequency switch
    {
        CostFrequency.PerHour => Hours ?? 0m,
        CostFrequency.PerKilometre => Kilometres ?? 0m,
        CostFrequency.PerDelivery => Deliveries ?? 0m,
        CostFrequency.PerRoute => Routes ?? 0m,
        CostFrequency.PerProject => Projects ?? 0m,
        _ => 0m,
    };
}

/// <summary>A one-off direct cost typed in for this job, e.g. tolls, subcontractor fee, software licence.</summary>
public sealed record PricingExtraCost(string Label, decimal Amount);

/// <summary>Surcharge or discount: a fixed amount or a percentage of the net price before adjustments.</summary>
public sealed record PricingAdjustment(string Label, decimal Value, bool IsPercent = false);

public sealed record CostLine(
    string Group,
    string Label,
    decimal Quantity,
    string Unit,
    decimal UnitCost,
    decimal Total,
    string Explanation);

public sealed record PriceLine(string Label, decimal Amount, string Explanation, PricingUnit? Unit = null, decimal? Rate = null);

/// <summary>The complete, explainable result of one calculation.</summary>
public sealed record PricingResult(
    CalculationStatus Status,
    IReadOnlyList<string> Errors,
    IReadOnlyList<string> Warnings,
    BusinessUnit BusinessUnit,
    ServiceType ServiceType,
    int? PricingProfileId,
    int? PricingProfileVersion,
    string? PricingProfileName,
    int? CostProfileId,
    int? CostProfileVersion,
    PricingStrategyType? Strategy,
    string Currency,
    IReadOnlyList<CostLine> CostLines,
    decimal DirectCosts,
    decimal AllocatedOverhead,
    decimal VehicleCosts,
    decimal LabourCosts,
    decimal RiskAllowance,
    decimal TotalEstimatedCost,
    IReadOnlyList<PriceLine> PriceLines,
    decimal BaseNetPrice,
    decimal FinalNetSellingPrice,
    TaxTreatment TaxTreatment,
    decimal VatRate,
    decimal VatAmount,
    string? TaxNote,
    decimal FinalGrossSellingPrice,
    decimal ExpectedProfit,
    decimal ExpectedMarginPercent,
    decimal ExpectedMarkupPercent,
    IReadOnlyDictionary<string, decimal> DerivedRates);
