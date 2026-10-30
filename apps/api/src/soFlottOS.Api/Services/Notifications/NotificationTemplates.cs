using System.Globalization;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Notifications;

public static class NotificationTemplates
{
    public static string Render(string eventType, Order order, string locale)
    {
        var english = locale == "en";
        var culture = CultureInfo.GetCultureInfo(english ? "en-GB" : "de-DE");
        var amount = order.GrossPrice.ToString("N2", culture) + " EUR";
        return eventType switch
        {
            "order_created" => english
                ? $"soFlott: order #{order.Id} booked. Invoice {order.Invoice?.InvoiceNumber}, total {amount} incl. VAT."
                : $"soFlott: Auftrag #{order.Id} gebucht. Rechnung {order.Invoice?.InvoiceNumber}, Gesamtbetrag {amount} inkl. MwSt.",
            "order_assigned" => english
                ? $"soFlott: order #{order.Id} was assigned to {order.AssignedDriver?.FullName}."
                : $"soFlott: Auftrag #{order.Id} wurde {order.AssignedDriver?.FullName} zugewiesen.",
            "driver_en_route" => english
                ? $"soFlott: your delivery #{order.Id} is on the way." + (order.EstimatedDurationMinutes > 0 ? $" Estimated journey time: about {order.EstimatedDurationMinutes} minutes." : "")
                : $"soFlott: Ihre Lieferung #{order.Id} ist unterwegs." + (order.EstimatedDurationMinutes > 0 ? $" Voraussichtliche Fahrzeit: ca. {order.EstimatedDurationMinutes} Minuten." : ""),
            "proof_of_delivery" => Delivered(order, english, culture),
            _ => throw new ArgumentOutOfRangeException(nameof(eventType), eventType, "Unsupported notification template.")
        };
    }

    private static string Delivered(Order order, bool english, CultureInfo culture)
    {
        var proof = order.ProofOfDelivery ?? throw new InvalidOperationException("A delivery notification requires proof of delivery.");
        var time = proof.DeliveredAt.UtcDateTime.ToString(english ? "dd MMM yyyy HH:mm" : "dd.MM.yyyy HH:mm", culture) + " UTC";
        return english
            ? $"soFlott: order #{order.Id} was delivered to {proof.RecipientName} at {time}."
            : $"soFlott: Auftrag #{order.Id} wurde am {time} an {proof.RecipientName} zugestellt.";
    }
}
