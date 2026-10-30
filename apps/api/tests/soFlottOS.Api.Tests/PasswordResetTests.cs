using System.IdentityModel.Tokens.Jwt;
using System.Diagnostics;
using System.Security.Claims;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using soFlottOS.Api.Common;
using soFlottOS.Api.Controllers;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Email;
using soFlottOS.Api.Services.Security;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

public sealed class PasswordResetTests
{
    private readonly IDataProtectionProvider _protection = new EphemeralDataProtectionProvider();
    private readonly FixedEmailClock _clock = new(new DateTimeOffset(2026, 10, 9, 9, 0, 0, TimeSpan.Zero));
    private const string OldPassword = "OldPassword123!";
    private const string NewPassword = "NewPassword123!";

    private PasswordResetService Service(AppDbContext context, EmailOptions? options = null) =>
        new(context, new BCryptPasswordHasher(),
            new PasswordResetEmailOutbox(context, options ?? EmailSamples.Options(), _protection),
            options ?? EmailSamples.Options(), _clock);

    private static async Task<User> AddUserAsync(AppDbContext context, UserRole role = UserRole.Client)
    {
        var user = new User
        {
            Email = "account@example.com", FullName = "<Anna & Max>", Role = role,
            PasswordHash = new BCryptPasswordHasher().Hash(OldPassword)
        };
        context.Users.Add(user);
        await context.SaveChangesAsync();
        return user;
    }

    private async Task<string> IssueAsync(AppDbContext context, string locale = "en")
    {
        await Service(context).ForgotAsync(new ForgotPasswordRequest { Email = " ACCOUNT@Example.com ", Locale = locale });
        var message = await context.EmailMessages.AsNoTracking().OrderByDescending(e => e.Id).FirstAsync();
        var content = JsonSerializer.Deserialize<EmailContent>(PasswordResetEmailOutbox.Unprotect(_protection, message.ContentJson))!;
        return Regex.Match(content.Text, "#token=([A-F0-9]{64})").Groups[1].Value;
    }

    [Theory]
    [InlineData("de", "Wenn morgen zu spät ist.", "When tomorrow is too late.")]
    [InlineData("en", "When tomorrow is too late.", "Wenn morgen zu spät ist.")]
    public async Task ResetEmailIncludesLogoAndLocalizedBrandTagline(string locale, string tagline, string otherTagline)
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        await IssueAsync(database.Context, locale);
        var message = await database.Context.EmailMessages.AsNoTracking().SingleAsync();
        var email = JsonSerializer.Deserialize<EmailContent>(
            PasswordResetEmailOutbox.Unprotect(_protection, message.ContentJson))!;

