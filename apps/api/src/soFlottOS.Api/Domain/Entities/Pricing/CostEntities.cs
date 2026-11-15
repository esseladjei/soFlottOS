namespace soFlottOS.Api.Domain.Entities.Pricing;

// ---------------------------------------------------------------------------
// COST FOUNDATION (spec sections 3-7).
// Admins describe what running the business costs; the engine turns those
// descriptions into a cost per kilometre / hour / day / delivery ...
// Nothing here is a selling price.
// ---------------------------------------------------------------------------

/// <summary>A heading that groups cost items, e.g. "Vehicle", "Personnel", "Office &amp; admin".</summary>
public sealed class CostCategory : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    /// <summary>Null = applies to both business units.</summary>
    public BusinessUnit? BusinessUnit { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<CostItem> Items { get; } = new List<CostItem>();
}

/// <summary>
/// One real-world expense, e.g. "Vehicle insurance €1,200 / year, allocated per working day over 240 days".
/// The engine annualises <see cref="Amount"/> by <see cref="Frequency"/>, divides by
/// <see cref="AllocationDenominator"/> and multiplies by the quantity of the <see cref="AllocationMethod"/>
/// driver supplied in the calculation request.
/// </summary>
public sealed class CostItem : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int CostCategoryId { get; set; }

    public CostCategory Category { get; set; } = null!;

    /// <summary>Null = shared overhead of the whole company.</summary>
    public BusinessUnit? BusinessUnit { get; set; }

    public CostType CostType { get; set; } = CostType.Fixed;

    public decimal Amount { get; set; }

    public string Currency { get; set; } = "EUR";

    public CostFrequency Frequency { get; set; } = CostFrequency.Monthly;

    public AllocationMethod AllocationMethod { get; set; } = AllocationMethod.PerWorkingDay;

    /// <summary>
    /// Annual volume of the allocation driver (240 working days, 60,000 km, 1,600 hours...).
    /// Not needed for per-unit frequencies, WholeAmount or PercentageOfDirectCosts.
    /// For PercentageOfDirectCosts this holds the percentage (e.g. 10 = 10%).
    /// </summary>
    public decimal? AllocationDenominator { get; set; }

    public DateOnly? EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public bool IsActive { get; set; } = true;

    public ICollection<CostProfileItem> ProfileLinks { get; } = new List<CostProfileItem>();
}

/// <summary>
/// Everything needed to know what one kilometre and one day of a vehicle costs (spec section 6).
/// All results are derived - nothing is typed in as "cost per km" directly.
/// </summary>
public sealed class VehicleProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public decimal PurchasePrice { get; set; }

    public DateOnly? PurchaseDate { get; set; }

    public decimal ExpectedResidualValue { get; set; }

    /// <summary>Kilometres the vehicle is expected to drive over its life with soFlott.</summary>
    public decimal ExpectedUsefulKilometres { get; set; }

    public decimal FuelConsumptionPer100Km { get; set; }

    public decimal FuelPricePerLitre { get; set; }

    public decimal TyreReplacementCost { get; set; }

    public decimal TyreLifespanKm { get; set; }

    public decimal BrakeReplacementCost { get; set; }

    public decimal BrakeLifespanKm { get; set; }

    public decimal ServiceCost { get; set; }

    public decimal ServiceIntervalKm { get; set; }

    // Time-based costs - incurred whether the van moves or not.

    public decimal AnnualInsurance { get; set; }

    public decimal AnnualVehicleTax { get; set; }

    public decimal MonthlyFinancingCost { get; set; }

    public decimal AnnualOtherCosts { get; set; }

    /// <summary>Days per year the vehicle is in service; spreads the time-based costs per day.</summary>
    public int OperatingDaysPerYear { get; set; } = 240;

    /// <summary>Kilometres driven per year; spreads the time-based costs per km when no days are given.</summary>
    public decimal ExpectedAnnualKilometres { get; set; } = 40000m;

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// What one productive hour of a person really costs (spec section 7).
/// Total annual employment cost / productive hours - never divided by calendar hours.
/// </summary>
public sealed class LabourProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public BusinessUnit BusinessUnit { get; set; } = BusinessUnit.Express;

    /// <summary>"Employee" or "Contractor" - free text kept short on purpose.</summary>
    public string ResourceType { get; set; } = "Employee";

    public decimal AnnualGrossSalary { get; set; }

    /// <summary>Employer social contributions as a percentage of gross salary (Germany ≈ 21%).</summary>
    public decimal EmployerContributionPercent { get; set; } = 21m;

    public decimal AnnualAdditionalCosts { get; set; }

    public decimal PaidHoursPerWeek { get; set; } = 40m;

    public int AnnualLeaveDays { get; set; } = 28;

    public int PublicHolidayDays { get; set; } = 10;

    public int TrainingAndSickDays { get; set; } = 10;

    /// <summary>Share of the remaining hours that is actually billable / productive (e.g. 75%).</summary>
    public decimal BillableUtilisationPercent { get; set; } = 80m;

    public bool IsActive { get; set; } = true;
}

/// <summary>
/// A named bundle of cost items plus the vehicle and labour profiles that apply to a kind of service,
/// e.g. "Standard van route" or "Senior developer project". Pricing profiles point at one of these.
/// </summary>
public sealed class CostProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public BusinessUnit BusinessUnit { get; set; } = BusinessUnit.Express;

    public int? VehicleProfileId { get; set; }

    public VehicleProfile? VehicleProfile { get; set; }

    public int? LabourProfileId { get; set; }

    public LabourProfile? LabourProfile { get; set; }

    public RiskAllowanceMethod RiskAllowanceMethod { get; set; } = RiskAllowanceMethod.None;

    /// <summary>Amount in EUR for FixedAmount, otherwise percentage (5 = 5%).</summary>
    public decimal RiskAllowanceValue { get; set; }

    public int Version { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    public ICollection<CostProfileItem> Items { get; } = new List<CostProfileItem>();
}

/// <summary>Join table: which cost items belong to a cost profile.</summary>
public sealed class CostProfileItem
{
    public int CostProfileId { get; set; }

    public CostProfile CostProfile { get; set; } = null!;

    public int CostItemId { get; set; }

    public CostItem CostItem { get; set; } = null!;
}
