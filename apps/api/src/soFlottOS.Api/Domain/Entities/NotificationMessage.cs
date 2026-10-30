namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// An outbound SMS/WhatsApp message waiting to be delivered.
/// Messages are written to the database first and sent later by the background worker
/// (see Services/Notifications), so a failing SMS provider can never break an API request.
/// </summary>
public sealed class NotificationMessage : BaseEntity
{
    public int? OrderId { get; set; }

    public Order? Order { get; set; }

    public NotificationChannel Channel { get; set; }

    public NotificationStatus Status { get; set; } = NotificationStatus.Pending;

    /// <summary>Why the message was sent, e.g. "order_created" or "proof_of_delivery".</summary>
    public string EventType { get; set; } = string.Empty;

    public string Recipient { get; set; } = string.Empty;

    public string Body { get; set; } = string.Empty;

    public int AttemptCount { get; set; }

    public DateTimeOffset? LastAttemptAt { get; set; }

    public DateTimeOffset? ProcessedAt { get; set; }

    public string? LastError { get; set; }
}
