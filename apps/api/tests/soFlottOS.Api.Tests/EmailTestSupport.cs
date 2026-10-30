using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Microsoft.Extensions.Logging.Abstractions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using soFlottOS.Api.Services.Notifications;

namespace soFlottOS.Api.Tests;

internal sealed class EmailTestDatabase : IDisposable
{
    private readonly SqliteConnection _connection;
    public AppDbContext Context { get; }
    static EmailTestDatabase() => SQLitePCL.raw.SetProvider(new SQLitePCL.SQLite3Provider_sqlite3());

    public EmailTestDatabase()
    {
        _connection = new SqliteConnection("Data Source=:memory:");
        _connection.Open();
        Context = NewContext();
        Context.Database.EnsureCreated();
    }
    public AppDbContext NewContext() => new(new DbContextOptionsBuilder<AppDbContext>()
        .UseSqlite(_connection).ReplaceService<IModelCustomizer, EmailTestModelCustomizer>().Options);
    public void Dispose()
    {
        Context.Dispose();
        _connection.Dispose();
    }
}

public sealed class EmailTestModelCustomizer(ModelCustomizerDependencies dependencies) : ModelCustomizer(dependencies)
{
    public override void Customize(ModelBuilder modelBuilder, DbContext context)
    {
        base.Customize(modelBuilder, context);
        // SQLite has no native DateTimeOffset ordering; keep UTC ticks for relational tests.
        var converter = new ValueConverter<DateTimeOffset, long>(
            value => value.UtcTicks, value => new DateTimeOffset(value, TimeSpan.Zero));
        foreach (var property in modelBuilder.Model.GetEntityTypes().SelectMany(entity => entity.GetProperties())
                     .Where(property => property.ClrType == typeof(DateTimeOffset) || property.ClrType == typeof(DateTimeOffset?)))
        {
            property.SetValueConverter(converter);
            property.SetColumnType("INTEGER");
        }
    }
}

internal static class EmailSamples
{
    public static EmailOptions Options() => new()
    {
        Enabled = true, ApiKey = "test-key", From = "soFlott <notifications@example.com>",
        ReplyTo = "support@example.com", FrontendBaseUrl = "https://app.example.com"
    };
    public static InvoicingOptions Seller() => new()
    {
        CompanyName = "soFlott GmbH", Street = "Musterstrasse 1", PostalCode = "86150",
        City = "Augsburg", Country = "Deutschland", TaxIdNumber = "DE123456789",
        Email = "billing@example.com", Phone = "+498211234", Iban = "DE1234567890",
        Bic = "BANKDE123", BankName = "Testbank", PayPalHandle = "paypal.me/test"
    };
    public static Order Order() => new()
    {
        Id = 42, ClientId = 7, Client = new Client
        {
            Id = 7, UserId = 3, CompanyName = "MediLab", ContactPerson = "Anna",
            Email = "operations@example.com", Street = "Kundenstrasse 2", City = "Augsburg",
            PostalCode = "86150", Country = "Deutschland",
            User = new User { Id = 3, Email = "owner@example.com", FullName = "Anna", Role = UserRole.Client, PasswordHash = "hash" }
        },
        PickupAddress = "Pickup street 1", DropoffAddress = "Dropoff street 2",
        PickupContactName = "Hans", PickupPhone = "+49111", DropoffContactName = "Eva", DropoffPhone = "+49222",
        CargoCategory = CargoCategory.SmallBox, WeightKg = 2.5m, SpecialInstructions = "Hintereingang",
        ExternalReference = "REF-123", NetPrice = 25, VatAmount = 4.75m, GrossPrice = 29.75m,
        EstimatedDurationMinutes = 12, PaymentMethod = PaymentMethod.BankTransfer,
        AssignedDriver = new User { Id = 8, Email = "driver@example.com", FullName = "Max", Role = UserRole.Driver, PasswordHash = "hash" },
        AssignedDriverId = 8,
        ProofOfDelivery = new ProofOfDelivery
        {
            RecipientName = "Eva", DeliveredAt = new DateTimeOffset(2026, 10, 8, 10, 30, 0, TimeSpan.Zero),
            SignatureDataUrl = "data:image/png;base64,signature", GpsLatitude = 48.3m, GpsLongitude = 10.8m
        }
    };
    public static Invoice Invoice()
    {
        var order = Order();
        return new Invoice
        {
            Id = 12, Order = order, OrderId = order.Id, Client = order.Client, ClientId = order.ClientId,
            InvoiceNumber = "SOFLOTT-2026-1000", NetTotal = 25, VatTotal = 4.75m, GrossTotal = 29.75m,
            VatRate = .19m, PaymentMethod = PaymentMethod.BankTransfer,
            IssuedAt = DateTimeOffset.UtcNow, DueDate = DateTimeOffset.UtcNow.AddDays(14)
        };
    }
    public static EmailQueue Queue(AppDbContext context, EmailOptions? options = null) =>
        new(context, new EmailTemplateRenderer(options ?? Options(), Seller()), options ?? Options(), NullLogger<EmailQueue>.Instance);
}

internal sealed class FixedEmailClock(DateTimeOffset now) : TimeProvider
{
    public DateTimeOffset Now { get; set; } = now;
    public override DateTimeOffset GetUtcNow() => Now;
}

internal sealed class FakeRoutingService : IRoutingService
{
    public Task<RouteQuote> GetRouteAsync(RouteRequest request, CancellationToken cancellationToken = default) =>
        Task.FromResult(new RouteQuote(3.28m, 4, "Test", [new(48.1m, 11.5m), new(48.2m, 11.6m)]));
}

/// <summary>Resolves any address to a fixed point so tests never touch a geocoding provider.</summary>
internal sealed class FakeGeocodingService : IGeocodingService
{
    public Task<GeocodedAddress> GeocodeAsync(string address, CancellationToken cancellationToken = default) =>
        Task.FromResult(new GeocodedAddress(48.1m, 11.5m, address, "Test"));
}

internal sealed class FakeNotificationQueue : INotificationQueue
{
    public Task EnqueueAsync(NotificationRequest request, CancellationToken cancellationToken = default) => Task.CompletedTask;
}
