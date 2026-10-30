using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// CRM endpoints for business customers.
/// Admins manage every client; a client can read and edit only its own profile.
/// </summary>
[ApiController]
[Route("api/clients")]
[Authorize]
public sealed class ClientsController(IClientService clientService) : ControllerBase
{
    private readonly IClientService _clientService = clientService;

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IReadOnlyList<ClientSummaryResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<ClientSummaryResponse>>> List(CancellationToken cancellationToken) =>
        Ok(await _clientService.ListAsync(cancellationToken));

    /// <summary>Manual onboarding of a client that has no login yet.</summary>
    [HttpPost]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(ClientDetailResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<ClientDetailResponse>> Create(
        [FromBody] SaveClientRequest request,
        CancellationToken cancellationToken)
    {
        var client = await _clientService.CreateAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
    }

    /// <summary>The company profile of the signed-in client.</summary>
    [HttpGet("me")]
    [Authorize(Roles = Roles.Client)]
    [ProducesResponseType(typeof(ClientDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ClientDetailResponse>> GetMine(CancellationToken cancellationToken) =>
        Ok(await _clientService.GetMineAsync(User.GetCurrentUser(), cancellationToken));

    [HttpGet("{id:int}")]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(ClientDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ClientDetailResponse>> GetById(int id, CancellationToken cancellationToken) =>
        Ok(await _clientService.GetAsync(id, User.GetCurrentUser(), cancellationToken));

    [HttpPut("{id:int}")]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(ClientDetailResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<ClientDetailResponse>> Update(
        int id,
        [FromBody] SaveClientRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _clientService.UpdateAsync(id, request, User.GetCurrentUser(), cancellationToken));
}
