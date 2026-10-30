using System.ComponentModel.DataAnnotations;
using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Dtos;

// ---------------------------------------------------------------------------
// Driver PWA payloads: profile, availability toggle and proof of delivery.
// ---------------------------------------------------------------------------

public sealed record DriverProfileResponse(
    int UserId,
    string FullName,
    string Email,
    string? Phone,
    string? VehicleDescription,
    DriverAvailability Availability,
    int ActiveJobs,
    int CompletedJobs,
    decimal RevenueGenerated);

/// <summary>
/// Drivers may only switch between Online and Offline.
/// Busy is set by the system while a job is running (see DriverService / OrderService).
/// </summary>
public sealed record UpdateAvailabilityRequest
{
    [Required]
    public DriverAvailability Availability { get; init; } = DriverAvailability.Offline;
}

/// <summary>Captured on the phone: signature canvas + GPS position of the handover.</summary>
public sealed record ProofOfDeliveryRequest
{
    [Required, MaxLength(150)]
    public string RecipientName { get; init; } = string.Empty;

    /// <summary>Base64 PNG data URL, e.g. "data:image/png;base64,....".</summary>
    [Required]
    public string SignatureDataUrl { get; init; } = string.Empty;

    [Range(-90, 90)]
    public decimal GpsLatitude { get; init; }

    [Range(-180, 180)]
    public decimal GpsLongitude { get; init; }
}
