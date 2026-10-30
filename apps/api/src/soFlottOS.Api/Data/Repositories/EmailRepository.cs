using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

public interface IEmailRepository
{
    Task<IReadOnlyList<int>> GetDueIdsAsync(DateTimeOffset now, int batchSize, int maxAttempts, CancellationToken cancellationToken);
    Task<EmailMessage?> ClaimAsync(int id, DateTimeOffset now, TimeSpan lease, int maxAttempts, CancellationToken cancellationToken);
    Task CompleteAsync(EmailMessage message, string providerId, DateTimeOffset now, CancellationToken cancellationToken);
    Task FailAsync(EmailMessage message, string error, bool retry, DateTimeOffset nextAttempt, CancellationToken cancellationToken);
}

public sealed class EmailRepository(AppDbContext dbContext) : IEmailRepository
{
    public async Task<IReadOnlyList<int>> GetDueIdsAsync(
        DateTimeOffset now, int batchSize, int maxAttempts, CancellationToken cancellationToken)
    {
        await dbContext.EmailMessages
            .Where(message => message.AttemptCount >= maxAttempts &&
                (message.Status == EmailMessageStatus.Pending ||
                    message.Status == EmailMessageStatus.Processing && message.LeaseUntil <= now))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(message => message.Status, EmailMessageStatus.Failed)
                .SetProperty(message => message.LastError, "Retry limit exhausted after an interrupted delivery.")
                .SetProperty(message => message.LeaseToken, (string?)null)
                .SetProperty(message => message.LeaseUntil, (DateTimeOffset?)null), cancellationToken);

        return await dbContext.EmailMessages.AsNoTracking()
            .Where(message => message.AttemptCount < maxAttempts &&
                (message.Status == EmailMessageStatus.Pending && message.NextAttemptAt <= now ||
                    message.Status == EmailMessageStatus.Processing && message.LeaseUntil <= now))
            .OrderBy(message => message.Id).Take(batchSize).Select(message => message.Id)
            .ToListAsync(cancellationToken);
    }

    public async Task<EmailMessage?> ClaimAsync(
        int id, DateTimeOffset now, TimeSpan lease, int maxAttempts, CancellationToken cancellationToken)
    {
        var token = Guid.NewGuid().ToString("N");
        var updated = await dbContext.EmailMessages
            .Where(message => message.Id == id && message.AttemptCount < maxAttempts &&
                (message.Status == EmailMessageStatus.Pending && message.NextAttemptAt <= now ||
                    message.Status == EmailMessageStatus.Processing && message.LeaseUntil <= now))
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(message => message.Status, EmailMessageStatus.Processing)
                .SetProperty(message => message.LeaseToken, token)
                .SetProperty(message => message.LeaseUntil, now.Add(lease))
                .SetProperty(message => message.FirstAttemptAt, message => message.FirstAttemptAt ?? now)
                .SetProperty(message => message.AttemptCount, message => message.AttemptCount + 1)
                .SetProperty(message => message.UpdatedAt, now), cancellationToken);
        if (updated == 0) return null;
        return await dbContext.EmailMessages.AsNoTracking()
            .SingleAsync(message => message.Id == id && message.LeaseToken == token, cancellationToken);
    }

    public Task CompleteAsync(EmailMessage message, string providerId, DateTimeOffset now, CancellationToken cancellationToken) =>
        Owned(message).ExecuteUpdateAsync(setters => setters
            .SetProperty(email => email.Status, EmailMessageStatus.Sent)
            .SetProperty(email => email.ProviderMessageId, providerId)
            .SetProperty(email => email.SentAt, now)
            .SetProperty(email => email.LastError, (string?)null)
            .SetProperty(email => email.LeaseToken, (string?)null)
            .SetProperty(email => email.LeaseUntil, (DateTimeOffset?)null)
            .SetProperty(email => email.UpdatedAt, now), cancellationToken);

    public Task FailAsync(EmailMessage message, string error, bool retry, DateTimeOffset nextAttempt, CancellationToken cancellationToken) =>
        Owned(message).ExecuteUpdateAsync(setters => setters
            .SetProperty(email => email.Status, retry ? EmailMessageStatus.Pending : EmailMessageStatus.Failed)
            .SetProperty(email => email.LastError, error.Length > 2000 ? error.Substring(0, 2000) : error)
            .SetProperty(email => email.NextAttemptAt, nextAttempt)
            .SetProperty(email => email.LeaseToken, (string?)null)
            .SetProperty(email => email.LeaseUntil, (DateTimeOffset?)null)
            .SetProperty(email => email.UpdatedAt, DateTimeOffset.UtcNow), cancellationToken);

    private IQueryable<EmailMessage> Owned(EmailMessage message) =>
        dbContext.EmailMessages.Where(email => email.Id == message.Id &&
            email.Status == EmailMessageStatus.Processing && email.LeaseToken == message.LeaseToken);
}
