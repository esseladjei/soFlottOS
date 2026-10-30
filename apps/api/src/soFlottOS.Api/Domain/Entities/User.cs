namespace soFlottOS.Api.Domain.Entities;

/// <summary>
/// A login account. One table for all three roles (Admin / Client / Driver);
/// the <see cref="Role"/> property decides what the account may do.
/// Driver specific columns are only filled when Role == Driver.
/// </summary>
public sealed class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;

    /// <summary>BCrypt hash - plain passwords are never stored.</summary>
    public string PasswordHash { get; set; } = string.Empty;

    public string? PasswordResetTokenHash { get; set; }

    public DateTimeOffset? PasswordResetExpiresAt { get; set; }

    public int PasswordVersion { get; set; }

    public string PreferredLocale { get; set; } = "de";

    public string FullName { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public string? Phone { get; set; }

    // --- Driver-only fields -------------------------------------------------

    /// <summary>E.g. "VW Caddy - A-VE 123". Only used for drivers.</summary>
    public string? VehicleDescription { get; set; }

    /// <summary>Offline/Online/Busy. Only meaningful for drivers.</summary>
    public DriverAvailability Availability { get; set; } = DriverAvailability.Offline;

    // --- Navigation properties (relationships) ------------------------------

    /// <summary>The CRM profile when this account is a business client.</summary>
    public Client? Client { get; set; }

    /// <summary>Orders this user drives (only for drivers).</summary>
    public ICollection<Order> AssignedOrders { get; } = new List<Order>();
}
