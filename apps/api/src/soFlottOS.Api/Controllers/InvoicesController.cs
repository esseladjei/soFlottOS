using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

/// <summary>
/// Invoices (Rechnungen). They are created automatically when an order is booked;
/// this controller only reads them and lets an admin change the payment status.
/// </summary>
[ApiController]
[Route("api/invoices")]
[Authorize]
public sealed class InvoicesController(IInvoiceService invoiceService) : ControllerBase
{
    private readonly IInvoiceService _invoiceService = invoiceService;

    [HttpGet]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(IReadOnlyList<InvoiceResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<InvoiceResponse>>> List(
        [FromQuery] InvoiceStatus? status,
        CancellationToken cancellationToken) =>
        Ok(await _invoiceService.ListAsync(status, cancellationToken));

    /// <summary>Invoices of the signed-in client.</summary>
    [HttpGet("mine")]
    [Authorize(Roles = Roles.Client)]
    [ProducesResponseType(typeof(IReadOnlyList<InvoiceResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<IReadOnlyList<InvoiceResponse>>> ListMine(CancellationToken cancellationToken) =>
        Ok(await _invoiceService.ListMineAsync(User.GetCurrentUser(), cancellationToken));

    /// <summary>Everything needed to print a compliant German invoice.</summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = Roles.AdminOrClient)]
    [ProducesResponseType(typeof(InvoiceDetailResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<InvoiceDetailResponse>> GetById(int id, CancellationToken cancellationToken) =>
        Ok(await _invoiceService.GetAsync(id, User.GetCurrentUser(), cancellationToken));

    /// <summary>Admin marks the invoice as Sent, Paid or Overdue after checking the bank/PayPal account.</summary>
    [HttpPut("{id:int}/status")]
    [Authorize(Roles = Roles.Admin)]
    [ProducesResponseType(typeof(InvoiceResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<ActionResult<InvoiceResponse>> UpdateStatus(
        int id,
        [FromBody] UpdateInvoiceStatusRequest request,
        CancellationToken cancellationToken) =>
        Ok(await _invoiceService.UpdateStatusAsync(id, request, cancellationToken));
}
