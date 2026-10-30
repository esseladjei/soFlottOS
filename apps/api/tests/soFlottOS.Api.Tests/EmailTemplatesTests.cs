using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Services.Email;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class EmailTemplatesTests
{
    private readonly EmailTemplateRenderer _renderer = new(EmailSamples.Options(), EmailSamples.Seller());

    [Fact]
    public void BookingConfirmationIncludesContactsAndAvailableJourneyEstimate()
    {
        var order = EmailSamples.Order();
        order.PickupContactName = "<Hans & Team>";
        var email = _renderer.Render(new OrderEmail(order, OrderEmailKind.Confirmed, EmailAudience.Customer));
        Assert.Contains("Kontakt Abholung: <Hans & Team>", email.Text);
        Assert.Contains("Telefon Abholung: +49111", email.Text);
        Assert.Contains("Kontakt Zustellung: Eva", email.Text);
        Assert.Contains("Telefon Zustellung: +49222", email.Text);
        Assert.Contains("Voraussichtliche Fahrzeit: ca. 12 Minuten (unverbindlich)", email.Text);
        Assert.Contains("&lt;Hans &amp; Team&gt;", email.Html);
        Assert.DoesNotContain("<Hans & Team>", email.Html);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void BookingConfirmationOmitsMissingContactsAndUnavailableEstimate(int duration)
    {
        var order = EmailSamples.Order();
        order.PickupContactName = null;
        order.PickupPhone = "";
        order.DropoffContactName = " ";
        order.DropoffPhone = null;
        order.EstimatedDurationMinutes = duration;
        var email = _renderer.Render(new OrderEmail(order, OrderEmailKind.Confirmed, EmailAudience.Customer));
        Assert.DoesNotContain("Kontakt Abholung", email.Text);
        Assert.DoesNotContain("Telefon Abholung", email.Text);
        Assert.DoesNotContain("Kontakt Zustellung", email.Text);
        Assert.DoesNotContain("Telefon Zustellung", email.Text);
        Assert.DoesNotContain("Voraussichtliche Fahrzeit", email.Text);
        Assert.Contains(order.PickupAddress, email.Text);
        Assert.Contains(order.DropoffAddress, email.Text);
    }

    [Fact]
    public void CustomerAssignmentIncludesAvailableDriverContactAndEncodesHtml()
    {
        var order = EmailSamples.Order();
        order.AssignedDriver!.FullName = "<Max & Team>";
        order.AssignedDriver.Phone = "+49333";
        var email = _renderer.Render(new OrderEmail(order, OrderEmailKind.Assigned, EmailAudience.Customer));
        Assert.Contains("Fahrer: <Max & Team>", email.Text);
        Assert.Contains("Telefon Fahrer: +49333", email.Text);
        Assert.Contains("E-Mail Fahrer: driver@example.com", email.Text);
        Assert.Contains("&lt;Max &amp; Team&gt;", email.Html);
        Assert.DoesNotContain("<Max & Team>", email.Html);
        var driverEmail = _renderer.Render(new OrderEmail(order, OrderEmailKind.Assigned, EmailAudience.Driver));
        Assert.DoesNotContain("Telefon Fahrer", driverEmail.Text);
        Assert.DoesNotContain("E-Mail Fahrer", driverEmail.Text);
    }

    [Fact]
    public void CustomerAssignmentOmitsUnavailableDriverContact()
    {
        var order = EmailSamples.Order();
        order.AssignedDriver!.Phone = " ";
        order.AssignedDriver.Email = "";
        var email = _renderer.Render(new OrderEmail(order, OrderEmailKind.Assigned, EmailAudience.Customer));
        Assert.Contains("Fahrer: Max", email.Text);
        Assert.DoesNotContain("Telefon Fahrer", email.Text);
        Assert.DoesNotContain("E-Mail Fahrer", email.Text);
        order.AssignedDriver = null;
        email = _renderer.Render(new OrderEmail(order, OrderEmailKind.Assigned, EmailAudience.Customer));
        Assert.DoesNotContain("Fahrer:", email.Text);
        Assert.DoesNotContain("Telefon Fahrer", email.Text);
        Assert.DoesNotContain("E-Mail Fahrer", email.Text);
    }

    [Fact]
    public async Task OrderContactDetailsRemainSnapshottedInTransactionalOutbox()
    {
        using var database = new EmailTestDatabase();
        var order = EmailSamples.Order();
        order.AssignedDriver!.Phone = "+49333";
        var queue = EmailSamples.Queue(database.Context);
        queue.Stage("order_confirmed", new OrderEmail(order, OrderEmailKind.Confirmed, EmailAudience.Customer), "client@example.com");
        queue.Stage("order_assigned", new OrderEmail(order, OrderEmailKind.Assigned, EmailAudience.Customer), "client@example.com");
        order.PickupPhone = "+49000";
        order.EstimatedDurationMinutes = 99;
        order.AssignedDriver.Phone = "+49000";
        using var other = database.NewContext();
        Assert.Empty(await other.EmailMessages.ToListAsync());
        await database.Context.SaveChangesAsync();
        var confirmed = JsonSerializer.Deserialize<EmailContent>(
            (await other.EmailMessages.SingleAsync(e => e.EventType == "order_confirmed")).ContentJson)!;
        var assigned = JsonSerializer.Deserialize<EmailContent>(
            (await other.EmailMessages.SingleAsync(e => e.EventType == "order_assigned")).ContentJson)!;
        Assert.Contains("Telefon Abholung: +49111", confirmed.Text);
        Assert.Contains("ca. 12 Minuten", confirmed.Text);
        Assert.Contains("Telefon Fahrer: +49333", assigned.Text);
        Assert.DoesNotContain("+49000", confirmed.Text + assigned.Text);
        Assert.DoesNotContain("99 Minuten", confirmed.Text);
    }

    [Theory]
    [InlineData(UserRole.Client, "/client")]
    [InlineData(UserRole.Driver, "/driver")]
    public void AccountWelcome_IsRoleSpecificAndNeverContainsCredentials(UserRole role, string path)
    {
        var user = EmailSamples.Order().Client.User!;
        user.Role = role;
        user.FullName = "<script>alert('x')</script>";
        user.PasswordHash = "SECRET_HASH";
        var email = _renderer.Render(new AccountCreatedEmail(user));
        Assert.Contains("https://app.example.com" + path, email.Html);
        Assert.Contains("&lt;script&gt;", email.Html);
        Assert.DoesNotContain("<script>", email.Html);
        Assert.DoesNotContain("SECRET_HASH", email.Html + email.Text);
        Assert.Contains("keine Verifizierung", email.Text);
    }

    [Theory]
    [InlineData(OrderEmailKind.Confirmed)]
    [InlineData(OrderEmailKind.Assigned)]
    [InlineData(OrderEmailKind.Cancelled)]
    [InlineData(OrderEmailKind.EnRoute)]
    [InlineData(OrderEmailKind.Delivered)]
    public void CustomerOrderTemplates_HaveRouteAndAuthenticatedLink(OrderEmailKind kind)
    {
        var order = EmailSamples.Order();
        order.PickupAddress = "<img src=x onerror=alert(1)>";
        var email = _renderer.Render(new OrderEmail(order, kind, EmailAudience.Customer));
        Assert.Contains("/client/orders/42", email.Html);
        Assert.Contains("&lt;img", email.Html);
        Assert.DoesNotContain("<img src=x", email.Html);
        Assert.Contains(order.DropoffAddress, email.Text);
        Assert.NotEmpty(email.Subject);
        if (kind == OrderEmailKind.Cancelled) Assert.Contains("nicht automatisch", email.Text);
        if (kind == OrderEmailKind.EnRoute) Assert.Contains("unverbindlich", email.Text);
        if (kind == OrderEmailKind.Delivered)
        {
            var attachment = Assert.Single(email.Attachments);
            var html = Encoding.UTF8.GetString(Convert.FromBase64String(attachment.Content));
            Assert.Equal("text/html", attachment.ContentType);
            Assert.Contains("Eva", html);
            Assert.Contains("08.10.2026 12:30 +02:00 (Europe/Berlin)", html);
            Assert.DoesNotContain("data:image", html);
        }
    }

    [Theory]
    [InlineData(OrderEmailKind.Assigned, "/driver/jobs/42")]
    [InlineData(OrderEmailKind.AssignmentRemoved, "/driver")]
    [InlineData(OrderEmailKind.Cancelled, "/driver")]
    [InlineData(OrderEmailKind.Delivered, "/driver/jobs/42")]
    public void DriverTemplates_IncludeInstructionsWithoutCustomerFinancials(OrderEmailKind kind, string path)
    {
        var email = _renderer.Render(new OrderEmail(EmailSamples.Order(), kind, EmailAudience.Driver));
        Assert.Contains("https://app.example.com" + path, email.Html);
        Assert.Contains("Hintereingang", email.Text);
        Assert.Contains("+49111", email.Text);
        Assert.DoesNotContain("29,75", email.Html + email.Text);
        Assert.DoesNotContain("Netto", email.Html + email.Text);
        Assert.Empty(email.Attachments);
    }

    [Theory]
    [InlineData(InvoiceEmailKind.Issued, true)]
    [InlineData(InvoiceEmailKind.Sent, true)]
    [InlineData(InvoiceEmailKind.Paid, false)]
    [InlineData(InvoiceEmailKind.Overdue, false)]
    public void InvoiceTemplates_UseStoredAmountsAndPrintableAttachments(InvoiceEmailKind kind, bool attached)
    {
        var invoice = EmailSamples.Invoice();
        invoice.VatRate = .07m;
        invoice.InvoiceNumber = "<script>evil</script>";
        var email = _renderer.Render(new InvoiceEmail(invoice, kind));
        Assert.Contains("MwSt. (7 %)", email.Text);
        Assert.Contains("29,75", email.Text);
        Assert.Contains("/client/orders/42/invoice", email.Html);
        Assert.DoesNotContain("<script>", email.Html);
        Assert.Equal(attached ? 1 : 0, email.Attachments.Count);
        if (attached)
        {
            var html = Encoding.UTF8.GetString(Convert.FromBase64String(email.Attachments[0].Content));
            Assert.Contains("DE123456789", html);
            Assert.Contains("Kundenstrasse", html);
            Assert.Contains("DE1234567890", html);
            Assert.Contains("&lt;script&gt;", html);
            Assert.DoesNotContain("<script>", html);
        }
        if (kind == InvoiceEmailKind.Paid) Assert.Contains("keine weitere Zahlung", email.Text);
    }

    [Fact]
    public void ManualClients_DoNotReceiveInaccessiblePortalLinks()
    {
        var invoice = EmailSamples.Invoice();
        invoice.Client.UserId = null;
        invoice.Client.User = null;
        Assert.DoesNotContain("href=\"https://app.example.com", _renderer.Render(new ClientOnboardedEmail(invoice.Client)).Html);
        Assert.DoesNotContain("href=\"https://app.example.com", _renderer.Render(new InvoiceEmail(invoice, InvoiceEmailKind.Issued)).Html);
        Assert.DoesNotContain("href=\"https://app.example.com", _renderer.Render(new OrderEmail(invoice.Order, OrderEmailKind.Confirmed, EmailAudience.Customer)).Html);
    }

    [Fact]
    public void NewInvoiceUsesOrderSpecificLinkAndPaypalInstructions()
    {
        var invoice = EmailSamples.Invoice();
        invoice.Id = 0;
        invoice.PaymentMethod = PaymentMethod.PayPal;
        var email = _renderer.Render(new InvoiceEmail(invoice, InvoiceEmailKind.Issued));
        var englishEmail = _renderer.Render(new InvoiceEmail(invoice, InvoiceEmailKind.Issued), "en");
        Assert.Contains("href=\"https://app.example.com/client/orders/42/invoice\"", email.Html);
        Assert.Contains("View invoice: https://app.example.com/client/orders/42/invoice", englishEmail.Text);
        Assert.Contains("paypal.me/test", email.Text);
        Assert.DoesNotContain("IBAN:", email.Text);
        Assert.Contains("Please pay via PayPal", englishEmail.Text);
        Assert.Contains("paypal.me/test", englishEmail.Text);
    }

    [Theory]
    [InlineData("en", UserRole.Client, "Business customer")]
    [InlineData("en", UserRole.Driver, "Driver")]
    [InlineData("de", UserRole.Client, "Geschäftskunde")]
    [InlineData("de", UserRole.Driver, "Fahrer")]
    public void AccountTemplatesAreLocalizedWithoutChangingUserData(string locale, UserRole role, string translatedRole)
    {
        var user = EmailSamples.Order().Client.User!;
        user.Role = role;
        user.FullName = "<Anna & Co>";
        user.Email = "anna@example.com";

        var email = _renderer.Render(new AccountCreatedEmail(user), locale);

        Assert.Contains($"lang=\"{locale}\"", email.Html);
        Assert.Contains(translatedRole, email.Text);
        Assert.Contains(System.Net.WebUtility.HtmlEncode(translatedRole), email.Html);
        Assert.Contains("anna@example.com", email.Text);
        Assert.Contains("<Anna & Co>", email.Text);
        Assert.Contains("&lt;Anna &amp; Co&gt;", email.Html);
        Assert.DoesNotContain("<Anna & Co>", email.Html);
        Assert.Contains(locale == "en" ? "Hello" : "Guten Tag", email.Text);
    }

    [Theory]
    [InlineData("en", "Working with soFlott")]
    [InlineData("de", "Ihre Zusammenarbeit mit soFlott")]
    public void ClientOnboardingTemplateIsLocalized(string locale, string heading)
    {
        var client = EmailSamples.Invoice().Client;
        client.ContactPerson = "<Anna & Team>";
        client.CompanyName = "MediLab & Co";

        var email = _renderer.Render(new ClientOnboardedEmail(client), locale);

        Assert.Contains(heading, email.Text);
        Assert.Contains($"<h1 style=\"font-size:26px;line-height:1.25\">{heading}</h1>", email.Html);
        Assert.Equal(locale == "en" ? "Welcome to soFlott" : "Willkommen bei soFlott", email.Subject);
        Assert.Contains($"lang=\"{locale}\"", email.Html);
        Assert.Contains("MediLab & Co", email.Text);
        Assert.Contains("<Anna & Team>", email.Text);
        Assert.Contains("&lt;Anna &amp; Team&gt;", email.Html);
        Assert.DoesNotContain("<Anna & Team>", email.Html);
        Assert.DoesNotContain("href=\"https://app.example.com", email.Html);
    }

    [Fact]
    public void EveryOrderKindAndAudienceRendersInEnglishAndGerman()
    {
        foreach (var kind in Enum.GetValues<OrderEmailKind>())
        foreach (var audience in Enum.GetValues<EmailAudience>())
        {
            var order = EmailSamples.Order();
            order.PickupAddress = "<Dock & 1>";
            foreach (var locale in new[] { "en", "de" })
            {
                var email = _renderer.Render(new OrderEmail(order, kind, audience), locale);
                Assert.Contains($"lang=\"{locale}\"", email.Html);
                Assert.Contains(locale == "en" ? "Pickup:" : "Abholung:", email.Text);
                Assert.Contains("<Dock & 1>", email.Text);
                Assert.Contains("&lt;Dock &amp; 1&gt;", email.Html);
                Assert.DoesNotContain("<Dock & 1>", email.Html);
                Assert.Contains(locale == "en" ? "Hello" : "Guten Tag", email.Text);
                Assert.Equal(audience == EmailAudience.Driver && kind == OrderEmailKind.Delivered ? 0 :
                    kind == OrderEmailKind.Delivered ? 1 : 0, email.Attachments.Count);
                if (audience == EmailAudience.Driver)
                {
                    Assert.Contains(locale == "en" ? "Delivery instructions: Hintereingang" : "Lieferhinweise: Hintereingang",
                        email.Text);
                    Assert.DoesNotContain("Netto", email.Text);
                    Assert.DoesNotContain("Net:", email.Text);
                }
                if (kind == OrderEmailKind.Delivered && audience == EmailAudience.Customer)
                {
                    var attachment = Assert.Single(email.Attachments);
                    Assert.Equal(locale == "en" ? "Delivery-proof-42.html" : "Zustellnachweis-42.html",
                        attachment.Filename);
                    var document = Encoding.UTF8.GetString(Convert.FromBase64String(attachment.Content));
                    Assert.Contains($"lang=\"{locale}\"", document);
                    Assert.Contains(locale == "en" ? "Delivery proof" : "Zustellnachweis", document);
                    Assert.Contains("Eva", document);
                }
            }
        }
    }

    [Fact]
    public void EveryInvoiceKindUsesRequestedLocaleAndLocalizesPrintableDocuments()
    {
        foreach (var kind in Enum.GetValues<InvoiceEmailKind>())
        foreach (var locale in new[] { "en", "de" })
        {
            var invoice = EmailSamples.Invoice();
            invoice.VatRate = .07m;
            invoice.InvoiceNumber = "<SO & 1000>";
            var email = _renderer.Render(new InvoiceEmail(invoice, kind), locale);
            Assert.Contains($"lang=\"{locale}\"", email.Html);
            Assert.Contains(locale == "en" ? "Invoice number:" : "Rechnungsnummer:", email.Text);
            Assert.Contains("<SO & 1000>", email.Text);
            Assert.DoesNotContain("<SO & 1000>", email.Html);
            Assert.Contains("&lt;SO &amp; 1000&gt;", email.Html);
            Assert.Contains(locale == "en" ? "VAT (7%)" : "MwSt. (7 %)", email.Text);
            Assert.Contains(locale == "en" ? "€29.75" : "29,75 €", email.Text);
            if (kind == InvoiceEmailKind.Paid)
                Assert.Contains(locale == "en" ? "No further payment" : "keine weitere Zahlung", email.Text);
            else
                Assert.Contains(locale == "en" ? "Please transfer" : "Bitte überweisen", email.Text);

            if (kind is InvoiceEmailKind.Issued or InvoiceEmailKind.Sent)
            {
                var attachment = Assert.Single(email.Attachments);
                Assert.Equal(locale == "en" ? "Invoice-Order-42.html" : "Rechnung-Auftrag-42.html",
                    attachment.Filename);
                var document = Encoding.UTF8.GetString(Convert.FromBase64String(attachment.Content));
                Assert.Contains($"lang=\"{locale}\"", document);
                Assert.Contains(locale == "en" ? "Invoice issuer" : "Rechnungsaussteller", document);
                Assert.Contains(locale == "en" ? "Service: courier delivery" : "Leistung: Kurierlieferung", document);
                Assert.Contains("&lt;SO &amp; 1000&gt;", document);
                Assert.DoesNotContain("<SO & 1000>", document);
            }
            else
            {
                Assert.Empty(email.Attachments);
            }
        }
    }

    [Fact]
    public void LocaleFallbackAndOneArgumentRendererRemainGerman()
    {
        var model = new AccountCreatedEmail(EmailSamples.Order().Client.User!);

        var defaultEmail = _renderer.Render(model);
        var fallbackEmail = _renderer.Render(model, "fr");

        Assert.Equal(defaultEmail.Subject, fallbackEmail.Subject);
        Assert.Equal(defaultEmail.Html, fallbackEmail.Html);
        Assert.Equal(defaultEmail.Text, fallbackEmail.Text);
        Assert.Contains("lang=\"de\"", fallbackEmail.Html);
        Assert.Contains("Guten Tag", fallbackEmail.Text);
    }

    [Theory]
    [InlineData("2026-10-11T20:24:00Z", "de", "11.10.2026 22:24 +02:00")]
    [InlineData("2026-10-11T20:24:00Z", "en", "11/10/2026 22:24 +02:00")]
    [InlineData("2026-12-11T20:24:00Z", "de", "11.12.2026 21:24 +01:00")]
    [InlineData("2026-12-11T20:24:00Z", "en", "11/12/2026 21:24 +01:00")]
    [InlineData("2026-10-11T23:24:00Z", "de", "12.10.2026 01:24 +02:00")]
    [InlineData("2026-03-29T00:30:00Z", "de", "29.03.2026 01:30 +01:00")]
    [InlineData("2026-03-29T01:30:00Z", "de", "29.03.2026 03:30 +02:00")]
    [InlineData("2026-10-25T00:30:00Z", "de", "25.10.2026 02:30 +02:00")]
    [InlineData("2026-10-25T01:30:00Z", "de", "25.10.2026 02:30 +01:00")]
    public void InvoiceDatesUseBerlinTimeInBothLanguages(string timestamp, string locale, string expected)
    {
        var invoice = EmailSamples.Invoice();
        var time = DateTimeOffset.Parse(timestamp, System.Globalization.CultureInfo.InvariantCulture);
        invoice.IssuedAt = time;
        invoice.DueDate = time;
        invoice.PaidAt = time;
        invoice.Order.DeliveredAt = time;

        foreach (var kind in Enum.GetValues<InvoiceEmailKind>())
        {
            var email = _renderer.Render(new InvoiceEmail(invoice, kind), locale);
            Assert.Contains($"{expected} (Europe/Berlin)", email.Text);
            Assert.Contains($"{expected} (Europe/Berlin)", email.Html);
            Assert.DoesNotContain(" UTC", email.Text);
            foreach (var attachment in email.Attachments)
            {
                var document = Encoding.UTF8.GetString(Convert.FromBase64String(attachment.Content));
                Assert.Contains($"{expected} (Europe/Berlin)", document);
                Assert.DoesNotContain(" UTC", document);
            }
        }
    }

    [Theory]
    [InlineData("en", "Your invoice", "TRANSACTIONAL UPDATE", "View invoice")]
    [InlineData("de", "Ihre Rechnung", "TRANSAKTIONSBESTÄTIGUNG", "Rechnung ansehen")]
    public void DefaultInvoiceRendererUsesSavedCustomerLanguage(
        string locale, string heading, string transaction, string action)
    {
        var invoice = EmailSamples.Invoice();
        invoice.Client.User!.PreferredLocale = locale;

        var email = _renderer.Render(new InvoiceEmail(invoice, InvoiceEmailKind.Issued));

        Assert.Contains($"lang=\"{locale}\"", email.Html);
        Assert.Contains(heading, email.Subject);
        Assert.Contains(System.Net.WebUtility.HtmlEncode(transaction), email.Html);
        Assert.Contains(action, email.Text);
        Assert.Contains("/client/orders/42/invoice", email.Text);
    }

    [Fact]
    public void DefaultRendererUsesRecipientPreferenceForEveryTemplateAndHonorsExplicitOverride()
    {
        var invoice = EmailSamples.Invoice();
        invoice.Client.User!.PreferredLocale = "en";
        invoice.Order.AssignedDriver!.PreferredLocale = "de";
        EmailTemplateModel[] models =
        [
            new AccountCreatedEmail(invoice.Client.User),
            new ClientOnboardedEmail(invoice.Client),
            new OrderEmail(invoice.Order, OrderEmailKind.Assigned, EmailAudience.Customer),
            new InvoiceEmail(invoice, InvoiceEmailKind.Issued)
        ];
        foreach (var model in models)
        {
            Assert.Contains("lang=\"en\"", _renderer.Render(model).Html);
            Assert.Contains("lang=\"de\"", _renderer.Render(model with { Locale = "de" }).Html);
            Assert.Contains("lang=\"de\"", _renderer.Render(model, "de").Html);
        }
        Assert.Contains("lang=\"de\"", _renderer.Render(
            new OrderEmail(invoice.Order, OrderEmailKind.Assigned, EmailAudience.Driver)).Html);
    }

    [Fact]
    public void EmailOptionsRejectInvalidConfigurationButAllowDisabledWithoutSecrets()
    {
        new EmailOptions().Validate();
        var options = EmailSamples.Options();
        options.Validate();
        options.ApiKey = "";
        Assert.Throws<InvalidOperationException>(options.Validate);
        options = EmailSamples.Options();
        options.From = "invalid";
        Assert.Throws<InvalidOperationException>(options.Validate);
        options = EmailSamples.Options();
        options.FrontendBaseUrl = "javascript:alert(1)";
        Assert.Throws<InvalidOperationException>(options.Validate);
        options = EmailSamples.Options();
        options.FrontendBaseUrl = "https://user:pass@example.com";
        Assert.Throws<InvalidOperationException>(options.Validate);
        options = EmailSamples.Options();
        options.MaxAttempts = 0;
        Assert.Throws<InvalidOperationException>(options.Validate);
    }

    [Theory]
    [InlineData("de", "Wenn morgen zu spät ist.", "When tomorrow is too late.")]
    [InlineData("en", "When tomorrow is too late.", "Wenn morgen zu spät ist.")]
    public void AllEmailTemplatesIncludeLogoAndLocalizedBrandTagline(string locale, string tagline, string otherTagline)
    {
        var invoice = EmailSamples.Invoice();
        EmailTemplateModel[] models =
        [
            new AccountCreatedEmail(invoice.Client.User!),
            new ClientOnboardedEmail(invoice.Client),
            .. Enum.GetValues<OrderEmailKind>().Select(kind =>
                new OrderEmail(invoice.Order, kind, EmailAudience.Customer)),
            .. Enum.GetValues<InvoiceEmailKind>().Select(kind => new InvoiceEmail(invoice, kind))
        ];

        foreach (var model in models)
        {
            var email = _renderer.Render(model, locale);
            Assert.Contains("src=\"https://app.example.com/logo/soFlott_arrow_nav.png\"", email.Html);
            Assert.Contains("alt=\"soFlott\"", email.Html);
            Assert.Contains(System.Net.WebUtility.HtmlEncode(tagline), email.Html);
            Assert.Contains(tagline, email.Text);
            Assert.DoesNotContain(System.Net.WebUtility.HtmlEncode(otherTagline), email.Html);
            Assert.DoesNotContain(otherTagline, email.Text);
            Assert.Contains($"<p lang=\"{locale}\"", email.Html);
            foreach (var attachment in email.Attachments)
            {
                var document = Encoding.UTF8.GetString(Convert.FromBase64String(attachment.Content));
                Assert.Contains("/logo/soFlott_arrow_nav.png", document);
                Assert.Contains(System.Net.WebUtility.HtmlEncode(tagline), document);
                Assert.DoesNotContain(System.Net.WebUtility.HtmlEncode(otherTagline), document);
                Assert.Contains($"<p lang=\"{locale}\"", document);
            }
        }
    }

    [Fact]
    public void EnabledEmailRequiresCompleteInvoiceConfiguration()
    {
        var options = EmailSamples.Options();
        var seller = EmailSamples.Seller();
        options.ValidateInvoicing(seller);
        seller.Street = "";
        Assert.Throws<InvalidOperationException>(() => options.ValidateInvoicing(seller));
        seller = EmailSamples.Seller();
        seller.Iban = "";
        Assert.Throws<InvalidOperationException>(() => options.ValidateInvoicing(seller));
        options.Enabled = false;
        options.ValidateInvoicing(seller);
    }
}
