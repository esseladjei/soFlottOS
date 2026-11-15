using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos.Pricing;
using soFlottOS.Api.Services.Pricing;

namespace soFlottOS.Api.Controllers.Pricing;

/// <summary>
/// Admin-only cost &amp; pricing engine endpoints. Everything under /api/admin/pricing.
/// Cost side: categories, items, vehicle and labour profiles, cost profiles.
/// Price side: pricing profiles, calculate / simulate, saved calculations, audit trail.
/// </summary>
[ApiController]
[Route("api/admin/pricing")]
[Authorize(Roles = Roles.Admin)]
public sealed class PricingAdminController(
    ICostConfigurationService costs,
    IPricingProfileService profiles,
    IPricingCalculationService calculations,
    IPricingAuditService audit) : ControllerBase
{
    private CurrentUser Me => User.GetCurrentUser();

    // --- Overview & reference ----------------------------------------------------------

    [HttpGet("overview")]
    public async Task<ActionResult<PricingOverviewResponse>> Overview(CancellationToken ct) => Ok(await calculations.GetOverviewAsync(ct));

    [HttpGet("reference")]
    public async Task<ActionResult<PricingReferenceResponse>> Reference(CancellationToken ct) => Ok(await calculations.GetReferenceAsync(ct));

    // --- Cost categories ---------------------------------------------------------------

    [HttpGet("cost-categories")]
    public async Task<ActionResult<IReadOnlyList<CostCategoryResponse>>> ListCategories(CancellationToken ct) => Ok(await costs.ListCategoriesAsync(ct));

    [HttpPost("cost-categories")]
    public async Task<ActionResult<CostCategoryResponse>> CreateCategory([FromBody] SaveCostCategoryRequest request, CancellationToken ct)
    {
        var created = await costs.CreateCategoryAsync(request, Me, ct);
        return Created($"/api/admin/pricing/cost-categories/{created.Id}", created);
    }

    [HttpPut("cost-categories/{id:int}")]
    public async Task<ActionResult<CostCategoryResponse>> UpdateCategory(int id, [FromBody] SaveCostCategoryRequest request, CancellationToken ct) =>
        Ok(await costs.UpdateCategoryAsync(id, request, Me, ct));

    // --- Cost items --------------------------------------------------------------------

    [HttpGet("cost-items")]
    public async Task<ActionResult<IReadOnlyList<CostItemResponse>>> ListItems(CancellationToken ct) => Ok(await costs.ListItemsAsync(ct));

    [HttpPost("cost-items")]
    public async Task<ActionResult<CostItemResponse>> CreateItem([FromBody] SaveCostItemRequest request, CancellationToken ct)
    {
        var created = await costs.CreateItemAsync(request, Me, ct);
        return Created($"/api/admin/pricing/cost-items/{created.Id}", created);
    }

    [HttpPut("cost-items/{id:int}")]
    public async Task<ActionResult<CostItemResponse>> UpdateItem(int id, [FromBody] SaveCostItemRequest request, CancellationToken ct) =>
        Ok(await costs.UpdateItemAsync(id, request, Me, ct));

    // --- Vehicle profiles --------------------------------------------------------------

    [HttpGet("vehicle-profiles")]
    public async Task<ActionResult<IReadOnlyList<VehicleProfileResponse>>> ListVehicles(CancellationToken ct) => Ok(await costs.ListVehiclesAsync(ct));

    [HttpPost("vehicle-profiles")]
    public async Task<ActionResult<VehicleProfileResponse>> CreateVehicle([FromBody] SaveVehicleProfileRequest request, CancellationToken ct)
    {
        var created = await costs.CreateVehicleAsync(request, Me, ct);
        return Created($"/api/admin/pricing/vehicle-profiles/{created.Id}", created);
    }

    [HttpPut("vehicle-profiles/{id:int}")]
    public async Task<ActionResult<VehicleProfileResponse>> UpdateVehicle(int id, [FromBody] SaveVehicleProfileRequest request, CancellationToken ct) =>
        Ok(await costs.UpdateVehicleAsync(id, request, Me, ct));

    // --- Labour profiles ---------------------------------------------------------------

    [HttpGet("labour-profiles")]
    public async Task<ActionResult<IReadOnlyList<LabourProfileResponse>>> ListLabour(CancellationToken ct) => Ok(await costs.ListLabourAsync(ct));

    [HttpPost("labour-profiles")]
    public async Task<ActionResult<LabourProfileResponse>> CreateLabour([FromBody] SaveLabourProfileRequest request, CancellationToken ct)
    {
        var created = await costs.CreateLabourAsync(request, Me, ct);
        return Created($"/api/admin/pricing/labour-profiles/{created.Id}", created);
    }

    [HttpPut("labour-profiles/{id:int}")]
    public async Task<ActionResult<LabourProfileResponse>> UpdateLabour(int id, [FromBody] SaveLabourProfileRequest request, CancellationToken ct) =>
        Ok(await costs.UpdateLabourAsync(id, request, Me, ct));

    // --- Cost profiles -----------------------------------------------------------------

    [HttpGet("cost-profiles")]
    public async Task<ActionResult<IReadOnlyList<CostProfileResponse>>> ListCostProfiles(CancellationToken ct) => Ok(await costs.ListCostProfilesAsync(ct));

    [HttpPost("cost-profiles")]
    public async Task<ActionResult<CostProfileResponse>> CreateCostProfile([FromBody] SaveCostProfileRequest request, CancellationToken ct)
    {
        var created = await costs.CreateCostProfileAsync(request, Me, ct);
        return Created($"/api/admin/pricing/cost-profiles/{created.Id}", created);
    }

    [HttpPut("cost-profiles/{id:int}")]
    public async Task<ActionResult<CostProfileResponse>> UpdateCostProfile(int id, [FromBody] SaveCostProfileRequest request, CancellationToken ct) =>
        Ok(await costs.UpdateCostProfileAsync(id, request, Me, ct));

    // --- Pricing profiles --------------------------------------------------------------

    [HttpGet("profiles")]
    public async Task<ActionResult<IReadOnlyList<PricingProfileResponse>>> ListProfiles(CancellationToken ct) => Ok(await profiles.ListAsync(ct));

    [HttpGet("profiles/{id:int}")]
    public async Task<ActionResult<PricingProfileResponse>> GetProfile(int id, CancellationToken ct) => Ok(await profiles.GetAsync(id, ct));

    [HttpPost("profiles")]
    public async Task<ActionResult<PricingProfileResponse>> CreateProfile([FromBody] SavePricingProfileRequest request, CancellationToken ct)
    {
        var created = await profiles.CreateAsync(request, Me, ct);
        return CreatedAtAction(nameof(GetProfile), new { id = created.Id }, created);
    }

    [HttpPut("profiles/{id:int}")]
    public async Task<ActionResult<PricingProfileResponse>> UpdateProfile(int id, [FromBody] SavePricingProfileRequest request, CancellationToken ct) =>
        Ok(await profiles.UpdateAsync(id, request, Me, ct));

    // --- Calculations ------------------------------------------------------------------

    /// <summary>Real calculation, stored as a snapshot (e.g. for a quotation).</summary>
    [HttpPost("calculate")]
    public async Task<ActionResult<PricingCalculationResponse>> Calculate([FromBody] CalculatePriceRequest request, CancellationToken ct) =>
        Ok(await calculations.CalculateAsync(request, Me, ct));

    /// <summary>What-if calculation; stored only when SaveAsScenarioName is set.</summary>
    [HttpPost("simulate")]
    public async Task<ActionResult<PricingCalculationResponse>> Simulate([FromBody] CalculatePriceRequest request, CancellationToken ct) =>
        Ok(await calculations.SimulateAsync(request, Me, ct));

    [HttpGet("calculations")]
    public async Task<ActionResult<IReadOnlyList<PricingCalculationSummaryResponse>>> ListCalculations([FromQuery] bool? simulations, [FromQuery] int take = 50, CancellationToken ct = default) =>
        Ok(await calculations.ListAsync(simulations, take, ct));

    [HttpGet("calculations/{id:int}")]
    public async Task<ActionResult<PricingCalculationResponse>> GetCalculation(int id, CancellationToken ct) => Ok(await calculations.GetAsync(id, ct));

    // --- Audit -------------------------------------------------------------------------

    [HttpGet("audit")]
    public async Task<ActionResult<IReadOnlyList<PricingAuditResponse>>> Audit([FromQuery] int take = 100, CancellationToken ct = default) =>
        Ok(await audit.ListAsync(take, ct));
}
