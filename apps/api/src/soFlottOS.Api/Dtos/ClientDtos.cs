using System.ComponentModel.DataAnnotations;

namespace soFlottOS.Api.Dtos;

// ---------------------------------------------------------------------------
// CRM payloads: creating/updating a business customer and reading it back.
// ---------------------------------------------------------------------------

/// <summary>Used for both POST /api/clients and PUT /api/clients/{id}.</summary>
public sealed record SaveClientRequest
{
    [Required, MaxLength(250)]
    public string CompanyName { get; init; } = string.Empty;

    [Required, MaxLength(150)]
    public string ContactPerson { get; init; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required, MaxLength(50)]
    public string Phone { get; init; } = string.Empty;

    [Required, MaxLength(250)]
    public string Street { get; init; } = string.Empty;

    [Required, MaxLength(100)]
    public string City { get; init; } = string.Empty;

    [Required, MaxLength(20)]
    public string PostalCode { get; init; } = string.Empty;

    [MaxLength(100)]
    public string Country { get; init; } = "Germany";

    [MaxLength(50)]
    public string? TaxIdNumber { get; init; }

    [MaxLength(1000)]
    public string? SpecialDeliveryInstructions { get; init; }

    [Range(0.01, 1_000_000)]
    public decimal? DefaultBaseFee { get; init; }

    [Range(0.01, 1_000_000)]
    public decimal? DefaultRatePerKilometer { get; init; }
}

/// <summary>Row in the admin CRM list.</summary>
public record ClientSummaryResponse(
    int Id,
    string CompanyName,
    string ContactPerson,
    string Email,
    string Phone,
    string City,
    string PostalCode,
    int ActiveOrders,
    int TotalOrders,
    DateTimeOffset CreatedAt);

/// <summary>Full CRM record, including billing address and negotiated rates.</summary>
public sealed record ClientDetailResponse(
    int Id,
    string CompanyName,
    string ContactPerson,
    string Email,
    string Phone,
    string City,
    string PostalCode,
    int ActiveOrders,
    int TotalOrders,
    DateTimeOffset CreatedAt,
    int? UserId,
    string Street,
    string Country,
    string? TaxIdNumber,
    string? SpecialDeliveryInstructions,
    decimal? DefaultBaseFee,
    decimal? DefaultRatePerKilometer)
    : ClientSummaryResponse(Id, CompanyName, ContactPerson, Email, Phone, City, PostalCode, ActiveOrders, TotalOrders, CreatedAt);
