namespace soFlottOS.Api.Dtos;

/// <summary>
/// Numbers for the admin operations dashboard: what needs attention today and
/// how much money the business made this month.
/// </summary>
public sealed record AdminDashboardResponse(
    int PendingOrders,
    int ActiveOrders,
    int DeliveredToday,
    int OnlineDrivers,
    int BusyDrivers,
    int TotalClients,
    decimal RevenueNetThisMonth,
    decimal RevenueGrossThisMonth,
    decimal OutstandingInvoiceTotal,
    int OpenInvoices);
