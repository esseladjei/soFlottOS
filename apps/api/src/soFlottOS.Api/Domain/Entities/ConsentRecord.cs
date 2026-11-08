namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// Minimal evidence of one cookie-consent decision (GDPR Art. 7(1) accountability).
/// The visitor's browser generates the <see cref="Id"/> and keeps it in its first-party consent cookie.
/// Data minimisation: no IP address, user agent or any other personal identifier is stored here, so
/// the row cannot be linked to a person. "Necessary" cookies are always on and therefore not stored.
/// Not a <see cref="BaseEntity"/>: the key is the client-supplied Guid and rows are never updated.
/// </summary>
public sealed class ConsentRecord
{
    /// <summary>Consent record identifier chosen by the client; recording the same id twice is a no-op.</summary>
    public Guid Id { get; set; }

    /// <summary>The visitor's previous decision, forming a chain. Deliberately not a foreign key: the earlier row may be purged.</summary>
    public Guid? PreviousConsentId { get; set; }

    /// <summary>Version of the consent text/categories the visitor saw, e.g. "1.0".</summary>
    public string Version { get; set; } = string.Empty;

    public ConsentAction Action { get; set; }

    public bool Analytics { get; set; }

    public bool Marketing { get; set; }

    public bool Preferences { get; set; }

    /// <summary>Server time (UTC) the decision was recorded.</summary>
    public DateTimeOffset CreatedAt { get; set; }
}
