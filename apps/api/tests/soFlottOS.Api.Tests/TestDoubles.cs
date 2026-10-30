using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Services.Security;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Tests;

/// <summary>
/// Hand written test doubles. They keep entities in a list instead of a database,
/// which keeps the unit tests fast and removes the need for a running MySQL.
/// </summary>
internal sealed class FakeUserRepository : IUserRepository
{
    public List<User> Users { get; } = [];

    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        Task.FromResult(Users.FirstOrDefault(user => user.Id == id));

    public Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default) =>
        Task.FromResult(Users.FirstOrDefault(user => user.Email == email));

    public Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default) =>
        Task.FromResult(Users.Any(user => user.Email == email));

    public Task<User> AddAsync(User user, CancellationToken cancellationToken = default)
    {
        user.Id = Users.Count + 1;
        Users.Add(user);
        return Task.FromResult(user);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task<IReadOnlyList<User>> ListDriversAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<User>>(Users.Where(user => user.Role == UserRole.Driver).ToList());

    public Task<int> CountDriversByAvailabilityAsync(
        DriverAvailability availability,
        CancellationToken cancellationToken = default) =>
        Task.FromResult(Users.Count(user => user.Role == UserRole.Driver && user.Availability == availability));
}

internal sealed class FakeClientRepository : IClientRepository
{
    public List<Client> Clients { get; } = [];

    public Task<IReadOnlyList<Client>> ListAsync(CancellationToken cancellationToken = default) =>
        Task.FromResult<IReadOnlyList<Client>>(Clients);

    public Task<Client?> GetByIdAsync(int id, bool includeOrders = false, CancellationToken cancellationToken = default) =>
        Task.FromResult(Clients.FirstOrDefault(client => client.Id == id));

    public Task<Client?> GetByUserIdAsync(int userId, CancellationToken cancellationToken = default) =>
        Task.FromResult(Clients.FirstOrDefault(client => client.UserId == userId));

    public Task<Client> AddAsync(Client client, CancellationToken cancellationToken = default)
    {
        client.Id = Clients.Count + 1;
        if (client.User is not null)
        {
            client.User.Id = client.Id;
            client.UserId = client.User.Id;
        }

        Clients.Add(client);
        return Task.FromResult(client);
    }

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => Task.CompletedTask;

    public Task<int> CountAsync(CancellationToken cancellationToken = default) => Task.FromResult(Clients.Count);
}

/// <summary>Reversible "hash" so tests stay readable; never use this outside tests.</summary>
internal sealed class FakePasswordHasher : IPasswordHasher
{
    public string Hash(string password) => $"hashed:{password}";

    public bool Verify(string password, string passwordHash) => passwordHash == Hash(password);
}

internal sealed class FakeTokenService : ITokenService
{
    public AccessToken CreateToken(User user) =>
        new($"token-for-{user.Email}", DateTimeOffset.UtcNow.AddHours(2));
}

internal sealed class FakeEmailCommunications : IEmailCommunications
{
    public List<User> Accounts { get; } = [];
    public List<Client> OnboardedClients { get; } = [];
    public List<(Order Order, OrderEmailKind Kind, User? Driver)> Orders { get; } = [];
    public List<(Invoice Invoice, InvoiceEmailKind Kind)> Invoices { get; } = [];
    public void AccountCreated(User user) => Accounts.Add(user);
    public void ClientOnboarded(Client client) => OnboardedClients.Add(client);
    public void OrderChanged(Order order, OrderEmailKind kind, User? affectedDriver = null) => Orders.Add((order, kind, affectedDriver));
    public void InvoiceChanged(Invoice invoice, InvoiceEmailKind kind) => Invoices.Add((invoice, kind));
}
