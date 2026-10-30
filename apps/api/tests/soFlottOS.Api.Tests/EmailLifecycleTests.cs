using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class EmailLifecycleTests
{
    [Fact]
    public async Task RegistrationAndManualOnboardingQueueAppropriateMessages()
    {
        const string password = "Secret123!Strong";
        using var database = new EmailTestDatabase();
        var context = database.Context;
        var emails = new EmailCommunications(EmailSamples.Queue(context));
        var users = new UserRepository(context);
        var clients = new ClientRepository(context);
        var auth = new AuthService(users, clients, new FakePasswordHasher(), new FakeTokenService(), emails);
        await auth.RegisterClientAsync(new RegisterClientRequest
        {
            CompanyName = "Test", ContactPerson = "Anna", Email = "client@example.com",
            Password = password, Phone = "+49111", Street = "Street", City = "Augsburg", PostalCode = "86150"
        });
        await auth.RegisterDriverAsync(new RegisterDriverRequest
        {
            FullName = "Max", Email = "driver@example.com", Password = password, Phone = "+49222"
        });
        await new ClientService(clients, emails).CreateAsync(new SaveClientRequest
        {
            CompanyName = "Manual", ContactPerson = "Eva", Email = "manual@example.com",
            Phone = "+49333", Street = "Street", City = "Augsburg", PostalCode = "86150", Country = "Germany"
        });
        Assert.Equal(2, await context.EmailMessages.CountAsync(message => message.EventType == "account_created"));
        Assert.Equal(1, await context.EmailMessages.CountAsync(message => message.EventType == "client_onboarded"));
        Assert.All(await context.EmailMessages.ToListAsync(), message => Assert.DoesNotContain(password, message.ContentJson));
        Assert.DoesNotContain("/client", (await context.EmailMessages.SingleAsync(message => message.EventType == "client_onboarded")).ContentJson);
    }

    [Fact]
    public async Task FullDeliveryFlowNotifiesCustomerContactsAndDrivers()
    {
        using var fixture = new LifecycleFixture();
        var booked = await fixture.Book();
        Assert.Equal(2, await fixture.Count("order_confirmed"));
        Assert.Equal(2, await fixture.Count("invoice_issued"));
        var invoice = await fixture.Context.Invoices.SingleAsync();
        var issuedMessages = await fixture.Context.EmailMessages
            .Where(message => message.EventType == "invoice_issued").ToListAsync();
        foreach (var message in issuedMessages)
        {
            var content = JsonSerializer.Deserialize<EmailContent>(message.ContentJson)!;
            Assert.Contains($"href=\"https://app.example.com/client/orders/{booked.Id}/invoice\"", content.Html);
            Assert.Contains($"/client/orders/{booked.Id}/invoice", content.Text);
        }
        await fixture.Orders.AssignAsync(booked.Id, new AssignOrderRequest { DriverUserId = fixture.Driver.Id });
        Assert.Equal(3, await fixture.Count("order_assigned"));
        await fixture.Orders.AssignAsync(booked.Id, new AssignOrderRequest { DriverUserId = fixture.Driver.Id });
        Assert.Equal(3, await fixture.Count("order_assigned"));
        await fixture.Drivers.StartTransitAsync(fixture.Driver.Id, booked.Id);
        Assert.Equal(2, await fixture.Count("order_enroute"));
        await fixture.Drivers.CaptureProofOfDeliveryAsync(fixture.Driver.Id, booked.Id, new ProofOfDeliveryRequest
        {
            RecipientName = "Eva", SignatureDataUrl = "data:image/png;base64,signature", GpsLatitude = 48, GpsLongitude = 10
        });
        Assert.Equal(3, await fixture.Count("order_delivered"));
        Assert.Equal(DriverAvailability.Online, fixture.Driver.Availability);
        await fixture.Invoices.UpdateStatusAsync(invoice.Id, new UpdateInvoiceStatusRequest { Status = InvoiceStatus.Overdue });
        Assert.Equal(2, await fixture.Count("invoice_overdue"));
        await fixture.Invoices.UpdateStatusAsync(invoice.Id, new UpdateInvoiceStatusRequest { Status = InvoiceStatus.Paid });
        await fixture.Invoices.UpdateStatusAsync(invoice.Id, new UpdateInvoiceStatusRequest { Status = InvoiceStatus.Paid });
        Assert.Equal(2, await fixture.Count("invoice_paid"));
        await Assert.ThrowsAsync<ConflictException>(() => fixture.Orders.CancelAsync(booked.Id, fixture.Caller));
        Assert.Equal(0, await fixture.Count("order_cancelled"));
    }

    [Fact]
    public async Task ReassignmentAndCancellationNotifyAffectedDriversWithoutDuplicates()
    {
        using var fixture = new LifecycleFixture();
        var booked = await fixture.Book();
        await fixture.Orders.AssignAsync(booked.Id, new AssignOrderRequest { DriverUserId = fixture.Driver.Id });
        var second = new User
        {
            Email = "second-driver@example.com", PasswordHash = "hash", FullName = "Second", Role = UserRole.Driver,
            Availability = DriverAvailability.Online
        };
        fixture.Context.Users.Add(second);
        await fixture.Context.SaveChangesAsync();
        await fixture.Orders.AssignAsync(booked.Id, new AssignOrderRequest { DriverUserId = second.Id });
        var removed = await fixture.Context.EmailMessages.SingleAsync(message => message.EventType == "order_assignmentremoved");
        Assert.Equal(fixture.Driver.Email, removed.Recipient);
        Assert.Equal(DriverAvailability.Online, fixture.Driver.Availability);
        await fixture.Orders.CancelAsync(booked.Id, fixture.Caller);
        Assert.Equal(3, await fixture.Count("order_cancelled"));
        Assert.Equal(DriverAvailability.Online, second.Availability);
        await fixture.Orders.CancelAsync(booked.Id, fixture.Caller);
        Assert.Equal(3, await fixture.Count("order_cancelled"));
        Assert.DoesNotContain(fixture.Driver.Email, await fixture.Context.EmailMessages
            .Where(message => message.EventType == "order_cancelled").Select(message => message.Recipient).ToListAsync());
    }

    [Fact]
    public async Task FailedBookingRollsBackOrderInvoiceAndStagedEmails()
    {
        using var fixture = new LifecycleFixture();
        fixture.Client.Email = "invalid-recipient";
        await fixture.Context.SaveChangesAsync();
        await Assert.ThrowsAsync<ValidationException>(fixture.Book);
        using var other = fixture.Database.NewContext();
        Assert.Empty(await other.Orders.ToListAsync());
        Assert.Empty(await other.Invoices.ToListAsync());
        Assert.Empty(await other.EmailMessages.ToListAsync());
    }

    private sealed class LifecycleFixture : IDisposable
    {
        public EmailTestDatabase Database { get; } = new();
        public AppDbContext Context => Database.Context;
        public Client Client { get; }
        public User Driver { get; }
        public CurrentUser Caller { get; }
        public OrderService Orders { get; }
        public InvoiceService Invoices { get; }
        public DriverService Drivers { get; }

        public LifecycleFixture()
        {
            var sample = EmailSamples.Order();
            Client = sample.Client;
            Client.Id = 0;
            Client.User!.Id = 0;
            Client.UserId = null;
            Driver = sample.AssignedDriver!;
            Driver.Id = 0;
            Driver.Availability = DriverAvailability.Online;
            Context.Clients.Add(Client);
            Context.Users.Add(Driver);
            Context.SaveChanges();
            Caller = new CurrentUser(Client.UserId!.Value, UserRole.Client, Client.User.Email);
            var users = new UserRepository(Context);
            var clients = new ClientRepository(Context);
            var orders = new OrderRepository(Context);
            var emails = new EmailCommunications(EmailSamples.Queue(Context));
            var pricing = new PricingOptions();
            Invoices = new InvoiceService(new EmailTestInvoiceRepository(Context), clients, EmailSamples.Seller(), pricing, emails);
            Orders = new OrderService(orders, clients, users, new FakeRoutingService(), new FakeGeocodingService(), new PricingService(pricing),
                Invoices, new FakeNotificationQueue(), emails, new BusinessTransaction(Context),
                new BookingAvailabilityService(Context, TimeProvider.System,
                    new MessageLocale(new Microsoft.AspNetCore.Http.HttpContextAccessor())));
            Drivers = new DriverService(users, orders, new FakeNotificationQueue(), emails);
        }

        public Task<OrderResponse> Book() => Orders.CreateAsync(new CreateOrderRequest
        {
            CargoCategory = CargoCategory.Document, WeightKg = 1, PickupAddress = "Pickup street",
            DropoffAddress = "Dropoff street", PickupLat = 48.37m, PickupLng = 10.89m, DropoffLat = 48.4m, DropoffLng = 10.9m
        }, Caller);
        public Task<int> Count(string eventType) => Context.EmailMessages.CountAsync(message => message.EventType == eventType);
        public void Dispose() => Database.Dispose();
    }
}
