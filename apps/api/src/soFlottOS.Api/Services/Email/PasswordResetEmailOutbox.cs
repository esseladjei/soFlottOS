using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.DataProtection;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Email;

public sealed class PasswordResetEmailOutbox(
    AppDbContext dbContext, EmailOptions options, IDataProtectionProvider protection)
{
    public const string EventType = "password_reset";
    private const string Purpose = "soFlottOS.PasswordResetEmail.v1";

    public void Stage(User user, string token, string locale)
    {
        if (!options.Enabled)
            throw new InvalidOperationException("Password recovery requires transactional email.");
        if (!EmailOptions.IsMailbox(user.Email))
            throw new ValidationException("Email", "The account must have a valid email address.");

        var url = $"{options.FrontendBaseUrl.TrimEnd('/')}/reset-password#token={token}";
        var content = Render(user.FullName, url, locale, options.FrontendBaseUrl);
        dbContext.EmailMessages.Add(new EmailMessage
        {
            EventType = EventType,
            Recipient = user.Email,
            ContentJson = protection.CreateProtector(Purpose).Protect(JsonSerializer.Serialize(content))
        });
    }

    internal static string Unprotect(IDataProtectionProvider protection, string payload) =>
        protection.CreateProtector(Purpose).Unprotect(payload);

    internal static EmailContent Render(string name, string url, string locale, string frontendBaseUrl)
    {
        var english = EmailTranslations.Normalize(locale) == "en";
        var heading = english ? "Reset your password" : "Passwort zurücksetzen";
        var greeting = english ? $"Hello {name}," : $"Hallo {name},";
        var intro = english
            ? "A password reset was requested for your soFlott account. This link is valid for 30 minutes and can be used once."
            : "Für Ihr soFlott-Konto wurde ein neues Passwort angefordert. Dieser Link ist 30 Minuten gültig und kann einmal verwendet werden.";
        var note = english
            ? "If you did not request this, ignore this email. Your password has not changed. We never ask for your password by email."
            : "Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail. Ihr Passwort wurde nicht geändert. Wir fragen niemals per E-Mail nach Ihrem Passwort.";
        static string E(string value) => WebUtility.HtmlEncode(value);
        var html = $"""
            <!doctype html><html lang="{(english ? "en" : "de")}"><head><meta charset="utf-8"><title>{E(heading)}</title></head>
            <body style="margin:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif;color:#1f2937">
            <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden">
            {EmailBranding.Header(frontendBaseUrl, locale)}
            <div style="padding:32px"><h1>{E(heading)}</h1><p>{E(greeting)}</p><p>{E(intro)}</p>
            <p><a href="{E(url)}">{E(heading)}</a></p><p>{E(note)}</p></div></div></body></html>
            """;
        return new EmailContent($"soFlott · {heading}", html,
            $"soFlott · {EmailBranding.Tagline(locale)}\n\n{greeting}\n\n{intro}\n\n{heading}: {url}\n\n{note}", []);
    }
}
