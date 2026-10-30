namespace soFlottOS.Api.Common;

// ---------------------------------------------------------------------------
// Strongly typed settings. Each class maps to one section of appsettings.json
// and is registered in Program.cs. Validate() runs at startup so a misconfigured
// deployment fails immediately instead of at the first request.
// ---------------------------------------------------------------------------

/// <summary>"Jwt" section - how access tokens are signed and how long they live.</summary>
public sealed class JwtOptions
{
    public const string SectionName = "Jwt";

    public string Issuer { get; set; } = string.Empty;

    public string Audience { get; set; } = string.Empty;

    public string SigningKey { get; set; } = string.Empty;

    public int ExpirationMinutes { get; set; } = 120;

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Issuer) || string.IsNullOrWhiteSpace(Audience))
        {
            throw new InvalidOperationException("Jwt:Issuer and Jwt:Audience are required.");
        }

        if (SigningKey.Length < 32)
        {
            throw new InvalidOperationException("Jwt:SigningKey must be at least 32 characters long.");
        }

        if (ExpirationMinutes <= 0)
        {
            throw new InvalidOperationException("Jwt:ExpirationMinutes must be greater than zero.");
        }
    }
}

/// <summary>"Pricing" section - the price list used by PricingService.</summary>
public sealed class PricingOptions
{
    public const string SectionName = "Pricing";

    /// <summary>Fixed fee charged on every job.</summary>
    public decimal BaseFee { get; set; } = 19.50m;

    public decimal RatePerKilometer { get; set; } = 1.35m;

    /// <summary>German MwSt, 0.19 = 19%.</summary>
    public decimal VatRate { get; set; } = 0.19m;

    /// <summary>No job is ever cheaper than this net amount.</summary>
    public decimal MinimumCharge { get; set; } = 25.00m;

    public void Validate()
    {
        if (BaseFee <= 0 || RatePerKilometer <= 0 || MinimumCharge <= 0)
        {
            throw new InvalidOperationException("Pricing values must be greater than zero.");
        }

        if (VatRate is <= 0 or >= 1)
        {
            throw new InvalidOperationException("Pricing:VatRate must be between 0 and 1 (0.19 = 19%).");
        }
    }
}

/// <summary>Which distance provider RoutingService uses.</summary>
public enum RoutingProvider
{
    /// <summary>Straight-line distance, no external call. Good enough for local development.</summary>
    GeoDistance = 1,

    /// <summary>Real driving distance from openrouteservice.org (needs an API key).</summary>
    OpenRouteService = 2
}

/// <summary>"Routing" section - how distances between two points are calculated.</summary>
public sealed class RoutingOptions
{
    public const string SectionName = "Routing";

    public RoutingProvider Provider { get; set; } = RoutingProvider.GeoDistance;

    public string BaseUrl { get; set; } = "https://api.openrouteservice.org";

    public string? ApiKey { get; set; }

    /// <summary>Key-less OpenStreetMap geocoder used when no OpenRouteService key is configured.</summary>
    public string GeocodingUrl { get; set; } = "https://nominatim.openstreetmap.org";

    /// <summary>ISO-3166 alpha-2 country the address lookup is biased towards.</summary>
    public string CountryCode { get; set; } = "DE";

    /// <summary>Identifies this deployment to Nominatim, which rejects anonymous traffic.</summary>
    public string UserAgent { get; set; } = "soFlottOS/1.0 (dispatch@soflott.de)";

    /// <summary>Used to estimate a duration when no provider duration is available.</summary>
    public decimal AverageSpeedKph { get; set; } = 55m;

    public int TimeoutSeconds { get; set; } = 15;

    /// <summary>Addresses are resolved by OpenRouteService only when it can be authenticated.</summary>
    public bool UseOpenRouteServiceGeocoding =>
        Provider == RoutingProvider.OpenRouteService && !string.IsNullOrWhiteSpace(ApiKey);

