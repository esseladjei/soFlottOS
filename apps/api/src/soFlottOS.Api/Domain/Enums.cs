namespace soFlottOS.Api.Domain;

// ---------------------------------------------------------------------------
// All enumerations used by the domain live in this single file so that a
// newcomer can see every "allowed value" of the system at a glance.
// They are stored in PostgreSQL as readable strings (see AppDbContext) and sent to
// the frontend as strings too (see Program.cs -> JsonStringEnumConverter).
// ---------------------------------------------------------------------------

/// <summary>Who the user is. Kept deliberately flat to avoid permission complexity.</summary>
public enum UserRole
{
    /// <summary>Runs the business: dispatching, CRM, invoicing.</summary>
    Admin = 1,

    /// <summary>A B2B customer (workshop, pharmacy, law firm...) that books deliveries.</summary>
    Client = 2,

    /// <summary>A courier that picks up and delivers orders.</summary>
    Driver = 3
}

/// <summary>Driver availability state machine (see DriverService).</summary>
public enum DriverAvailability
{
    /// <summary>Not accepting work (set by the driver).</summary>
    Offline = 1,

    /// <summary>Ready for dispatch (set by the driver).</summary>
    Online = 2,

    /// <summary>Currently on a job (set automatically by the system).</summary>
    Busy = 3
}

/// <summary>Lifecycle of a delivery order.</summary>
public enum OrderStatus
{
    Pending = 1,
    Assigned = 2,
    InTransit = 3,
    Delivered = 4,
    Cancelled = 5
}

/// <summary>Lifecycle of an invoice (Rechnung).</summary>
public enum InvoiceStatus
{
    Draft = 1,
    Sent = 2,
    Paid = 3,
    Overdue = 4
}

/// <summary>How the client settles the invoice. v1 is manual on purpose.</summary>
public enum PaymentMethod
{
    /// <summary>German bank transfer (Überweisung) against the generated invoice.</summary>
    BankTransfer = 1,

    /// <summary>Client sends money to the business PayPal handle, Admin marks it paid.</summary>
    PayPal = 2
}

/// <summary>What is being transported - drives handling expectations.</summary>
public enum CargoCategory
{
    Document = 1,
    SmallBox = 2,
    AutoPart = 3,
    Oversized = 4
}

/// <summary>Transport channel of an outbound customer notification.</summary>
public enum NotificationChannel
{
    Sms = 1,
    WhatsApp = 2
}

/// <summary>Delivery state of a queued notification.</summary>
public enum NotificationStatus
{
    Pending = 1,
    Sent = 2,
    Failed = 3
}

/// <summary>Which cookie choice a visitor made in the consent banner.</summary>
public enum ConsentAction
{
    AcceptAll = 1,
    RejectOptional = 2,
    Custom = 3
}

/// <summary>The GDPR data-subject right a person is exercising.</summary>
public enum PrivacyRequestType
{
    /// <summary>Art. 15 - access to the stored personal data.</summary>
    Access = 1,

    /// <summary>Art. 17 - erasure.</summary>
    Deletion = 2,

    /// <summary>Art. 16 - rectification.</summary>
    Correction = 3,

    /// <summary>Art. 20 - data portability.</summary>
    Export = 4,

    /// <summary>Art. 18 - restriction of processing.</summary>
    Restriction = 5,

    /// <summary>Art. 21 - objection to processing.</summary>
    Objection = 6
}

/// <summary>Where a privacy request stands in the admin's handling process.</summary>
public enum PrivacyRequestStatus
{
    Received = 1,
    InProgress = 2,
    Completed = 3,
    Rejected = 4
}

// ---------------------------------------------------------------------------
// Cost & Pricing engine (see FeatureSpecs/CostAndPricingEngine.txt).
// ---------------------------------------------------------------------------

/// <summary>The two commercial divisions of soFlott UG.</summary>
public enum BusinessUnit
{
    /// <summary>soFlott Express - logistics (courier, routes, subcontracting).</summary>
    Express = 1,

    /// <summary>soFlott Digital - software, integration and IT consulting.</summary>
    Digital = 2
}

/// <summary>
/// Every sellable service. The engine is service-agnostic; the service type only decides which
/// pricing profile is resolved and which three-letter code appears in the invoice number.
/// </summary>
public enum ServiceType
{
    // --- Express -----------------------------------------------------------
    /// <summary>Point-to-point B2B courier job (Direktfahrt). Invoice code DLV.</summary>
    OnDemandDelivery = 1,

    /// <summary>Fixed daily/weekly route driven for one customer. Invoice code RTE.</summary>
    ContractedRoute = 2,

    /// <summary>Last-mile parcels driven for a carrier (Hermes, DPD...). Invoice code SUB.</summary>
    Subcontracting = 3,

    /// <summary>Monthly delivery agreement with an included allowance. Invoice code REC.</summary>
    RecurringB2BAgreement = 4,

