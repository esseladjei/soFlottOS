using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Data;
using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services.Security;

public sealed class AccountSessionValidator(AppDbContext dbContext, MessageLocale? locale = null)
{
    public const string PasswordVersionClaim = "password_version";

    public async Task<bool> IsCurrentAsync(ClaimsPrincipal principal, CancellationToken cancellationToken = default)
    {
        if (!int.TryParse(principal.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            return false;
        // Tokens issued before password recovery was introduced have version zero.
        var claim = principal.FindFirstValue(PasswordVersionClaim);
        if (!int.TryParse(claim ?? "0", out var version) || version < 0)
            return false;
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Id == userId && u.PasswordVersion == version, cancellationToken);
        if (user is null) return false;
        if (locale?.Selected is { } selected && user.PreferredLocale != selected)
        {
            user.PreferredLocale = selected;
            await dbContext.SaveChangesAsync(cancellationToken);
        }
        return true;
    }
}
