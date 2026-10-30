using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using soFlottOS.Api.Common;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services;

namespace soFlottOS.Api.Controllers;

[ApiController]
[Route("api/booking-availability")]
[Authorize(Roles = Roles.AdminOrClient)]
public sealed class BookingAvailabilityController(BookingAvailabilityService availability) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<BookingAvailabilityResponse>> Get(CancellationToken cancellationToken) =>
        Ok(await availability.GetAsync(cancellationToken));

    [HttpPut]
    [Authorize(Roles = Roles.Admin)]
    public async Task<ActionResult<BookingAvailabilityResponse>> Save(
        SaveBookingAvailabilityRequest request, CancellationToken cancellationToken) =>
        Ok(await availability.SaveAsync(request, cancellationToken));
}
