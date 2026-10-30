using Microsoft.EntityFrameworkCore;

namespace soFlottOS.Api.Data;

public interface IBusinessTransaction
{
    Task<T> ExecuteAsync<T>(Func<Task<T>> action, CancellationToken cancellationToken);
}

// Booking spans several repository saves; commit its invoice and outbox together.
public sealed class BusinessTransaction(AppDbContext dbContext) : IBusinessTransaction
{
    public Task<T> ExecuteAsync<T>(Func<Task<T>> action, CancellationToken cancellationToken)
    {
        var attempt = 0;
        return dbContext.Database.CreateExecutionStrategy().ExecuteAsync(async () =>
        {
            if (attempt++ > 0) dbContext.ChangeTracker.Clear();
            await using var transaction = await dbContext.Database.BeginTransactionAsync(cancellationToken);
            var result = await action();
            await transaction.CommitAsync(cancellationToken);
            return result;
        });
    }
}
