namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// The CRM record of a business customer (the "C" in CRM module).
/// A client can be created by self-registration (then <see cref="UserId"/> points at the
/// login account) or onboarded manually by an admin after a flyer drop (then UserId is null).
/// </summary>
public sealed class Client : BaseEntity
{
    /// <summary>Login account of this business, when it has one.</summary>
    public int? UserId { get; set; }

    public User? User { get; set; }

    public string CompanyName { get; set; } = string.Empty;

    public string ContactPerson { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Street { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = "Germany";

    /// <summary>German VAT id (USt-IdNr.) printed on the invoice.</summary>
    public string? TaxIdNumber { get; set; }

    /// <summary>Standing instructions that apply to every delivery for this client.</summary>
    public string? SpecialDeliveryInstructions { get; set; }

    /// <summary>Optional negotiated base fee that overrides the global price list.</summary>
    public decimal? DefaultBaseFee { get; set; }

    /// <summary>Optional negotiated per-kilometre rate that overrides the global price list.</summary>
    public decimal? DefaultRatePerKilometer { get; set; }

    public ICollection<Order> Orders { get; } = new List<Order>();

    public ICollection<Invoice> Invoices { get; } = new List<Invoice>();
}
