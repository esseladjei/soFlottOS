using soFlottOS.Api.Common;
using soFlottOS.Api.Data;
using soFlottOS.Api.Services.Pricing;

namespace soFlottOS.Api.Tests;

/// <summary>Builds the real cost &amp; pricing engine on top of a test database.</summary>
internal static class PricingEngineFactory
{
    public static IPricingCalculationService Create(AppDbContext context, PricingOptions pricing, TimeProvider? clock = null)
    {
        var audit = new PricingAuditService(context);
        var profiles = new PricingProfileService(context, audit);
        return new PricingCalculationService(context, profiles, pricing, clock ?? TimeProvider.System);
    }
}
