using soFlottOS.Api.Common;

namespace soFlottOS.Api.Services;

/// <summary>Result of a price calculation, itemised so the booking form can explain the price.</summary>
public sealed record PriceBreakdown(
    decimal NetPrice,
    decimal VatAmount,
    decimal GrossPrice,
    decimal VatRate,
    decimal BaseFee,
    decimal RatePerKilometer,
    decimal DistanceCost,
    bool MinimumChargeApplied);

public interface IPricingService
{
    PriceBreakdown Calculate(decimal distanceKm, decimal? baseFeeOverride = null, decimal? ratePerKilometerOverride = null);
}

/// <summary>
/// The pricing and tax engine.
/// Net = base fee + (distance x rate per km), never below the minimum charge.
/// Gross = net + 19% German VAT (MwSt).
/// Clients with a negotiated contract can override the base fee and the km rate.
/// </summary>
public sealed class PricingService(PricingOptions options) : IPricingService
{
    private readonly PricingOptions _options = options;

    public PriceBreakdown Calculate(
        decimal distanceKm,
        decimal? baseFeeOverride = null,
        decimal? ratePerKilometerOverride = null)
    {
        if (distanceKm < 0)
        {
            throw new ValidationException("Distance must be zero or greater.");
        }

        var baseFee = baseFeeOverride ?? _options.BaseFee;
        var ratePerKilometer = ratePerKilometerOverride ?? _options.RatePerKilometer;

        var distanceCost = Round(distanceKm * ratePerKilometer);
        var calculated = Round(baseFee + distanceCost);
        var netPrice = Math.Max(calculated, _options.MinimumCharge);

        var vatAmount = Round(netPrice * _options.VatRate);
        var grossPrice = Round(netPrice + vatAmount);

        return new PriceBreakdown(
            netPrice,
            vatAmount,
            grossPrice,
            _options.VatRate,
            baseFee,
            ratePerKilometer,
            distanceCost,
            netPrice > calculated);
    }

    /// <summary>Money is always rounded to cents, away from zero (German invoicing convention).</summary>
    private static decimal Round(decimal value) => decimal.Round(value, 2, MidpointRounding.AwayFromZero);
}
