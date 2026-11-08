using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;

namespace soFlottOS.Api.Services;

/// <summary>What one retention sweep removed. Only counts are ever reported, never record contents.</summary>
public sealed record RetentionSweepResult(int ConsentRecords, int PrivacyRequests);

/// <summary>
/// Background job that enforces the GDPR storage-limitation rule. It runs once at startup and then every
/// <see cref="PrivacyOptions.RetentionSweepIntervalHours"/> hours, deleting consent evidence and finished
/// privacy requests whose retention period is over.
/// </summary>
public sealed class DataRetentionService(
    IServiceScopeFactory scopeFactory,
    PrivacyOptions options,
    TimeProvider clock,
    ILogger<DataRetentionService> logger) : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly PrivacyOptions _options = options;
    private readonly TimeProvider _clock = clock;
    private readonly ILogger<DataRetentionService> _logger = logger;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromHours(_options.RetentionSweepIntervalHours));

        do
        {
            try
            {
                await using var scope = _scopeFactory.CreateAsyncScope();
                var result = await PurgeAsync(
                    scope.ServiceProvider.GetRequiredService<IConsentRepository>(),
                    scope.ServiceProvider.GetRequiredService<IPrivacyRequestRepository>(),
                    _options, _clock, stoppingToken);

                _logger.LogInformation(
                    "Retention sweep removed {ConsentRecords} consent records and {PrivacyRequests} privacy requests.",
                    result.ConsentRecords, result.PrivacyRequests);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                return;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "The data retention sweep failed.");
            }
        }
        while (await WaitForNextSweepAsync(timer, stoppingToken));
    }

    /// <summary>
    /// Deletes consent records older than <see cref="PrivacyOptions.ConsentEvidenceRetentionDays"/> and
    /// Completed/Rejected privacy requests finished more than <see cref="PrivacyOptions.CompletedRequestRetentionDays"/> ago.
    /// Open requests are never deleted, however old they are.
    /// </summary>
    public static async Task<RetentionSweepResult> PurgeAsync(
        IConsentRepository consents,
        IPrivacyRequestRepository requests,
        PrivacyOptions options,
        TimeProvider clock,
        CancellationToken cancellationToken = default)
    {
        var now = clock.GetUtcNow();

        var consentRecords = await consents.DeleteCreatedBeforeAsync(
            now.AddDays(-options.ConsentEvidenceRetentionDays), cancellationToken);
        var privacyRequests = await requests.DeleteResolvedBeforeAsync(
            now.AddDays(-options.CompletedRequestRetentionDays), cancellationToken);

        return new RetentionSweepResult(consentRecords, privacyRequests);
    }

    private static async Task<bool> WaitForNextSweepAsync(PeriodicTimer timer, CancellationToken stoppingToken)
    {
        try
        {
            return await timer.WaitForNextTickAsync(stoppingToken);
        }
        catch (OperationCanceledException)
        {
            return false;
        }
    }
}
