using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// Booking and dispatching deliveries.
/// Clients quote, book, view and cancel their own orders; admins see and dispatch everything.
/// </summary>
[ApiController]
[Route("api/orders")]
[Authorize]
public sealed class OrdersController(IOrderService orderService) : ControllerBase
{
    private readonly IOrderService _orderService = orderService;

    /// <summary>Price preview (distance, net, 19% VAT, gross) before booking.</summary>
    [HttpPost("quote")]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(OrderQuoteResponse), StatusCodes.Status200OK)]
    public async Task<ActionResult<OrderQuoteResponse>> Quote(
        [FromBody] QuoteOrderRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _orderService.QuoteAsync(request, User.GetCurrentUser(), cancellationToken));

    /// <summary>Books a delivery and generates its invoice.</summary>
    [HttpPost]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status201Created)]
    public async Task<ActionResult<OrderResponse>> Create(
        [FromBody] CreateOrderRequest request,
        CancellationToken cancellationToken)
    {
        var order = await _orderService.CreateAsync(request, User.GetCurrentUser(), cancellationToken);
        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    /// <summary>Dispatch board. Without a status filter it returns all orders in progress.</summary>
    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IReadOnlyList<OrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<OrderResponse>>> List(
        [FromQuery] OrderStatus? status,
        CancellationToken cancellationToken) =>
        Ok(await _orderService.ListAsync(status, cancellationToken));

    /// <summary>Order history of the signed-in client.</summary>
    [HttpGet("mine")]
    [Authorize(Roles = Roles.Client)]
    [ProducesResponseType(typeof(IReadOnlyList<OrderResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<OrderResponse>>> ListMine(CancellationToken cancellationToken) =>
        Ok(await _orderService.ListMineAsync(User.GetCurrentUser(), cancellationToken));

    [HttpGet("{id:int}")]
    [Authorize(Roles = Roles.AdminClientOrDriver)]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<OrderResponse>> GetById(int id, CancellationToken cancellationToken) =>
        Ok(await _orderService.GetAsync(id, User.GetCurrentUser(), cancellationToken));

    /// <summary>Manual driver assignment (v1 dispatch is done by a human).</summary>
    [HttpPut("{id:int}/assign")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderResponse>> Assign(
        int id,
        [FromBody] AssignOrderRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _orderService.AssignAsync(id, request, cancellationToken));

    [HttpPut("{id:int}/cancel")]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(OrderResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<OrderResponse>> Cancel(int id, CancellationToken cancellationToken) =>
        Ok(await _orderService.CancelAsync(id, User.GetCurrentUser(), cancellationToken));
}
