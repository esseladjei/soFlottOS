using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities;
using soFlottOS.Api.Domain.Entities.Pricing;
using soFlottOS.Api.Services.Pricing;
using Xunit;

namespace soFlottOS.Api.Tests;

/// <summary>
/// Pure engine maths: cost build-up (vehicle, labour, overhead allocation, risk), the four pricing
/// strategies, minimum price, manual override and the three tax treatments (DE / EU / third country).
/// </summary>
public sealed class PricingCalculatorTests
{
    private static readonly DateOnly Today = new(2026, 3, 1);

    private static PricingResult Run(PricingRequest request, PricingProfile? profile, TaxTreatment treatment = TaxTreatment.StandardGermanVat) =>
        PricingCalculator.Calculate(request, profile, treatment, 0.19m, Today);

    private static PricingProfile RateCard(params PricingProfileRate[] rates)
    {
        var profile = new PricingProfile
        {
            Id = 1, Name = "Test", BusinessUnit = BusinessUnit.Express, ServiceType = ServiceType.OnDemandDelivery,
            Strategy = PricingStrategyType.RateCard, Version = 1, IsActive = true,
        };
        foreach (var rate in rates) profile.Rates.Add(rate);
        return profile;
    }

    private static CostProfile OwnVanAndDriver() => new()
    {
        Id = 5, Name = "Own van", BusinessUnit = BusinessUnit.Express, Version = 2,
        VehicleProfile = new VehicleProfile
        {
            Name = "Van", PurchasePrice = 32000m, ExpectedResidualValue = 8000m, ExpectedUsefulKilometres = 240000m,
            FuelConsumptionPer100Km = 8m, FuelPricePerLitre = 1.75m, TyreReplacementCost = 600m, TyreLifespanKm = 40000m,
            BrakeReplacementCost = 450m, BrakeLifespanKm = 60000m, ServiceCost = 400m, ServiceIntervalKm = 30000m,
            AnnualInsurance = 1800m, AnnualVehicleTax = 300m, MonthlyFinancingCost = 0m, AnnualOtherCosts = 300m,
            OperatingDaysPerYear = 240, ExpectedAnnualKilometres = 40000m,
        },
        LabourProfile = new LabourProfile
        {
            Name = "Driver", BusinessUnit = BusinessUnit.Express, ResourceType = "Driver", AnnualGrossSalary = 34000m,
            EmployerContributionPercent = 21m, AnnualAdditionalCosts = 1200m, PaidHoursPerWeek = 40m,
            AnnualLeaveDays = 28, PublicHolidayDays = 10, TrainingAndSickDays = 10, BillableUtilisationPercent = 100m,
        },
        RiskAllowanceMethod = RiskAllowanceMethod.PercentageOfTotalCosts,
        RiskAllowanceValue = 5m,
    };

    [Fact]
    public void RateCard_AddsFixedAndPerKilometreLines_WithGermanVat()
    {
        var profile = RateCard(
            new PricingProfileRate { Label = "Base fee", Unit = PricingUnit.Fixed, Rate = 19.50m, SortOrder = 1 },
            new PricingProfileRate { Label = "Per km", Unit = PricingUnit.Kilometre, Rate = 1.35m, SortOrder = 2 });

        var result = Run(new PricingRequest(ServiceType.OnDemandDelivery, null, new PricingQuantities(Kilometres: 10m)), profile);

        Assert.Equal(CalculationStatus.Ok, result.Status);
        Assert.Equal(33.00m, result.FinalNetSellingPrice);
        Assert.Equal(0.19m, result.VatRate);
        Assert.Equal(6.27m, result.VatAmount);
        Assert.Equal(39.27m, result.FinalGrossSellingPrice);
        Assert.Equal(TaxTreatment.StandardGermanVat, result.TaxTreatment);
        Assert.Null(result.TaxNote);
    }

    [Fact]
    public void RateCard_AppliesMinimumPriceAndIncludedQuantity()
    {
        var profile = RateCard(new PricingProfileRate { Label = "Per km", Unit = PricingUnit.Kilometre, Rate = 2m, IncludedQuantity = 5m });
        profile.MinimumPrice = 25m;

        var result = Run(new PricingRequest(ServiceType.OnDemandDelivery, null, new PricingQuantities(Kilometres: 8m)), profile);

        // (8 − 5) × 2 = 6 → raised to minimum 25.
        Assert.Equal(25m, result.FinalNetSellingPrice);
        Assert.Contains(result.PriceLines, line => line.Label == "Minimum price applied" && line.Amount == 19m);
    }

