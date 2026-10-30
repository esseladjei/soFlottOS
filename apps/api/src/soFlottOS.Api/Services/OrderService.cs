using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Notifications;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services;

public interface IOrderService
{
    Task<OrderQuoteResponse> QuoteAsync(QuoteOrderRequest request, CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<OrderResponse> CreateAsync(CreateOrderRequest request, CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OrderResponse>> ListAsync(OrderStatus? status, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OrderResponse>> ListMineAsync(CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<OrderResponse> GetAsync(int id, CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<OrderResponse> AssignAsync(int id, AssignOrderRequest request, CancellationToken cancellationToken = default);

    Task<OrderResponse> CancelAsync(int id, CurrentUser currentUser, CancellationToken cancellationToken = default);
}

/// <summary>
/// The heart of the platform: quoting, booking, dispatching and cancelling deliveries.
/// <para>
/// Booking an order performs four steps in one go:
/// 1. work out the distance, 2. price it including 19% VAT, 3. store the order,
/// 4. generate the invoice and notify the customer.
/// </para>
/// </summary>
public sealed class OrderService(
    IOrderRepository orderRepository,
    IClientRepository clientRepository,
    IUserRepository userRepository,
    IRoutingService routingService,
    IGeocodingService geocodingService,
    IPricingService pricingService,
    IInvoiceService invoiceService,
    INotificationQueue notificationQueue,
    IEmailCommunications emails,
    IBusinessTransaction transaction,
    BookingAvailabilityService availability) : IOrderService
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IClientRepository _clientRepository = clientRepository;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IRoutingService _routingService = routingService;
    private readonly IGeocodingService _geocodingService = geocodingService;
    private readonly IPricingService _pricingService = pricingService;
    private readonly IInvoiceService _invoiceService = invoiceService;
    private readonly INotificationQueue _notificationQueue = notificationQueue;

    /// <summary>Price preview. Uses the client's negotiated rates when the caller is a client.</summary>
    public async Task<OrderQuoteResponse> QuoteAsync(
        QuoteOrderRequest request,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        await availability.EnsureCanBookAsync(currentUser, cancellationToken);
        Client? client;
        if (currentUser.IsClient)
        {
            client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken)
                ?? throw new ForbiddenException("This login is not linked to a client profile.");
            if (request.ClientId.HasValue && request.ClientId.Value != client.Id)
                throw new ForbiddenException("You may only quote orders for your own company.");
        }
        else
        {
            client = request.ClientId.HasValue
                ? await _clientRepository.GetByIdAsync(request.ClientId.Value, includeOrders: false, cancellationToken)
                    ?? throw new NotFoundException($"Client {request.ClientId.Value} was not found.")
                : null;
        }

        var resolved = await ResolveRouteAsync(request.PickupAddress, request.DropoffAddress, null, null, null, null, cancellationToken);

        var price = _pricingService.Calculate(resolved.Route.DistanceKm, client?.DefaultBaseFee, client?.DefaultRatePerKilometer);

        return new OrderQuoteResponse(
            resolved.Route.DistanceKm,
            resolved.Route.EstimatedDurationMinutes,
            price.NetPrice,
            price.VatAmount,
            price.GrossPrice,
            price.VatRate,
            resolved.Route.Source,
            price.BaseFee,
            price.RatePerKilometer,
            price.DistanceCost,
            price.MinimumChargeApplied,
            new RouteEndpointResponse(resolved.Pickup.Lat, resolved.Pickup.Lng, resolved.Pickup.Label),
            new RouteEndpointResponse(resolved.Dropoff.Lat, resolved.Dropoff.Lng, resolved.Dropoff.Label),
            resolved.Route.Geometry.Select(point => new RoutePointResponse(point.Lat, point.Lng)).ToArray());
    }

    /// <summary>
    /// Turns the two typed addresses into coordinates and a driven route. Explicit coordinates are
    /// honoured when supplied (dispatchers correcting a bad match), otherwise the address is geocoded.
    /// </summary>
    private async Task<(RouteQuote Route, GeocodedAddress Pickup, GeocodedAddress Dropoff)> ResolveRouteAsync(
        string pickupAddress,
        string dropoffAddress,
        decimal? pickupLat,
        decimal? pickupLng,
        decimal? dropoffLat,
        decimal? dropoffLng,
        CancellationToken cancellationToken)
    {
        var pickup = pickupLat.HasValue && pickupLng.HasValue
            ? new GeocodedAddress(pickupLat.Value, pickupLng.Value, pickupAddress.Trim(), "Manual")
            : await _geocodingService.GeocodeAsync(pickupAddress, cancellationToken);

        var dropoff = dropoffLat.HasValue && dropoffLng.HasValue
            ? new GeocodedAddress(dropoffLat.Value, dropoffLng.Value, dropoffAddress.Trim(), "Manual")
            : await _geocodingService.GeocodeAsync(dropoffAddress, cancellationToken);

        var route = await _routingService.GetRouteAsync(
            new RouteRequest(pickup.Lat, pickup.Lng, dropoff.Lat, dropoff.Lng),
            cancellationToken);

        return (route, pickup, dropoff);
    }

    public Task<OrderResponse> CreateAsync(
        CreateOrderRequest request,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default) =>
        transaction.ExecuteAsync(() => CreateCoreAsync(request, currentUser, cancellationToken), cancellationToken);

    private async Task<OrderResponse> CreateCoreAsync(
        CreateOrderRequest request,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        await availability.EnsureCanBookAsync(currentUser, cancellationToken);
        var client = await ResolveClientAsync(request.ClientId, currentUser, cancellationToken);

        var resolved = await ResolveRouteAsync(
            request.PickupAddress, request.DropoffAddress,
            request.PickupLat, request.PickupLng, request.DropoffLat, request.DropoffLng,
            cancellationToken);
        var route = resolved.Route;

        var price = _pricingService.Calculate(route.DistanceKm, client.DefaultBaseFee, client.DefaultRatePerKilometer);

        await availability.EnsureCanBookAsync(currentUser, cancellationToken);

        var order = new Order
        {
            ClientId = client.Id,
            Client = client,
            CargoCategory = request.CargoCategory,
            WeightKg = request.WeightKg,
            PickupAddress = request.PickupAddress.Trim(),
            PickupLat = resolved.Pickup.Lat,
            PickupLng = resolved.Pickup.Lng,
            PickupContactName = Clean(request.PickupContactName),
            PickupPhone = Clean(request.PickupPhone),
            DropoffAddress = request.DropoffAddress.Trim(),
            DropoffLat = resolved.Dropoff.Lat,
            DropoffLng = resolved.Dropoff.Lng,
            DropoffContactName = Clean(request.DropoffContactName),
            DropoffPhone = Clean(request.DropoffPhone),

            // Client instructions win; otherwise fall back to the standing CRM instructions.
            SpecialInstructions = Clean(request.SpecialInstructions) ?? client.SpecialDeliveryInstructions,
            ExternalReference = Clean(request.ExternalReference),
            PaymentMethod = request.PaymentMethod,
            DistanceKm = route.DistanceKm,
            EstimatedDurationMinutes = route.EstimatedDurationMinutes,
            NetPrice = price.NetPrice,
            VatAmount = price.VatAmount,
            GrossPrice = price.GrossPrice,
            Status = OrderStatus.Pending
        };

        await _orderRepository.AddAsync(order, cancellationToken);

        // Every order is invoiced immediately (German MVP flow: Rechnung first, payment later).
        emails.OrderChanged(order, OrderEmailKind.Confirmed);
        var invoice = await _invoiceService.CreateForOrderAsync(order, cancellationToken);
        order.InvoiceId = invoice.Id;
        order.Invoice = invoice;
        await _orderRepository.SaveChangesAsync(cancellationToken);

        await _notificationQueue.EnqueueAsync(
            NotificationRequest.ForOrder(client.Phone, "order_created", order),
            cancellationToken);

        // Reload so the response contains client, invoice and driver names.
        var stored = await _orderRepository.GetByIdAsync(order.Id, cancellationToken)
            ?? throw new NotFoundException($"Order {order.Id} could not be reloaded after creation.");

        return stored.ToResponse();
    }

    /// <summary>Admin view. Without a status filter this returns everything still in progress.</summary>
    public async Task<IReadOnlyList<OrderResponse>> ListAsync(
        OrderStatus? status,
        CancellationToken cancellationToken = default)
    {
        var orders = await _orderRepository.ListAsync(status, cancellationToken);
        return orders.Select(order => order.ToResponse()).ToArray();
    }

    /// <summary>Order history of the signed-in client.</summary>
    public async Task<IReadOnlyList<OrderResponse>> ListMineAsync(
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken)
            ?? throw new ForbiddenException("This login is not linked to a client profile.");

        var orders = await _orderRepository.ListForClientAsync(client.Id, cancellationToken);
        return orders.Select(order => order.ToResponse()).ToArray();
    }

    public async Task<OrderResponse> GetAsync(
        int id,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Order {id} was not found.");

        await EnsureCanViewAsync(order, currentUser, cancellationToken);

        return order.ToResponse();
    }

    /// <summary>
    /// Manual dispatch by the admin. The driver becomes Busy; assigning a second order to the
    /// same driver is allowed on purpose so sequential drops on one route can be grouped.
    /// </summary>
    public async Task<OrderResponse> AssignAsync(
        int id,
        AssignOrderRequest request,
        CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Order {id} was not found.");

        if (order.Status is OrderStatus.Delivered or OrderStatus.Cancelled)
        {
            throw new ConflictException("Delivered or cancelled orders cannot be assigned.");
        }

        var driver = await _userRepository.GetByIdAsync(request.DriverUserId, cancellationToken)
            ?? throw new NotFoundException($"Driver {request.DriverUserId} was not found.");

        if (driver.Role != UserRole.Driver)
        {
            throw new ValidationException(nameof(request.DriverUserId), "The selected user is not a driver.");
        }

        if (driver.Availability == DriverAvailability.Offline)
        {
            throw new ConflictException($"{driver.FullName} is offline and cannot take new jobs.");
        }

        if (order.Status == OrderStatus.Assigned && order.AssignedDriverId == driver.Id)
            return order.ToResponse();

        var previousDriver = order.AssignedDriver;
        order.AssignedDriverId = driver.Id;
        order.AssignedDriver = driver;
        order.Status = OrderStatus.Assigned;
        order.AssignedAt = DateTimeOffset.UtcNow;

        // Availability state machine: an assigned driver is blocked for automatic dispatch.
        driver.Availability = DriverAvailability.Busy;

        if (previousDriver is not null && previousDriver.Id != driver.Id)
            emails.OrderChanged(order, OrderEmailKind.AssignmentRemoved, previousDriver);
        emails.OrderChanged(order, OrderEmailKind.Assigned);
        await _orderRepository.SaveChangesAsync(cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

        if (previousDriver is not null && previousDriver.Id != driver.Id)
            await ReleaseDriverIfIdleAsync(previousDriver.Id, cancellationToken);

        await _notificationQueue.EnqueueAsync(
            NotificationRequest.ForOrder(order.Client.Phone, "order_assigned", order),
            cancellationToken);

        return order.ToResponse();
    }

    /// <summary>Cancelling releases the driver if they have no other active job.</summary>
    public async Task<OrderResponse> CancelAsync(
        int id,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var order = await _orderRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Order {id} was not found.");

        await EnsureCanViewAsync(order, currentUser, cancellationToken);

        if (order.Status == OrderStatus.Delivered)
        {
            throw new ConflictException("Delivered orders cannot be cancelled.");
        }

        if (order.Status == OrderStatus.InTransit && !currentUser.IsAdmin)
        {
            throw new ConflictException("The order is already in transit. Please call dispatch to cancel it.");
        }

        if (order.Status == OrderStatus.Cancelled)
            return order.ToResponse();

        var driverId = order.AssignedDriverId;
        var cancelledDriver = order.AssignedDriver;
        order.Status = OrderStatus.Cancelled;
        order.AssignedDriverId = null;
        order.AssignedDriver = null;

        emails.OrderChanged(order, OrderEmailKind.Cancelled, cancelledDriver);
        await _orderRepository.SaveChangesAsync(cancellationToken);

        if (driverId.HasValue)
        {
            await ReleaseDriverIfIdleAsync(driverId.Value, cancellationToken);
        }

        return order.ToResponse();
    }

    /// <summary>A driver goes back Online as soon as their last active job is finished.</summary>
    private async Task ReleaseDriverIfIdleAsync(int driverUserId, CancellationToken cancellationToken)
    {
        var driver = await _userRepository.GetByIdAsync(driverUserId, cancellationToken);
        if (driver is null || driver.Availability != DriverAvailability.Busy)
        {
            return;
        }

        var remainingJobs = await _orderRepository.CountActiveForDriverAsync(driverUserId, cancellationToken);
        if (remainingJobs == 0)
        {
            driver.Availability = DriverAvailability.Online;
            await _userRepository.SaveChangesAsync(cancellationToken);
        }
    }

    /// <summary>Admins book for any client; a client may only book for itself.</summary>
    private async Task<Client> ResolveClientAsync(
        int? requestedClientId,
        CurrentUser currentUser,
        CancellationToken cancellationToken)
    {
        if (currentUser.IsClient)
        {
            var ownClient = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken)
                ?? throw new ForbiddenException("This login is not linked to a client profile.");

            if (requestedClientId.HasValue && requestedClientId.Value != ownClient.Id)
            {
                throw new ForbiddenException("You may only book orders for your own company.");
            }

            return ownClient;
        }

        if (!requestedClientId.HasValue)
        {
            throw new ValidationException(nameof(CreateOrderRequest.ClientId), "A client id is required when booking as an admin.");
        }

        return await _clientRepository.GetByIdAsync(requestedClientId.Value, includeOrders: false, cancellationToken)
            ?? throw new NotFoundException($"Client {requestedClientId.Value} was not found.");
    }

    private async Task EnsureCanViewAsync(Order order, CurrentUser currentUser, CancellationToken cancellationToken)
    {
        if (currentUser.IsAdmin)
        {
            return;
        }

        if (currentUser.IsDriver)
        {
            if (order.AssignedDriverId != currentUser.UserId)
            {
                throw new ForbiddenException("This order is not assigned to you.");
            }

            return;
        }

        var client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken);
        if (client is null || client.Id != order.ClientId)
        {
            throw new ForbiddenException("You may only access your own orders.");
        }
    }

    private static string? Clean(string? value) => string.IsNullOrWhiteSpace(value) ? null : value.Trim();

}
