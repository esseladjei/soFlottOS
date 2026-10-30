using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Security;

/// <summary>A signed access token and the moment it expires.</summary>
public sealed record AccessToken(string Token, DateTimeOffset ExpiresAtUtc);

public interface ITokenService
{
    AccessToken CreateToken(User user);
}

/// <summary>
/// Creates the JWT the frontend sends back on every request.
/// The token carries the user id, email and role, so [Authorize(Roles = ...)]
/// can protect endpoints. Password version is checked against the account so
/// resetting a password revokes previously issued sessions.
/// </summary>
public sealed class JwtTokenService(JwtOptions options) : ITokenService
{
    private readonly JwtOptions _options = options;

    public AccessToken CreateToken(User user)
    {
        var expiresAt = DateTimeOffset.UtcNow.AddMinutes(_options.ExpirationMinutes);

        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.Name, user.FullName),
            new(ClaimTypes.Role, user.Role.ToString()),
            new(AccountSessionValidator.PasswordVersionClaim, user.PasswordVersion.ToString()),

            // Unique token id - useful when you later add token revocation.
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString("N"))
        };

        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_options.SigningKey));
        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256));

        return new AccessToken(new JwtSecurityTokenHandler().WriteToken(token), expiresAt);
    }
}
