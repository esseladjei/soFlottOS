using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services.Email;

public sealed class ResendEmailSender(HttpClient httpClient, EmailOptions options) : IEmailSender
{
    public async Task<string> SendAsync(
        EmailContent content, string recipient, string idempotencyKey, CancellationToken cancellationToken = default)
    {
        if (!options.Enabled)
            throw new InvalidOperationException("Email delivery is disabled.");

        using var request = new HttpRequestMessage(HttpMethod.Post, "emails");
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", options.ApiKey);
        request.Headers.Add("Idempotency-Key", idempotencyKey);
        request.Content = JsonContent.Create(new
        {
            from = options.From,
            to = new[] { recipient },
            subject = content.Subject,
            html = content.Html,
            text = content.Text,
            reply_to = string.IsNullOrWhiteSpace(options.ReplyTo) ? null : options.ReplyTo,
            attachments = content.Attachments.Count == 0 ? null : content.Attachments.Select(attachment => new
            {
                filename = attachment.Filename,
                content = attachment.Content,
                content_type = attachment.ContentType
            }).ToArray()
        }, options: new JsonSerializerOptions { DefaultIgnoreCondition = System.Text.Json.Serialization.JsonIgnoreCondition.WhenWritingNull });

        HttpResponseMessage response;
        try
        {
            response = await httpClient.SendAsync(request, cancellationToken);
        }
        catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
        {
            throw new EmailDeliveryException("The Resend request timed out.", true);
        }
        catch (HttpRequestException)
        {
            throw new EmailDeliveryException("Resend could not be reached.", true);
        }

        using (response)
        {
            if (!response.IsSuccessStatusCode)
            {
                var status = (int)response.StatusCode;
                var retry = response.Headers.RetryAfter;
                var retryAfter = retry?.Delta ?? (retry?.Date - DateTimeOffset.UtcNow);
                throw new EmailDeliveryException(
                    $"Resend rejected the request (HTTP {status}).",
                    status is 408 or 429 || status >= 500, retryAfter);
            }

            try
            {
                using var body = await JsonDocument.ParseAsync(
                    await response.Content.ReadAsStreamAsync(cancellationToken), cancellationToken: cancellationToken);
                if (body.RootElement.ValueKind == JsonValueKind.Object &&
                    body.RootElement.TryGetProperty("id", out var id) && id.ValueKind == JsonValueKind.String &&
                    !string.IsNullOrWhiteSpace(id.GetString()))
                    return id.GetString()!;
            }
            catch (JsonException)
            {
                throw new EmailDeliveryException("Resend returned an invalid response.", true);
            }
            catch (HttpRequestException)
            {
                throw new EmailDeliveryException("The Resend response could not be read.", true);
            }
            catch (OperationCanceledException) when (!cancellationToken.IsCancellationRequested)
            {
                throw new EmailDeliveryException("The Resend response timed out.", true);
            }

            throw new EmailDeliveryException("Resend did not return a message ID.", true);
        }
    }
}
