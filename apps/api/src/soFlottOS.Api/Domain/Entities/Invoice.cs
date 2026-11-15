namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// A legally compliant German invoice (Rechnung) for exactly one order.
/// It is created automatically when the client places the order, so the client can pay
/// by bank transfer (Überweisung) or PayPal straight away.
/// <para>
/// The invoice number is consecutive per year and carries a three-letter service code so anyone can
/// tell which service it bills (e.g. SOFLOTT-DLV-2026-1001 = on-demand delivery, SOFLOTT-SWD-2026-1002
/// = software development), as required by German bookkeeping rules (§14 UStG).
/// </para>
/// </summary>
public sealed class Invoice : BaseEntity
{
    public string InvoiceNumber { get; set; } = string.Empty;

    public int ClientId { get; set; }

    public Client Client { get; set; } = null!;

    /// <summary>The single order this invoice bills.</summary>
    public int OrderId { get; set; }

    public Order Order { get; set; } = null!;

    public decimal NetTotal { get; set; }

    /// <summary>VAT percentage used, stored so historic invoices stay correct if the rate changes.</summary>
    public decimal VatRate { get; set; }

    public decimal VatTotal { get; set; }

    public decimal GrossTotal { get; set; }

    /// <summary>Which service is billed; drives the code inside the invoice number.</summary>
    public ServiceType ServiceType { get; set; } = ServiceType.OnDemandDelivery;

    /// <summary>Why VAT is 19% or 0% - frozen so the invoice stays legally correct.</summary>
    public TaxTreatment TaxTreatment { get; set; } = TaxTreatment.StandardGermanVat;

    /// <summary>Mandatory legal note for 0% invoices (§13b / §3a UStG); null for standard VAT.</summary>
    public string? TaxNote { get; set; }

    public PaymentMethod PaymentMethod { get; set; } = PaymentMethod.BankTransfer;

    public InvoiceStatus Status { get; set; } = InvoiceStatus.Draft;

    public DateTimeOffset IssuedAt { get; set; } = DateTimeOffset.UtcNow;

    public DateTimeOffset DueDate { get; set; }

    public DateTimeOffset? PaidAt { get; set; }
}
