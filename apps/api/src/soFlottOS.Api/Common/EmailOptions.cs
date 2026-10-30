using System.Net.Mail;

namespace soFlottOS.Api.Common;

public sealed class EmailOptions
{
    public const string SectionName = "Email";
    public bool Enabled { get; set; }
    public string ApiKey { get; set; } = string.Empty;
    public string From { get; set; } = string.Empty;
    public string ReplyTo { get; set; } = string.Empty;
    public string FrontendBaseUrl { get; set; } = "http://localhost:3000";
    public int PollingIntervalSeconds { get; set; } = 15;
    public int ProcessingBatchSize { get; set; } = 20;
    public int MaxAttempts { get; set; } = 5;
    public int RetryBaseSeconds { get; set; } = 30;
    public int TimeoutSeconds { get; set; } = 15;

    public void Validate()
    {
        if (!Uri.TryCreate(FrontendBaseUrl, UriKind.Absolute, out var uri) ||
            uri.Scheme is not ("http" or "https") || uri.UserInfo.Length > 0 ||
            uri.Query.Length > 0 || uri.Fragment.Length > 0)
            throw new InvalidOperationException("Email:FrontendBaseUrl must be an absolute HTTP(S) URL without credentials, query or fragment.");

        if (PollingIntervalSeconds is < 1 or > 3600 || ProcessingBatchSize is < 1 or > 100 ||
            MaxAttempts is < 1 or > 10 || RetryBaseSeconds is < 1 or > 3600 ||
            TimeoutSeconds is < 1 or > 60)
            throw new InvalidOperationException("Email polling, batch, retry and timeout settings are outside their supported ranges.");

        if (Enabled && (string.IsNullOrWhiteSpace(ApiKey) || !IsMailbox(From)))
            throw new InvalidOperationException("Enabled email requires Email:ApiKey and a valid Email:From address.");
        if (!string.IsNullOrWhiteSpace(ReplyTo) && !IsMailbox(ReplyTo))
            throw new InvalidOperationException("Email:ReplyTo must be a valid email address.");
    }

    public void ValidateInvoicing(InvoicingOptions seller)
    {
        if (!Enabled) return;
        if (new[] { seller.CompanyName, seller.Street, seller.City, seller.PostalCode, seller.Country, seller.TaxIdNumber }
            .Any(string.IsNullOrWhiteSpace) || !IsMailbox(seller.Email))
            throw new InvalidOperationException("Enabled email requires complete Invoicing seller identity, address, tax ID and contact email.");
        if (new[] { seller.Iban, seller.Bic, seller.BankName, seller.PayPalHandle }.Any(string.IsNullOrWhiteSpace))
            throw new InvalidOperationException("Enabled email requires Invoicing bank details and PayPalHandle for the supported payment methods.");
    }

    internal static bool IsMailbox(string value) =>
        !string.IsNullOrWhiteSpace(value) && !value.Contains('\r') && !value.Contains('\n') &&
        MailAddress.TryCreate(value, out var address) && address.Host.Contains('.');
}
