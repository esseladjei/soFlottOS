using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Dtos.Pricing;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using soFlottOS.Api.Services.Pricing;
using Xunit;

namespace soFlottOS.Api.Tests;

/// <summary>
/// End-to-end booking through the engine: service-coded invoice numbers, tax treatment per client
/// country, the legacy fallback when no profile exists and the persisted calculation snapshot.
/// </summary>
public sealed class PricingIntegrationTests
{
    private static readonly PricingOptions Tariff = new() { BaseFee = 19.50m, RatePerKilometer = 1.35m, VatRate = 0.19m, MinimumCharge = 25m };

    private static (OrderService Orders, IPricingCalculationService Engine) Build(EmailTestDatabase database)
    {
        var context = database.Context;
        var clients = new ClientRepository(context);
        var emails = new EmailCommunications(EmailSamples.Queue(context));
        var engine = PricingEngineFactory.Create(context, Tariff);
        var invoices = new InvoiceService(new EmailTestInvoiceRepository(context), clients, EmailSamples.Seller(), emails);
        var availability = new BookingAvailabilityService(context, TimeProvider.System, new MessageLocale(new HttpContextAccessor { HttpContext = new DefaultHttpContext() }));
        var orders = new OrderService(new OrderRepository(context), clients, new UserRepository(context), new FakeRoutingService(), new FakeGeocodingService(),
            new PricingService(Tariff), engine, invoices, new FakeNotificationQueue(), emails, new BusinessTransaction(context), availability);
        return (orders, engine);
    }

    private static Client Client(string country, string? vatId = "IE1234567X")
    {
        var client = EmailSamples.Order().Client;
        client.Country = country;
        client.TaxIdNumber = vatId;
        return client;
    }

    private static CreateOrderRequest Booking(int clientId) => new()
    {
        ClientId = clientId, PickupAddress = "Pickup", DropoffAddress = "Dropoff",
        PickupContactName = "Anna", PickupPhone = "+49111", DropoffContactName = "Max", DropoffPhone = "+49222",
    };

    private static readonly CurrentUser Admin = new(1, UserRole.Admin, "admin@example.com");

    [Fact]
    public async Task WithoutAnyProfile_LegacyTariffIsUsed_AndInvoiceCarriesServiceCode()
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(Client("Deutschland", "DE123"));
        await database.Context.SaveChangesAsync();
        var (orders, _) = Build(database);

        var booked = await orders.CreateAsync(Booking(7), Admin);

        var invoice = await database.Context.Invoices.SingleAsync();
        Assert.StartsWith("SOFLOTT-DLV-", invoice.InvoiceNumber);
        Assert.Equal(ServiceType.OnDemandDelivery, invoice.ServiceType);
        Assert.Equal(TaxTreatment.StandardGermanVat, invoice.TaxTreatment);
        Assert.Null(invoice.TaxNote);
        Assert.Equal(0.19m, invoice.VatRate);
        Assert.True(booked.VatAmount > 0);
        Assert.Null((await database.Context.Orders.SingleAsync()).PricingCalculationId);
    }

    [Fact]
    public async Task IrishClient_IsReverseCharged_WithZeroVatAndLegalNote()
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(Client("Ireland"));
        await database.Context.SaveChangesAsync();
        var (orders, _) = Build(database);

        var quote = await orders.QuoteAsync(new QuoteOrderRequest { ClientId = 7, PickupAddress = "Pickup", DropoffAddress = "Dropoff" }, Admin);
        var booked = await orders.CreateAsync(Booking(7), Admin);

        Assert.Equal(TaxTreatment.ReverseChargeEu, quote.TaxTreatment);
        Assert.Equal(0m, quote.VatAmount);
        Assert.Equal(quote.NetPrice, quote.GrossPrice);
        Assert.Equal(0m, booked.VatAmount);
        var invoice = await database.Context.Invoices.SingleAsync();
        Assert.Equal(TaxTreatmentResolver.ReverseChargeNote, invoice.TaxNote);
        Assert.Equal(0m, invoice.VatRate);
    }

    [Theory]
    [InlineData("United Kingdom")]
    [InlineData("United Arab Emirates")]
    public async Task ThirdCountryClient_IsNotTaxable(string country)
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(Client(country, null));
        await database.Context.SaveChangesAsync();
        var (orders, _) = Build(database);

        var booked = await orders.CreateAsync(Booking(7), Admin);

        Assert.Equal(0m, booked.VatAmount);
        var invoice = await database.Context.Invoices.SingleAsync();
        Assert.Equal(TaxTreatment.NonTaxableThirdCountry, invoice.TaxTreatment);
        Assert.Equal(TaxTreatmentResolver.NonTaxableNote, invoice.TaxNote);
    }

    [Fact]
    public async Task WithOnDemandProfile_EngineIsUsed_AndSnapshotIsStored()
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(Client("Deutschland", "DE123"));
        var profile = new PricingProfile
        {
            Name = "Tariff", BusinessUnit = BusinessUnit.Express, ServiceType = ServiceType.OnDemandDelivery,
            Strategy = PricingStrategyType.RateCard, IsDefault = true, MinimumPrice = 40m,
        };
        profile.Rates.Add(new PricingProfileRate { Label = "Base fee", Unit = PricingUnit.Fixed, Rate = 10m });
        profile.Rates.Add(new PricingProfileRate { Label = "Per km", Unit = PricingUnit.Kilometre, Rate = 2m });
        database.Context.PricingProfiles.Add(profile);
        await database.Context.SaveChangesAsync();
        var (orders, _) = Build(database);

        var booked = await orders.CreateAsync(Booking(7), Admin);

        var order = await database.Context.Orders.SingleAsync();
        Assert.NotNull(order.PricingCalculationId);
        var snapshot = await database.Context.PricingCalculations.SingleAsync();
        Assert.False(snapshot.IsSimulation);
        Assert.Equal(order.Id, snapshot.OrderId);
        Assert.Equal(booked.NetPrice, snapshot.FinalNetSellingPrice);
        Assert.True(booked.NetPrice >= 40m, "minimum price from the profile must apply");
        Assert.Contains("Base fee", snapshot.BreakdownJson);
    }

    [Fact]
    public async Task Simulation_IsNotPersisted_UnlessNamed()
    {
        using var database = new EmailTestDatabase();
        var profile = new PricingProfile
        {
            Name = "Dev", BusinessUnit = BusinessUnit.Digital, ServiceType = ServiceType.SoftwareDevelopment,
            Strategy = PricingStrategyType.RateCard, IsDefault = true,
        };
        profile.Rates.Add(new PricingProfileRate { Label = "Per hour", Unit = PricingUnit.Hour, Rate = 95m });
        database.Context.PricingProfiles.Add(profile);
        await database.Context.SaveChangesAsync();
        var (_, engine) = Build(database);

        var request = new CalculatePriceRequest(ServiceType.SoftwareDevelopment, null, new PricingQuantities(Hours: 10m), null, null, null, null, null, null, null);
        var unsaved = await engine.SimulateAsync(request, Admin, CancellationToken.None);
        var saved = await engine.SimulateAsync(request with { SaveAsScenarioName = "Pilot" }, Admin, CancellationToken.None);

        Assert.Null(unsaved.Id);
        Assert.Equal(950m, unsaved.Result.FinalNetSellingPrice);
        Assert.NotNull(saved.Id);
        Assert.Single(await database.Context.PricingCalculations.ToListAsync());
        Assert.True((await database.Context.PricingCalculations.SingleAsync()).IsSimulation);
    }
}
