using System.ComponentModel.DataAnnotations;
using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Dtos;

// ---------------------------------------------------------------------------
// Invoice payloads. InvoiceDetailResponse carries everything required to print a
// legally compliant German "Rechnung" in the browser.
// ---------------------------------------------------------------------------

public record InvoiceResponse(
    int Id,
    string InvoiceNumber,
    int ClientId,
    string ClientCompanyName,
    int OrderId,
    decimal NetTotal,
    decimal VatRate,
    decimal VatTotal,
    decimal GrossTotal,
    InvoiceStatus Status,
    PaymentMethod PaymentMethod,
    DateTimeOffset IssuedAt,
    DateTimeOffset DueDate);

/// <summary>The seller block (your UG) that must appear on every invoice.</summary>
public sealed record InvoiceIssuerResponse(
    string CompanyName,
    string Street,
    string City,
    string PostalCode,
    string Country,
    string TaxIdNumber,
    string Email,
    string Phone,
    string? Iban,
    string? Bic,
    string? BankName,
    string? PayPalHandle);

public sealed record InvoiceDetailResponse(
    int Id,
    string InvoiceNumber,
    int ClientId,
    string ClientCompanyName,
    int OrderId,
    decimal NetTotal,
    decimal VatRate,
    decimal VatTotal,
    decimal GrossTotal,
    InvoiceStatus Status,
    PaymentMethod PaymentMethod,
    DateTimeOffset IssuedAt,
    DateTimeOffset DueDate,
    InvoiceIssuerResponse Issuer,
    ClientDetailResponse Client,
    OrderResponse Order,
    int PaymentTermsDays)
    : InvoiceResponse(Id, InvoiceNumber, ClientId, ClientCompanyName, OrderId, NetTotal, VatRate, VatTotal, GrossTotal, Status, PaymentMethod, IssuedAt, DueDate);

/// <summary>Admin action: Draft -> Sent -> Paid / Overdue.</summary>
public sealed record UpdateInvoiceStatusRequest
{
    [Required]
    public InvoiceStatus Status { get; init; } = InvoiceStatus.Sent;
}
