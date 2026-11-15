using soFlottOS.Api.Common;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Dtos;
using soFlottOS.Api.Services.Email;
using soFlottOS.Api.Services.Pricing;

namespace soFlottOS.Api.Services;

public interface IInvoiceService
{
    Task<Invoice> CreateForOrderAsync(Order order, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<InvoiceResponse>> ListAsync(InvoiceStatus? status, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<InvoiceResponse>> ListMineAsync(CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<InvoiceDetailResponse> GetAsync(int id, CurrentUser currentUser, CancellationToken cancellationToken = default);

    Task<InvoiceResponse> UpdateStatusAsync(int id, UpdateInvoiceStatusRequest request, CancellationToken cancellationToken = default);
}

/// <summary>
/// Creates and manages German invoices (Rechnungen).
/// <para>
/// v1 is deliberately simple: one invoice per order, created automatically the moment the
/// order is booked, so the client can pay by bank transfer or PayPal right away.
/// An admin then flips the status to Paid once the money arrives.
/// </para>
/// </summary>
public sealed class InvoiceService(
    IInvoiceRepository invoiceRepository,
    IClientRepository clientRepository,
    InvoicingOptions invoicingOptions,
    IEmailCommunications emails) : IInvoiceService
{
    private readonly IInvoiceRepository _invoiceRepository = invoiceRepository;
    private readonly IClientRepository _clientRepository = clientRepository;
    private readonly InvoicingOptions _invoicingOptions = invoicingOptions;

    /// <summary>Called by <see cref="OrderService"/> straight after an order is stored.</summary>
    public async Task<Invoice> CreateForOrderAsync(Order order, CancellationToken cancellationToken = default)
    {
        var issuedAt = DateTimeOffset.UtcNow;

        var invoice = new Invoice
        {
            InvoiceNumber = await BuildInvoiceNumberAsync(order.ServiceType, issuedAt, cancellationToken),
            ServiceType = order.ServiceType,
            TaxTreatment = order.TaxTreatment,
            TaxNote = TaxTreatmentResolver.NoteFor(order.TaxTreatment),
            ClientId = order.ClientId,
            Client = order.Client,
            OrderId = order.Id,
            Order = order,
            NetTotal = order.NetPrice,
            VatRate = order.VatRate,
            VatTotal = order.VatAmount,
            GrossTotal = order.GrossPrice,
            PaymentMethod = order.PaymentMethod,
            Status = InvoiceStatus.Sent,
            IssuedAt = issuedAt,
            DueDate = issuedAt.AddDays(_invoicingOptions.PaymentTermsDays)
        };

        emails.InvoiceChanged(invoice, InvoiceEmailKind.Issued);
        await _invoiceRepository.AddAsync(invoice, cancellationToken);

        return invoice;
    }

    public async Task<IReadOnlyList<InvoiceResponse>> ListAsync(
        InvoiceStatus? status,
        CancellationToken cancellationToken = default)
    {
        var invoices = await _invoiceRepository.ListAsync(status, cancellationToken);
        return invoices.Select(invoice => invoice.ToResponse()).ToArray();
    }

    public async Task<IReadOnlyList<InvoiceResponse>> ListMineAsync(
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken)
            ?? throw new ForbiddenException("This login is not linked to a client profile.");

        var invoices = await _invoiceRepository.ListForClientAsync(client.Id, cancellationToken);
        return invoices.Select(invoice => invoice.ToResponse()).ToArray();
    }

    public async Task<InvoiceDetailResponse> GetAsync(
        int id,
        CurrentUser currentUser,
        CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Invoice {id} was not found.");

        if (!currentUser.IsAdmin)
        {
            var client = await _clientRepository.GetByUserIdAsync(currentUser.UserId, cancellationToken);
            if (client is null || client.Id != invoice.ClientId)
            {
                throw new ForbiddenException("You may only view your own invoices.");
            }
        }

        return invoice.ToDetail(_invoicingOptions);
    }

    /// <summary>Admin marks an invoice as Sent, Paid or Overdue after a manual bank/PayPal check.</summary>
    public async Task<InvoiceResponse> UpdateStatusAsync(
        int id,
        UpdateInvoiceStatusRequest request,
        CancellationToken cancellationToken = default)
    {
        var invoice = await _invoiceRepository.GetByIdAsync(id, cancellationToken)
            ?? throw new NotFoundException($"Invoice {id} was not found.");

        if (invoice.Status == InvoiceStatus.Paid && request.Status != InvoiceStatus.Paid)
        {
            throw new ConflictException("A paid invoice cannot be reopened. Issue a credit note instead.");
        }

        if (invoice.Status == request.Status)
            return invoice.ToResponse();

        invoice.Status = request.Status;
        invoice.PaidAt = request.Status == InvoiceStatus.Paid ? DateTimeOffset.UtcNow : null;

        if (request.Status is InvoiceStatus.Sent or InvoiceStatus.Paid or InvoiceStatus.Overdue)
            emails.InvoiceChanged(invoice, request.Status switch
            {
                InvoiceStatus.Paid => InvoiceEmailKind.Paid,
                InvoiceStatus.Overdue => InvoiceEmailKind.Overdue,
                _ => InvoiceEmailKind.Sent
            });
        await _invoiceRepository.SaveChangesAsync(cancellationToken);

        return invoice.ToResponse();
    }

    /// <summary>
    /// German law requires consecutive, gap-free invoice numbers. We keep ONE yearly sequence for the
    /// whole company and embed the service code so anyone can tell at a glance what was billed:
    /// SOFLOTT-DLV-2026-1001 (on-demand delivery), SOFLOTT-RTE-2026-1002 (contracted route),
    /// SOFLOTT-SWD-2026-1003 (software development), see <see cref="ServiceTypes.InvoiceCode"/>.
    /// The sequence restarts every year from Invoicing:StartingSequence.
    /// </summary>
    private async Task<string> BuildInvoiceNumberAsync(ServiceType serviceType, DateTimeOffset issuedAt, CancellationToken cancellationToken)
    {
        var issuedThisYear = await _invoiceRepository.CountIssuedInYearAsync(issuedAt.Year, cancellationToken);
        var sequence = _invoicingOptions.StartingSequence + issuedThisYear;

        return $"{_invoicingOptions.Prefix}-{serviceType.InvoiceCode()}-{issuedAt.Year}-{sequence:D4}";
    }
}
