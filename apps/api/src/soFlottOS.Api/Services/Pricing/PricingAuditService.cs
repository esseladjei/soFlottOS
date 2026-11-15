using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Dtos.Pricing;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>Writes the "who changed what" trail for pricing configuration (spec section 15).</summary>
public interface IPricingAuditService
{
    Task RecordAsync(string entityType, int entityId, PricingAuditAction action, string summary, CurrentUser? user, CancellationToken ct);

    Task<IReadOnlyList<PricingAuditResponse>> ListAsync(int take, CancellationToken ct);
}

public sealed class PricingAuditService(AppDbContext db) : IPricingAuditService
{
    public async Task RecordAsync(string entityType, int entityId, PricingAuditAction action, string summary, CurrentUser? user, CancellationToken ct)
    {
        db.PricingAuditEntries.Add(new PricingAuditEntry
        {
            EntityType = entityType,
            EntityId = entityId,
            Action = action,
            Summary = summary.Length > 1000 ? summary[..1000] : summary,
            UserId = user?.UserId,
        });
        await db.SaveChangesAsync(ct);
    }

    public async Task<IReadOnlyList<PricingAuditResponse>> ListAsync(int take, CancellationToken ct) =>
        await db.PricingAuditEntries.AsNoTracking()
            .OrderByDescending(a => a.CreatedAt).ThenByDescending(a => a.Id)
            .Take(Math.Clamp(take, 1, 500))
            .Select(a => new PricingAuditResponse(a.Id, a.EntityType, a.EntityId, a.Action, a.Summary, a.UserId, a.CreatedAt))
            .ToListAsync(ct);
}
