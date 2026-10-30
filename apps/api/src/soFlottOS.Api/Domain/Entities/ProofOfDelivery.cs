namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// Digital proof that a delivery happened: who received it, their signature,
/// and where the driver's phone was when the signature was captured.
/// Exactly one record per delivered order.
/// </summary>
public sealed class ProofOfDelivery : BaseEntity
{
    public int OrderId { get; set; }

    public Order Order { get; set; } = null!;

    public string RecipientName { get; set; } = string.Empty;

    /// <summary>Base64 PNG data URL produced by the canvas signature pad in the driver PWA.</summary>
    public string SignatureDataUrl { get; set; } = string.Empty;

    public decimal GpsLatitude { get; set; }

    public decimal GpsLongitude { get; set; }

    public DateTimeOffset DeliveredAt { get; set; } = DateTimeOffset.UtcNow;
}
