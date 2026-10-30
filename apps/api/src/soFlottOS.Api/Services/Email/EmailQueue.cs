using System.Net.Mail;
using System.Text.Json;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Email;

public interface IEmailQueue
{
    void Stage(string eventType, EmailTemplateModel model, params string[] recipients);
}

// Staged messages are committed by the business repository's next SaveChanges.
public sealed class EmailQueue(
    AppDbContext dbContext, IEmailTemplateRenderer renderer, EmailOptions options, ILogger<EmailQueue> logger,
    MessageLocale? locale = null) : IEmailQueue
{
    public void Stage(string eventType, EmailTemplateModel model, params string[] recipients)
    {
        if (!options.Enabled)
        {
            logger.LogDebug("Email event {EventType} was not queued because email is disabled.", eventType);
            return;
        }

        var addresses = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        foreach (var recipient in recipients)
        {
            if (!EmailOptions.IsMailbox(recipient))
                throw new ValidationException("Email", "The notification recipient must have a valid email address.");
            addresses.Add(new MailAddress(recipient).Address);
        }
        if (addresses.Count == 0)
            throw new InvalidOperationException("An email event requires at least one recipient.");

        var contentJson = JsonSerializer.Serialize(renderer.Render(model, model.Locale ?? locale?.Current ?? "de"));
        foreach (var recipient in addresses)
            dbContext.EmailMessages.Add(new EmailMessage
            {
                EventType = eventType,
                Recipient = recipient,
                ContentJson = contentJson
            });
    }
}
