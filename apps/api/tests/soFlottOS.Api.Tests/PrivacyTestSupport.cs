using Microsoft.AspNetCore.Http;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Tests;

/// <summary>Shared builders for the privacy / consent tests. Everything runs on the SQLite test database.</summary>
internal static class PrivacySamples
{
    public static readonly DateTimeOffset Now = new(2026, 3, 10, 12, 0, 0, TimeSpan.Zero);

    public static MessageLocale Locale(string? header = null)
    {
        var context = new DefaultHttpContext();
        if (header is not null)
        {
            context.Request.Headers[MessageLocale.HeaderName] = header;
        }

        return new MessageLocale(new HttpContextAccessor { HttpContext = context });
    }

    public static ConsentService ConsentService(EmailTestDatabase database, TimeProvider? clock = null, string? locale = null) =>
        new(new ConsentRepository(database.Context), clock ?? new FixedEmailClock(Now), Locale(locale));

    /// <summary>A service wired to the real email outbox so tests can read back the queued messages.</summary>
    public static PrivacyRequestService RequestService(
        EmailTestDatabase database, TimeProvider? clock = null, PrivacyOptions? options = null, string? locale = null) =>
        new(new PrivacyRequestRepository(database.Context),
            new EmailCommunications(EmailSamples.Queue(database.Context)),
            options ?? new PrivacyOptions(),
            clock ?? new FixedEmailClock(Now),
            Locale(locale));

    public static RecordConsentRequest Consent(Guid? id = null, Guid? previousId = null) => new()
    {
        Id = id ?? Guid.NewGuid(),
        PreviousId = previousId,
        Version = "1.0",
        Action = ConsentAction.Custom,
        Analytics = true,
        Marketing = false,
        Preferences = true
    };

    public static CreatePrivacyRequestRequest NewRequest(
        PrivacyRequestType type = PrivacyRequestType.Access, string? locale = "de") => new()
    {
        Type = type,
        Email = "erika.mustermann@example.org",
        FullName = "Erika Mustermann",
        Message = "Bitte alle Daten geheim-Marker-4711 senden.",
        Locale = locale
    };

    public static ConsentRecord StoredConsent(Guid id, Guid? previousId, DateTimeOffset createdAt) => new()
    {
        Id = id,
        PreviousConsentId = previousId,
        Version = "1.0",
        Action = ConsentAction.AcceptAll,
        Analytics = true,
        Marketing = true,
        Preferences = true,
        CreatedAt = createdAt
    };

    public static PrivacyRequest StoredRequest(
        PrivacyRequestStatus status, DateTimeOffset createdAt, DateTimeOffset? completedAt = null) => new()
    {
        Id = Guid.NewGuid(),
        Type = PrivacyRequestType.Deletion,
        Status = status,
        Email = "person@example.org",
        Locale = "de",
        CreatedAt = createdAt,
        UpdatedAt = createdAt,
        DueAt = createdAt.AddMonths(1),
        CompletedAt = completedAt
    };
}
