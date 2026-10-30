using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services.Security;

public sealed class PasswordResetService(
    AppDbContext dbContext, IPasswordHasher passwordHasher, PasswordResetEmailOutbox emails,
    EmailOptions options, TimeProvider clock)
{
    public static readonly TimeSpan TokenLifetime = TimeSpan.FromMinutes(30);

    public async Task ForgotAsync(ForgotPasswordRequest request, CancellationToken cancellationToken = default)
    {
        if (request.Locale is not ("en" or "de"))
            throw new ValidationException("Locale", "Use en or de.");
        // Fail identically for every address when recovery cannot send email.
        if (!options.Enabled)
            throw new ExternalServiceException("Password recovery is currently unavailable.");

        var email = request.Email.Trim().ToLowerInvariant();
        var user = await dbContext.Users.SingleOrDefaultAsync(u => u.Email == email, cancellationToken);
        if (user is null) return;

        var token = Convert.ToHexString(RandomNumberGenerator.GetBytes(32));
        user.PasswordResetTokenHash = HashToken(token);
        user.PasswordResetExpiresAt = clock.GetUtcNow().Add(TokenLifetime);
        emails.Stage(user, token, request.Locale);
        // The token and its encrypted transactional email commit together.
        await dbContext.SaveChangesAsync(cancellationToken);
    }

    public async Task ResetAsync(ResetPasswordRequest request, CancellationToken cancellationToken = default)
    {
        PasswordPolicy.Validate(request.Password);
        if (request.Token is not { Length: 64 } ||
            !request.Token.All(c => c is >= 'A' and <= 'F' or >= '0' and <= '9'))
            throw InvalidToken();

        var tokenHash = HashToken(request.Token);
        var passwordHash = passwordHasher.Hash(request.Password);
        var now = clock.GetUtcNow();
        // One conditional write consumes the token even with simultaneous reset attempts.
        var changed = await dbContext.Users
            .Where(u => u.PasswordResetTokenHash == tokenHash && u.PasswordResetExpiresAt > now)
            .ExecuteUpdateAsync(update => update
                .SetProperty(u => u.PasswordHash, passwordHash)
                .SetProperty(u => u.PasswordResetTokenHash, (string?)null)
                .SetProperty(u => u.PasswordResetExpiresAt, (DateTimeOffset?)null)
                .SetProperty(u => u.PasswordVersion, u => u.PasswordVersion + 1)
                .SetProperty(u => u.UpdatedAt, now), cancellationToken);
        if (changed != 1) throw InvalidToken();
    }

    internal static string HashToken(string token) => Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(token)));
    private static ValidationException InvalidToken() => new("Token", "This password reset link is invalid or expired.");
}
