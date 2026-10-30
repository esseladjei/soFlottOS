using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries about login accounts and drivers.</summary>
public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);

    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);

    Task<User> AddAsync(User user, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<IReadOnlyList<User>> ListDriversAsync(CancellationToken cancellationToken = default);

    Task<int> CountDriversByAvailabilityAsync(DriverAvailability availability, CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class UserRepository(AppDbContext dbContext) : IUserRepository
{
    private readonly AppDbContext _dbContext = dbContext;

    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _dbContext.Users.SingleOrDefaultAsync(user => user.Id == id, cancellationToken);

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        _dbContext.Users.SingleOrDefaultAsync(user => user.Email == email, cancellationToken);

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default) =>
        _dbContext.Users.AnyAsync(user => user.Email == email, cancellationToken);

    public async Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        await _dbContext.Users.AddAsync(user, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return user;
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    /// <summary>Drivers plus the counters the admin dispatch screen displays.</summary>
    public async Task<IReadOnlyList<User>> ListDriversAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.Users
            .Where(user => user.Role == UserRole.Driver)
            .Include(user => user.AssignedOrders)
            .AsNoTracking()
            .OrderBy(user => user.FullName)
            .ToListAsync(cancellationToken);

    public Task<int> CountDriversByAvailabilityAsync(
        DriverAvailability availability,
        CancellationToken cancellationToken = default) =>
        _dbContext.Users.CountAsync(
            user => user.Role == UserRole.Driver && user.Availability == availability,
            cancellationToken);
}
