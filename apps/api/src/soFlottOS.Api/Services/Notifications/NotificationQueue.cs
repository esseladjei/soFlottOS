using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services.Notifications;

/// <summary>A customer message that should be sent (SMS by default).</summary>
public sealed record NotificationRequest(string Recipient, string Body, string EventType, int? OrderId = null)
{
    public Order? TemplateOrder { get; init; }

    public static NotificationRequest ForOrder(string recipient, string eventType, Order order) =>
        new(recipient, NotificationTemplates.Render(eventType, order, order.Client.User?.PreferredLocale ?? "de"), eventType, order.Id)
        { TemplateOrder = order };
}

public interface INotificationQueue
{
    Task EnqueueAsync(NotificationRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Writes outbound messages to the database ("outbox pattern") instead of calling the
/// SMS provider inline. Booking an order therefore never fails because Twilio is down;
/// <see cref="NotificationWorker"/> delivers the message a few seconds later.
/// </summary>
public sealed class NotificationQueue(INotificationRepository repository, MessageLocale? locale = null) : INotificationQueue
{
    private readonly INotificationRepository _repository = repository;

    public Task EnqueueAsync(NotificationRequest request, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(request.Recipient))
        {
            // Nothing to send to - silently skip instead of failing the business action.
            return Task.CompletedTask;
        }

        var message = new NotificationMessage
        {
            OrderId = request.OrderId,
            Channel = NotificationChannel.Sms,
            Status = NotificationStatus.Pending,
            EventType = request.EventType,
            Recipient = request.Recipient.Trim(),
            Body = request.TemplateOrder is { } order
                ? NotificationTemplates.Render(request.EventType, order, order.Client.User?.PreferredLocale ?? locale?.Current ?? "de")
                : request.Body
        };

        return _repository.AddAsync(message, cancellationToken);
    }
}
