using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// GDPR data-subject requests. Anyone can submit one and look up its status by reference id;
/// everything that exposes personal data is admin only.
/// </summary>
[ApiController]
[Route("api/privacy")]
[ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
public sealed class DataRequestController(IPrivacyRequestService privacyRequestService) : ControllerBase
{
    private readonly IPrivacyRequestService _privacyRequestService = privacyRequestService;

    /// <summary>Submits a request (access, deletion, ...). The requester receives an acknowledgement by email.</summary>
    [HttpPost("data-request")]
    [AllowAnonymous]
    [EnableRateLimiting("privacy")]
    [ProducesResponseType(typeof(PrivacyRequestCreatedResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PrivacyRequestCreatedResponse>> Create(
        [FromBody] CreatePrivacyRequestRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _privacyRequestService.CreateAsync(request, cancellationToken);
        return Created($"/api/privacy/data-request/{response.Id}", response);
    }

    /// <summary>Status by reference id. The unguessable id is the access capability; no personal data is returned.</summary>
    [HttpGet("data-request/{id:guid}")]
    [AllowAnonymous]
    [EnableRateLimiting("privacy")]
    [ProducesResponseType(typeof(PrivacyRequestStatusResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PrivacyRequestStatusResponse>> GetStatus(
        Guid id, CancellationToken cancellationToken) =>
        Ok(await _privacyRequestService.GetStatusAsync(id, cancellationToken));

    /// <summary>All requests, newest first (at most 200), optionally filtered by status.</summary>
    [HttpGet("data-requests")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IReadOnlyList<PrivacyRequestAdminResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<PrivacyRequestAdminResponse>>> List(
        [FromQuery] PrivacyRequestStatus? status,
        CancellationToken cancellationToken) =>
        Ok(await _privacyRequestService.ListAsync(status, cancellationToken));

    /// <summary>Moves a request along (InProgress, Completed, Rejected, ...) with an optional internal note.</summary>
    [HttpPut("data-requests/{id:guid}/status")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(PrivacyRequestAdminResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PrivacyRequestAdminResponse>> UpdateStatus(
        Guid id,
        [FromBody] UpdatePrivacyRequestStatusRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _privacyRequestService.UpdateStatusAsync(id, request, cancellationToken));
}
