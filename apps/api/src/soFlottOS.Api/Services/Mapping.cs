using soFlottOS.Api.Common;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;

namespace soFlottOS.Api.Services;

/// <summary>
/// Converts database entities into the DTOs the API returns.
/// Entities stay internal; only these DTO shapes are part of the public contract
/// (see docs/API-CONTRACT.md and apps/web/src/types/api.ts).
/// </summary>
public static class Mapping
{
    public static ClientSummaryResponse ToSummary(this Client client) =>
        new(
            client.Id,
            client.CompanyName,
            client.ContactPerson,
            client.Email,
            client.Phone,
            client.City,
            client.PostalCode,
            CountActiveOrders(client),
            client.Orders.Count,
            client.CreatedAt);

    public static ClientDetailResponse ToDetail(this Client client) =>
        new(
            client.Id,
            client.CompanyName,
            client.ContactPerson,
            client.Email,
            client.Phone,
            client.City,
            client.PostalCode,
            CountActiveOrders(client),
            client.Orders.Count,
            client.CreatedAt,
            client.UserId,
            client.Street,
            client.Country,
            client.TaxIdNumber,
            client.SpecialDeliveryInstructions,
            client.DefaultBaseFee,
            client.DefaultRatePerKilometer);

    public static OrderResponse ToResponse(this Order order) =>
        new(
            order.Id,
            order.ClientId,
            order.Client?.CompanyName ?? string.Empty,
            order.AssignedDriverId,
            order.AssignedDriver?.FullName,
            order.CargoCategory,
            order.WeightKg,
            order.PickupAddress,
            order.PickupLat,
            order.PickupLng,
            order.PickupContactName,
            order.PickupPhone,
            order.DropoffAddress,
            order.DropoffLat,
            order.DropoffLng,
            order.DropoffContactName,
            order.DropoffPhone,
            order.SpecialInstructions,
            order.ExternalReference,
            order.DistanceKm,
            order.EstimatedDurationMinutes,
            order.NetPrice,
            order.VatAmount,
            order.GrossPrice,
            order.Status,
            order.PaymentMethod,
            order.CreatedAt,
            order.AssignedAt,
            order.PickedUpAt,
            order.DeliveredAt,
            order.Invoice?.Id,
            order.Invoice?.InvoiceNumber,
            order.ProofOfDelivery?.ToResponse());

    public static ProofOfDeliveryResponse ToResponse(this ProofOfDelivery proofOfDelivery) =>
        new(
            proofOfDelivery.OrderId,
            proofOfDelivery.RecipientName,
            proofOfDelivery.SignatureDataUrl,
            proofOfDelivery.GpsLatitude,
            proofOfDelivery.GpsLongitude,
            proofOfDelivery.DeliveredAt);

    public static InvoiceResponse ToResponse(this Invoice invoice) =>
        new(
            invoice.Id,
            invoice.InvoiceNumber,
            invoice.ClientId,
            invoice.Client?.CompanyName ?? string.Empty,
            invoice.OrderId,
            invoice.NetTotal,
            invoice.VatRate,
            invoice.VatTotal,
            invoice.GrossTotal,
            invoice.Status,
            invoice.PaymentMethod,
            invoice.IssuedAt,
            invoice.DueDate);

    /// <summary>Everything the frontend needs to print a complete German Rechnung.</summary>
    public static InvoiceDetailResponse ToDetail(this Invoice invoice, InvoicingOptions invoicing) =>
        new(
            invoice.Id,
            invoice.InvoiceNumber,
            invoice.ClientId,
            invoice.Client.CompanyName,
            invoice.OrderId,
            invoice.NetTotal,
            invoice.VatRate,
            invoice.VatTotal,
            invoice.GrossTotal,
            invoice.Status,
            invoice.PaymentMethod,
            invoice.IssuedAt,
            invoice.DueDate,
            invoicing.ToIssuerResponse(),
            invoice.Client.ToDetail(),
            invoice.Order.ToResponse(),
            invoicing.PaymentTermsDays);

    public static InvoiceIssuerResponse ToIssuerResponse(this InvoicingOptions invoicing) =>
        new(
            invoicing.CompanyName,
            invoicing.Street,
            invoicing.City,
            invoicing.PostalCode,
            invoicing.Country,
            invoicing.TaxIdNumber,
            invoicing.Email,
            invoicing.Phone,
            invoicing.Iban,
            invoicing.Bic,
            invoicing.BankName,
            invoicing.PayPalHandle);

    public static DriverProfileResponse ToDriverProfile(
        this User driver,
        int activeJobs,
        int completedJobs,
        decimal revenueGenerated) =>
        new(
            driver.Id,
            driver.FullName,
            driver.Email,
            driver.Phone,
            driver.VehicleDescription,
            driver.Availability,
            activeJobs,
            completedJobs,
            revenueGenerated);

    private static int CountActiveOrders(Client client) =>
        client.Orders.Count(order =>
            order.Status is Domain.OrderStatus.Pending or Domain.OrderStatus.Assigned or Domain.OrderStatus.InTransit);
}
