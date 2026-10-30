namespace soFlottOS.Api.Common;

public sealed class MessageLocale(IHttpContextAccessor accessor)
{
    public const string HeaderName = "X-App-Locale";
    public string? Selected => accessor.HttpContext?.Request.Headers[HeaderName].ToString() switch
    {
        "en" => "en",
        "de" => "de",
        _ => null
    };
    public string Current => Selected ?? "de";
}
