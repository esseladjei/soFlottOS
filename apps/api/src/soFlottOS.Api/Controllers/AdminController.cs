using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>Operations overview for the business owner.</summary>
[ApiController]
[Route("api/admin")]
[Authorize(Roles = Roles.Admin)]
public sealed class AdminController(
    IAdminService adminService,
    IDriverService driverService,
    IAuthService authService) : ControllerBase
{
    private readonly IAdminService _adminService = adminService;
    private readonly IDriverService _driverService = driverService;
    private readonly IAuthService _authService = authService;

    /// <summary>KPI cards: workload today, driver availability and revenue this month.</summary>
    [HttpGet("dashboard")]
    [ProducesResponseType(typeof(AdminDashboardResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<AdminDashboardResponse>> Dashboard(CancellationToken cancellationToken) =>
        Ok(await _adminService.GetDashboardAsync(cancellationToken));

    /// <summary>All drivers with their availability, used to pick someone for dispatch.</summary>
    [HttpGet("drivers")]
    [ProducesResponseType(typeof(IReadOnlyList<DriverProfileResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<DriverProfileResponse>>> Drivers(CancellationToken cancellationToken) =>
        Ok(await _driverService.ListDriversAsync(cancellationToken));

    /// <summary>Create a driver account from the admin workspace.</summary>
    [HttpPost("drivers")]
    [ProducesResponseType(typeof(DriverProfileResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<AuthResponse>> CreateDriver(
        [FromBody] RegisterDriverRequest request,
        CancellationToken cancellationToken)
    {
        var response = await _authService.RegisterDriverAsync(request, cancellationToken);
        var driver = await _driverService.GetProfileAsync(response.UserId, cancellationToken);
        return Created("/api/admin/drivers", driver);
    }
}
