using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries for delivery orders.</summary>
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Order>> ListAsync(OrderStatus? status, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Order>> ListForClientAsync(int clientId, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Order>> ListForDriverAsync(int driverUserId, bool activeOnly, CancellationToken cancellationToken = default);

    Task<Order> AddAsync(Order order, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<int> CountActiveForDriverAsync(int driverUserId, CancellationToken cancellationToken = default);

    Task<int> CountByStatusAsync(OrderStatus status, CancellationToken cancellationToken = default);

    Task<int> CountActiveAsync(CancellationToken cancellationToken = default);

    Task<int> CountDeliveredSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class OrderRepository(AppDbContext dbContext) : IOrderRepository
{
    /// <summary>Statuses that still require operational attention.</summary>
    private static readonly OrderStatus[] ActiveStatuses =
        [OrderStatus.Pending, OrderStatus.Assigned, OrderStatus.InTransit];

    private readonly AppDbContext _dbContext = dbContext;

    /// <summary>Loads an order with everything the API needs to render it (client, driver, invoice, PoD).</summary>
    public Task<Order?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        WithDetails(_dbContext.Orders).SingleOrDefaultAsync(order => order.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Order>> ListAsync(OrderStatus? status, CancellationToken cancellationToken = default)
    {
        var query = WithDetails(_dbContext.Orders).AsNoTracking();

        query = status.HasValue
            ? query.Where(order => order.Status == status.Value)
            : query.Where(order => ActiveStatuses.Contains(order.Status));

        return await query
            .OrderBy(order => order.Status)
            .ThenByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Order>> ListForClientAsync(int clientId, CancellationToken cancellationToken = default) =>
        await WithDetails(_dbContext.Orders)
            .AsNoTracking()
            .Where(order => order.ClientId == clientId)
            .OrderByDescending(order => order.CreatedAt)
            .ToListAsync(cancellationToken);

    /// <param name="activeOnly">True for the driver's job list, false for their delivery history.</param>
    public async Task<IReadOnlyList<Order>> ListForDriverAsync(
        int driverUserId,
        bool activeOnly,
        CancellationToken cancellationToken = default)
    {
        var query = WithDetails(_dbContext.Orders)
            .AsNoTracking()
            .Where(order => order.AssignedDriverId == driverUserId);

        if (activeOnly)
        {
            query = query.Where(order => order.Status == OrderStatus.Assigned || order.Status == OrderStatus.InTransit);
        }

        return await query
            .OrderBy(order => order.Status)
            .ThenBy(order => order.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Order> AddAsync(Order order, CancellationToken cancellationToken = default)
    {
        await _dbContext.Orders.AddAsync(order, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return order;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    /// <summary>Drives the driver availability state machine (Busy while jobs remain).</summary>
    public Task<int> CountActiveForDriverAsync(int driverUserId, CancellationToken cancellationToken = default) =>
        _dbContext.Orders.CountAsync(
            order => order.AssignedDriverId == driverUserId &&
                     (order.Status == OrderStatus.Assigned || order.Status == OrderStatus.InTransit),
            cancellationToken);

    public Task<int> CountByStatusAsync(OrderStatus status, CancellationToken cancellationToken = default) =>
        _dbContext.Orders.CountAsync(order => order.Status == status, cancellationToken);

    public Task<int> CountActiveAsync(CancellationToken cancellationToken = default) =>
        _dbContext.Orders.CountAsync(order => ActiveStatuses.Contains(order.Status), cancellationToken);

    public Task<int> CountDeliveredSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default) =>
        _dbContext.Orders.CountAsync(
            order => order.Status == OrderStatus.Delivered && order.DeliveredAt >= since,
            cancellationToken);

    private static IQueryable<Order> WithDetails(IQueryable<Order> query) =>
        query
            .Include(order => order.Client)
                .ThenInclude(client => client.User)
            .Include(order => order.AssignedDriver)
            .Include(order => order.Invoice)
            .Include(order => order.ProofOfDelivery);
}
