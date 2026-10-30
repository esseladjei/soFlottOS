using System.ComponentModel.DataAnnotations;
using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Dtos;

// ---------------------------------------------------------------------------
// Booking, quoting and reading delivery orders.
// ---------------------------------------------------------------------------

/// <summary>Price preview before the client commits to the booking.</summary>
public sealed record QuoteOrderRequest
{
    [Range(1, int.MaxValue)]
    public int? ClientId { get; init; }

    /// <summary>Full pickup address. The API geocodes it, so clients never type coordinates.</summary>
    [Required, MaxLength(500)]
    public string PickupAddress { get; init; } = string.Empty;

    /// <summary>Full drop-off address.</summary>
    [Required, MaxLength(500)]
    public string DropoffAddress { get; init; } = string.Empty;
}

/// <summary>One point of the route, ready to be drawn on the booking map.</summary>
public sealed record RoutePointResponse(decimal Lat, decimal Lng);

/// <summary>The resolved end of a route: what the geocoder matched and where it sits.</summary>
public sealed record RouteEndpointResponse(decimal Lat, decimal Lng, string Label);

public sealed record OrderQuoteResponse(
    decimal DistanceKm,
    int EstimatedDurationMinutes,
    decimal NetPrice,
    decimal VatAmount,
    decimal GrossPrice,
    decimal VatRate,
    string RoutingSource,
    decimal BaseFee,
    decimal RatePerKilometer,
    decimal DistanceCost,
    bool MinimumChargeApplied,
    RouteEndpointResponse Pickup,
    RouteEndpointResponse Dropoff,
    IReadOnlyList<RoutePointResponse> Geometry);

public sealed record CreateOrderRequest
{
    /// <summary>Admins book on behalf of a client; a client booking for itself may leave this null.</summary>
    [Range(1, int.MaxValue)]
    public int? ClientId { get; init; }

    public CargoCategory CargoCategory { get; init; } = CargoCategory.Document;

    [Range(0.01, 10_000)]
    public decimal WeightKg { get; init; } = 1m;

    [Required, MaxLength(500)]
    public string PickupAddress { get; init; } = string.Empty;

    /// <summary>Optional override. Left empty the API geocodes <see cref="PickupAddress"/> instead.</summary>
    [Range(-90, 90)]
    public decimal? PickupLat { get; init; }

    [Range(-180, 180)]
    public decimal? PickupLng { get; init; }

    [Required, MaxLength(150)]
    public string? PickupContactName { get; init; }

    [Required, MaxLength(50)]
    public string? PickupPhone { get; init; }

    [Required, MaxLength(500)]
    public string DropoffAddress { get; init; } = string.Empty;

    /// <summary>Optional override. Left empty the API geocodes <see cref="DropoffAddress"/> instead.</summary>
    [Range(-90, 90)]
    public decimal? DropoffLat { get; init; }

    [Range(-180, 180)]
    public decimal? DropoffLng { get; init; }

    [Required, MaxLength(150)]
    public string? DropoffContactName { get; init; }

    [Required, MaxLength(50)]
    public string? DropoffPhone { get; init; }

    /// <summary>"Ring the back doorbell and ask for warehouse manager Hans".</summary>
    [MaxLength(1000)]
    public string? SpecialInstructions { get; init; }

    public PaymentMethod PaymentMethod { get; init; } = PaymentMethod.BankTransfer;

    [MaxLength(100)]
    public string? ExternalReference { get; init; }
}

/// <summary>Admin dispatch action: give an order to a driver.</summary>
public sealed record AssignOrderRequest
{
    [Range(1, int.MaxValue)]
    public int DriverUserId { get; init; }
}

public sealed record ProofOfDeliveryResponse(
    int OrderId,
    string RecipientName,
    string SignatureDataUrl,
    decimal GpsLatitude,
    decimal GpsLongitude,
    DateTimeOffset DeliveredAt);

/// <summary>Everything the three portals need to display one order.</summary>
public sealed record OrderResponse(
    int Id,
    int ClientId,
    string ClientCompanyName,
    int? AssignedDriverId,
    string? AssignedDriverName,
    CargoCategory CargoCategory,
    decimal WeightKg,
    string PickupAddress,
    decimal? PickupLat,
    decimal? PickupLng,
    string? PickupContactName,
    string? PickupPhone,
    string DropoffAddress,
    decimal? DropoffLat,
    decimal? DropoffLng,
    string? DropoffContactName,
    string? DropoffPhone,
    string? SpecialInstructions,
    string? ExternalReference,
    decimal DistanceKm,
    int EstimatedDurationMinutes,
    decimal NetPrice,
    decimal VatAmount,
    decimal GrossPrice,
    OrderStatus Status,
    PaymentMethod PaymentMethod,
    DateTimeOffset CreatedAt,
    DateTimeOffset? AssignedAt,
    DateTimeOffset? PickedUpAt,
    DateTimeOffset? DeliveredAt,
    int? InvoiceId,
    string? InvoiceNumber,
    ProofOfDeliveryResponse? ProofOfDelivery);
