using soFlottOS.Api.Domain;
using soFlottOS.Api.Services.Pricing;

namespace soFlottOS.Api.Dtos.Pricing;

// ---------------------------------------------------------------------------
// Cost foundation
// ---------------------------------------------------------------------------

public sealed record SaveCostCategoryRequest(string Name, string? Description, BusinessUnit? BusinessUnit, bool IsActive = true);

public sealed record CostCategoryResponse(int Id, string Name, string? Description, BusinessUnit? BusinessUnit, bool IsActive, int ItemCount);

public sealed record SaveCostItemRequest(
    string Name,
    string? Description,
    int CostCategoryId,
    BusinessUnit? BusinessUnit,
    CostType CostType,
    decimal Amount,
    CostFrequency Frequency,
    AllocationMethod AllocationMethod,
    decimal? AllocationDenominator,
    DateOnly? EffectiveFrom,
    DateOnly? EffectiveTo,
    bool IsActive = true,
    string Currency = "EUR");

public sealed record CostItemResponse(
    int Id,
    string Name,
    string? Description,
    int CostCategoryId,
    string CostCategoryName,
    BusinessUnit? BusinessUnit,
    CostType CostType,
    decimal Amount,
    string Currency,
    CostFrequency Frequency,
    AllocationMethod AllocationMethod,
    decimal? AllocationDenominator,
    DateOnly? EffectiveFrom,
    DateOnly? EffectiveTo,
    bool IsActive,
    // Amount per year after annualising the frequency (null for per-unit frequencies).
    decimal? AnnualAmount,
    // What one unit of the allocation driver costs, e.g. 5.00 per working day.
    decimal? UnitCost);

public sealed record SaveVehicleProfileRequest(
    string Name,
    string? Description,
    decimal PurchasePrice,
    DateOnly? PurchaseDate,
    decimal ExpectedResidualValue,
    decimal ExpectedUsefulKilometres,
    decimal FuelConsumptionPer100Km,
    decimal FuelPricePerLitre,
    decimal TyreReplacementCost,
    decimal TyreLifespanKm,
    decimal BrakeReplacementCost,
    decimal BrakeLifespanKm,
    decimal ServiceCost,
    decimal ServiceIntervalKm,
    decimal AnnualInsurance,
    decimal AnnualVehicleTax,
    decimal MonthlyFinancingCost,
    decimal AnnualOtherCosts,
    int OperatingDaysPerYear,
    decimal ExpectedAnnualKilometres,
    bool IsActive = true);

public sealed record VehicleProfileResponse(
    int Id,
    string Name,
    string? Description,
    decimal PurchasePrice,
    DateOnly? PurchaseDate,
    decimal ExpectedResidualValue,
    decimal ExpectedUsefulKilometres,
    decimal FuelConsumptionPer100Km,
    decimal FuelPricePerLitre,
    decimal TyreReplacementCost,
    decimal TyreLifespanKm,
    decimal BrakeReplacementCost,
    decimal BrakeLifespanKm,
    decimal ServiceCost,
    decimal ServiceIntervalKm,
    decimal AnnualInsurance,
    decimal AnnualVehicleTax,
    decimal MonthlyFinancingCost,
    decimal AnnualOtherCosts,
    int OperatingDaysPerYear,
    decimal ExpectedAnnualKilometres,
    bool IsActive,
    VehicleCostSummary Derived);

/// <summary>The numbers the engine derives from a vehicle profile - shown live in the form.</summary>
public sealed record VehicleCostSummary(
    decimal DepreciationPerKm,
    decimal FuelPerKm,
    decimal TyresPerKm,
    decimal BrakesPerKm,
    decimal ServicePerKm,
    decimal DistanceCostPerKm,
    decimal AnnualTimeCost,
    decimal TimeCostPerDay,
    decimal TimeCostPerKm,
    decimal TotalCostPerKm);

public sealed record SaveLabourProfileRequest(
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    string ResourceType,
    decimal AnnualGrossSalary,
    decimal EmployerContributionPercent,
    decimal AnnualAdditionalCosts,
    decimal PaidHoursPerWeek,
    int AnnualLeaveDays,
    int PublicHolidayDays,
    int TrainingAndSickDays,
    decimal BillableUtilisationPercent,
    bool IsActive = true);

public sealed record LabourProfileResponse(
    int Id,
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    string ResourceType,
    decimal AnnualGrossSalary,
    decimal EmployerContributionPercent,
    decimal AnnualAdditionalCosts,
    decimal PaidHoursPerWeek,
    int AnnualLeaveDays,
    int PublicHolidayDays,
    int TrainingAndSickDays,
    decimal BillableUtilisationPercent,
    bool IsActive,
    LabourCostSummary Derived);

public sealed record LabourCostSummary(
    decimal AnnualEmploymentCost,
    decimal PaidHoursPerYear,
    decimal AvailableHoursPerYear,
    decimal ProductiveHoursPerYear,
    decimal CostPerProductiveHour,
    decimal CostPerDay);

public sealed record SaveCostProfileRequest(
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    int? VehicleProfileId,
    int? LabourProfileId,
    RiskAllowanceMethod RiskAllowanceMethod,
    decimal RiskAllowanceValue,
    IReadOnlyList<int> CostItemIds,
    bool IsActive = true);

