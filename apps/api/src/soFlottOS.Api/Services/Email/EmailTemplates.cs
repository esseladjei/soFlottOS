using System.Globalization;
using System.Net;
using System.Text;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Email;

public sealed class EmailTemplateRenderer(EmailOptions options, InvoicingOptions seller) : IEmailTemplateRenderer
{
    public EmailContent Render(EmailTemplateModel model) => Render(model, model.Locale ?? (model switch
    {
        AccountCreatedEmail account => account.User.PreferredLocale,
        ClientOnboardedEmail onboarded => onboarded.Client.User?.PreferredLocale,
        OrderEmail { Audience: EmailAudience.Driver } order => order.Order.AssignedDriver?.PreferredLocale,
        OrderEmail order => order.Order.Client.User?.PreferredLocale,
        InvoiceEmail invoice => invoice.Invoice.Client.User?.PreferredLocale,
        _ => null
    }) ?? "de");

    public EmailContent Render(EmailTemplateModel model, string locale)
    {
        locale = EmailTranslations.Normalize(locale);
        return model switch
        {
            AccountCreatedEmail account => Account(account.User, locale),
            ClientOnboardedEmail onboarded => Onboarded(onboarded.Client, locale),
            OrderEmail order => OrderUpdate(order, locale),
            InvoiceEmail invoice => InvoiceUpdate(invoice, locale),
            _ => throw new ArgumentOutOfRangeException(nameof(model), "Unsupported email template.")
        };
    }

    private EmailContent Account(User user, string locale)
    {
        var driver = user.Role == UserRole.Driver;
        return Build(locale, T(locale, "account.title"), T(locale, "account.ready"), user.FullName,
            T(locale, driver ? "account.driverIntro" : "account.clientIntro"),
            [(T(locale, "account.email"), user.Email),
                (T(locale, "account.type"), T(locale, driver ? "account.driver" : "account.businessCustomer"))],
            Link(driver ? "/driver" : "/client"),
            T(locale, driver ? "account.driverAction" : "account.clientAction"),
            T(locale, "account.note"));
    }

    private EmailContent Onboarded(Client client, string locale) =>
        Build(locale, T(locale, "account.title"), T(locale, "client.title"), client.ContactPerson,
            T(locale, "client.intro"),
            [(T(locale, "client.company"), client.CompanyName), (T(locale, "client.contact"), client.Email)],
            null, null, T(locale, "client.note"));