    public void Validate()
    {
        if (!Uri.IsWellFormedUriString(BaseUrl, UriKind.Absolute))
        {
            throw new InvalidOperationException("Routing:BaseUrl must be an absolute URL.");
        }

        if (!Uri.IsWellFormedUriString(GeocodingUrl, UriKind.Absolute))
        {
            throw new InvalidOperationException("Routing:GeocodingUrl must be an absolute URL.");
        }

        if (CountryCode.Length != 2)
        {
            throw new InvalidOperationException("Routing:CountryCode must be a two letter ISO-3166 code, for example 'DE'.");
        }

        if (string.IsNullOrWhiteSpace(UserAgent))
        {
            throw new InvalidOperationException("Routing:UserAgent is required so the address lookup identifies itself.");
        }

        if (AverageSpeedKph <= 0 || TimeoutSeconds <= 0)
        {
            throw new InvalidOperationException("Routing:AverageSpeedKph and Routing:TimeoutSeconds must be greater than zero.");
        }

        if (Provider == RoutingProvider.OpenRouteService && string.IsNullOrWhiteSpace(ApiKey))
        {
            throw new InvalidOperationException("Routing:ApiKey is required when Routing:Provider is OpenRouteService.");
        }
    }
}

/// <summary>Which SMS provider the notification worker uses.</summary>
public enum NotificationProvider
{
    /// <summary>Messages are queued and logged but never sent (default for development).</summary>
    None = 1,

    Twilio = 2
}

/// <summary>"Notifications" section - outbound SMS/WhatsApp delivery.</summary>
public sealed class NotificationOptions
{
    public const string SectionName = "Notifications";

    public NotificationProvider Provider { get; set; } = NotificationProvider.None;

    public string BaseUrl { get; set; } = "https://api.twilio.com";

    public string? AccountSid { get; set; }

    public string? AuthToken { get; set; }

    public string? FromNumber { get; set; }

    public int ProcessingBatchSize { get; set; } = 20;

    public int PollingIntervalSeconds { get; set; } = 15;

    public void Validate()
    {
        if (!Uri.IsWellFormedUriString(BaseUrl, UriKind.Absolute))
        {
            throw new InvalidOperationException("Notifications:BaseUrl must be an absolute URL.");
        }

        if (ProcessingBatchSize <= 0 || PollingIntervalSeconds <= 0)
        {
            throw new InvalidOperationException("Notification batch size and polling interval must be greater than zero.");
        }

        if (Provider == NotificationProvider.Twilio &&
            (string.IsNullOrWhiteSpace(AccountSid) || string.IsNullOrWhiteSpace(AuthToken) || string.IsNullOrWhiteSpace(FromNumber)))
        {
            throw new InvalidOperationException("Twilio needs AccountSid, AuthToken and FromNumber.");
        }
    }
}

/// <summary>
/// "Invoicing" section - the legally required seller details that are printed on every
/// German invoice, plus numbering and payment terms.
/// </summary>
public sealed class InvoicingOptions
{
    public const string SectionName = "Invoicing";

    /// <summary>Invoice numbers look like {Prefix}-{year}-{sequence}.</summary>
    public string Prefix { get; set; } = "SOFLOTT";

    public int StartingSequence { get; set; } = 1000;

    public int PaymentTermsDays { get; set; } = 14;

    // --- Seller (your UG) details required on a German Rechnung ------------

    public string CompanyName { get; set; } = "soFlott UG (haftungsbeschränkt)";

    public string Street { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string PostalCode { get; set; } = string.Empty;

    public string Country { get; set; } = "Germany";

    /// <summary>Steuernummer or USt-IdNr.</summary>
    public string TaxIdNumber { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string? Iban { get; set; }

    public string? Bic { get; set; }

    public string? BankName { get; set; }

    public string? PayPalHandle { get; set; }

    public void Validate()
    {
        if (string.IsNullOrWhiteSpace(Prefix))
        {
            throw new InvalidOperationException("Invoicing:Prefix is required.");
        }

        if (StartingSequence <= 0 || PaymentTermsDays <= 0)
        {
            throw new InvalidOperationException("Invoicing:StartingSequence and Invoicing:PaymentTermsDays must be greater than zero.");
        }
    }
}

/// <summary>"Database" section - startup behaviour of EF Core.</summary>
public sealed class DatabaseOptions
{
    public const string SectionName = "Database";

    /// <summary>Apply pending EF Core migrations when the API starts.</summary>
    public bool ApplyMigrationsOnStartup { get; set; } = true;
}

/// <summary>"Seed" section - demo accounts created in development only.</summary>
public sealed class SeedOptions
{
    public const string SectionName = "Seed";

    public bool Enabled { get; set; }

    public string DefaultPassword { get; set; } = string.Empty;

    public void Validate()
    {
        if (Enabled && !Services.Security.PasswordPolicy.IsValid(DefaultPassword))
        {
            throw new InvalidOperationException($"Seed:DefaultPassword: {Services.Security.PasswordPolicy.Message}");
        }
    }
}
