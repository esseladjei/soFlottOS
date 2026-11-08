using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries about cookie-consent evidence.</summary>
public interface IConsentRepository
{
    Task<ConsentRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Stores the record unless its id already exists. Returns false for such a duplicate.</summary>
    Task<bool> TryAddAsync(ConsentRecord record, CancellationToken cancellationToken = default);

    /// <summary>Deletes every record created before the cutoff and returns how many were removed.</summary>
    Task<int> DeleteCreatedBeforeAsync(DateTimeOffset cutoff, CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class ConsentRepository(AppDbContext dbContext) : IConsentRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<ConsentRecord?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _dbContext.ConsentRecords.AsNoTracking().SingleOrDefaultAsync(record => record.Id == id, cancellationToken);

    public async Task<bool> TryAddAsync(ConsentRecord record, CancellationToken cancellationToken = default)
    {
        if (await _dbContext.ConsentRecords.AnyAsync(existing => existing.Id == record.Id, cancellationToken))
        {
            return false;
        }

        _dbContext.ConsentRecords.Add(record);
        try
        {
            await _dbContext.SaveChangesAsync(cancellationToken);
            return true;
        }
        catch (DbUpdateException)
        {
            // A simultaneous request stored the same id first; that is a duplicate, not a failure.
            _dbContext.Entry(record).State = EntityState.Detached;
            if (await _dbContext.ConsentRecords.AnyAsync(existing => existing.Id == record.Id, cancellationToken))
            {
                return false;
            }

            throw;
        }
    }

    public Task<int> DeleteCreatedBeforeAsync(DateTimeOffset cutoff, CancellationToken cancellationToken = default) =>
        _dbContext.ConsentRecords
            .Where(record => record.CreatedAt < cutoff)
            .ExecuteDeleteAsync(cancellationToken);
}
