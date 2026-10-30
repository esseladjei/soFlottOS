using System.ComponentModel.DataAnnotations;
using soFlottOS.Api.Services.Security;

namespace soFlottOS.Api.Dtos;

// ---------------------------------------------------------------------------
// Login and registration payloads.
// [Required]/[EmailAddress]/... attributes are checked by ASP.NET Core before the
// controller runs, so services only ever see structurally valid data.
// ---------------------------------------------------------------------------

public sealed record LoginRequest
{
    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required, MinLength(8), MaxLength(128)]
    public string Password { get; init; } = string.Empty;
}

/// <summary>Self-service signup for a B2B customer. Creates a User + a CRM Client record.</summary>
public sealed record RegisterClientRequest
{
    [Required, MaxLength(250)]
    public string CompanyName { get; init; } = string.Empty;

    [Required, MaxLength(150)]
    public string ContactPerson { get; init; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required, StrongPassword]
    public string Password { get; init; } = string.Empty;

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
}

/// <summary>Self-service signup for a courier. The driver starts Offline.</summary>
public sealed record RegisterDriverRequest
{
    [Required, MaxLength(150)]
    public string FullName { get; init; } = string.Empty;

    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required, StrongPassword]
    public string Password { get; init; } = string.Empty;

    [Required, MaxLength(50)]
    public string Phone { get; init; } = string.Empty;

    [MaxLength(150)]
    public string? VehicleDescription { get; init; }
}

public sealed record ForgotPasswordRequest
{
    [Required, EmailAddress, MaxLength(255)]
    public string Email { get; init; } = string.Empty;

    [Required, RegularExpression("^(en|de)$")]
    public string Locale { get; init; } = "de";
}

public sealed record ResetPasswordRequest
{
    [Required, RegularExpression("^[A-F0-9]{64}$"), MaxLength(64)]
    public string Token { get; init; } = string.Empty;

    [Required, StrongPassword]
    public string Password { get; init; } = string.Empty;
}

/// <summary>Returned by login and both registration endpoints.</summary>
public sealed record AuthResponse(
    int UserId,
    string Email,
    string FullName,
    string Role,
    string Token,
    DateTimeOffset ExpiresAtUtc,
    int? ClientId);

/// <summary>Returned by GET /api/auth/me so a frontend can refresh the session.</summary>
public sealed record CurrentUserResponse(
    int UserId,
    string Email,
    string FullName,
    string Role,
    int? ClientId,
    string? DriverAvailability);
