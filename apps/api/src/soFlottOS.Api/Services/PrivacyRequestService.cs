using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services;

public interface IPrivacyRequestService
{
    Task<PrivacyRequestCreatedResponse> CreateAsync(
        CreatePrivacyRequestRequest request, CancellationToken cancellationToken = default);

    /// <summary>Public lookup by reference id. Returns no personal data.</summary>
    Task<PrivacyRequestStatusResponse> GetStatusAsync(Guid id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<PrivacyRequestAdminResponse>> ListAsync(
        PrivacyRequestStatus? status, CancellationToken cancellationToken = default);

    Task<PrivacyRequestAdminResponse> UpdateStatusAsync(
        Guid id, UpdatePrivacyRequestStatusRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Handles GDPR data-subject requests (access, deletion, ...). The controller never sees the rules here:
/// a request is answered within one month (Art. 12(3) GDPR), so every new request gets a due date,
/// the requester gets an acknowledgement and the privacy inbox gets a heads-up - both through the email outbox.
/// </summary>
public sealed class PrivacyRequestService(
    IPrivacyRequestRepository requests,
    IEmailCommunications emails,
    PrivacyOptions options,
    TimeProvider clock,
    MessageLocale locale) : IPrivacyRequestService
{
    public const int MaxListLength = 200;

    private const int EmailMaxLength = 254;
    private const int FullNameMaxLength = 120;
    private const int FreeTextMaxLength = 2000;

    private readonly IPrivacyRequestRepository _requests = requests;
    private readonly IEmailCommunications _emails = emails;
    private readonly PrivacyOptions _options = options;
    private readonly TimeProvider _clock = clock;
    private readonly MessageLocale _locale = locale;

    public async Task<PrivacyRequestCreatedResponse> CreateAsync(
        CreatePrivacyRequestRequest request, CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.Type))
        {
            throw new ValidationException("type", Text("The request type is not valid.", "Die Art der Anfrage ist ungültig."));
        }

        var email = request.Email?.Trim() ?? string.Empty;
        if (email.Length > EmailMaxLength || !EmailOptions.IsMailbox(email))
        {
            throw new ValidationException("email", Text("A valid email address is required.", "Eine gültige E-Mail-Adresse ist erforderlich."));
        }

        var fullName = NullIfBlank(request.FullName);
        var message = NullIfBlank(request.Message);
        if (fullName?.Length > FullNameMaxLength)
        {
            throw new ValidationException("fullName", Text("The name is too long.", "Der Name ist zu lang."));
        }

        if (message?.Length > FreeTextMaxLength)
        {
            throw new ValidationException("message", Text("The message is too long.", "Die Nachricht ist zu lang."));
        }

        var now = _clock.GetUtcNow();
        var privacyRequest = new PrivacyRequest
        {
            Id = Guid.NewGuid(),
            Type = request.Type,
            Status = PrivacyRequestStatus.Received,
            Email = email,
            FullName = fullName,
            Message = message,
            Locale = string.Equals(request.Locale?.Trim(), "en", StringComparison.OrdinalIgnoreCase) ? "en" : "de",
            CreatedAt = now,
            UpdatedAt = now,
            DueAt = now.AddMonths(1)
        };

        // The emails are staged on the same context, so the request and its emails are saved together or not at all.
        _requests.Add(privacyRequest);
        _emails.PrivacyRequestReceived(privacyRequest, _options.NotificationEmail);
        await _requests.SaveChangesAsync(cancellationToken);

        return new PrivacyRequestCreatedResponse(
            privacyRequest.Id, privacyRequest.Status, privacyRequest.CreatedAt, privacyRequest.DueAt);
    }

    public async Task<PrivacyRequestStatusResponse> GetStatusAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var request = await _requests.GetByIdAsync(id, cancellationToken) ?? throw NotFound();

        return new PrivacyRequestStatusResponse(
            request.Id, request.Type, request.Status, request.CreatedAt, request.DueAt, request.CompletedAt);
    }

    public async Task<IReadOnlyList<PrivacyRequestAdminResponse>> ListAsync(
        PrivacyRequestStatus? status, CancellationToken cancellationToken = default)
    {
        var items = await _requests.ListAsync(status, MaxListLength, cancellationToken);
        return items.Select(ToAdminResponse).ToList();
    }

    /// <summary>
    /// Moves a request to a new status. A null note keeps the existing one; a blank note clears it.
    /// Completed and Rejected stamp <c>CompletedAt</c>; going back to Received or InProgress reopens the request.
    /// </summary>
    public async Task<PrivacyRequestAdminResponse> UpdateStatusAsync(
        Guid id, UpdatePrivacyRequestStatusRequest request, CancellationToken cancellationToken = default)
    {
        if (!Enum.IsDefined(request.Status))
        {
            throw new ValidationException("status", Text("The status is not valid.", "Der Status ist ungültig."));
        }

        var note = NullIfBlank(request.HandlerNote);
        if (note?.Length > FreeTextMaxLength)
        {
            throw new ValidationException("handlerNote", Text("The note is too long.", "Die Notiz ist zu lang."));
        }

        var privacyRequest = await _requests.GetByIdAsync(id, cancellationToken) ?? throw NotFound();
        var now = _clock.GetUtcNow();

        privacyRequest.Status = request.Status;
        privacyRequest.UpdatedAt = now;
        privacyRequest.CompletedAt = request.Status is PrivacyRequestStatus.Completed or PrivacyRequestStatus.Rejected
            ? privacyRequest.CompletedAt ?? now
            : null;
        if (request.HandlerNote is not null)
        {
            privacyRequest.HandlerNote = note;
        }

        await _requests.SaveChangesAsync(cancellationToken);
        return ToAdminResponse(privacyRequest);
    }

    private static PrivacyRequestAdminResponse ToAdminResponse(PrivacyRequest request) => new(
        request.Id, request.Type, request.Status, request.Email, request.FullName, request.Message,
        request.Locale, request.HandlerNote, request.CreatedAt, request.UpdatedAt, request.DueAt, request.CompletedAt);

    private static string? NullIfBlank(string? value) =>
        string.IsNullOrWhiteSpace(value) ? null : value.Trim();

    private NotFoundException NotFound() =>
        new(Text("Privacy request not found.", "Datenschutzanfrage nicht gefunden."));

    private string Text(string english, string german) => _locale.Current == "en" ? english : german;
}
