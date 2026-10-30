using soFlottOS.Api.Common;
using soFlottOS.Api.Services;
using Xunit;

namespace soFlottOS.Api.Tests;

/// <summary>Checks the money maths: distance pricing, the minimum charge and 19% MwSt.</summary>
public sealed class PricingServiceTests
{
    private static PricingService CreateService() => new(new PricingOptions
    {
        BaseFee = 19.50m,
        RatePerKilometer = 1.35m,
        VatRate = 0.19m,
        MinimumCharge = 25.00m
    });

    [Fact]
    public void Calculate_AddsBaseFeeAndDistanceRate()
    {
        var result = CreateService().Calculate(distanceKm: 10m);

        // 19.50 + (10 * 1.35) = 33.00
        Assert.Equal(33.00m, result.NetPrice);
        Assert.Equal(6.27m, result.VatAmount);
        Assert.Equal(39.27m, result.GrossPrice);
        Assert.Equal(0.19m, result.VatRate);
        Assert.Equal(19.50m, result.BaseFee);
        Assert.Equal(1.35m, result.RatePerKilometer);
        Assert.Equal(13.50m, result.DistanceCost);
        Assert.False(result.MinimumChargeApplied);
    }

    [Fact]
    public void Calculate_NeverGoesBelowTheMinimumCharge()
    {
        var result = CreateService().Calculate(distanceKm: 0m);

        Assert.Equal(25.00m, result.NetPrice);
        Assert.Equal(29.75m, result.GrossPrice);
        Assert.True(result.MinimumChargeApplied);
    }

    [Fact]
    public void Calculate_UsesNegotiatedClientRates()
    {
        var result = CreateService().Calculate(distanceKm: 20m, baseFeeOverride: 30m, ratePerKilometerOverride: 1m);

        Assert.Equal(50.00m, result.NetPrice);
        Assert.Equal(9.50m, result.VatAmount);
        Assert.Equal(59.50m, result.GrossPrice);
        Assert.Equal(1m, result.RatePerKilometer);
        Assert.Equal(20.00m, result.DistanceCost);
    }

    [Fact]
    public void Calculate_RejectsNegativeDistance() =>
        Assert.Throws<ValidationException>(() => CreateService().Calculate(distanceKm: -1m));
}
