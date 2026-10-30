using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Data.Repositories;

/// <summary>Database queries for invoices (Rechnungen).</summary>
public interface IInvoiceRepository
{
    Task<Invoice?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Invoice>> ListAsync(InvoiceStatus? status, CancellationToken cancellationToken = default);

    Task<IReadOnlyList<Invoice>> ListForClientAsync(int clientId, CancellationToken cancellationToken = default);

    Task<Invoice> AddAsync(Invoice invoice, CancellationToken cancellationToken = default);

    Task SaveChangesAsync(CancellationToken cancellationToken = default);

    Task<int> CountIssuedInYearAsync(int year, CancellationToken cancellationToken = default);

    Task<decimal> SumGrossIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default);

    Task<decimal> SumNetIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default);

    Task<decimal> SumOutstandingGrossAsync(CancellationToken cancellationToken = default);

    Task<int> CountOutstandingAsync(CancellationToken cancellationToken = default);
}

/// <inheritdoc />
public sealed class InvoiceRepository(AppDbContext dbContext) : IInvoiceRepository
{
    /// <summary>Invoices that have not been paid (or cancelled) yet.</summary>
    private static readonly InvoiceStatus[] OutstandingStatuses =
        [InvoiceStatus.Draft, InvoiceStatus.Sent, InvoiceStatus.Overdue];

    private readonly AppDbContext _dbContext = dbContext;

    public Task<Invoice?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        WithDetails(_dbContext.Invoices).SingleOrDefaultAsync(invoice => invoice.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Invoice>> ListAsync(InvoiceStatus? status, CancellationToken cancellationToken = default)
    {
        var query = WithDetails(_dbContext.Invoices).AsNoTracking();
        if (status.HasValue)
        {
            query = query.Where(invoice => invoice.Status == status.Value);
        }

        return await query.OrderByDescending(invoice => invoice.IssuedAt).ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Invoice>> ListForClientAsync(int clientId, CancellationToken cancellationToken = default) =>
        await WithDetails(_dbContext.Invoices)
            .AsNoTracking()
            .Where(invoice => invoice.ClientId == clientId)
            .OrderByDescending(invoice => invoice.IssuedAt)
            .ToListAsync(cancellationToken);

    public Task SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    public async Task<Invoice> AddAsync(Invoice invoice, CancellationToken cancellationToken = default)
    {
        await _dbContext.Invoices.AddAsync(invoice, cancellationToken);
        await _dbContext.SaveChangesAsync(cancellationToken);
        return invoice;
    }

    /// <summary>Used to build the consecutive invoice number SOFLOTT-{year}-{sequence}.</summary>
    public Task<int> CountIssuedInYearAsync(int year, CancellationToken cancellationToken = default) =>
        _dbContext.Invoices.CountAsync(invoice => invoice.IssuedAt.Year == year, cancellationToken);

    public async Task<decimal> SumGrossIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default) =>
        await _dbContext.Invoices
            .Where(invoice => invoice.IssuedAt >= since)
            .SumAsync(invoice => (decimal?)invoice.GrossTotal, cancellationToken) ?? 0m;

    public async Task<decimal> SumNetIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default) =>
        await _dbContext.Invoices
            .Where(invoice => invoice.IssuedAt >= since)
            .SumAsync(invoice => (decimal?)invoice.NetTotal, cancellationToken) ?? 0m;

    public async Task<decimal> SumOutstandingGrossAsync(CancellationToken cancellationToken = default) =>
        await _dbContext.Invoices
            .Where(invoice => OutstandingStatuses.Contains(invoice.Status))
            .SumAsync(invoice => (decimal?)invoice.GrossTotal, cancellationToken) ?? 0m;

    public Task<int> CountOutstandingAsync(CancellationToken cancellationToken = default) =>
        _dbContext.Invoices.CountAsync(invoice => OutstandingStatuses.Contains(invoice.Status), cancellationToken);

    private static IQueryable<Invoice> WithDetails(IQueryable<Invoice> query) =>
        query
            .Include(invoice => invoice.Client)
                .ThenInclude(client => client.User)
            .Include(invoice => invoice.Order)
                .ThenInclude(order => order.AssignedDriver)
            .Include(invoice => invoice.Order)
                .ThenInclude(order => order.ProofOfDelivery);
}
