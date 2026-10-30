using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Notifications;
using soFlottOS.Api.Services.Email;

namespace soFlottOS.Api.Services;

public interface IDriverService
{
    Task<DriverProfileResponse> GetProfileAsync(int driverUserId, CancellationToken cancellationToken = default);

    Task<DriverProfileResponse> UpdateAvailabilityAsync(int driverUserId, UpdateAvailabilityRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<OrderResponse>> GetJobsAsync(int driverUserId, CancellationToken cancellationToken = default);

    Task<OrderResponse> StartTransitAsync(int driverUserId, int orderId, CancellationToken cancellationToken = default);

    Task<OrderResponse> CaptureProofOfDeliveryAsync(int driverUserId, int orderId, ProofOfDeliveryRequest request, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<DriverProfileResponse>> ListDriversAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Everything the driver PWA does, plus the availability state machine:
/// <list type="number">
/// <item>The driver switches to Online when they start their shift.</item>
/// <item>Assigning an order flips them to Busy (see <see cref="OrderService.AssignAsync"/>).</item>
/// <item>Submitting proof of delivery releases them back to Online once no jobs remain.</item>
/// </list>
/// </summary>
public sealed class DriverService(
    IUserRepository userRepository,
    IOrderRepository orderRepository,
    INotificationQueue notificationQueue,
    IEmailCommunications emails) : IDriverService
{
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly INotificationQueue _notificationQueue = notificationQueue;

    public async Task<DriverProfileResponse> GetProfileAsync(int driverUserId, CancellationToken cancellationToken = default)
    {
        var driver = await GetDriverAsync(driverUserId, cancellationToken);
        return await BuildProfileAsync(driver, cancellationToken);
    }

    /// <summary>A driver may only pick Online or Offline - Busy is owned by the system.</summary>
    public async Task<DriverProfileResponse> UpdateAvailabilityAsync(
        int driverUserId,
        UpdateAvailabilityRequest request,
        CancellationToken cancellationToken = default)
    {
        if (request.Availability == DriverAvailability.Busy)
        {
            throw new ValidationException(
                nameof(request.Availability),
                "Busy is set automatically when you are assigned a job.");
        }

        var driver = await GetDriverAsync(driverUserId, cancellationToken);
        var activeJobs = await _orderRepository.CountActiveForDriverAsync(driverUserId, cancellationToken);

        if (request.Availability == DriverAvailability.Offline && activeJobs > 0)
        {
            throw new ConflictException("Finish or hand over your active job before going offline.");
        }

        driver.Availability = activeJobs > 0 ? DriverAvailability.Busy : request.Availability;
        await _userRepository.SaveChangesAsync(cancellationToken);

        return await BuildProfileAsync(driver, cancellationToken);
    }

    /// <summary>The job list of the driver PWA: everything assigned and not yet delivered.</summary>
    public async Task<IReadOnlyList<OrderResponse>> GetJobsAsync(int driverUserId, CancellationToken cancellationToken = default)
    {
        var orders = await _orderRepository.ListForDriverAsync(driverUserId, activeOnly: true, cancellationToken);
        return orders.Select(order => order.ToResponse()).ToArray();
    }

    /// <summary>"I picked the parcel up" - moves the order to InTransit.</summary>
    public async Task<OrderResponse> StartTransitAsync(
        int driverUserId,
        int orderId,
        CancellationToken cancellationToken = default)
    {
        var order = await GetOwnJobAsync(driverUserId, orderId, cancellationToken);

        if (order.Status != OrderStatus.Assigned)
        {
            throw new ConflictException("Only an assigned job can be started.");
        }

        order.Status = OrderStatus.InTransit;
        order.PickedUpAt = DateTimeOffset.UtcNow;

        emails.OrderChanged(order, OrderEmailKind.EnRoute);
        await _orderRepository.SaveChangesAsync(cancellationToken);

        await _notificationQueue.EnqueueAsync(
            NotificationRequest.ForOrder(RecipientFor(order), "driver_en_route", order),
            cancellationToken);

        return order.ToResponse();
    }

    /// <summary>
    /// Final step of a run: store signature + GPS, mark the order delivered and
    /// release the driver for the next dispatch.
    /// </summary>
    public async Task<OrderResponse> CaptureProofOfDeliveryAsync(
        int driverUserId,
        int orderId,
        ProofOfDeliveryRequest request,
        CancellationToken cancellationToken = default)
    {
        var order = await GetOwnJobAsync(driverUserId, orderId, cancellationToken);

        if (order.Status == OrderStatus.Cancelled)
        {
            throw new ConflictException("A cancelled order cannot be delivered.");
        }

        if (order.ProofOfDelivery is not null)
        {
            throw new ConflictException("Proof of delivery was already captured for this order.");
        }

        if (!request.SignatureDataUrl.StartsWith("data:image/", StringComparison.OrdinalIgnoreCase))
        {
            throw new ValidationException(nameof(request.SignatureDataUrl), "The signature must be a PNG data URL.");
        }

        var deliveredAt = DateTimeOffset.UtcNow;

        order.ProofOfDelivery = new ProofOfDelivery
        {
            OrderId = order.Id,
            RecipientName = request.RecipientName.Trim(),
            SignatureDataUrl = request.SignatureDataUrl,
            GpsLatitude = request.GpsLatitude,
            GpsLongitude = request.GpsLongitude,
            DeliveredAt = deliveredAt
        };
        order.Status = OrderStatus.Delivered;
        order.DeliveredAt = deliveredAt;

        emails.OrderChanged(order, OrderEmailKind.Delivered);
        await _orderRepository.SaveChangesAsync(cancellationToken);

        await ReleaseDriverIfIdleAsync(driverUserId, cancellationToken);

        await _notificationQueue.EnqueueAsync(
            NotificationRequest.ForOrder(RecipientFor(order), "proof_of_delivery", order),
            cancellationToken);

        return order.ToResponse();
    }

    /// <summary>Used by the admin dispatch screen to pick a driver.</summary>
    public async Task<IReadOnlyList<DriverProfileResponse>> ListDriversAsync(CancellationToken cancellationToken = default)
    {
        var drivers = await _userRepository.ListDriversAsync(cancellationToken);

        return drivers
            .Select(driver => driver.ToDriverProfile(
                driver.AssignedOrders.Count(order => order.Status is OrderStatus.Assigned or OrderStatus.InTransit),
                driver.AssignedOrders.Count(order => order.Status == OrderStatus.Delivered),
                driver.AssignedOrders
                    .Where(order => order.Status == OrderStatus.Delivered)
                    .Sum(order => order.GrossPrice)))
            .ToArray();
    }

    private async Task ReleaseDriverIfIdleAsync(int driverUserId, CancellationToken cancellationToken)
    {
        var driver = await _userRepository.GetByIdAsync(driverUserId, cancellationToken);
        if (driver is null)
        {
            return;
        }

        var remainingJobs = await _orderRepository.CountActiveForDriverAsync(driverUserId, cancellationToken);
        if (remainingJobs == 0 && driver.Availability == DriverAvailability.Busy)
        {
            driver.Availability = DriverAvailability.Online;
            await _userRepository.SaveChangesAsync(cancellationToken);
        }
    }

    private async Task<User> GetDriverAsync(int driverUserId, CancellationToken cancellationToken)
    {
        var driver = await _userRepository.GetByIdAsync(driverUserId, cancellationToken)
            ?? throw new NotFoundException("Driver account was not found.");

        if (driver.Role != UserRole.Driver)
        {
            throw new ForbiddenException("This endpoint is only available to drivers.");
        }

        return driver;
    }

    private async Task<Order> GetOwnJobAsync(int driverUserId, int orderId, CancellationToken cancellationToken)
    {
        var order = await _orderRepository.GetByIdAsync(orderId, cancellationToken)
            ?? throw new NotFoundException($"Order {orderId} was not found.");

        if (order.AssignedDriverId != driverUserId)
        {
            throw new ForbiddenException("This order is not assigned to you.");
        }

        return order;
    }

    private async Task<DriverProfileResponse> BuildProfileAsync(User driver, CancellationToken cancellationToken)
    {
        var activeJobs = await _orderRepository.CountActiveForDriverAsync(driver.Id, cancellationToken);
        var allJobs = await _orderRepository.ListForDriverAsync(driver.Id, activeOnly: false, cancellationToken);
        var completedOrders = allJobs.Where(order => order.Status == OrderStatus.Delivered).ToArray();

        return driver.ToDriverProfile(
            activeJobs,
            completedOrders.Length,
            completedOrders.Sum(order => order.GrossPrice));
    }

    /// <summary>Prefer the person waiting at the drop-off, fall back to the booking company.</summary>
    private static string RecipientFor(Order order) =>
        string.IsNullOrWhiteSpace(order.DropoffPhone) ? order.Client.Phone : order.DropoffPhone!;
}
