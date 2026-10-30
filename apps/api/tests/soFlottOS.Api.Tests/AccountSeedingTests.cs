using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Services.Security;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class AccountSeedingTests
{
    [Fact]
    public async Task DirectSeedingRejectsWeakPasswordEvenWithPermissiveHasher()
    {
        using var database = new EmailTestDatabase();
        var seeder = new DataSeeder(database.Context, new TestEnvironment(),
            new SeedOptions { Enabled = true, DefaultPassword = "weakpasswordlong" },
            new FakePasswordHasher(), NullLogger<DataSeeder>.Instance);

        var error = await Assert.ThrowsAsync<InvalidOperationException>(() => seeder.SeedAsync());
        Assert.Contains("Seed:DefaultPassword", error.Message);
        Assert.Empty(await database.Context.Users.ToListAsync());
        Assert.Empty(await database.Context.Clients.ToListAsync());
    }

    [Fact]
    public async Task SeedsEveryRoleIncludingAdminWithPolicyCompliantBcryptPassword()
    {
        using var database = new EmailTestDatabase();
        const string password = "StrongSeedPassword123!";
        var hasher = new BCryptPasswordHasher();
        var seeder = new DataSeeder(database.Context, new TestEnvironment(),
            new SeedOptions { Enabled = true, DefaultPassword = password },
            hasher, NullLogger<DataSeeder>.Instance);

        await seeder.SeedAsync();
        var users = await database.Context.Users.ToListAsync();
        Assert.Equal(3, users.Count);
        Assert.Single(users, user => user.Role == UserRole.Admin);
        Assert.Single(users, user => user.Role == UserRole.Client);
        Assert.Single(users, user => user.Role == UserRole.Driver);
        Assert.All(users, user =>
        {
            Assert.NotEqual(password, user.PasswordHash);
            Assert.True(hasher.Verify(password, user.PasswordHash));
        });
        await seeder.SeedAsync();
        Assert.Equal(3, await database.Context.Users.CountAsync());
    }

    [Theory]
    [InlineData(false, "Development")]
    [InlineData(true, "Production")]
    public async Task InactiveSeedingDoesNotCreateAccounts(bool enabled, string environment)
    {
        using var database = new EmailTestDatabase();
        var seeder = new DataSeeder(database.Context, new TestEnvironment { EnvironmentName = environment },
            new SeedOptions { Enabled = enabled, DefaultPassword = "weak" },
            new FakePasswordHasher(), NullLogger<DataSeeder>.Instance);

        await seeder.SeedAsync();
        Assert.Empty(await database.Context.Users.ToListAsync());
    }

    private sealed class TestEnvironment : IHostEnvironment
    {
        public string EnvironmentName { get; set; } = Environments.Development;
        public string ApplicationName { get; set; } = "soFlottOS.Api.Tests";
        public string ContentRootPath { get; set; } = string.Empty;
        public IFileProvider ContentRootFileProvider { get; set; } = new NullFileProvider();
    }
}
