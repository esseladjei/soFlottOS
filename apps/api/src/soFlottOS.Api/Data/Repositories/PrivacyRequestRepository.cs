using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries about GDPR data-subject requests.</summary>
public interface IPrivacyRequestRepository
{
    /// <summary>Loads the request tracked by EF Core so the caller can change and save it.</summary>
    Task<PrivacyRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>Newest first, optionally limited to one status.</summary>
    Task<IReadOnlyList<PrivacyRequest>> ListAsync(
        PrivacyRequestStatus? status, int take, CancellationToken cancellationToken = default);

    /// <summary>Tracks the new request without saving, so related emails can be staged in the same save.</summary>
    void Add(PrivacyRequest request);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>Deletes Completed/Rejected requests finished before the cutoff and returns how many were removed.</summary>
    Task<int> DeleteResolvedBeforeAsync(DateTimeOffset cutoff, CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class PrivacyRequestRepository(AppDbContext dbContext) : IPrivacyRequestRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<PrivacyRequest?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default) =>
        _dbContext.PrivacyRequests.SingleOrDefaultAsync(request => request.Id == id, cancellationToken);

    public async Task<IReadOnlyList<PrivacyRequest>> ListAsync(
        PrivacyRequestStatus? status, int take, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.PrivacyRequests.AsNoTracking();
        if (status is { } value)
        {
            query = query.Where(request => request.Status == value);
        }

        return await query
            .OrderByDescending(request => request.CreatedAt)
            .Take(take)
            .ToListAsync(cancellationToken);
    }

    public void Add(PrivacyRequest request) => _dbContext.PrivacyRequests.Add(request);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    public Task<int> DeleteResolvedBeforeAsync(DateTimeOffset cutoff, CancellationToken cancellationToken = default) =>
        _dbContext.PrivacyRequests
            .Where(request => (request.Status == PrivacyRequestStatus.Completed ||
                               request.Status == PrivacyRequestStatus.Rejected) &&
                              request.CompletedAt < cutoff)
            .ExecuteDeleteAsync(cancellationToken);
}
