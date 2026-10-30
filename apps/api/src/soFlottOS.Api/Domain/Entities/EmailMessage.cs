namespace soFlottOS.Api.Domain.Entities;

public enum EmailMessageStatus { Pending, Processing, Sent, Failed }

public sealed class EmailMessage : BaseEntity
{
    public string DeliveryKey { get; set; } = Guid.NewGuid().ToString("N");
    public string EventType { get; set; } = string.Empty;
    public string Recipient { get; set; } = string.Empty;
    public string ContentJson { get; set; } = string.Empty;
    public EmailMessageStatus Status { get; set; } = EmailMessageStatus.Pending;
    public int AttemptCount { get; set; }
    public DateTimeOffset NextAttemptAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? FirstAttemptAt { get; set; }
    public DateTimeOffset? LeaseUntil { get; set; }
    public string? LeaseToken { get; set; }
    public string? ProviderMessageId { get; set; }
    public string? LastError { get; set; }
    public DateTimeOffset? SentAt { get; set; }
}
