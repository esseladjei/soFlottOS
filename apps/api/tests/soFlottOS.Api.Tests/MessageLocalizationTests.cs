using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Email;
using soFlottOS.Api.Services.Notifications;
using soFlottOS.Api.Services.Security;
using soFlottOS.Api.Dtos;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class MessageLocalizationTests
{
    private static MessageLocale Locale(string? value)
    {
        var context = new DefaultHttpContext();
        if (value is not null) context.Request.Headers[MessageLocale.HeaderName] = value;
        return new MessageLocale(new HttpContextAccessor { HttpContext = context });
    }

    [Theory]
    [InlineData(null, "de")]
    [InlineData("fr", "de")]
    [InlineData("en", "en")]
    [InlineData("de", "de")]
    public void RequestLocaleDefaultsToGerman(string? selected, string expected) =>
        Assert.Equal(expected, Locale(selected).Current);

    [Fact]
    public async Task RegistrationRemembersSelectedLocaleBeforeWelcomeEmailIsStaged()
    {
        var users = new FakeUserRepository();
        var clients = new FakeClientRepository();
        var emails = new FakeEmailCommunications();
        var auth = new AuthService(users, clients, new FakePasswordHasher(), new FakeTokenService(), emails, Locale("en"));
        await auth.RegisterDriverAsync(new RegisterDriverRequest
        {
            Email = "driver@example.com", FullName = "Max", Password = "StrongPassword123!", Phone = "+491234"
        });
        Assert.Equal("en", Assert.Single(users.Users).PreferredLocale);
        Assert.Equal("en", Assert.Single(emails.Accounts).PreferredLocale);
    }

    [Fact]
    public async Task LoginAndAuthenticatedRequestsRememberLocaleWithoutChangingPasswordVersion()
    {
        using var database = new EmailTestDatabase();
        var user = EmailSamples.Order().Client.User!;
        user.Id = 0;
        user.PasswordHash = new FakePasswordHasher().Hash("Secret123!");
        database.Context.Users.Add(user);
        await database.Context.SaveChangesAsync();
        var auth = new AuthService(new UserRepository(database.Context), new ClientRepository(database.Context),
            new FakePasswordHasher(), new FakeTokenService(), new FakeEmailCommunications(), Locale("en"));
        await auth.LoginAsync(new LoginRequest { Email = user.Email, Password = "Secret123!" });
        Assert.Equal("en", user.PreferredLocale);
        var principal = new ClaimsPrincipal(new ClaimsIdentity(
            [new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())], "test"));
        Assert.True(await new AccountSessionValidator(database.Context, Locale("de")).IsCurrentAsync(principal));
        Assert.Equal("de", user.PreferredLocale);
        Assert.Equal(0, user.PasswordVersion);
        Assert.True(await new AccountSessionValidator(database.Context, Locale("invalid")).IsCurrentAsync(principal));
        Assert.Equal("de", user.PreferredLocale);
    }

    [Fact]
    public async Task RecipientPreferencesOverrideActorAndManualContactsUseRequestLocale()
    {
        using var database = new EmailTestDatabase();
        var queue = new EmailQueue(database.Context,
            new EmailTemplateRenderer(EmailSamples.Options(), EmailSamples.Seller()), EmailSamples.Options(),
            NullLogger<EmailQueue>.Instance, Locale("en"));
        var communications = new EmailCommunications(queue);
        var order = EmailSamples.Order();
        order.Client.User!.PreferredLocale = "de";
        order.AssignedDriver!.PreferredLocale = "en";
        communications.OrderChanged(order, OrderEmailKind.Assigned);
        var manual = EmailSamples.Invoice().Client;
        manual.User = null;
        manual.UserId = null;
        communications.ClientOnboarded(manual);
        await database.Context.SaveChangesAsync();
        var messages = await database.Context.EmailMessages.ToListAsync();
        foreach (var message in messages.Where(m => m.EventType == "order_assigned"))
        {
            var content = JsonSerializer.Deserialize<EmailContent>(message.ContentJson)!;
            Assert.Contains(message.Recipient == order.AssignedDriver.Email ? "lang=\"en\"" : "lang=\"de\"", content.Html);
        }
        var onboarded = JsonSerializer.Deserialize<EmailContent>(messages.Single(m => m.EventType == "client_onboarded").ContentJson)!;
        Assert.Contains("Working with soFlott", onboarded.Text);
        Assert.Contains("lang=\"en\"", onboarded.Html);
    }

    [Theory]
    [InlineData("order_created", "Auftrag #42 gebucht", "order #42 booked")]
    [InlineData("order_assigned", "wurde Max zugewiesen", "was assigned to Max")]
    [InlineData("driver_en_route", "ist unterwegs", "is on the way")]
    [InlineData("proof_of_delivery", "an Eva zugestellt", "delivered to Eva")]
    public void EverySmsTemplateSupportsGermanAndEnglish(string eventType, string german, string english)
    {
        var order = EmailSamples.Order();
        order.Invoice = EmailSamples.Invoice();
        var de = NotificationTemplates.Render(eventType, order, "de");
        var en = NotificationTemplates.Render(eventType, order, "en");
        Assert.Contains(german, de);
        Assert.Contains(english, en);
        Assert.Equal(de, NotificationTemplates.Render(eventType, order, "unsupported"));
        if (eventType == "order_created")
        {
            Assert.Contains(order.Invoice.InvoiceNumber, en);
            Assert.Contains("29.75 EUR", en);
            Assert.Contains("29,75 EUR", de);
        }

        if (eventType == "proof_of_delivery")
        {
            Assert.Contains("UTC", en);
            Assert.Contains("UTC", de);
        }
    }

    [Theory]
    [InlineData("en", "de", "Your invoice", "View invoice")]
    [InlineData("de", "en", "Ihre Rechnung", "Rechnung ansehen")]
    public async Task InvoiceOutboxUsesCustomerLanguageAndOrderLinkBeforeInvoiceIsSaved(
        string customerLocale, string actorLocale, string heading, string action)
    {
        using var database = new EmailTestDatabase();
        var queue = new EmailQueue(database.Context,
            new EmailTemplateRenderer(EmailSamples.Options(), EmailSamples.Seller()), EmailSamples.Options(),
            NullLogger<EmailQueue>.Instance, Locale(actorLocale));
        var invoice = EmailSamples.Invoice();
        invoice.Id = 0;
        invoice.Client.User!.PreferredLocale = customerLocale;

        new EmailCommunications(queue).InvoiceChanged(invoice, InvoiceEmailKind.Issued);
        invoice.Client.User.PreferredLocale = actorLocale;
        await database.Context.SaveChangesAsync();

        foreach (var message in await database.Context.EmailMessages.ToListAsync())
        {
            var content = JsonSerializer.Deserialize<EmailContent>(message.ContentJson)!;
            Assert.Contains($"lang=\"{customerLocale}\"", content.Html);
            Assert.Contains(heading, content.Subject);
            Assert.Contains($"{action}: https://app.example.com/client/orders/42/invoice", content.Text);
        }
        Assert.Equal(2, await database.Context.EmailMessages.CountAsync());
    }

    [Fact]
    public async Task SmsOutboxSnapshotsRecipientLocaleAndOmitsMissingJourneyEstimate()
    {
        using var database = new EmailTestDatabase();
        var order = EmailSamples.Order();
        order.Id = 0;
        order.Client.User!.PreferredLocale = "en";
        order.Client.Phone = "+491234";
        order.EstimatedDurationMinutes = 0;
        database.Context.Orders.Add(order);
        await database.Context.SaveChangesAsync();
        var queue = new NotificationQueue(new NotificationRepository(database.Context), Locale("de"));
        await queue.EnqueueAsync(NotificationRequest.ForOrder(order.Client.Phone, "driver_en_route", order));
        order.Client.User.PreferredLocale = "de";
        order.EstimatedDurationMinutes = 99;
        await database.Context.SaveChangesAsync();
        var message = await database.Context.NotificationMessages.AsNoTracking().SingleAsync();
        Assert.Contains("is on the way", message.Body);
        Assert.DoesNotContain("minutes", message.Body);
        Assert.DoesNotContain("99", message.Body);
    }
}
