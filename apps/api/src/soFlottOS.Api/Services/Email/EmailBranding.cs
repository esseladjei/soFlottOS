using System.Net;

namespace soFlottOS.Api.Services.Email;

internal static class EmailBranding
{
    public static string Tagline(string locale) => EmailTranslations.Get(locale, "brand.tagline");

    public static string Header(string frontendBaseUrl, string locale) => $"""
        <div style="padding:24px 32px;background:#fff;border-bottom:3px solid #f97316">
        <img src="{WebUtility.HtmlEncode(frontendBaseUrl.TrimEnd('/') + "/logo/soFlott_arrow_nav.png")}" alt="soFlott" width="160" height="98" style="display:block;width:160px;max-width:100%;height:auto;border:0">
        <p lang="{EmailTranslations.Language(locale)}" style="margin:12px 0 0;color:#ea580c;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.5;font-weight:bold">{WebUtility.HtmlEncode(Tagline(locale))}</p>
        </div>
        """;
}