    [Theory]
    [InlineData(TaxTreatment.ReverseChargeEu)]
    [InlineData(TaxTreatment.NonTaxableThirdCountry)]
    public void ForeignBusinessCustomers_GetNoVatButALegalNote(TaxTreatment treatment)
    {
        var profile = RateCard(new PricingProfileRate { Label = "Fixed", Unit = PricingUnit.Fixed, Rate = 100m });

        var result = Run(new PricingRequest(ServiceType.ItConsulting, null), profile, treatment);

        Assert.Equal(0m, result.VatRate);
        Assert.Equal(0m, result.VatAmount);
        Assert.Equal(100m, result.FinalGrossSellingPrice);
        Assert.Equal(TaxTreatmentResolver.NoteFor(treatment), result.TaxNote);
        Assert.NotNull(result.TaxNote);
    }

    [Fact]
    public void TargetMargin_BuildsCostFromVehicleLabourAndRisk_ThenReachesTheMargin()
    {
        var profile = new PricingProfile
        {
            Id = 2, Name = "Route", BusinessUnit = BusinessUnit.Express, ServiceType = ServiceType.ContractedRoute,
            Strategy = PricingStrategyType.TargetMargin, TargetMarginPercent = 25m, Version = 3, CostProfile = OwnVanAndDriver(), CostProfileId = 5,
        };

        var result = Run(new PricingRequest(ServiceType.ContractedRoute, null, new PricingQuantities(Kilometres: 120m, Hours: 8m, Days: 1m)), profile);

        Assert.Equal(CalculationStatus.Ok, result.Status);
        Assert.True(result.VehicleCosts > 0, "vehicle costs should be allocated");
        Assert.True(result.LabourCosts > 0, "labour costs should be allocated");
        Assert.Equal(PricingCalculator.Round((result.DirectCosts + result.AllocatedOverhead + result.VehicleCosts + result.LabourCosts) * 0.05m), result.RiskAllowance);
        Assert.Equal(PricingCalculator.Round(result.TotalEstimatedCost / 0.75m), result.FinalNetSellingPrice);
        Assert.InRange(result.ExpectedMarginPercent, 24.9m, 25.1m);
        Assert.Equal(5, result.CostProfileId);
        Assert.Equal(3, result.PricingProfileVersion);
        Assert.Equal(2, result.CostProfileVersion);
    }

    [Fact]
    public void CostPlus_AllocatesMonthlyOverheadPerKilometre()
    {
        var costProfile = new CostProfile { Id = 9, Name = "Sub", BusinessUnit = BusinessUnit.Express, Version = 1 };
        costProfile.Items.Add(new CostProfileItem
        {
            CostItem = new CostItem
            {
                Name = "Carrier", CostType = CostType.Variable, Amount = 1m, Frequency = CostFrequency.PerKilometre, AllocationMethod = AllocationMethod.PerKilometre,
                Category = new CostCategory { Name = "Subcontractors" },
            },
        });
        costProfile.Items.Add(new CostProfileItem
        {
            CostItem = new CostItem
            {
                Name = "Office", CostType = CostType.Fixed, Amount = 1200m, Frequency = CostFrequency.Monthly,
                AllocationMethod = AllocationMethod.PerKilometre, AllocationDenominator = 4800m, Category = new CostCategory { Name = "Office" },
            },
        });
        var profile = new PricingProfile
        {
            Id = 3, Name = "Sub", BusinessUnit = BusinessUnit.Express, ServiceType = ServiceType.Subcontracting,
            Strategy = PricingStrategyType.CostPlus, MarkupPercent = 20m, CostProfile = costProfile, CostProfileId = 9,
        };

        var result = Run(new PricingRequest(ServiceType.Subcontracting, null, new PricingQuantities(Kilometres: 100m)), profile);

        // Direct: 100 km × 1 = 100. Overhead: 1200 × 12 / 4800 = 3 per km → 300.
        Assert.Equal(100m, result.DirectCosts);
        Assert.Equal(300m, result.AllocatedOverhead);
        Assert.Equal(400m, result.TotalEstimatedCost);
        Assert.Equal(480m, result.FinalNetSellingPrice);
        Assert.Equal(80m, result.ExpectedProfit);
    }

