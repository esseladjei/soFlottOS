namespace soFlottOS.Api.Domain.Entities.Pricing;

// ---------------------------------------------------------------------------
// PRICING CONFIGURATION (spec sections 8-9) and CALCULATION SNAPSHOTS (section 15).
// ---------------------------------------------------------------------------

/// <summary>
/// How a service type is priced: which cost profile feeds the cost, which strategy turns cost into
/// price, and which guard rails apply (minimum price, minimum margin, risk).
/// <para>
/// Resolution order when a price is requested (spec 9): client-specific profile for the service →
/// default profile for the service → default profile of the business unit (ServiceType null).
/// If none exists the engine returns a configuration error instead of inventing a price.
/// </para>
/// Editing a profile that has been used by a calculation bumps <see cref="Version"/>; snapshots
/// record the version they used so history never changes.
/// </summary>
public sealed class PricingProfile : BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public BusinessUnit BusinessUnit { get; set; } = BusinessUnit.Express;

    /// <summary>Null = fallback profile for the whole business unit.</summary>
    public ServiceType? ServiceType { get; set; }

    /// <summary>Set when this profile is a negotiated deal for one customer.</summary>
    public int? ClientId { get; set; }

    public Client? Client { get; set; }

    public int? CostProfileId { get; set; }

    public CostProfile? CostProfile { get; set; }

    public PricingStrategyType Strategy { get; set; } = PricingStrategyType.TargetMargin;

    /// <summary>CostPlus: percentage added on top of cost (25 = 25%).</summary>
    public decimal? MarkupPercent { get; set; }

    /// <summary>TargetMargin: share of the price that must be profit (20 = 20%).</summary>
    public decimal? TargetMarginPercent { get; set; }

    /// <summary>FixedPrice: the net selling price set by the admin.</summary>
    public decimal? FixedPrice { get; set; }

    /// <summary>Net price is never lower than this (spec 8.7).</summary>
    public decimal? MinimumPrice { get; set; }

    /// <summary>Calculations whose margin is below this raise a warning (spec 8.3).</summary>
    public decimal? MinimumMarginPercent { get; set; }

    public string Currency { get; set; } = "EUR";

    /// <summary>The default profile for its service type (or business unit when ServiceType is null).</summary>
    public bool IsDefault { get; set; }

    public DateOnly? EffectiveFrom { get; set; }

    public DateOnly? EffectiveTo { get; set; }

    public int Version { get; set; } = 1;

    public bool IsActive { get; set; } = true;

    /// <summary>Rate lines used by the RateCard strategy and as surcharges for the other strategies.</summary>
    public ICollection<PricingProfileRate> Rates { get; } = new List<PricingProfileRate>();
}

/// <summary>
/// One line of a rate card: "Base fee €8.90 fixed", "€1.40 per kilometre, first 5 km included",
/// "Waiting time €0.75 per minute"... <see cref="IncludedQuantity"/> is free of charge.
/// </summary>
public sealed class PricingProfileRate : BaseEntity
{
    public int PricingProfileId { get; set; }

    public PricingProfile PricingProfile { get; set; } = null!;

    public string Label { get; set; } = string.Empty;

    public PricingUnit Unit { get; set; } = PricingUnit.Fixed;

    public decimal Rate { get; set; }

    public decimal IncludedQuantity { get; set; }

    public int SortOrder { get; set; }
}

/// <summary>
/// Immutable record of one price calculation (spec 15). Saved when an order is booked, when an admin
/// saves a simulation scenario, or when a quotation is approved. Inputs and the itemised breakdown are
/// stored as JSON so the exact numbers can be shown again even after the configuration changed.
/// </summary>
public sealed class PricingCalculation : BaseEntity
{
    public Guid CalculationId { get; set; } = Guid.NewGuid();

    /// <summary>Optional label when saved as a simulation scenario.</summary>
    public string? Name { get; set; }

    public bool IsSimulation { get; set; }

    public BusinessUnit BusinessUnit { get; set; }

    public ServiceType ServiceType { get; set; }

    public int? ClientId { get; set; }

    public int? OrderId { get; set; }

    public int? PricingProfileId { get; set; }

    public int? PricingProfileVersion { get; set; }

    public int? CostProfileId { get; set; }

    public int? CostProfileVersion { get; set; }

    public string Currency { get; set; } = "EUR";

    public decimal DirectCosts { get; set; }

    public decimal AllocatedOverhead { get; set; }

    public decimal LabourCosts { get; set; }

    public decimal VehicleCosts { get; set; }

    public decimal RiskAllowance { get; set; }

    public decimal TotalEstimatedCost { get; set; }

    public decimal FinalNetSellingPrice { get; set; }

    public TaxTreatment TaxTreatment { get; set; }

    public decimal VatRate { get; set; }

    public decimal VatAmount { get; set; }

    public decimal FinalGrossSellingPrice { get; set; }

    public decimal ExpectedProfit { get; set; }

    public decimal ExpectedMarginPercent { get; set; }

    public CalculationStatus Status { get; set; }

    /// <summary>JSON of the request that produced this result.</summary>
    public string InputJson { get; set; } = "{}";

    /// <summary>JSON of the full itemised breakdown and warnings.</summary>
    public string BreakdownJson { get; set; } = "{}";

    public int? CreatedByUserId { get; set; }
}

/// <summary>Who changed which pricing configuration and when (spec 15).</summary>
public sealed class PricingAuditEntry : BaseEntity
{
    public string EntityType { get; set; } = string.Empty;

    public int EntityId { get; set; }

    public PricingAuditAction Action { get; set; }

    public string Summary { get; set; } = string.Empty;

    public int? UserId { get; set; }
}
