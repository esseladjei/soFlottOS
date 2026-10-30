using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Services.Security;

namespace soFlottOS.Api.Data;

/// <summary>
/// Creates demo accounts so you can click through the app immediately.
/// Runs only when ASPNETCORE_ENVIRONMENT=Development and Seed:Enabled is true,
/// and only when the Users table is still empty.
/// <para>
/// Demo logins (password = Seed:DefaultPassword):
/// admin@soflott.local, client@soflott.local, driver@soflott.local
/// </para>
/// </summary>
public sealed class DataSeeder(
    AppDbContext dbContext,
    IHostEnvironment environment,
    SeedOptions options,
    IPasswordHasher passwordHasher,
    ILogger<DataSeeder> logger)
{
    private readonly AppDbContext _dbContext = dbContext;
    private readonly IHostEnvironment _environment = environment;
    private readonly SeedOptions _options = options;
    private readonly IPasswordHasher _passwordHasher = passwordHasher;
    private readonly ILogger<DataSeeder> _logger = logger;

    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (!_environment.IsDevelopment() || !_options.Enabled)
        {
            return;
        }

        _options.Validate();

        if (await _dbContext.Users.AnyAsync(cancellationToken))
        {
            return;
        }

        var passwordHash = _passwordHasher.Hash(_options.DefaultPassword);

        var admin = new User
        {
            Email = "admin@soflott.local",
            PasswordHash = passwordHash,
            FullName = "soFlott Admin",
            Role = UserRole.Admin,
            Phone = "+4915112345678"
        };

        var driver = new User
        {
            Email = "driver@soflott.local",
            PasswordHash = passwordHash,
            FullName = "Max Fahrer",
            Role = UserRole.Driver,
            Phone = "+4915198765432",
            VehicleDescription = "VW Caddy - A-VE 123",
            Availability = DriverAvailability.Online
        };

        var clientUser = new User
        {
            Email = "client@soflott.local",
            PasswordHash = passwordHash,
            FullName = "Anna Weber",
            Role = UserRole.Client,
            Phone = "+491701234567"
        };

        var client = new Client
        {
            User = clientUser,
            CompanyName = "MediLab Augsburg",
            ContactPerson = "Anna Weber",
            Email = "ops@medilab-augsburg.de",
            Phone = "+491701234567",
            Street = "Musterstraße 12",
            City = "Augsburg",
            PostalCode = "86150",
            Country = "Germany",
            TaxIdNumber = "DE123456789",
            SpecialDeliveryInstructions = "Use the rear entrance after 18:00."
        };

        _dbContext.Users.AddRange(admin, driver, clientUser);
        await _dbContext.Clients.AddAsync(client, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);

        _logger.LogInformation("Seeded development accounts: admin@soflott.local, client@soflott.local, driver@soflott.local.");
    }
}
