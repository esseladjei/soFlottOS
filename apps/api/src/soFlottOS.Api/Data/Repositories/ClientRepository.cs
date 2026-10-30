using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries for the CRM module.</summary>
public interface IClientRepository
{
    Task<IReadOnlyList<Client>> ListAsync(CancellationToken cancellationToken = default);

    Task<Client?> GetByIdAsync(int id, bool includeOrders = false, CancellationToken cancellationToken = default);

    Task<Client?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default);

    Task<Client> AddAsync(Client client, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<int> CountAsync(CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class ClientRepository(AppDbContext dbContext) : IClientRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public async Task<IReadOnlyList<Client>> ListAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.Clients
            .Include(client => client.Orders)
            .AsNoTracking()
            .OrderByDescending(client => client.CreatedAt)
            .ToListAsync(cancellationToken);

    /// <param name="includeOrders">
    /// Order counts are only needed on detail screens; skipping the join keeps writes cheap.
    /// </param>
    public Task<Client?> GetByIdAsync(int id, bool includeOrders = false, CancellationToken cancellationToken = default)
    {
        var query = _dbContext.Clients.Include(client => client.User).AsQueryable();
        if (includeOrders)
        {
            query = query.Include(client => client.Orders);
        }

        return query.SingleOrDefaultAsync(client => client.Id == id, cancellationToken);
    }

    public Task<Client?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default) =>
        _dbContext.Clients
            .Include(client => client.User)
            .Include(client => client.Orders)
            .SingleOrDefaultAsync(client => client.UserId == userId, cancellationToken);

    public async Task<Client> AddAsync(Client client, CancellationToken cancellationToken = default)
    {
        await _dbContext.Clients.AddAsync(client, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return client;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    public Task<int> CountAsync(CancellationToken cancellationToken = default) =>
        _dbContext.Clients.CountAsync(cancellationToken);
}
