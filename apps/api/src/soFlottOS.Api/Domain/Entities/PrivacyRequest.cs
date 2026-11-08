namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// A GDPR data-subject request (access, deletion, ...) sent through the public privacy form.
/// The admin must answer within one month (Art. 12(3)), which is stored as <see cref="DueAt"/>.
/// Not a <see cref="BaseEntity"/>: the Guid is the unguessable reference the requester receives
/// by email and can use to look up the status.
/// </summary>
public sealed class PrivacyRequest
{
    public Guid Id { get; set; }

    public PrivacyRequestType Type { get; set; }

    public PrivacyRequestStatus Status { get; set; } = PrivacyRequestStatus.Received;

    public string Email { get; set; } = string.Empty;

    public string? FullName { get; set; }

    /// <summary>Free text from the requester. Only visible to admins, never echoed in emails.</summary>
    public string? Message { get; set; }

    /// <summary>Language of the requester ("de" or "en"), used for the acknowledgement email.</summary>
    public string Locale { get; set; } = "de";

    public DateTimeOffset CreatedAt { get; set; }

    public DateTimeOffset UpdatedAt { get; set; }

    /// <summary>CreatedAt plus one month.</summary>
    public DateTimeOffset DueAt { get; set; }

    /// <summary>Set when the request is Completed or Rejected.</summary>
    public DateTimeOffset? CompletedAt { get; set; }

    /// <summary>Internal admin note, never shown to the requester.</summary>
    public string? HandlerNote { get; set; }
}
