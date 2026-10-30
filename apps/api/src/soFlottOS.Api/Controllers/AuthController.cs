using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using System.Diagnostics;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;
using soFlottOS.Api.Services.Security;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// Sign-in and sign-up. These endpoints are public, so they sit behind a stricter
/// rate limit ("auth") to slow down password guessing.
/// </summary>
[ApiController]
[Route("api/auth")]
[EnableRateLimiting("auth")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class AuthController(IAuthService authService, PasswordResetService passwordReset) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("forgot-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ForgotPassword(
        [FromBody] ForgotPasswordRequest request, CancellationToken cancellationToken)
    {
        var started = Stopwatch.GetTimestamp();
        try
        {
            await passwordReset.ForgotAsync(request, cancellationToken);
        }
        finally
        {
            // Equalize normal known/unknown-account response times without waiting for email delivery.
            var remaining = TimeSpan.FromMilliseconds(500) - Stopwatch.GetElapsedTime(started);
            if (remaining > TimeSpan.Zero)
                await Task.Delay(remaining, cancellationToken);
        }
        return NoContent();
    }

    [HttpPost("reset-password")]
    [AllowAnonymous]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword(
        [FromBody] ResetPasswordRequest request, CancellationToken cancellationToken)
    {
        await passwordReset.ResetAsync(request, cancellationToken);
        return NoContent();
    }

    /// <summary>Exchanges email + password for a JWT.</summary>
    [HttpPost("login")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<ActionResult<AuthResponse>> Login(
        [FromBody] LoginRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _authService.LoginAsync(request, cancellationToken));

    /// <summary>Self-service signup for a business customer (creates login + CRM record).</summary>
    [HttpPost("register/client")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> RegisterClient(
        [FromBody] RegisterClientRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterClientAsync(request, cancellationToken);
        return Created($"/api/clients/{response.ClientId}", response);
    }

    /// <summary>Self-service signup for a courier.</summary>
    [HttpPost("register/driver")]
    [AllowAnonymous]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> RegisterDriver(
        [FromBody] RegisterDriverRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterDriverAsync(request, cancellationToken);
        return Created("/api/driver/me", response);
    }

    /// <summary>Who am I? Used by the frontend to refresh its session.</summary>
    [HttpGet("me")]
    [Authorize]
    [ProducesResponseType(typeof(CurrentUserResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<CurrentUserResponse>> Me(CancellationToken cancellationToken) =>
        Ok(await _authService.GetCurrentUserAsync(User.GetCurrentUser(), cancellationToken));
}
