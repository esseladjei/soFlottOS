using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// Cookie-consent evidence. The browser reports each decision here without any identity;
/// only admins can read the stored history.
/// </summary>
[ApiController]
[Route("api/privacy/consent")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class ConsentController(IConsentService consentService) : ControllerBase
{
    private readonly IConsentService _consentService = consentService;

    /// <summary>Stores one consent decision. Sending the same id again is accepted and changes nothing.</summary>
    [HttpPost]
    [AllowAnonymous]
    [EnableRateLimiting("privacy")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Record(
        [FromBody] RecordConsentRequest request,
        CancellationToken cancellationToken)
    {
        await _consentService.RecordAsync(request, cancellationToken);
        return NoContent();
    }

    /// <summary>The chain of decisions ending at <paramref name="consentId"/>, newest first (at most 100).</summary>
    [HttpGet("history")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IReadOnlyList<ConsentHistoryItemResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<IReadOnlyList<ConsentHistoryItemResponse>>> History(
        [FromQuery] Guid consentId,
        CancellationToken cancellationToken,
        [FromQuery] int take = ConsentService.DefaultHistoryLength) =>
        Ok(await _consentService.GetHistoryAsync(consentId, take, cancellationToken));
}
