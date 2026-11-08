using System.Text.RegularExpressions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;

namespace soFlottOS.Api.Services;

public interface IConsentService
{
    /// <summary>Stores a consent decision. Recording the same id again changes nothing and is not an error.</summary>
    Task RecordAsync(RecordConsentRequest request, CancellationToken cancellationToken = default);

    /// <summary>The chain of decisions ending at <paramref name="consentId"/>, newest first.</summary>
    Task<IReadOnlyList<ConsentHistoryItemResponse>> GetHistoryAsync(
        Guid consentId, int take, CancellationToken cancellationToken = default);
}

/// <summary>
/// Keeps minimal proof of what a visitor agreed to in the cookie banner.
/// A record holds only the random id, the decision and the server time. It never holds an IP address,
/// a user agent or anything else that could identify the visitor, and none of that is logged either.
/// </summary>
public sealed partial class ConsentService(
    IConsentRepository consents,
    TimeProvider clock,
    MessageLocale locale) : IConsentService
{
    public const int MaxHistoryLength = 100;
    public const int DefaultHistoryLength = 50;

    private readonly IConsentRepository _consents = consents;
    private readonly TimeProvider _clock = clock;
    private readonly MessageLocale _locale = locale;

    // Letters, digits and . _ - only, so this field cannot be used to smuggle free text into the evidence table.
    [GeneratedRegex("^[A-Za-z0-9._-]{1,20}$")]
    private static partial Regex VersionPattern();

    public async Task RecordAsync(RecordConsentRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Id == Guid.Empty)
        {
            throw new ValidationException("id", Text("The consent id is required.", "Die Einwilligungs-ID ist erforderlich."));
        }

        var version = request.Version?.Trim() ?? string.Empty;
        if (!VersionPattern().IsMatch(version))
        {
            throw new ValidationException("version", Text(
                "The version must be 1-20 characters: letters, digits, '.', '_' or '-'.",
                "Die Version muss aus 1-20 Zeichen bestehen: Buchstaben, Ziffern, '.', '_' oder '-'."));
        }

        if (!Enum.IsDefined(request.Action))
        {
            throw new ValidationException("action", Text("The consent action is not valid.", "Die Einwilligungsaktion ist ungültig."));
        }

        var previousId = request.PreviousId == Guid.Empty ? null : request.PreviousId;
        if (previousId == request.Id)
        {
            throw new ValidationException("previousId", Text(
                "A decision cannot follow itself.", "Eine Entscheidung kann nicht auf sich selbst folgen."));
        }

        await _consents.TryAddAsync(new ConsentRecord
        {
            Id = request.Id,
            PreviousConsentId = previousId,
            Version = version,
            Action = request.Action,
            Analytics = request.Analytics,
            Marketing = request.Marketing,
            Preferences = request.Preferences,
            CreatedAt = _clock.GetUtcNow()
        }, cancellationToken);
    }

    public async Task<IReadOnlyList<ConsentHistoryItemResponse>> GetHistoryAsync(
        Guid consentId, int take, CancellationToken cancellationToken = default)
    {
        if (consentId == Guid.Empty)
        {
            throw new ValidationException("consentId", Text("The consent id is required.", "Die Einwilligungs-ID ist erforderlich."));
        }

        var limit = Math.Clamp(take, 1, MaxHistoryLength);
        var current = await _consents.GetByIdAsync(consentId, cancellationToken)
            ?? throw new NotFoundException(Text("Consent record not found.", "Einwilligungsnachweis nicht gefunden."));

        var history = new List<ConsentHistoryItemResponse>();
        var visited = new HashSet<Guid>();

        // Walk back from the newest decision. The visited set stops a corrupted chain that loops.
        while (current is not null && history.Count < limit && visited.Add(current.Id))
        {
            history.Add(new ConsentHistoryItemResponse(
                current.Id, current.PreviousConsentId, current.Version, current.Action,
                current.Analytics, current.Marketing, current.Preferences, current.CreatedAt));

            // The previous record may already have been purged by the retention sweep; then the chain simply ends.
            current = current.PreviousConsentId is { } previousId
                ? await _consents.GetByIdAsync(previousId, cancellationToken)
                : null;
        }

        return history;
    }

    private string Text(string english, string german) => _locale.Current == "en" ? english : german;
}