    private EmailContent OrderUpdate(OrderEmail model, string locale)
    {
        var order = model.Order;
        var driver = model.Audience == EmailAudience.Driver;
        var (heading, intro) = model.Kind switch
        {
            OrderEmailKind.Confirmed => (T(locale, "order.confirmed"), T(locale, "order.confirmedIntro")),
            OrderEmailKind.Assigned when driver =>
                (T(locale, "order.assignedDriver"), T(locale, "order.assignedDriverIntro")),
            OrderEmailKind.Assigned =>
                (T(locale, "order.assignedCustomer"), T(locale, "order.assignedCustomerIntro")),
            OrderEmailKind.AssignmentRemoved =>
                (T(locale, "order.assignmentRemoved"), T(locale, "order.assignmentRemovedIntro")),
            OrderEmailKind.Cancelled when driver =>
                (T(locale, "order.cancelledDriver"), T(locale, "order.cancelledDriverIntro")),
            OrderEmailKind.Cancelled => (T(locale, "order.cancelled"), T(locale, "order.cancelledIntro")),
            OrderEmailKind.EnRoute => (T(locale, "order.enRoute"), T(locale, "order.enRouteIntro")),
            OrderEmailKind.Delivered when driver =>
                (T(locale, "order.deliveredDriver"), T(locale, "order.deliveredDriverIntro")),
            OrderEmailKind.Delivered => (T(locale, "order.delivered"),
                T(locale, order.Client.UserId.HasValue
                    ? "order.deliveredWithPortalIntro"
                    : "order.deliveredWithoutPortalIntro")),
            _ => throw new ArgumentOutOfRangeException(nameof(model.Kind))
        };

        var culture = EmailTranslations.Culture(locale);
        List<(string Label, string Value)> details =
        [
            (T(locale, "order.number"), $"#{order.Id}"),
            (T(locale, "order.pickup"), order.PickupAddress),
            (T(locale, "order.dropoff"), order.DropoffAddress),
            (T(locale, "order.shipment"),
                $"{Cargo(order.CargoCategory, locale)} · {order.WeightKg.ToString("0.##", culture)} kg")
        ];
        if (!string.IsNullOrWhiteSpace(order.ExternalReference))
            details.Add((T(locale, "order.reference"), order.ExternalReference));
        if (driver || model.Kind == OrderEmailKind.Confirmed)
        {
            AddIfPresent(details, T(locale, "order.pickupContact"), order.PickupContactName);
            AddIfPresent(details, T(locale, "order.pickupPhone"), order.PickupPhone);
            AddIfPresent(details, T(locale, "order.dropoffContact"), order.DropoffContactName);
            AddIfPresent(details, T(locale, "order.dropoffPhone"), order.DropoffPhone);
        }
        if (driver)
            AddIfPresent(details, T(locale, "order.instructions"), order.SpecialInstructions);
        if (!driver && model.Kind == OrderEmailKind.Confirmed)
        {
            details.Add((T(locale, "order.net"), Money(order.NetPrice, locale)));
            details.Add((T(locale, "order.vat"), Money(order.VatAmount, locale)));
            details.Add((T(locale, "order.total"), Money(order.GrossPrice, locale)));
            details.Add((T(locale, "order.payment"), Payment(order.PaymentMethod, locale)));
        }
        if (model.Kind == OrderEmailKind.Assigned && order.AssignedDriver is not null && !driver)
        {
            details.Add((T(locale, "order.driver"), order.AssignedDriver.FullName));
            AddIfPresent(details, T(locale, "order.driverPhone"), order.AssignedDriver.Phone);
            AddIfPresent(details, T(locale, "order.driverEmail"), order.AssignedDriver.Email);
        }
        if (model.Kind is OrderEmailKind.Confirmed or OrderEmailKind.EnRoute && order.EstimatedDurationMinutes > 0)
            details.Add((T(locale, "order.estimatedDuration"),
                string.Format(culture, T(locale, "order.approxDuration"), order.EstimatedDurationMinutes)));

        List<EmailAttachment> attachments = [];
        if (model.Kind == OrderEmailKind.Delivered)
        {
            var proof = order.ProofOfDelivery ?? throw new InvalidOperationException("A delivery email requires proof of delivery.");
            details.Add((T(locale, "order.recipient"), proof.RecipientName));
            details.Add((T(locale, "order.deliveredAt"), Date(proof.DeliveredAt, locale)));
            if (!driver)
            {
                var certificate = Document(locale, T(locale, "order.certificate"), $"#{order.Id}",
                    Details(details) + $"<p>{E(T(locale, "order.certificateBody"))}</p>");
                attachments.Add(Attachment(
                    string.Format(CultureInfo.InvariantCulture, T(locale, "order.certificateFilename"), order.Id),
                    certificate));
            }
        }

        var inaccessibleDriverJob = driver &&
            model.Kind is OrderEmailKind.AssignmentRemoved or OrderEmailKind.Cancelled;
        var url = driver
            ? Link(inaccessibleDriverJob ? "/driver" : $"/driver/jobs/{order.Id}")
            : order.Client.UserId.HasValue ? Link($"/client/orders/{order.Id}") : null;
        var note = model.Kind == OrderEmailKind.Cancelled
            ? T(locale, "order.cancelNote")
            : T(locale, "order.note");
        if (driver) note = T(locale, "order.driverNote");
        return Build(locale, $"soFlott · {heading} · #{order.Id}", heading,
            driver ? T(locale, "order.driver") : order.Client.ContactPerson, intro, details, url,
            driver ? T(locale, "order.driverAction") : T(locale, "order.view"), note, attachments);
    }

    private EmailContent InvoiceUpdate(InvoiceEmail model, string locale)
    {
        var invoice = model.Invoice;
        var client = invoice.Client;
        var (heading, intro) = model.Kind switch
        {
            InvoiceEmailKind.Issued => (T(locale, "invoice.heading"), T(locale, "invoice.issuedIntro")),
            InvoiceEmailKind.Sent => (T(locale, "invoice.heading"), T(locale, "invoice.sentIntro")),
            InvoiceEmailKind.Paid => (T(locale, "invoice.paidHeading"), T(locale, "invoice.paidIntro")),
            InvoiceEmailKind.Overdue => (T(locale, "invoice.overdueHeading"), T(locale, "invoice.overdueIntro")),
            _ => throw new ArgumentOutOfRangeException(nameof(model.Kind))
        };

        var culture = EmailTranslations.Culture(locale);
        List<(string Label, string Value)> details =
        [
            (T(locale, "invoice.number"), invoice.InvoiceNumber),
            (T(locale, "invoice.order"), $"#{invoice.OrderId}"),
            (T(locale, "invoice.date"), Date(invoice.IssuedAt, locale)),
            (T(locale, "invoice.due"), Date(invoice.DueDate, locale)),
            (T(locale, "order.net"), Money(invoice.NetTotal, locale)),
            (string.Format(culture, T(locale, "invoice.vatRate"),
                (invoice.VatRate * 100).ToString("0.##", culture)), Money(invoice.VatTotal, locale)),
            (T(locale, "order.total"), Money(invoice.GrossTotal, locale)),
            (T(locale, "order.payment"), Payment(invoice.PaymentMethod, locale))
        ];
        if (invoice.PaidAt.HasValue)
            details.Add((T(locale, "invoice.paidAt"), Date(invoice.PaidAt.Value, locale)));

        var instructions = model.Kind == InvoiceEmailKind.Paid
            ? T(locale, "invoice.noFurtherPayment")
            : invoice.PaymentMethod == PaymentMethod.BankTransfer
                ? string.Format(culture, T(locale, "invoice.bankInstructions"), invoice.InvoiceNumber,
                    seller.Iban, seller.Bic, seller.BankName)
                : string.Format(culture, T(locale, "invoice.paypalInstructions"),
                    seller.PayPalHandle, invoice.InvoiceNumber);

        List<EmailAttachment> attachments = [];
        if (model.Kind is InvoiceEmailKind.Issued or InvoiceEmailKind.Sent)
        {
            var document = Document(locale, T(locale, "invoice.document"), invoice.InvoiceNumber,
                $"<h2>{E(T(locale, "invoice.issuer"))}</h2>{Address(seller.CompanyName, seller.Street, seller.PostalCode, seller.City, seller.Country)}" +
                $"<p>{E(T(locale, "invoice.taxId"))}: {E(seller.TaxIdNumber)}<br>{E(seller.Email)} · {E(seller.Phone)}</p>" +
                $"<h2>{E(T(locale, "invoice.recipient"))}</h2>{Address(client.CompanyName, client.Street, client.PostalCode, client.City, client.Country)}" +
                $"<p>{E(T(locale, "invoice.vatId"))}: {E(client.TaxIdNumber ?? "")}</p><h2>{E(T(locale, "invoice.service"))}</h2>" +
                Details(
                [
                    (T(locale, "order.pickup"), invoice.Order.PickupAddress),
                    (T(locale, "order.dropoff"), invoice.Order.DropoffAddress),
                    (T(locale, "invoice.serviceDate"),
                        invoice.Order.DeliveredAt.HasValue
                            ? Date(invoice.Order.DeliveredAt.Value, locale)
                            : T(locale, "invoice.notCompleted")),
                    (T(locale, "invoice.reference"), invoice.Order.ExternalReference ?? "")
                ]) + Details(details) + $"<p>{E(instructions)}</p>");
            // IDs, not user-controlled invoice numbers, determine the attachment filename.
            attachments.Add(Attachment(
                string.Format(CultureInfo.InvariantCulture, T(locale, "invoice.filename"), invoice.OrderId), document));
        }

        return Build(locale, $"soFlott · {heading} · {invoice.InvoiceNumber}", heading, client.ContactPerson, intro,
            details, client.UserId.HasValue ? Link($"/client/orders/{invoice.OrderId}/invoice") : null,
            T(locale, "invoice.action"), instructions, attachments);
    }

    private EmailContent Build(string locale, string subject, string heading, string name, string intro,
        IReadOnlyList<(string Label, string Value)> details, string? url, string? action, string note,
        IReadOnlyList<EmailAttachment>? attachments = null)
    {
        var button = url is null ? "" :
            $"<p style=\"margin:28px 0\"><a href=\"{E(url)}\" style=\"background:#f97316;color:#111827;text-decoration:none;padding:14px 22px;border-radius:8px;font-weight:bold;display:inline-block\">{E(action ?? "")}</a></p>";
        var html = $$"""
            <!doctype html><html lang="{{EmailTranslations.Language(locale)}}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{{E(heading)}}</title></head>
            <body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
            <div style="display:none;max-height:0;overflow:hidden">{{E(intro)}}</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 12px">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#fff;border-radius:12px;overflow:hidden">
            <tr><td>{{EmailBranding.Header(options.FrontendBaseUrl, locale)}}</td></tr>
            <tr><td style="padding:32px"><p style="color:#ea580c;font-size:12px;letter-spacing:2px;text-transform:uppercase">{{E(T(locale, "brand.transaction"))}}</p>
            <h1 style="font-size:26px;line-height:1.25">{{E(heading)}}</h1><p>{{E(T(locale, "greeting"))}} {{E(name)}},</p>
            <p style="line-height:1.7">{{E(intro)}}</p>{{Details(details)}}{{button}}<p style="font-size:14px;line-height:1.6;color:#4b5563">{{E(note)}}</p>
            <p style="line-height:1.6">{{E(T(locale, "closing"))}}<br><strong>{{E(T(locale, "team"))}}</strong></p></td></tr>
            <tr><td style="padding:24px 32px;background:#f9fafb;font-size:12px;line-height:1.7;color:#6b7280">
            {{E(seller.CompanyName)}}<br>{{E($"{seller.Street}, {seller.PostalCode} {seller.City}, {seller.Country}")}}<br>
            {{E(T(locale, "brand.contact"))}} {{E(string.IsNullOrWhiteSpace(options.ReplyTo) ? seller.Email : options.ReplyTo)}} · {{E(seller.Phone)}}<br>
            {{E(T(locale, "brand.noAdvertising"))}}</td></tr></table></td></tr></table></body></html>
            """;
        var text = $"soFlott · {EmailBranding.Tagline(locale)}\n\n{heading}\n\n{T(locale, "greeting")} {name},\n\n{intro}\n\n" +
            string.Join("\n", details.Select(item => $"{item.Label}: {item.Value}")) +
            (url is null ? "" : $"\n\n{action}: {url}") +
            $"\n\n{note}\n\n{T(locale, "closing")}\n{T(locale, "team")}\n{seller.CompanyName}\n{seller.Email} | {seller.Phone}";
        return new EmailContent(subject.Replace('\r', ' ').Replace('\n', ' '), html, text, attachments ?? []);
    }

    private static string Details(IReadOnlyList<(string Label, string Value)> details) =>
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" style=\"border-collapse:collapse;font-size:14px\">" +
        string.Join("", details.Select(item =>
            $"<tr><th scope=\"row\" align=\"left\" style=\"padding:12px 8px;border-bottom:1px solid #e5e7eb;color:#6b7280;width:35%\">{E(item.Label)}</th><td style=\"padding:12px 8px;border-bottom:1px solid #e5e7eb;white-space:pre-line\">{E(item.Value)}</td></tr>")) + "</table>";

    private string Document(string locale, string title, string reference, string body) => $$$"""
        <!doctype html><html lang="{{{EmailTranslations.Language(locale)}}}"><head><meta charset="utf-8"><title>{{{E(title)}}} {{{E(reference)}}}</title>
        <style>body{font-family:Arial,sans-serif;color:#111827;max-width:800px;margin:40px auto;padding:24px}h1{border-bottom:3px solid #f97316;padding-bottom:16px}table{margin:20px 0}p{line-height:1.6}@media print{body{margin:0;padding:0}}</style></head>
        <body>{{{EmailBranding.Header(options.FrontendBaseUrl, locale)}}}<h1>soFlott · {{{E(title)}}}</h1><p>{{{E(reference)}}}</p>{{{body}}}<footer><p>{{{E(seller.CompanyName)}}} · {{{E(seller.Email)}}} · {{{E(seller.Phone)}}}</p></footer></body></html>
        """;

    private static string Address(string company, string street, string postalCode, string city, string country) =>
        $"<p>{E(company)}<br>{E(street)}<br>{E($"{postalCode} {city}")}<br>{E(country)}</p>";
    private string Link(string path) => options.FrontendBaseUrl.TrimEnd('/') + path;
    private static string E(string value) => WebUtility.HtmlEncode(value);
    private static string T(string locale, string key) => EmailTranslations.Get(locale, key);
    private static string Money(decimal value, string locale) => value.ToString("C", EmailTranslations.Culture(locale));
    private static string Date(DateTimeOffset value, string locale) =>
        BusinessTime.ToLocal(value).ToString(
            EmailTranslations.Normalize(locale) == "en" ? "dd/MM/yyyy HH:mm zzz" : "dd.MM.yyyy HH:mm zzz",
            EmailTranslations.Culture(locale)) + $" ({BusinessTime.ZoneId})";
    private static string Payment(PaymentMethod method, string locale) => method switch
    {
        PaymentMethod.BankTransfer => T(locale, "payment.bank"),
        PaymentMethod.PayPal => T(locale, "payment.paypal"),
        _ => throw new ArgumentOutOfRangeException(nameof(method))
    };
    private static string Cargo(CargoCategory category, string locale) => category switch
    {
        CargoCategory.Document => T(locale, "cargo.document"),
        CargoCategory.SmallBox => T(locale, "cargo.smallBox"),
        CargoCategory.AutoPart => T(locale, "cargo.autoPart"),
        CargoCategory.Oversized => T(locale, "cargo.oversized"),
        _ => throw new ArgumentOutOfRangeException(nameof(category))
    };
    private static void AddIfPresent(List<(string Label, string Value)> details, string label, string? value)
    {
        if (!string.IsNullOrWhiteSpace(value)) details.Add((label, value));
    }
    private static EmailAttachment Attachment(string filename, string html) =>
        new(filename, Convert.ToBase64String(Encoding.UTF8.GetBytes(html)), "text/html");
}
