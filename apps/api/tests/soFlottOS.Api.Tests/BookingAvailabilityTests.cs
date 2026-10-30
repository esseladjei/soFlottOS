using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Controllers;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class BookingAvailabilityTests
{
    private static BookingAvailabilityService Service(EmailTestDatabase database, string now, string language = "de")
    {
        var context = new DefaultHttpContext();
        context.Request.Headers[MessageLocale.HeaderName] = language;
        return new(database.Context, new FixedEmailClock(DateTimeOffset.Parse(now)),
            new MessageLocale(new HttpContextAccessor { HttpContext = context }));
    }

    [Fact]
    public async Task DefaultPreservesBookingsAndSavedSettingsPersistAcrossContexts()
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, "2026-10-19T08:00:00Z");
        Assert.True((await service.GetAsync()).CanBook);
        await service.SaveAsync(new() { ScheduleEnabled = true, IsBusy = true, Windows = [new(1, "09:00", "18:00")] });
        using var fresh = database.NewContext();
        var settings = await fresh.BookingAvailability.SingleAsync();
        Assert.True(settings.IsBusy);
        Assert.True(settings.ScheduleEnabled);
        Assert.Contains("09:00", settings.WindowsJson);
    }

    [Theory]
    [InlineData("2026-01-19T07:59:59Z", false)]
    [InlineData("2026-01-19T08:00:00Z", true)]
    [InlineData("2026-01-19T16:59:59Z", true)]
    [InlineData("2026-01-19T17:00:00Z", false)]
    [InlineData("2026-07-20T06:59:59Z", false)]
    [InlineData("2026-07-20T07:00:00Z", true)]
    [InlineData("2026-07-20T16:00:00Z", false)]
    [InlineData("2026-07-20T03:00:00-04:00", true)]
    [InlineData("2026-07-21T07:00:00Z", false)]
    public async Task WeeklyWindowsUseBerlinAndIncludeStartButExcludeEnd(string now, bool expected)
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, now);
        var result = await service.SaveAsync(new() { ScheduleEnabled = true, Windows = [new(1, "09:00", "18:00")] });
        Assert.Equal(expected, result.CanBook);
        Assert.Equal(expected ? null : "OutsideHours", result.UnavailableReason);
        Assert.Equal("Europe/Berlin", result.TimeZone);
    }

    [Theory]
    [InlineData("2026-10-25T00:45:00Z", true)]
    [InlineData("2026-10-25T01:45:00Z", true)]
    [InlineData("2026-10-25T02:00:00Z", false)]
    [InlineData("2026-03-29T00:59:59Z", false)]
    [InlineData("2026-03-29T01:00:00Z", false)]
    public async Task DstUsesWallClockWindowsWithoutFixedOffsets(string now, bool expected)
    {
        using var database = new EmailTestDatabase();
        var result = await Service(database, now).SaveAsync(new()
        {
            ScheduleEnabled = true, Windows = [new(0, "02:30", "03:00")]
        });
        Assert.Equal(expected, result.CanBook);
    }

    [Theory]
    [InlineData("2026-07-19T21:59:59Z", true)]
    [InlineData("2026-07-19T22:00:00Z", false)]
    public async Task EndOfDayClosesAtBerlinMidnight(string now, bool expected)
    {
        using var database = new EmailTestDatabase();
        var result = await Service(database, now).SaveAsync(new()
        {
            ScheduleEnabled = true, Windows = [new(0, "23:00", "24:00")]
        });
        Assert.Equal(expected, result.CanBook);
    }

    [Fact]
    public async Task BusyOverridesScheduleAndEmptyEnabledScheduleIsClosed()
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, "2026-10-19T08:00:00Z");
        Assert.False((await service.SaveAsync(new() { ScheduleEnabled = true })).CanBook);
        Assert.True((await service.SaveAsync(new())).CanBook);
        var paused = await service.SaveAsync(new() { IsBusy = true });
        Assert.False(paused.CanBook);
        Assert.Equal("Busy", paused.UnavailableReason);
        await service.EnsureCanBookAsync(new(1, UserRole.Admin, "admin@example.com"));
        await Assert.ThrowsAsync<ConflictException>(() =>
            service.EnsureCanBookAsync(new(2, UserRole.Client, "client@example.com")));
    }

    [Theory]
    [InlineData(-1, "09:00", "18:00")]
    [InlineData(7, "09:00", "18:00")]
    [InlineData(1, "9:00", "18:00")]
    [InlineData(1, "09:60", "18:00")]
    [InlineData(1, "24:00", "24:00")]
    [InlineData(1, "18:00", "09:00")]
    [InlineData(1, "09:00", "09:00")]
    [InlineData(1, "09:00", "25:00")]
    public async Task InvalidWindowsDoNotChangeSettings(int day, string start, string end)
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, "2026-10-19T08:00:00Z");
        await Assert.ThrowsAsync<ValidationException>(() => service.SaveAsync(new()
        {
            ScheduleEnabled = true, IsBusy = true, Windows = [new(day, start, end)]
        }));
        Assert.True((await service.GetAsync()).CanBook);
    }

    [Fact]
    public async Task RejectsOverlappingOrExcessiveWindowsButAllowsAdjacentAndSplitShifts()
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, "2026-10-19T08:00:00Z");
        await Assert.ThrowsAsync<ValidationException>(() => service.SaveAsync(new()
        {
            Windows = [new(1, "09:00", "12:00"), new(1, "11:00", "18:00")]
        }));
        await Assert.ThrowsAsync<ValidationException>(() => service.SaveAsync(new()
        {
            Windows = Enumerable.Repeat(new BookingWindow(1, "09:00", "18:00"), 29).ToList()
        }));
        var saved = await service.SaveAsync(new()
        {
            ScheduleEnabled = true,
            Windows = [new(1, "09:00", "12:00"), new(1, "12:00", "13:00"), new(1, "14:00", "18:00")]
        });
        Assert.True(saved.CanBook);
        Assert.Equal(3, saved.Windows.Count);
    }

    [Theory]
    [InlineData(true, "en", "busy or unavailable")]
    [InlineData(false, "de", "ausgelastet oder nicht verfügbar")]
    public async Task ClosedCustomerQuoteAndBookingHaveNoOrderInvoiceOrNotificationSideEffects(
        bool busy, string language, string message)
    {
        using var database = new EmailTestDatabase();
        var service = Service(database, "2026-10-19T08:00:00Z", language);
        await service.SaveAsync(new() { IsBusy = busy, ScheduleEnabled = true });
        var context = database.Context;
        var orders = Orders(database, service);
        var caller = new CurrentUser(3, UserRole.Client, "client@example.com");
        var quoteError = await Assert.ThrowsAsync<ConflictException>(() =>
            orders.QuoteAsync(new QuoteOrderRequest { ClientId = 7, PickupAddress = "Pickup", DropoffAddress = "Dropoff" }, caller));
        Assert.Contains(message, quoteError.Message);
        var bookingError = await Assert.ThrowsAsync<ConflictException>(() =>
            orders.CreateAsync(new CreateOrderRequest { ClientId = 7 }, caller));
        Assert.Contains(message, bookingError.Message);
        Assert.Empty(await context.Orders.ToListAsync());
        Assert.Empty(await context.Invoices.ToListAsync());
        Assert.Empty(await context.EmailMessages.ToListAsync());
        Assert.Empty(await context.NotificationMessages.ToListAsync());
    }

    [Fact]
    public async Task BookingRechecksClosingTimeAfterRoutingBeforeCreatingAnything()
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(EmailSamples.Order().Client);
        await database.Context.SaveChangesAsync();
        var clock = new FixedEmailClock(DateTimeOffset.Parse("2026-10-19T08:00:00Z"));
        var service = new BookingAvailabilityService(database.Context, clock, new MessageLocale(new HttpContextAccessor()));
        await service.SaveAsync(new() { ScheduleEnabled = true, Windows = [new(1, "09:00", "11:00")] });
        var orders = Orders(database, service, new ClosingTimeRoutingService(clock));
        await Assert.ThrowsAsync<ConflictException>(() => orders.CreateAsync(new CreateOrderRequest { ClientId = 7 },
            new CurrentUser(3, UserRole.Client, "owner@example.com")));
        using var fresh = database.NewContext();
        Assert.Empty(await fresh.Orders.ToListAsync());
        Assert.Empty(await fresh.Invoices.ToListAsync());
        Assert.Empty(await fresh.EmailMessages.ToListAsync());
    }

    [Fact]
    public async Task AdminCanQuoteAndBookWhileCustomerBookingsArePaused()
    {
        using var database = new EmailTestDatabase();
        database.Context.Clients.Add(EmailSamples.Order().Client);
        await database.Context.SaveChangesAsync();
        var service = Service(database, "2026-10-19T08:00:00Z");
        await service.SaveAsync(new() { ScheduleEnabled = true, IsBusy = true });
        var orders = Orders(database, service);
        var caller = new CurrentUser(1, UserRole.Admin, "admin@example.com");
        Assert.NotNull(await orders.QuoteAsync(new QuoteOrderRequest { ClientId = 7, PickupAddress = "Pickup", DropoffAddress = "Dropoff" }, caller));
        var booked = await orders.CreateAsync(new CreateOrderRequest
        {
            ClientId = 7, PickupAddress = "Pickup", DropoffAddress = "Dropoff",
            PickupContactName = "Anna", PickupPhone = "+49111",
            DropoffContactName = "Max", DropoffPhone = "+49222"
        }, caller);
        Assert.NotNull(booked.InvoiceId);
        Assert.Single(await database.Context.Orders.ToListAsync());
        Assert.Single(await database.Context.Invoices.ToListAsync());
    }

    private static OrderService Orders(EmailTestDatabase database, BookingAvailabilityService availability, IRoutingService? routing = null)
    {
        var context = database.Context;
        var clients = new ClientRepository(context);
        var emails = new EmailCommunications(EmailSamples.Queue(context));
        var pricing = new PricingOptions();
        var invoices = new InvoiceService(new EmailTestInvoiceRepository(context), clients, EmailSamples.Seller(), pricing, emails);
        return new(new OrderRepository(context), clients, new UserRepository(context),
            routing ?? new FakeRoutingService(), new FakeGeocodingService(), new PricingService(pricing), invoices, new FakeNotificationQueue(),
            emails, new BusinessTransaction(context), availability);
    }

    private sealed class ClosingTimeRoutingService(FixedEmailClock clock) : IRoutingService
    {
        public Task<RouteQuote> GetRouteAsync(RouteRequest request, CancellationToken cancellationToken = default)
        {
            clock.Now = clock.Now.AddHours(1);
            return Task.FromResult(new RouteQuote(3.28m, 4, "Test", []));
        }
    }

    [Fact]
    public void OnlyAdminsCanChangeAvailability()
    {
        var controller = typeof(BookingAvailabilityController);
        var readAccess = Assert.Single(controller.GetCustomAttributes(typeof(AuthorizeAttribute), false).Cast<AuthorizeAttribute>());
        Assert.Equal(Roles.AdminOrClient, readAccess.Roles);
        var writeAccess = Assert.Single(controller.GetMethod(nameof(BookingAvailabilityController.Save))!
            .GetCustomAttributes(typeof(AuthorizeAttribute), false).Cast<AuthorizeAttribute>());
        Assert.Equal(Roles.Admin, writeAccess.Roles);
    }
}
