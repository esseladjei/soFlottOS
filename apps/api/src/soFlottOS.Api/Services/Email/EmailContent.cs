using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Email;

public sealed record EmailAttachment(string Filename, string Content, string ContentType);
public sealed record EmailContent(string Subject, string Html, string Text, IReadOnlyList<EmailAttachment> Attachments);
public enum EmailAudience { Customer, Driver }
public enum OrderEmailKind { Confirmed, Assigned, AssignmentRemoved, Cancelled, EnRoute, Delivered }
public enum InvoiceEmailKind { Issued, Sent, Paid, Overdue }
public enum PrivacyRequestEmailKind { Acknowledgement, InternalNotification }
public abstract record EmailTemplateModel
{
    public string? Locale { get; init; }
}
public sealed record AccountCreatedEmail(User User) : EmailTemplateModel;
public sealed record ClientOnboardedEmail(Client Client) : EmailTemplateModel;
public sealed record OrderEmail(Order Order, OrderEmailKind Kind, EmailAudience Audience) : EmailTemplateModel;
public sealed record InvoiceEmail(Invoice Invoice, InvoiceEmailKind Kind) : EmailTemplateModel;
public sealed record PrivacyRequestEmail(PrivacyRequest Request, PrivacyRequestEmailKind Kind) : EmailTemplateModel;

public interface IEmailTemplateRenderer
{
    EmailContent Render(EmailTemplateModel model);
    EmailContent Render(EmailTemplateModel model, string locale);
}

public interface IEmailSender
{
    Task<string> SendAsync(EmailContent content, string recipient, string idempotencyKey, CancellationToken cancellationToken = default);
}

public sealed class EmailDeliveryException(string message, bool isTransient, TimeSpan? retryAfter = null)
    : Exception(message)
{
    public bool IsTransient { get; } = isTransient;
    public TimeSpan? RetryAfter { get; } = retryAfter;
}
