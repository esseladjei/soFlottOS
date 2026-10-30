using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Services.Email;

public interface IEmailCommunications
{
    void AccountCreated(User user);
    void ClientOnboarded(Client client);
    void OrderChanged(Order order, OrderEmailKind kind, User? affectedDriver = null);
    void InvoiceChanged(Invoice invoice, InvoiceEmailKind kind);
}

// Recipient policy is separate from templates and from the delivery provider.
public sealed class EmailCommunications(IEmailQueue queue) : IEmailCommunications
{
    public void AccountCreated(User user) =>
        queue.Stage("account_created", new AccountCreatedEmail(user) { Locale = user.PreferredLocale }, user.Email);

    public void ClientOnboarded(Client client) =>
        queue.Stage("client_onboarded", new ClientOnboardedEmail(client) { Locale = client.User?.PreferredLocale }, CustomerRecipients(client));

    public void OrderChanged(Order order, OrderEmailKind kind, User? affectedDriver = null)
    {
        var eventType = $"order_{kind.ToString().ToLowerInvariant()}";
        if (kind != OrderEmailKind.AssignmentRemoved)
            queue.Stage(eventType, new OrderEmail(order, kind, EmailAudience.Customer) { Locale = order.Client.User?.PreferredLocale }, CustomerRecipients(order.Client));

        var driver = affectedDriver ?? order.AssignedDriver;
        if (driver is not null && kind is OrderEmailKind.Assigned or OrderEmailKind.AssignmentRemoved or OrderEmailKind.Cancelled or OrderEmailKind.Delivered)
            queue.Stage(eventType, new OrderEmail(order, kind, EmailAudience.Driver) { Locale = driver.PreferredLocale }, driver.Email);
    }

    public void InvoiceChanged(Invoice invoice, InvoiceEmailKind kind) =>
        queue.Stage($"invoice_{kind.ToString().ToLowerInvariant()}", new InvoiceEmail(invoice, kind) { Locale = invoice.Client.User?.PreferredLocale }, CustomerRecipients(invoice.Client));

    private static string[] CustomerRecipients(Client client) =>
        client.User is null ? [client.Email] : [client.Email, client.User.Email];
}
