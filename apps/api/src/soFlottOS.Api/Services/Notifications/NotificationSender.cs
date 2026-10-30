using System.Net.Http.Headers;
using System.Text;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Notifications;

/// <summary>Sends one queued message through the configured provider.</summary>
public interface INotificationSender
{
    Task SendAsync(NotificationMessage message, CancellationToken cancellationToken = default);
}

/// <summary>
/// Twilio implementation. When Notifications:Provider is "None" (the default for
/// development) the message is only logged, so no credentials are needed to run the app.
/// </summary>
public sealed class NotificationSender(
    HttpClient httpClient,
    NotificationOptions options,
    ILogger<NotificationSender> logger) : INotificationSender
{
    private readonly HttpClient _httpClient = httpClient;
    private readonly NotificationOptions _options = options;
    private readonly ILogger<NotificationSender> _logger = logger;

    public async Task SendAsync(NotificationMessage message, CancellationToken cancellationToken = default)
    {
        if (_options.Provider == NotificationProvider.None)
        {
            _logger.LogInformation(
                "[notifications disabled] Would send to {Recipient}: {Body}",
                message.Recipient,
                message.Body);
            return;
        }

        if (string.IsNullOrWhiteSpace(_options.AccountSid) ||
            string.IsNullOrWhiteSpace(_options.AuthToken) ||
            string.IsNullOrWhiteSpace(_options.FromNumber))
        {
            throw new InvalidOperationException("Twilio configuration is incomplete.");
        }

        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            $"/2010-04-01/Accounts/{_options.AccountSid}/Messages.json");

        request.Headers.Authorization = new AuthenticationHeaderValue(
            "Basic",
            Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_options.AccountSid}:{_options.AuthToken}")));

        request.Content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            ["To"] = message.Recipient,
            ["From"] = _options.FromNumber,
            ["Body"] = message.Body
        });

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var error = await response.Content.ReadAsStringAsync(cancellationToken);
            throw new ExternalServiceException($"Twilio responded with {(int)response.StatusCode}: {error}");
        }

        _logger.LogInformation("Notification {NotificationId} delivered.", message.Id);
    }
}
