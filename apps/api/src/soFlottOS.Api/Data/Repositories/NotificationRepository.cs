using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries for the outbound notification outbox.</summary>
public interface INotificationRepository
{
    Task AddAsync(NotificationMessage message, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<NotificationMessage>> GetPendingBatchAsync(int batchSize, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class NotificationRepository(AppDbContext dbContext) : INotificationRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task AddAsync(NotificationMessage message, CancellationToken cancellationToken = default)
    {
        await _dbContext.NotificationMessages.AddAsync(message, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
    }

    /// <summary>Oldest pending messages first, so nothing starves in the queue.</summary>
    public async Task<IReadOnlyList<NotificationMessage>> GetPendingBatchAsync(
        int batchSize,
        CancellationToken cancellationToken = default) =>
        await _dbContext.NotificationMessages
            .Where(message => message.Status == NotificationStatus.Pending)
            .OrderBy(message => message.CreatedAt)
            .Take(batchSize)
            .ToListAsync(cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);
}
