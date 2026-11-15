using Microsoft.EntityFrameworkCore;
using soFlottOS.Api.Common;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities.Pricing;

namespace soFlottOS.Api.Data;

/// <summary>
/// Gives the cost &amp; pricing engine a sensible starting configuration in EVERY environment,
/// but only once: when no pricing profile exists yet. Admins then adjust everything in the UI.
/// <list type="bullet">
/// <item>Standard cost categories (vehicle, personnel, office, insurance, software, subcontractors).</item>
/// <item>A sample van and a sample driver / developer so vehicle and labour costs show real numbers.</item>
/// <item>One active default pricing profile per service type, so every quote and invoice resolves.</item>
/// </list>
/// The on-demand delivery profile mirrors the legacy appsettings tariff (base fee + per km + minimum),
/// so existing bookings keep their prices after the engine goes live.
/// </summary>
public sealed class PricingSeeder(AppDbContext db, PricingOptions pricingOptions, ILogger<PricingSeeder> logger)
{
    public async Task SeedAsync(CancellationToken cancellationToken = default)
    {
        if (await db.PricingProfiles.AnyAsync(cancellationToken))
        {
            return;
        }

        var categories = new Dictionary<string, CostCategory>
        {
            ["Vehicle"] = new() { Name = "Vehicle", Description = "Fuel, depreciation, tyres, service, insurance and tax for vans."},
            ["Personnel"] = new() { Name = "Personnel", Description = "Drivers, dispatchers, developers – salaries plus employer contributions."},
            ["Office & admin"] = new() { Name = "Office & admin", Description = "Rent, accounting, bank fees, phone & internet."},
            ["Insurance"] = new() { Name = "Insurance", Description = "Liability, cargo and business insurance policies."},
            ["Software & tools"] = new() { Name = "Software & tools", Description = "Licences, hosting, SaaS subscriptions, developer tooling."},
            ["Subcontractors"] = new() { Name = "Subcontractors", Description = "External carriers and freelancers billed per job or per hour."},
        };
        db.CostCategories.AddRange(categories.Values);

        var van = new VehicleProfile
        {
            Name = "Sample van (Transporter 3.5t)",
            Description = "Example figures – replace with your real vehicle data.",
            PurchasePrice = 32000m,
            ExpectedResidualValue = 8000m,
            ExpectedUsefulKilometres = 250000m,
            FuelConsumptionPer100Km = 8.5m,
            FuelPricePerLitre = 1.75m,
            TyreReplacementCost = 600m,
            TyreLifespanKm = 40000m,
            BrakeReplacementCost = 450m,
            BrakeLifespanKm = 60000m,
            ServiceCost = 400m,
            ServiceIntervalKm = 30000m,
            AnnualInsurance = 1800m,
            AnnualVehicleTax = 300m,
            MonthlyFinancingCost = 0m,
            AnnualOtherCosts = 250m,
            OperatingDaysPerYear = 240,
            ExpectedAnnualKilometres = 40000m,
        };
        db.VehicleProfiles.Add(van);

        var driver = new LabourProfile
        {
            Name = "Sample driver (full-time)",
            BusinessUnit = BusinessUnit.Express,
            ResourceType = "Driver",
            AnnualGrossSalary = 34000m,
            EmployerContributionPercent = 21m,
            AnnualAdditionalCosts = 1200m,
            PaidHoursPerWeek = 40m,
            AnnualLeaveDays = 28,
            PublicHolidayDays = 10,
            TrainingAndSickDays = 10,
            BillableUtilisationPercent = 85m,
        };
        var developer = new LabourProfile
        {
            Name = "Sample developer (full-time)",
            BusinessUnit = BusinessUnit.Digital,
            ResourceType = "Developer",
            AnnualGrossSalary = 65000m,
            EmployerContributionPercent = 21m,
            AnnualAdditionalCosts = 3000m,
            PaidHoursPerWeek = 40m,
            AnnualLeaveDays = 28,
            PublicHolidayDays = 10,
            TrainingAndSickDays = 12,
            BillableUtilisationPercent = 70m,
        };
        db.LabourProfiles.AddRange(driver, developer);

        var expressOverhead = new CostItem
        {
            Name = "Express overhead (office, accounting, dispatch software)",
            Description = "Monthly fixed overhead of the Express unit, spread over ~3,300 km per month.",
            Category = categories["Office & admin"],
            BusinessUnit = BusinessUnit.Express,
            CostType = CostType.Fixed,
            Amount = 1500m,
            Frequency = CostFrequency.Monthly,
            AllocationMethod = AllocationMethod.PerKilometre,
            AllocationDenominator = 3300m,
        };
        var cargoInsurance = new CostItem
        {
            Name = "Cargo & liability insurance",
            Category = categories["Insurance"],
            BusinessUnit = BusinessUnit.Express,
            CostType = CostType.Fixed,
            Amount = 2400m,
            Frequency = CostFrequency.Annually,
            AllocationMethod = AllocationMethod.PerKilometre,
            AllocationDenominator = 40000m,
        };
        var digitalOverhead = new CostItem
        {
            Name = "Digital overhead (tooling, hosting, licences)",
            Description = "Monthly fixed overhead of the Digital unit, spread over ~120 billable hours per month.",
            Category = categories["Software & tools"],
            BusinessUnit = BusinessUnit.Digital,
            CostType = CostType.Fixed,
            Amount = 900m,
            Frequency = CostFrequency.Monthly,
            AllocationMethod = AllocationMethod.PerHour,
            AllocationDenominator = 120m,
        };
        var subcontractorRate = new CostItem
        {
            Name = "Subcontracted carrier rate",
            Description = "What an external carrier charges us per kilometre.",
            Category = categories["Subcontractors"],
            BusinessUnit = BusinessUnit.Express,
            CostType = CostType.Variable,
            Amount = 0.95m,
            Frequency = CostFrequency.PerKilometre,
            AllocationMethod = AllocationMethod.PerKilometre,
        };
        db.CostItems.AddRange(expressOverhead, cargoInsurance, digitalOverhead, subcontractorRate);

        var routeCosts = new CostProfile
        {
            Name = "Own van + driver (Express)",
            Description = "Full cost of running our own van with an employed driver.",
            BusinessUnit = BusinessUnit.Express,
            VehicleProfile = van,
            LabourProfile = driver,
            RiskAllowanceMethod = RiskAllowanceMethod.PercentageOfTotalCosts,
            RiskAllowanceValue = 5m,
            Items = { new CostProfileItem { CostItem = expressOverhead }, new CostProfileItem { CostItem = cargoInsurance } },
        };
        var subcontractCosts = new CostProfile
        {
            Name = "Subcontracted carrier (Express)",
            Description = "We buy the transport from a partner carrier and add our overhead.",
            BusinessUnit = BusinessUnit.Express,
            RiskAllowanceMethod = RiskAllowanceMethod.PercentageOfDirectCosts,
            RiskAllowanceValue = 3m,
            Items = { new CostProfileItem { CostItem = subcontractorRate }, new CostProfileItem { CostItem = expressOverhead } },
        };
        var digitalCosts = new CostProfile
        {
            Name = "Developer hour (Digital)",
            Description = "Fully loaded developer cost incl. tooling overhead.",
            BusinessUnit = BusinessUnit.Digital,
            LabourProfile = developer,
            RiskAllowanceMethod = RiskAllowanceMethod.PercentageOfTotalCosts,
            RiskAllowanceValue = 10m,
            Items = { new CostProfileItem { CostItem = digitalOverhead } },
        };
        db.CostProfiles.AddRange(routeCosts, subcontractCosts, digitalCosts);

        var profiles = new List<PricingProfile>
        {
            new()
            {
                Name = "Standard on-demand delivery tariff",
                Description = "Base fee + price per kilometre, never below the minimum charge. Same numbers as the previous appsettings tariff.",
                BusinessUnit = BusinessUnit.Express,
                ServiceType = ServiceType.OnDemandDelivery,
                CostProfile = routeCosts,
                Strategy = PricingStrategyType.RateCard,
                MinimumPrice = pricingOptions.MinimumCharge,
                MinimumMarginPercent = 15m,
                IsDefault = true,
                Rates =
                {
                    new PricingProfileRate { Label = "Base fee", Unit = PricingUnit.Fixed, Rate = pricingOptions.BaseFee},
                    new PricingProfileRate { Label = "Per kilometre", Unit = PricingUnit.Kilometre, Rate = pricingOptions.RatePerKilometer},
                },
            },
            new()
            {
                Name = "Contracted route – cost + 25% margin",
                Description = "Fixed daily / weekly routes priced from full cost (van + driver + overhead) to reach a 25% margin.",
                BusinessUnit = BusinessUnit.Express,
                ServiceType = ServiceType.ContractedRoute,
                CostProfile = routeCosts,
                Strategy = PricingStrategyType.TargetMargin,
                TargetMarginPercent = 25m,
                MinimumMarginPercent = 15m,
                IsDefault = true,
            },
            new()
            {
                Name = "Subcontracting – carrier cost + 18% markup",
                Description = "Partner carrier price plus our markup for coordination and liability.",
                BusinessUnit = BusinessUnit.Express,
                ServiceType = ServiceType.Subcontracting,
                CostProfile = subcontractCosts,
                Strategy = PricingStrategyType.CostPlus,
                MarkupPercent = 18m,
                MinimumMarginPercent = 10m,
                IsDefault = true,
            },
            new()
            {
                Name = "Recurring B2B agreement – cost + 22% margin",
                Description = "Monthly agreements with regular volumes; margin slightly below ad-hoc work.",
                BusinessUnit = BusinessUnit.Express,
                ServiceType = ServiceType.RecurringB2BAgreement,
                CostProfile = routeCosts,
                Strategy = PricingStrategyType.TargetMargin,
                TargetMarginPercent = 22m,
                MinimumMarginPercent = 12m,
                IsDefault = true,
            },
            DigitalRateCard(ServiceType.SoftwareDevelopment, "Software development – hourly rate card", 95m, 720m, digitalCosts),
            DigitalRateCard(ServiceType.ApiIntegration, "API integration – hourly rate card", 105m, 800m, digitalCosts),
            DigitalRateCard(ServiceType.ItConsulting, "IT consulting – hourly rate card", 120m, 900m, digitalCosts),
            DigitalRateCard(ServiceType.DigitalTransformation, "Digital transformation – hourly rate card", 110m, 850m, digitalCosts),
            new()
            {
                Name = "Maintenance & support – cost + 35% margin",
                Description = "Monthly retainers priced from developer hours with a healthy margin for on-call risk.",
                BusinessUnit = BusinessUnit.Digital,
                ServiceType = ServiceType.MaintenanceSupport,
                CostProfile = digitalCosts,
                Strategy = PricingStrategyType.TargetMargin,
                TargetMarginPercent = 35m,
                MinimumMarginPercent = 20m,
                IsDefault = true,
            },
        };
        db.PricingProfiles.AddRange(profiles);

        await db.SaveChangesAsync(cancellationToken);
        logger.LogInformation("Seeded cost & pricing engine defaults: {Profiles} pricing profiles.", profiles.Count);
    }

    private static PricingProfile DigitalRateCard(ServiceType serviceType, string name, decimal hourly, decimal daily, CostProfile costs) => new()
    {
        Name = name,
        Description = "Hourly and daily rates; cost profile attached so the margin is visible on every calculation.",
        BusinessUnit = BusinessUnit.Digital,
        ServiceType = serviceType,
        CostProfile = costs,
        Strategy = PricingStrategyType.RateCard,
        MinimumMarginPercent = 25m,
        IsDefault = true,
        Rates =
        {
            new PricingProfileRate { Label = "Per hour", Unit = PricingUnit.Hour, Rate = hourly},
            new PricingProfileRate { Label = "Per day", Unit = PricingUnit.Day, Rate = daily},
        },
    };
}
