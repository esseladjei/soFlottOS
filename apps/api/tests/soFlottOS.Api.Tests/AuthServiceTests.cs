using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

/// <summary>Sign-in and sign-up rules, exercised without a database.</summary>
public sealed class AuthServiceTests
{
    private readonly FakeUserRepository _users = new();
    private readonly FakeClientRepository _clients = new();
    private readonly FakePasswordHasher _passwordHasher = new();
    private readonly FakeEmailCommunications _emails = new();

    private AuthService CreateService() => new(_users, _clients, _passwordHasher, new FakeTokenService(), _emails);

    [Fact]
    public async Task RegistrationRejectsWeakPasswordsBeforeCreatingAccountsOrEmails()
    {
        await Assert.ThrowsAsync<ValidationException>(() => CreateService().RegisterClientAsync(
            new RegisterClientRequest { Email = "client@example.com", Password = "weak" }));
        await Assert.ThrowsAsync<ValidationException>(() => CreateService().RegisterDriverAsync(
            new RegisterDriverRequest { Email = "driver@example.com", Password = "weak" }));
        Assert.Empty(_users.Users);
        Assert.Empty(_clients.Clients);
        Assert.Empty(_emails.Accounts);
    }

    [Fact]
    public async Task LoginAsync_ReturnsTokenForValidCredentials()
    {
        _users.Users.Add(new User
        {
            Id = 1,
            Email = "client@soflott.local",
            PasswordHash = _passwordHasher.Hash("Secret123!"),
            FullName = "Anna Weber",
            Role = UserRole.Client
        });

        _clients.Clients.Add(new Client { Id = 7, UserId = 1, CompanyName = "MediLab" });

        var response = await CreateService().LoginAsync(new LoginRequest
        {
            Email = " Client@SoFlott.local ",
            Password = "Secret123!"
        });

        Assert.Equal("Client", response.Role);
        Assert.Equal(7, response.ClientId);
        Assert.False(string.IsNullOrWhiteSpace(response.Token));
    }

    [Fact]
    public async Task LoginAsync_RejectsWrongPassword()
    {
        _users.Users.Add(new User
        {
            Id = 1,
            Email = "client@soflott.local",
            PasswordHash = _passwordHasher.Hash("Secret123!"),
            FullName = "Anna Weber",
            Role = UserRole.Client
        });

        await Assert.ThrowsAsync<UnauthorizedException>(() => CreateService().LoginAsync(new LoginRequest
        {
            Email = "client@soflott.local",
            Password = "WrongPassword"
        }));
    }

    [Fact]
    public async Task RegisterClientAsync_CreatesLoginAndCrmRecord()
    {
        var response = await CreateService().RegisterClientAsync(new RegisterClientRequest
        {
            CompanyName = "MediLab Augsburg",
            ContactPerson = "Anna Weber",
            Email = "Ops@MediLab.de",
            Password = "Secret123!Strong",
            Phone = "+491701234567",
            Street = "Musterstraße 12",
            City = "Augsburg",
            PostalCode = "86150"
        });

        Assert.Equal("Client", response.Role);
        Assert.NotNull(response.ClientId);
        Assert.Equal("ops@medilab.de", response.Email);

        var created = Assert.Single(_clients.Clients);
        Assert.Equal("MediLab Augsburg", created.CompanyName);
        Assert.Equal("ops@medilab.de", Assert.Single(_emails.Accounts).Email);
    }

    [Fact]
    public async Task RegisterDriverAsync_StartsOffline()
    {
        var response = await CreateService().RegisterDriverAsync(new RegisterDriverRequest
        {
            FullName = "Max Fahrer",
            Email = "max@soflott.local",
            Password = "Secret123!Strong",
            Phone = "+4915198765432",
            VehicleDescription = "VW Caddy"
        });

        Assert.Equal("Driver", response.Role);
        Assert.Null(response.ClientId);

        var driver = Assert.Single(_users.Users);
        Assert.Equal(DriverAvailability.Offline, driver.Availability);
        Assert.Same(driver, Assert.Single(_emails.Accounts));
    }

    [Fact]
    public async Task RegisterDriverAsync_RejectsDuplicateEmail()
    {
        _users.Users.Add(new User { Id = 1, Email = "max@soflott.local", PasswordHash = "x", FullName = "Max" });

        await Assert.ThrowsAsync<ConflictException>(() => CreateService().RegisterDriverAsync(new RegisterDriverRequest
        {
            FullName = "Max Fahrer",
            Email = "max@soflott.local",
            Password = "Secret123!Strong",
            Phone = "+4915198765432"
        }));
        Assert.Empty(_emails.Accounts);
    }
}