    [Fact]
    public void MissingProfile_IsAnErrorNotAnException()
    {
        var result = Run(new PricingRequest(ServiceType.ApiIntegration, null), null);

        Assert.Equal(CalculationStatus.Error, result.Status);
        Assert.Contains(result.Errors, error => error.Contains("No active pricing profile", StringComparison.Ordinal));
    }

    [Fact]
    public void ManualOverride_ReplacesPriceAndWarns()
    {
        var profile = RateCard(new PricingProfileRate { Label = "Fixed", Unit = PricingUnit.Fixed, Rate = 100m });
        profile.MinimumMarginPercent = 50m;

        var result = Run(new PricingRequest(ServiceType.SoftwareDevelopment, null, ManualOverridePrice: 80m, ManualOverrideReason: "Pilot customer"), profile);

        Assert.Equal(80m, result.FinalNetSellingPrice);
        Assert.Equal(CalculationStatus.Warning, result.Status);
        Assert.Contains(result.Warnings, warning => warning.Contains("Pilot customer", StringComparison.Ordinal));
    }
}

public sealed class TaxTreatmentResolverTests
{
    [Theory]
    [InlineData("Deutschland", TaxTreatment.StandardGermanVat)]
    [InlineData("Germany", TaxTreatment.StandardGermanVat)]
    [InlineData("DE", TaxTreatment.StandardGermanVat)]
    [InlineData("Ireland", TaxTreatment.ReverseChargeEu)]
    [InlineData("Irland", TaxTreatment.ReverseChargeEu)]
    [InlineData("France", TaxTreatment.ReverseChargeEu)]
    [InlineData("United Kingdom", TaxTreatment.NonTaxableThirdCountry)]
    [InlineData("UK", TaxTreatment.NonTaxableThirdCountry)]
    [InlineData("United Arab Emirates", TaxTreatment.NonTaxableThirdCountry)]
    [InlineData("UAE", TaxTreatment.NonTaxableThirdCountry)]
    public void Country_DrivesTheTaxTreatment(string country, TaxTreatment expected) =>
        Assert.Equal(expected, TaxTreatmentResolver.ResolveFromCountry(country));

    [Fact]
    public void ClientOverride_WinsOverCountry()
    {
        var client = new Client { Country = "Ireland", TaxTreatmentOverride = TaxTreatment.StandardGermanVat };

        Assert.Equal(TaxTreatment.StandardGermanVat, TaxTreatmentResolver.Resolve(client));
    }

    [Fact]
    public void EuClientWithoutVatId_GetsAWarning()
    {
        var client = new Client { Country = "Ireland", TaxIdNumber = null };

        Assert.NotEmpty(TaxTreatmentResolver.Warnings(client, TaxTreatment.ReverseChargeEu));
    }

    [Fact]
    public void VatRate_IsZeroOutsideGermany()
    {
        Assert.Equal(0.19m, TaxTreatmentResolver.VatRateFor(TaxTreatment.StandardGermanVat, 0.19m));
        Assert.Equal(0m, TaxTreatmentResolver.VatRateFor(TaxTreatment.ReverseChargeEu, 0.19m));
        Assert.Equal(0m, TaxTreatmentResolver.VatRateFor(TaxTreatment.NonTaxableThirdCountry, 0.19m));
    }
}

public sealed class ServiceTypeCodeTests
{
    [Fact]
    public void EveryServiceType_HasAUniqueThreeLetterInvoiceCode()
    {
        var codes = ServiceTypes.All.Select(s => s.InvoiceCode()).ToList();

        Assert.Equal(codes.Count, codes.Distinct().Count());
        Assert.All(codes, code => Assert.Equal(3, code.Length));
        Assert.Equal("DLV", ServiceType.OnDemandDelivery.InvoiceCode());
        Assert.Equal("SWD", ServiceType.SoftwareDevelopment.InvoiceCode());
        Assert.Equal(BusinessUnit.Digital, ServiceType.ItConsulting.BusinessUnit());
        Assert.Equal(BusinessUnit.Express, ServiceType.ContractedRoute.BusinessUnit());
    }
}