public sealed record CostProfileResponse(
    int Id,
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    int? VehicleProfileId,
    string? VehicleProfileName,
    int? LabourProfileId,
    string? LabourProfileName,
    RiskAllowanceMethod RiskAllowanceMethod,
    decimal RiskAllowanceValue,
    IReadOnlyList<int> CostItemIds,
    int Version,
    bool IsActive);

// ---------------------------------------------------------------------------
// Pricing profiles
// ---------------------------------------------------------------------------

public sealed record SavePricingRateRequest(string Label, PricingUnit Unit, decimal Rate, decimal IncludedQuantity = 0m, int SortOrder = 0);

public sealed record PricingRateResponse(int Id, string Label, PricingUnit Unit, decimal Rate, decimal IncludedQuantity, int SortOrder);

public sealed record SavePricingProfileRequest(
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    ServiceType? ServiceType,
    int? ClientId,
    int? CostProfileId,
    PricingStrategyType Strategy,
    decimal? MarkupPercent,
    decimal? TargetMarginPercent,
    decimal? FixedPrice,
    decimal? MinimumPrice,
    decimal? MinimumMarginPercent,
    bool IsDefault,
    DateOnly? EffectiveFrom,
    DateOnly? EffectiveTo,
    IReadOnlyList<SavePricingRateRequest> Rates,
    bool IsActive = true,
    string Currency = "EUR");

public sealed record PricingProfileResponse(
    int Id,
    string Name,
    string? Description,
    BusinessUnit BusinessUnit,
    ServiceType? ServiceType,
    string? ServiceCode,
    int? ClientId,
    string? ClientName,
    int? CostProfileId,
    string? CostProfileName,
    PricingStrategyType Strategy,
    decimal? MarkupPercent,
    decimal? TargetMarginPercent,
    decimal? FixedPrice,
    decimal? MinimumPrice,
    decimal? MinimumMarginPercent,
    string Currency,
    bool IsDefault,
    DateOnly? EffectiveFrom,
    DateOnly? EffectiveTo,
    int Version,
    bool IsActive,
    IReadOnlyList<PricingRateResponse> Rates);

// ---------------------------------------------------------------------------
// Calculation
// ---------------------------------------------------------------------------

/// <summary>Body of POST /api/admin/pricing/calculate and /simulate.</summary>
public sealed record CalculatePriceRequest(
    ServiceType ServiceType,
    int? ClientId,
    PricingQuantities? Quantities,
    IReadOnlyList<PricingExtraCost>? ExtraCosts,
    IReadOnlyList<PricingAdjustment>? Surcharges,
    IReadOnlyList<PricingAdjustment>? Discounts,
    decimal? ManualOverridePrice,
    string? ManualOverrideReason,
    TaxTreatment? TaxTreatmentOverride,
    int? PricingProfileId,
    // Simulator only: store the scenario under this name.
    string? SaveAsScenarioName = null)
{
    public PricingRequest ToRequest() => new(
        ServiceType,
        ClientId,
        Quantities,
        ExtraCosts,
        Surcharges,
        Discounts,
        ManualOverridePrice,
        ManualOverrideReason,
        TaxTreatmentOverride,
        PricingProfileId);
}

public sealed record PricingCalculationResponse(
    int? Id,
    Guid? CalculationId,
    string? Name,
    bool IsSimulation,
    int? OrderId,
    int? ClientId,
    DateTimeOffset? CreatedAt,
    PricingResult Result);

public sealed record PricingCalculationSummaryResponse(
    int Id,
    Guid CalculationId,
    string? Name,
    bool IsSimulation,
    ServiceType ServiceType,
    int? ClientId,
    int? OrderId,
    decimal TotalEstimatedCost,
    decimal FinalNetSellingPrice,
    decimal ExpectedMarginPercent,
    CalculationStatus Status,
    DateTimeOffset CreatedAt);

public sealed record PricingAuditResponse(int Id, string EntityType, int EntityId, PricingAuditAction Action, string Summary, int? UserId, DateTimeOffset CreatedAt);

/// <summary>Static reference data so the UI can render labels, codes and hints without hard-coding.</summary>
public sealed record PricingReferenceResponse(
    IReadOnlyList<ServiceTypeInfo> ServiceTypes,
    decimal StandardVatRate,
    IReadOnlyList<TaxTreatmentInfo> TaxTreatments);

public sealed record ServiceTypeInfo(ServiceType ServiceType, BusinessUnit BusinessUnit, string InvoiceCode, string Label);

public sealed record TaxTreatmentInfo(TaxTreatment TaxTreatment, decimal VatRate, string? Note);

/// <summary>Dashboard numbers for the Pricing overview page.</summary>
public sealed record PricingOverviewResponse(
    int CostItems,
    int VehicleProfiles,
    int LabourProfiles,
    int CostProfiles,
    int PricingProfiles,
    IReadOnlyList<ServiceCoverage> Coverage,
    IReadOnlyList<PricingCalculationSummaryResponse> RecentCalculations);

/// <summary>Whether each service type has a default pricing profile - the first thing an admin must fix.</summary>
public sealed record ServiceCoverage(ServiceType ServiceType, string InvoiceCode, bool HasDefaultProfile, string? ProfileName, PricingStrategyType? Strategy);
