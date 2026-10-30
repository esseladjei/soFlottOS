using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Services.Notifications;

/// <summary>
/// Background job that runs for the lifetime of the API. Every few seconds it picks up
/// pending messages from the outbox and asks <see cref="INotificationSender"/> to deliver them.
/// Failures are recorded on the message instead of crashing the application.
/// </summary>
public sealed class NotificationWorker(
    IServiceProvider serviceProvider,
    NotificationOptions options,
    ILogger<NotificationWorker> logger) : BackgroundService
{
    private readonly IServiceProvider _serviceProvider = serviceProvider;
    private readonly NotificationOptions _options = options;
    private readonly ILogger<NotificationWorker> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(_options.PollingIntervalSeconds));

        while (!stoppingToken.IsCancellationRequested && await timer.WaitForNextTickAsync(stoppingToken))
        {
            try
            {
                await ProcessBatchAsync(stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "The notification worker failed to process a batch.");
            }
        }
    }

    private async Task ProcessBatchAsync(CancellationToken cancellationToken)
    {
        // Background services are singletons, repositories are scoped -> create a scope per batch.
        using var scope = _serviceProvider.CreateScope();

        var repository = scope.ServiceProvider.GetRequiredService<INotificationRepository>();
        var sender = scope.ServiceProvider.GetRequiredService<INotificationSender>();

        var pending = await repository.GetPendingBatchAsync(_options.ProcessingBatchSize, cancellationToken);
        if (pending.Count == 0)
        {
            return;
        }

        foreach (var message in pending)
        {
            try
            {
                await sender.SendAsync(message, cancellationToken);
                message.Status = NotificationStatus.Sent;
                message.ProcessedAt = DateTimeOffset.UtcNow;
                message.LastError = null;
            }
            catch (Exception exception)
            {
                message.Status = NotificationStatus.Failed;
                message.LastError = exception.Message;
                _logger.LogError(exception, "Notification {NotificationId} could not be delivered.", message.Id);
            }
            finally
            {
                message.AttemptCount++;
                message.LastAttemptAt = DateTimeOffset.UtcNow;
            }
        }

        await repository.SaveChangesAsync(cancellationToken);
    }
}
