namespace soFlottOS.Api.Common;

/// <summary>
/// Role names as strings, so that [Authorize(Roles = Roles.Admin)] cannot be mistyped.
/// The values must match <see cref="Domain.UserRole"/>.
/// </summary>
public static class Roles
{
    public const string Admin = "Admin";

    public const string Client = "Client";

    public const string Driver = "Driver";

    /// <summary>Admins and clients may book and quote orders.</summary>
    public const string AdminOrClient = "Admin,Client";

    /// <summary>Everyone who can look at a single order.</summary>
    public const string AdminClientOrDriver = "Admin,Client,Driver";
}