    // --- Digital -----------------------------------------------------------
    /// <summary>Custom software development. Invoice code SWD.</summary>
    SoftwareDevelopment = 10,

    /// <summary>API and systems integration. Invoice code API.</summary>
    ApiIntegration = 11,

    /// <summary>IT consulting, audits, architecture reviews. Invoice code CON.</summary>
    ItConsulting = 12,

    /// <summary>Digital transformation programmes. Invoice code DTX.</summary>
    DigitalTransformation = 13,

    /// <summary>Maintenance and support retainers. Invoice code SUP.</summary>
    MaintenanceSupport = 14
}

/// <summary>How a cost behaves when activity changes.</summary>
public enum CostType
{
    /// <summary>Same amount every period regardless of activity (rent, insurance).</summary>
    Fixed = 1,

    /// <summary>Grows with activity (fuel, subcontractor fees).</summary>
    Variable = 2,

    /// <summary>Partly fixed, partly variable (phone plan with usage).</summary>
    SemiVariable = 3,

    /// <summary>Paid once (laptop, vehicle fit-out).</summary>
    OneTime = 4
}

/// <summary>How often a cost item's amount is incurred. Decides how the amount is annualised.</summary>
public enum CostFrequency
{
    OneTime = 1,
    Daily = 2,
    Weekly = 3,
    Monthly = 4,
    Quarterly = 5,
    Annually = 6,

    /// <summary>Amount is already a per-unit cost - no annualisation, no allocation denominator.</summary>
    PerHour = 10,
    PerKilometre = 11,
    PerDelivery = 12,
    PerRoute = 13,
    PerProject = 14
}

/// <summary>
/// The cost driver used to spread a periodic cost onto one unit of service.
/// Example: €1,200 insurance per year / 240 working days = €5 per working day.
/// </summary>
public enum AllocationMethod
{
    PerKilometre = 1,
    PerHour = 2,
    PerWorkingDay = 3,
    PerDelivery = 4,
    PerStop = 5,
    PerParcel = 6,
    PerRoute = 7,
    PerProject = 8,
    PerMonth = 9,

    /// <summary>Added once per calculation regardless of volume (set-up fees).</summary>
    WholeAmount = 20,

    /// <summary>Configured percentage of the direct costs of the calculation.</summary>
    PercentageOfDirectCosts = 21
}

/// <summary>Quantity unit a price or a cost driver refers to.</summary>
public enum PricingUnit
{
    Kilometre = 1,
    Hour = 2,
    Day = 3,
    Delivery = 4,
    Stop = 5,
    Parcel = 6,
    Route = 7,
    Project = 8,
    Month = 9,

    /// <summary>One-off amount (base fee, retainer, fixed project price).</summary>
    Fixed = 20
}

/// <summary>How a calculated cost is turned into a selling price.</summary>
public enum PricingStrategyType
{
    /// <summary>Price = cost x (1 + markup %). Markup is on cost.</summary>
    CostPlus = 1,

    /// <summary>Price = cost / (1 - margin %). Margin is on price. Never the same as markup.</summary>
    TargetMargin = 2,

    /// <summary>Admin sets the price; the engine still reports cost, profit and margin.</summary>
    FixedPrice = 3,

    /// <summary>Price = sum of (unit rate x quantity) from the profile's rate lines (base fee + per km ...).</summary>
    RateCard = 4
}

/// <summary>How the contingency reserve is calculated. Shown as its own line, never hidden in costs.</summary>
public enum RiskAllowanceMethod
{
    None = 0,
    FixedAmount = 1,
    PercentageOfDirectCosts = 2,
    PercentageOfTotalCosts = 3
}

/// <summary>German VAT treatment of an invoice line, derived from the customer's country.</summary>
public enum TaxTreatment
{
    /// <summary>Domestic B2B: 19% MwSt.</summary>
    StandardGermanVat = 1,

    /// <summary>EU B2B customer with USt-IdNr.: Reverse Charge, §13b UStG / Art. 196 EU VAT Directive, 0%.</summary>
    ReverseChargeEu = 2,

    /// <summary>Non-EU customer (UK, UAE...): not taxable in Germany, §3a Abs. 2 UStG, 0%.</summary>
    NonTaxableThirdCountry = 3
}

/// <summary>Outcome of a price calculation.</summary>
public enum CalculationStatus
{
    /// <summary>Everything resolved, no warnings.</summary>
    Ok = 1,

    /// <summary>Price produced but the admin should look at the warnings (e.g. below minimum margin).</summary>
    Warning = 2,

    /// <summary>No price could be produced - configuration is missing.</summary>
    Error = 3
}

/// <summary>What was changed in the pricing configuration (audit trail).</summary>
public enum PricingAuditAction
{
    Created = 1,
    Updated = 2,
    Deactivated = 3,
    NewVersion = 4,
    ManualOverride = 5
}
