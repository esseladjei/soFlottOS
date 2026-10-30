using System.Security.Claims;
using soFlottOS.Api.Domain;

namespace soFlottOS.Api.Common;

/// <summary>
/// The signed-in caller, extracted from the JWT. Services receive this instead of
/// HttpContext so that business rules ("a client may only see their own orders")
/// stay testable and free of web framework types.
/// </summary>
public sealed record CurrentUser(int UserId, UserRole Role, string Email)
{
    public bool IsAdmin => Role == UserRole.Admin;

    public bool IsClient => Role == UserRole.Client;

    public bool IsDriver => Role == UserRole.Driver;
}

/// <summary>Helper that turns the JWT claims of a request into a <see cref="CurrentUser"/>.</summary>
public static class ClaimsPrincipalExtensions
{
    public static CurrentUser GetCurrentUser(this ClaimsPrincipal principal)
    {
        var rawUserId = principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue("sub")
            ?? throw new UnauthorizedException("The access token does not contain a user id.");

        if (!int.TryParse(rawUserId, out var userId))
        {
            throw new UnauthorizedException("The access token contains an invalid user id.");
        }

        var rawRole = principal.FindFirstValue(ClaimTypes.Role)
            ?? throw new UnauthorizedException("The access token does not contain a role.");

        if (!Enum.TryParse<UserRole>(rawRole, ignoreCase: true, out var role))
        {
            throw new UnauthorizedException("The access token contains an unknown role.");
        }

        return new CurrentUser(userId, role, principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty);
    }
}
