namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// A single courier job: one pickup, one drop-off, one price.
/// The money columns are frozen at booking time so an invoice can never change
/// retroactively when the price list is updated.
/// </summary>
public sealed class Order : BaseEntity
{
    public int ClientId { get; set; }

    public Client Client { get; set; } = null!;

    /// <summary>The driver (User with Role == Driver) currently responsible for the job.</summary>
    public int? AssignedDriverId { get; set; }

    public User? AssignedDriver { get; set; }

    /// <summary>Invoice generated automatically when the order is placed.</summary>
    public int? InvoiceId { get; set; }

    public Invoice? Invoice { get; set; }

    public CargoCategory CargoCategory { get; set; }

    public decimal WeightKg { get; set; }

    // --- Pickup -------------------------------------------------------------

    public string PickupAddress { get; set; } = string.Empty;

    public decimal? PickupLat { get; set; }

    public decimal? PickupLng { get; set; }

    public string? PickupContactName { get; set; }

    public string? PickupPhone { get; set; }

    // --- Drop-off -----------------------------------------------------------

    public string DropoffAddress { get; set; } = string.Empty;

    public decimal? DropoffLat { get; set; }

    public decimal? DropoffLng { get; set; }

    public string? DropoffContactName { get; set; }

    public string? DropoffPhone { get; set; }

    /// <summary>Free text from the client, e.g. "Ring the back doorbell, ask for Hans".</summary>
    public string? SpecialInstructions { get; set; }

    /// <summary>The client's own reference/ticket number, shown on the invoice.</summary>
    public string? ExternalReference { get; set; }

    // --- Pricing (calculated once, at booking time) -------------------------

    public decimal DistanceKm { get; set; }

    public int EstimatedDurationMinutes { get; set; }

    /// <summary>Net price: base fee + (distance x rate per km).</summary>
    public decimal NetPrice { get; set; }

    /// <summary>German VAT (MwSt), normally 19% of the net price.</summary>
    public decimal VatAmount { get; set; }

    /// <summary>What the client actually pays (net + VAT).</summary>
    public decimal GrossPrice { get; set; }

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.BankTransfer;

    // --- Lifecycle ----------------------------------------------------------

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTimeOffset? AssignedAt { get; set; }

    public DateTimeOffset? PickedUpAt { get; set; }

    public DateTimeOffset? DeliveredAt { get; set; }

    public ProofOfDelivery? ProofOfDelivery { get; set; }

    public ICollection<NotificationMessage> Notifications { get; } = new List<NotificationMessage>();
}
