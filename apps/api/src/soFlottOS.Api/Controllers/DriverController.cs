using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// The driver PWA talks to these endpoints only. Every action is scoped to the
/// signed-in driver, so a driver can never see or touch someone else's job.
/// </summary>
[ApiController]
[Route("api/driver")]
[Authorize(Roles = Roles.Driver)]
public sealed class DriverController(IDriverService driverService) : ControllerBase
{
    private readonly IDriverService _driverService = driverService;

    /// <summary>Profile + availability + job counters.</summary>
    [HttpGet("me")]
    [ProducesResponseType(typeof(DriverProfileResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<DriverProfileResponse>> Me(CancellationToken cancellationToken) =>
        Ok(await _driverService.GetProfileAsync(User.GetCurrentUser().UserId, cancellationToken));

    /// <summary>Go Online or Offline. Busy is managed by the system.</summary>
    [HttpPut("availability")]
    [ProducesResponseType(typeof(DriverProfileResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<DriverProfileResponse>> UpdateAvailability(
        [FromBody] UpdateAvailabilityRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _driverService.UpdateAvailabilityAsync(User.GetCurrentUser().UserId, request, cancellationToken));

    /// <summary>Jobs that are assigned to me and not finished yet.</summary>
    [HttpGet("jobs")]
    [ProducesResponseType(typeof(IReadOnlyList<OrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<OrderResponse>>> Jobs(CancellationToken cancellationToken) =>
        Ok(await _driverService.GetJobsAsync(User.GetCurrentUser().UserId, cancellationToken));

    /// <summary>I have the parcel - the order becomes InTransit.</summary>
    [HttpPut("jobs/{id:int}/start")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<OrderResponse>> Start(int id, CancellationToken cancellationToken) =>
        Ok(await _driverService.StartTransitAsync(User.GetCurrentUser().UserId, id, cancellationToken));

    /// <summary>Signature + GPS: completes the delivery and frees me for the next job.</summary>
    [HttpPost("jobs/{id:int}/pod")]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderResponse>> SubmitProofOfDelivery(
        int id,
        [FromBody] ProofOfDeliveryRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _driverService.CaptureProofOfDeliveryAsync(User.GetCurrentUser().UserId, id, request, cancellationToken));
}
