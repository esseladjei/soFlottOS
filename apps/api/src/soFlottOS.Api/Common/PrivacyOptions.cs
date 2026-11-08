namespace soFlottOS.Api.Common;

/// <summary>
/// "Privacy" section - GDPR retention periods and where new data-subject requests are announced.
/// Consent evidence and finished requests are deleted automatically once these periods pass
/// (see Services/DataRetentionService).
/// </summary>
public sealed class PrivacyOptions
{
    public const string SectionName = "Privacy";

    /// <summary>How long a cookie-consent decision is kept as proof. 1095 days = 3 years (German limitation period).</summary>
    public int ConsentEvidenceRetentionDays { get; set; } = 1095;

    /// <summary>How long a Completed/Rejected privacy request is kept after it was finished.</summary>
    public int CompletedRequestRetentionDays { get; set; } = 1095;

    /// <summary>Internal inbox that is told about every new privacy request.</summary>
    public string NotificationEmail { get; set; } = "info@soflott.de";

    /// <summary>How often the retention sweep runs.</summary>
    public int RetentionSweepIntervalHours { get; set; } = 24;

    public void Validate()
    {
        if (ConsentEvidenceRetentionDays is < 1 or > 3650 || CompletedRequestRetentionDays is < 1 or > 3650)
        {
            throw new InvalidOperationException(
                "Privacy retention periods must be between 1 and 3650 days.");
        }

        if (RetentionSweepIntervalHours is < 1 or > 168)
        {
            throw new InvalidOperationException("Privacy:RetentionSweepIntervalHours must be between 1 and 168.");
        }

        if (!EmailOptions.IsMailbox(NotificationEmail))
        {
            throw new InvalidOperationException("Privacy:NotificationEmail must be a valid email address.");
        }
    }
}
