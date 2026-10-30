using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Dtos;

namespace soFlottOS.Api.Services;

public interface IAdminService
{
    Task<AdminDashboardResponse> GetDashboardAsync(CancellationToken cancellationToken = default);
}

/// <summary>
/// Read-only numbers for the operations dashboard.
/// Everything is counted directly in the database - no data is loaded into memory.
/// </summary>
public sealed class AdminService(
    IOrderRepository orderRepository,
    IInvoiceRepository invoiceRepository,
    IClientRepository clientRepository,
    IUserRepository userRepository) : IAdminService
{
    private readonly IOrderRepository _orderRepository = orderRepository;
    private readonly IInvoiceRepository _invoiceRepository = invoiceRepository;
    private readonly IClientRepository _clientRepository = clientRepository;
    private readonly IUserRepository _userRepository = userRepository;

    public async Task<AdminDashboardResponse> GetDashboardAsync(CancellationToken cancellationToken = default)
    {
        var now = DateTimeOffset.UtcNow;
        var startOfToday = new DateTimeOffset(now.Year, now.Month, now.Day, 0, 0, 0, TimeSpan.Zero);
        var startOfMonth = new DateTimeOffset(now.Year, now.Month, 1, 0, 0, 0, TimeSpan.Zero);

        return new AdminDashboardResponse(
            PendingOrders: await _orderRepository.CountByStatusAsync(OrderStatus.Pending, cancellationToken),
            ActiveOrders: await _orderRepository.CountActiveAsync(cancellationToken),
            DeliveredToday: await _orderRepository.CountDeliveredSinceAsync(startOfToday, cancellationToken),
            OnlineDrivers: await _userRepository.CountDriversByAvailabilityAsync(DriverAvailability.Online, cancellationToken),
            BusyDrivers: await _userRepository.CountDriversByAvailabilityAsync(DriverAvailability.Busy, cancellationToken),
            TotalClients: await _clientRepository.CountAsync(cancellationToken),
            RevenueNetThisMonth: await _invoiceRepository.SumNetIssuedSinceAsync(startOfMonth, cancellationToken),
            RevenueGrossThisMonth: await _invoiceRepository.SumGrossIssuedSinceAsync(startOfMonth, cancellationToken),
            OutstandingInvoiceTotal: await _invoiceRepository.SumOutstandingGrossAsync(cancellationToken),
            OpenInvoices: await _invoiceRepository.CountOutstandingAsync(cancellationToken));
    }
}
