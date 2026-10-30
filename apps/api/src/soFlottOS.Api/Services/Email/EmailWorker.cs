using System.Text.Json;
using System.Security.Cryptography;
using Microsoft.AspNetCore.DataProtection;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;

namespace soFlottOS.Api.Services.Email;

public sealed class EmailDispatcher(
    IEmailRepository repository, IEmailSender sender, EmailOptions options, TimeProvider clock,
    ILogger<EmailDispatcher> logger, IDataProtectionProvider protection)
{
    // Resend retains idempotency keys for 24 hours. Never auto-retry outside that window.
    private static readonly TimeSpan RetryWindow = TimeSpan.FromHours(23);

    public async Task ProcessBatchAsync(CancellationToken cancellationToken)
    {
        var ids = await repository.GetDueIdsAsync(clock.GetUtcNow(), options.ProcessingBatchSize, options.MaxAttempts, cancellationToken);
        foreach (var id in ids)
        {
            cancellationToken.ThrowIfCancellationRequested();
            var message = await repository.ClaimAsync(id, clock.GetUtcNow(),
                TimeSpan.FromSeconds(options.TimeoutSeconds + 60), options.MaxAttempts, cancellationToken);
            if (message is null) continue;
            var now = clock.GetUtcNow();
            if (message.FirstAttemptAt.HasValue && now - message.FirstAttemptAt.Value >= RetryWindow)
            {
                await repository.FailAsync(message, "Automatic retry stopped before the provider idempotency window expires.", false, now, cancellationToken);
                logger.LogError("Email {EmailId} exceeded its safe retry window.", id);
                continue;
            }

            EmailContent content;
            try
            {
                var payload = message.EventType == PasswordResetEmailOutbox.EventType
                    ? PasswordResetEmailOutbox.Unprotect(protection, message.ContentJson)
                    : message.ContentJson;
                content = JsonSerializer.Deserialize<EmailContent>(payload)
                    ?? throw new JsonException("Missing email content.");
                if (string.IsNullOrWhiteSpace(content.Subject) || string.IsNullOrWhiteSpace(content.Html) ||
                    string.IsNullOrWhiteSpace(content.Text) || content.Attachments is null)
                    throw new JsonException("Incomplete email content.");
            }
            catch (Exception exception) when (exception is JsonException or CryptographicException)
            {
                await repository.FailAsync(message, "Stored email content is invalid.", false, now, cancellationToken);
                logger.LogError("Email {EmailId} has invalid stored content.", id);
                continue;
            }

            string providerId;
            try
            {
                providerId = await sender.SendAsync(content, message.Recipient, $"soflott-email-{message.DeliveryKey}", cancellationToken);
            }
            catch (EmailDeliveryException exception)
            {
                var next = clock.GetUtcNow().Add(RetryDelay(options, message.AttemptCount, exception.RetryAfter));
                var retry = exception.IsTransient && message.AttemptCount < options.MaxAttempts &&
                    next - message.FirstAttemptAt!.Value < RetryWindow;
                await repository.FailAsync(message, exception.Message, retry, next, cancellationToken);
                logger.LogWarning("Email {EmailId} delivery attempt {Attempt} failed; retry: {Retry}. {Reason}",
                    id, message.AttemptCount, retry, exception.Message);
                continue;
            }

            // Persistence failures leave the lease intact; retrying uses the same provider key.
            await repository.CompleteAsync(message, providerId, clock.GetUtcNow(), cancellationToken);
        }
    }

    internal static TimeSpan RetryDelay(EmailOptions options, int attempt, TimeSpan? providerDelay)
    {
        var delay = TimeSpan.FromSeconds(Math.Min(3600, options.RetryBaseSeconds * Math.Pow(2, Math.Max(0, attempt - 1))));
        return providerDelay.HasValue && providerDelay.Value > delay ? providerDelay.Value : delay;
    }
}

public sealed class EmailWorker(IServiceScopeFactory scopes, EmailOptions options, ILogger<EmailWorker> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        if (!options.Enabled)
        {
            logger.LogInformation("Transactional email is disabled. Set Email:Enabled and Resend credentials to enable delivery.");
            return;
        }
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(options.PollingIntervalSeconds));
        do
        {
            try
            {
                using var scope = scopes.CreateScope();
                await scope.ServiceProvider.GetRequiredService<EmailDispatcher>().ProcessBatchAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                // Boundary of a background job: preserve its lease and surface unexpected failures.
                logger.LogError(exception, "The email worker failed to process a batch.");
            }
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }
}
