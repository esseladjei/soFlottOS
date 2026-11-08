using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Data;
using soFlottOS.Api.Data.Repositories;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;

namespace soFlottOS.Api.Tests;

// Preserve the real repository; only its PostgreSQL year query is adapted to the test ticks mapping.
internal sealed class EmailTestInvoiceRepository(AppDbContext context) : IInvoiceRepository
{
    private readonly InvoiceRepository _repository = new(context);
    public Task<Invoice?> GetByIdAsync(int id, CancellationToken cancellationToken = default) => _repository.GetByIdAsync(id, cancellationToken);
    public Task<IReadOnlyList<Invoice>> ListAsync(InvoiceStatus? status, CancellationToken cancellationToken = default) => _repository.ListAsync(status, cancellationToken);
    public Task<IReadOnlyList<Invoice>> ListForClientAsync(int clientId, CancellationToken cancellationToken = default) => _repository.ListForClientAsync(clientId, cancellationToken);
    public Task<Invoice> AddAsync(Invoice invoice, CancellationToken cancellationToken = default) => _repository.AddAsync(invoice, cancellationToken);
    public Task SaveChangesAsync(CancellationToken cancellationToken = default) => _repository.SaveChangesAsync(cancellationToken);
    public Task<int> CountIssuedInYearAsync(int year, CancellationToken cancellationToken = default)
    {
        var start = new DateTimeOffset(year, 1, 1, 0, 0, 0, TimeSpan.Zero);
        var end = start.AddYears(1);
        return context.Invoices.CountAsync(invoice => invoice.IssuedAt >= start && invoice.IssuedAt < end, cancellationToken);
    }
    public Task<decimal> SumGrossIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default) => _repository.SumGrossIssuedSinceAsync(since, cancellationToken);
    public Task<decimal> SumNetIssuedSinceAsync(DateTimeOffset since, CancellationToken cancellationToken = default) => _repository.SumNetIssuedSinceAsync(since, cancellationToken);
    public Task<decimal> SumOutstandingGrossAsync(CancellationToken cancellationToken = default) => _repository.SumOutstandingGrossAsync(cancellationToken);
    public Task<int> CountOutstandingAsync(CancellationToken cancellationToken = default) => _repository.CountOutstandingAsync(cancellationToken);
}