        Assert.Contains("src=\"https://app.example.com/logo/soFlott_arrow_nav.png\"", email.Html);
        Assert.Contains("alt=\"soFlott\"", email.Html);
        Assert.Contains(System.Net.WebUtility.HtmlEncode(tagline), email.Html);
        Assert.Contains(tagline, email.Text);
        Assert.DoesNotContain(System.Net.WebUtility.HtmlEncode(otherTagline), email.Html);
        Assert.DoesNotContain(otherTagline, email.Text);
        Assert.Contains($"<p lang=\"{locale}\"", email.Html);
        Assert.Contains($"<html lang=\"{locale}\"", email.Html);
        Assert.Contains("#token=", email.Text);
    }

    [Fact]
    public async Task ForgotControllerReturnsIdenticalEmptyResponsesWithMinimumTiming()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        var auth = new AuthService(new FakeUserRepository(), new FakeClientRepository(),
            new FakePasswordHasher(), new FakeTokenService(), new FakeEmailCommunications());
        var controller = new AuthController(auth, Service(database.Context));
        foreach (var email in new[] { "account@example.com", "unknown@example.com" })
        {
            var started = Stopwatch.GetTimestamp();
            var response = await controller.ForgotPassword(new ForgotPasswordRequest { Email = email }, default);
            Assert.IsType<NoContentResult>(response);
            Assert.True(Stopwatch.GetElapsedTime(started) >= TimeSpan.FromMilliseconds(450));
        }
        Assert.Single(await database.Context.EmailMessages.ToListAsync());
    }

    [Theory]
    [InlineData(UserRole.Admin)]
    [InlineData(UserRole.Client)]
    [InlineData(UserRole.Driver)]
    public async Task RecoveryWorksForEveryRoleAndRevokesExistingSessions(UserRole role)
    {
        using var database = new EmailTestDatabase();
        var user = await AddUserAsync(database.Context, role);
        var token = await IssueAsync(database.Context);
        var stored = await database.Context.Users.AsNoTracking().SingleAsync();
        Assert.Equal(64, token.Length);
        Assert.NotEqual(token, stored.PasswordResetTokenHash);
        Assert.Equal(PasswordResetService.HashToken(token), stored.PasswordResetTokenHash);
        Assert.Equal(_clock.Now.AddMinutes(30), stored.PasswordResetExpiresAt);
        var email = await database.Context.EmailMessages.AsNoTracking().SingleAsync();
        Assert.DoesNotContain(token, email.ContentJson);
        Assert.DoesNotContain("Reset your password", email.ContentJson);
        Assert.Equal(user.Email, email.Recipient);

        using var resetContext = database.NewContext();
        var validator = new AccountSessionValidator(resetContext);
        Assert.True(await validator.IsCurrentAsync(Principal(user.Id)));
        await Service(resetContext).ResetAsync(new ResetPasswordRequest { Token = token, Password = NewPassword });
        stored = await resetContext.Users.AsNoTracking().SingleAsync();
        var hasher = new BCryptPasswordHasher();
        Assert.True(hasher.Verify(NewPassword, stored.PasswordHash));
        Assert.False(hasher.Verify(OldPassword, stored.PasswordHash));
        Assert.Null(stored.PasswordResetTokenHash);
        Assert.Null(stored.PasswordResetExpiresAt);
        Assert.Equal(1, stored.PasswordVersion);
        Assert.False(await validator.IsCurrentAsync(Principal(user.Id)));
        Assert.False(await validator.IsCurrentAsync(Principal(user.Id, "0")));
        Assert.True(await validator.IsCurrentAsync(Principal(user.Id, "1")));
        Assert.False(await validator.IsCurrentAsync(Principal(user.Id, "invalid")));
        Assert.Equal(role, stored.Role);
        Assert.Equal(user.Email, stored.Email);
        Assert.Equal(_clock.Now, stored.UpdatedAt);
        await Assert.ThrowsAsync<ValidationException>(() =>
            Service(database.Context).ResetAsync(new ResetPasswordRequest { Token = token, Password = NewPassword }));
    }

    [Fact]
    public async Task UnknownEmailReturnsNormallyWithoutTokenOrEmail()
    {
        using var database = new EmailTestDatabase();
        var user = await AddUserAsync(database.Context);
        await Service(database.Context).ForgotAsync(new ForgotPasswordRequest { Email = "unknown@example.com" });
        Assert.Empty(await database.Context.EmailMessages.ToListAsync());
        Assert.Null(user.PasswordResetTokenHash);
        Assert.True(new BCryptPasswordHasher().Verify(OldPassword, user.PasswordHash));
    }

    [Fact]
    public async Task ExpiryAndInvalidTokensDoNotChangePassword()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        var token = await IssueAsync(database.Context);
        _clock.Now = _clock.Now.AddMinutes(30);
        foreach (var invalid in new[] { token, new string('A', 64), "", "not-a-token", token + "\n" })
            await Assert.ThrowsAsync<ValidationException>(() =>
                Service(database.Context).ResetAsync(new ResetPasswordRequest { Token = invalid, Password = NewPassword }));
        var stored = await database.Context.Users.AsNoTracking().SingleAsync();
        Assert.True(new BCryptPasswordHasher().Verify(OldPassword, stored.PasswordHash));
        Assert.Equal(0, stored.PasswordVersion);
    }

    [Fact]
    public async Task NewRequestReplacesOldTokenAndWeakPasswordDoesNotConsumeIt()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        var first = await IssueAsync(database.Context);
        var second = await IssueAsync(database.Context);
        Assert.NotEqual(first, second);
        await Assert.ThrowsAsync<ValidationException>(() =>
            Service(database.Context).ResetAsync(new ResetPasswordRequest { Token = first, Password = NewPassword }));
        await Assert.ThrowsAsync<ValidationException>(() =>
            Service(database.Context).ResetAsync(new ResetPasswordRequest { Token = second, Password = "weak" }));
        await Service(database.Context).ResetAsync(new ResetPasswordRequest { Token = second, Password = NewPassword });
    }

    [Fact]
    public async Task StaleIssuanceCannotRestoreAConsumedToken()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        var token = await IssueAsync(database.Context);
        using var other = database.NewContext();
        await Service(other).ResetAsync(new ResetPasswordRequest { Token = token, Password = NewPassword });
        // The issuing context still has the previous token/version tracked.
        await Assert.ThrowsAsync<DbUpdateConcurrencyException>(() => IssueAsync(database.Context));
        Assert.Single(await other.EmailMessages.AsNoTracking().ToListAsync());
        Assert.Null((await other.Users.AsNoTracking().SingleAsync()).PasswordResetTokenHash);
    }

    [Theory]
    [InlineData("en", "Reset your password", "30 minutes")]
    [InlineData("de", "Passwort zurücksetzen", "30 Minuten")]
    public async Task ExistingDispatcherDecryptsLocalizedResetEmail(string locale, string heading, string lifetime)
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        var token = await IssueAsync(database.Context, locale);
        var sender = new RecordingSender();
        // Outbox defaults use real UTC, while reset expiry uses the deterministic test clock.
        await new EmailDispatcher(new EmailRepository(database.Context), sender, EmailSamples.Options(),
            TimeProvider.System, NullLogger<EmailDispatcher>.Instance, _protection).ProcessBatchAsync(default);
        var content = Assert.Single(sender.Sent);
        Assert.Contains(heading, content.Subject);
        Assert.Contains(lifetime, content.Text);
        Assert.Contains($"https://app.example.com/reset-password#token={token}", content.Text);
        Assert.Contains("&lt;Anna &amp; Max&gt;", content.Html);
        Assert.Contains($"lang=\"{locale}\"", content.Html);
        Assert.DoesNotContain("<Anna & Max>", content.Html);
        Assert.Equal(EmailMessageStatus.Sent, (await database.Context.EmailMessages.AsNoTracking().SingleAsync()).Status);
    }

    [Fact]
    public async Task DisabledEmailFailsEquallyForKnownAndUnknownAccounts()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        foreach (var email in new[] { "account@example.com", "unknown@example.com" })
            await Assert.ThrowsAsync<ExternalServiceException>(() =>
                Service(database.Context, new EmailOptions()).ForgotAsync(new ForgotPasswordRequest { Email = email }));
        Assert.Empty(await database.Context.EmailMessages.ToListAsync());
    }

    [Fact]
    public async Task UndecryptableOutboxFailsExplicitlyWithoutSending()
    {
        using var database = new EmailTestDatabase();
        await AddUserAsync(database.Context);
        await IssueAsync(database.Context);
        var sender = new RecordingSender();
        await new EmailDispatcher(new EmailRepository(database.Context), sender, EmailSamples.Options(),
            TimeProvider.System, NullLogger<EmailDispatcher>.Instance,
            new EphemeralDataProtectionProvider()).ProcessBatchAsync(default);
        Assert.Empty(sender.Sent);
        var stored = await database.Context.EmailMessages.AsNoTracking().SingleAsync();
        Assert.Equal(EmailMessageStatus.Failed, stored.Status);
        Assert.Equal("Stored email content is invalid.", stored.LastError);
    }

    [Fact]
    public void JwtContainsPasswordVersionWithoutExposingRecoveryToken()
    {
        var user = new User { Id = 1, Email = "account@example.com", FullName = "Anna", PasswordVersion = 3, PasswordResetTokenHash = "private" };
        var token = new JwtTokenService(new JwtOptions
        {
            Issuer = "test", Audience = "test", SigningKey = new string('x', 64), ExpirationMinutes = 60
        }).CreateToken(user);
        var jwt = new JwtSecurityTokenHandler().ReadJwtToken(token.Token);
        Assert.Equal("3", jwt.Claims.Single(c => c.Type == AccountSessionValidator.PasswordVersionClaim).Value);
        Assert.DoesNotContain(jwt.Claims, c => c.Value == "private");
    }

    private static ClaimsPrincipal Principal(int id, string? version = null)
    {
        var claims = new List<Claim> { new(ClaimTypes.NameIdentifier, id.ToString()) };
        if (version is not null) claims.Add(new Claim(AccountSessionValidator.PasswordVersionClaim, version));
        return new ClaimsPrincipal(new ClaimsIdentity(claims, "test"));
    }

    private sealed class RecordingSender : IEmailSender
    {
        public List<EmailContent> Sent { get; } = [];
        public Task<string> SendAsync(EmailContent content, string recipient, string idempotencyKey, CancellationToken cancellationToken = default)
        {
            Sent.Add(content);
            return Task.FromResult("provider-id");
        }
    }
}
