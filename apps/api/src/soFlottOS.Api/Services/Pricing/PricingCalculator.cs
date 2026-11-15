using System.Globalization;
using soFlottOS.Api.Domain;
using soFlottOS.Api.Domain.Entities.Pricing;

namespace soFlottOS.Api.Services.Pricing;

/// <summary>
/// The heart of the engine (spec section 10). Pure and deterministic: give it the resolved
/// configuration and the request and it returns the same answer every time, with every line explained.
/// No database, no clock, no I/O - which is what makes it easy to test and to trust.
/// <para>
/// Order of operations: cost items → vehicle → labour → extra costs → risk → total cost →
/// strategy price → minimum price → surcharges/discounts → manual override → VAT → profit.
/// </para>
/// </summary>
public static class PricingCalculator
{
    /// <summary>A "Daily" cost is understood as "per working day"; a year has this many of them.</summary>
    public const int WorkingDaysPerYear = 240;

    public const decimal HoursPerWorkingDay = 8m;

    public const string GroupDirect = "Direct";
    public const string GroupOverhead = "Overhead";
    public const string GroupVehicle = "Vehicle";
    public const string GroupLabour = "Labour";
    public const string GroupRisk = "Risk";

    public static PricingResult Calculate(
        PricingRequest request,
        PricingProfile? profile,
        TaxTreatment taxTreatment,
        decimal standardVatRate,
        DateOnly today,
        IEnumerable<string>? externalWarnings = null)
    {
        var errors = new List<string>();
        var warnings = new List<string>(externalWarnings ?? []);
        var costLines = new List<CostLine>();
        var priceLines = new List<PriceLine>();
        var derived = new Dictionary<string, decimal>();
        var qty = request.Quantities ?? new PricingQuantities();

        if (profile is null)
        {
            errors.Add(Inv($"No active pricing profile is configured for service '{request.ServiceType}'. Create one under Pricing → Pricing profiles."));
            return Build(request, null, taxTreatment, standardVatRate, errors, warnings, costLines, priceLines, derived, 0m, 0m);
        }

        var costProfile = profile.CostProfile;

        // --- 1. Cost items ----------------------------------------------------------------
        decimal direct = 0m, overhead = 0m;
        var percentageItems = new List<CostItem>();
        foreach (var link in costProfile?.Items ?? [])
        {
            var item = link.CostItem;
            if (item is null || !item.IsActive || !IsEffective(item.EffectiveFrom, item.EffectiveTo, today))
            {
                continue;
            }

            if (item.AllocationMethod == AllocationMethod.PercentageOfDirectCosts)
            {
                percentageItems.Add(item);
                continue;
            }

            var line = AllocateItem(item, qty, warnings);
            if (line is null)
            {
                continue;
            }

            costLines.Add(line);
            if (line.Group == GroupDirect)
            {
                direct += line.Total;
            }
            else
            {
                overhead += line.Total;
            }
        }

        // --- 2. Vehicle ------------------------------------------------------------------
        var vehicle = 0m;
        if (costProfile?.VehicleProfile is { } vp)
        {
            vehicle = AddVehicleLines(vp, qty, costLines, derived, warnings);
        }

        // --- 3. Labour -------------------------------------------------------------------
        var labour = 0m;
        if (costProfile?.LabourProfile is { } lp)
        {
            labour = AddLabourLines(lp, qty, costLines, derived, warnings);
        }

        // --- 4. Extra direct costs for this job -------------------------------------------
        foreach (var extra in request.ExtraCosts ?? [])
        {
            if (extra.Amount == 0m)
            {
                continue;
            }

            costLines.Add(new CostLine(GroupDirect, extra.Label, 1m, "job", extra.Amount, extra.Amount, "Entered for this job."));
            direct += extra.Amount;
        }

        // Percentage-of-direct items need the direct total first.
        foreach (var item in percentageItems)
        {
            var percent = item.AllocationDenominator ?? 0m;
            var total = Round(direct * percent / 100m);
            costLines.Add(new CostLine(GroupOverhead, item.Name, percent, "% of direct", direct, total,
                Inv($"{percent:0.##}% of direct costs {direct:0.00}.")));
            overhead += total;
        }

        // --- 5. Risk allowance -------------------------------------------------------------
        var risk = 0m;
        if (costProfile is not null && costProfile.RiskAllowanceMethod != RiskAllowanceMethod.None)
        {
            var baseline = costProfile.RiskAllowanceMethod switch
            {
                RiskAllowanceMethod.PercentageOfDirectCosts => direct + vehicle + labour,
                RiskAllowanceMethod.PercentageOfTotalCosts => direct + overhead + vehicle + labour,
                _ => 0m,
            };
            risk = costProfile.RiskAllowanceMethod == RiskAllowanceMethod.FixedAmount
                ? Round(costProfile.RiskAllowanceValue)
                : Round(baseline * costProfile.RiskAllowanceValue / 100m);
            var explanation = costProfile.RiskAllowanceMethod == RiskAllowanceMethod.FixedAmount
                ? "Fixed risk buffer from the cost profile."
                : Inv($"{costProfile.RiskAllowanceValue:0.##}% of {baseline:0.00} ({costProfile.RiskAllowanceMethod}).");
            costLines.Add(new CostLine(GroupRisk, "Risk allowance", 1m, "job", risk, risk, explanation));
        }

        direct = Round(direct);
        overhead = Round(overhead);
        vehicle = Round(vehicle);
        labour = Round(labour);
        var totalCost = direct + overhead + vehicle + labour + risk;

        // --- 6. Strategy → base price --------------------------------------------------
        var basePrice = 0m;
        switch (profile.Strategy)
        {
            case PricingStrategyType.CostPlus:
            {
                var markup = profile.MarkupPercent ?? 0m;
                basePrice = Round(totalCost * (1 + markup / 100m));
                if (totalCost == 0m)
                {
                    errors.Add("Cost-plus pricing needs cost data: link a cost profile with cost items, a vehicle or a labour profile, or enter extra costs.");
                }

                priceLines.Add(new PriceLine("Cost-plus price", basePrice, Inv($"Total cost {totalCost:0.00} + {markup:0.##}% markup.")));
                break;
            }

            case PricingStrategyType.TargetMargin:
            {
                var margin = profile.TargetMarginPercent ?? 0m;
                if (margin >= 100m)
                {
                    errors.Add("Target margin must be below 100%.");
                    margin = 0m;
                }

                if (totalCost == 0m)
                {
                    errors.Add("Target-margin pricing needs cost data: link a cost profile with cost items, a vehicle or a labour profile, or enter extra costs.");
                }

                basePrice = Round(totalCost / (1 - margin / 100m));
                priceLines.Add(new PriceLine("Target-margin price", basePrice, Inv($"Total cost {totalCost:0.00} ÷ (1 − {margin:0.##}%) so that {margin:0.##}% of the price is profit.")));
                break;
            }

            case PricingStrategyType.FixedPrice:
                basePrice = Round(profile.FixedPrice ?? 0m);
                if (profile.FixedPrice is null)
                {
                    errors.Add("Fixed-price profile has no fixed price configured.");
                }

                priceLines.Add(new PriceLine("Fixed price", basePrice, "Agreed price from the pricing profile."));
                break;

            case PricingStrategyType.RateCard:
            {
                var any = false;
                foreach (var rate in profile.Rates.OrderBy(r => r.SortOrder).ThenBy(r => r.Id))
                {
                    any = true;
                    var quantity = qty.For(rate.Unit);
                    var billable = rate.Unit == PricingUnit.Fixed ? 1m : Math.Max(0m, quantity - rate.IncludedQuantity);
                    var amount = Round(billable * rate.Rate);
                    basePrice += amount;
                    var unitText = rate.Unit == PricingUnit.Fixed
                        ? "Fixed amount."
                        : rate.IncludedQuantity > 0
                            ? Inv($"{quantity:0.##} {rate.Unit} − {rate.IncludedQuantity:0.##} included = {billable:0.##} × {rate.Rate:0.00##}.")
                            : Inv($"{billable:0.##} {rate.Unit} × {rate.Rate:0.00##}.");
                    priceLines.Add(new PriceLine(rate.Label, amount, unitText, rate.Unit, rate.Rate));
                }

                if (!any)
                {
                    errors.Add("Rate-card profile has no rate lines. Add at least one line, e.g. 'Base fee' (fixed) and 'Per kilometre'.");
                }

                break;
            }
        }

        var net = basePrice;

        // --- 7. Minimum price ----------------------------------------------------------
        if (profile.MinimumPrice is { } minimum && net < minimum)
        {
            priceLines.Add(new PriceLine("Minimum price applied", minimum - net, Inv($"Price raised from {net:0.00} to the minimum {minimum:0.00}.")));
            net = minimum;
        }

        // --- 8. Surcharges and discounts ---------------------------------------------------
        var adjustmentBase = net;
        foreach (var surcharge in request.Surcharges ?? [])
        {
            var amount = surcharge.IsPercent ? Round(adjustmentBase * surcharge.Value / 100m) : Round(surcharge.Value);
            net += amount;
            priceLines.Add(new PriceLine(surcharge.Label, amount, surcharge.IsPercent ? Inv($"{surcharge.Value:0.##}% surcharge on {adjustmentBase:0.00}.") : "Surcharge."));
        }

        foreach (var discount in request.Discounts ?? [])
        {
            var amount = discount.IsPercent ? Round(adjustmentBase * discount.Value / 100m) : Round(discount.Value);
            net -= amount;
            priceLines.Add(new PriceLine(discount.Label, -amount, discount.IsPercent ? Inv($"{discount.Value:0.##}% discount on {adjustmentBase:0.00}.") : "Discount."));
        }

        // --- 9. Manual override ----------------------------------------------------------
        if (request.ManualOverridePrice is { } overridePrice)
        {
            var reason = request.ManualOverrideReason ?? "not given";
            priceLines.Add(new PriceLine("Manual override", overridePrice - net, Inv($"Price set manually to {overridePrice:0.00}. Reason: {reason}.")));
            warnings.Add(Inv($"Price manually overridden to {overridePrice:0.00} (calculated {net:0.00}). Reason: {reason}."));
            net = overridePrice;
        }

        net = Round(net);
        if (net <= 0m && errors.Count == 0)
        {
            errors.Add("Calculated net price is zero or negative.");
        }

        if (profile.MinimumMarginPercent is { } minMargin && net > 0m && totalCost > 0m)
        {
            var marginNow = (net - totalCost) / net * 100m;
            if (marginNow < minMargin)
            {
                var loss = net < totalCost;
                var advice = profile.Strategy is PricingStrategyType.RateCard or PricingStrategyType.FixedPrice
                    ? Inv($"With the '{profile.Strategy}' strategy the price is set directly, so the margin is simply price minus cost. Raise the {(profile.Strategy == PricingStrategyType.RateCard ? "rate lines" : "fixed price")}, reduce the linked costs, or switch the profile to 'Target margin' / 'Cost plus' so the price is calculated from cost plus your desired profit.")
                    : "Surcharges, discounts or a manual override pulled the price below the cost base. Check the discounts or the override price.";
                warnings.Add(Inv($"Margin {marginNow:0.0}% is below the minimum {minMargin:0.#}% set on the profile: net price {net:0.00} vs total cost {totalCost:0.00}{(loss ? " – this job would make a loss" : "")}. {advice}"));
            }
        }

        if (profile.Strategy != PricingStrategyType.RateCard && profile.Strategy != PricingStrategyType.FixedPrice && costProfile is null)
        {
            warnings.Add("Pricing profile has no cost profile: only extra costs entered for the job are considered.");
        }

        return Build(request, profile, taxTreatment, standardVatRate, errors, warnings, costLines, priceLines, derived, basePrice, net,
            direct, overhead, vehicle, labour, risk);
    }

    private static CostLine? AllocateItem(CostItem item, PricingQuantities qty, List<string> warnings)
    {
        var group = item.CostType is CostType.Fixed or CostType.SemiVariable ? GroupOverhead : GroupDirect;

        if (item.AllocationMethod == AllocationMethod.WholeAmount)
        {
            return new CostLine(group, item.Name, 1m, "job", item.Amount, Round(item.Amount), "Whole amount charged to this job.");
        }

        // Per-unit frequencies are already a unit cost.
        if (item.Frequency >= CostFrequency.PerHour)
        {
            var quantity = qty.For(item.AllocationMethod);
            var total = Round(item.Amount * quantity);
            return new CostLine(group, item.Name, quantity, UnitName(item.AllocationMethod), item.Amount, total,
                Inv($"{quantity:0.##} × {item.Amount:0.00} ({item.Frequency})."));
        }

        var annual = Annualise(item.Amount, item.Frequency);
        if (item.AllocationDenominator is not > 0m)
        {
            warnings.Add(Inv($"Cost item '{item.Name}' has no allocation denominator (e.g. 240 working days or 60,000 km per year) and was skipped."));
            return null;
        }

        var unitCost = annual / item.AllocationDenominator.Value;
        var driverQty = qty.For(item.AllocationMethod);
        var lineTotal = Round(unitCost * driverQty);
        return new CostLine(group, item.Name, driverQty, UnitName(item.AllocationMethod), Round4(unitCost), lineTotal,
            Inv($"{item.Amount:0.00} {item.Frequency} = {annual:0.00}/year ÷ {item.AllocationDenominator.Value:0.##} = {unitCost:0.0000} per {UnitName(item.AllocationMethod)} × {driverQty:0.##}."));
    }

    private static decimal AddVehicleLines(VehicleProfile vp, PricingQuantities qty, List<CostLine> lines, Dictionary<string, decimal> derived, List<string> warnings)
    {
        var km = qty.Kilometres ?? 0m;
        var depreciationPerKm = vp.ExpectedUsefulKilometres > 0 ? (vp.PurchasePrice - vp.ExpectedResidualValue) / vp.ExpectedUsefulKilometres : 0m;
        var fuelPerKm = vp.FuelConsumptionPer100Km / 100m * vp.FuelPricePerLitre;
        var tyresPerKm = vp.TyreLifespanKm > 0 ? vp.TyreReplacementCost / vp.TyreLifespanKm : 0m;
        var brakesPerKm = vp.BrakeLifespanKm > 0 ? vp.BrakeReplacementCost / vp.BrakeLifespanKm : 0m;
        var servicePerKm = vp.ServiceIntervalKm > 0 ? vp.ServiceCost / vp.ServiceIntervalKm : 0m;
        var distancePerKm = depreciationPerKm + fuelPerKm + tyresPerKm + brakesPerKm + servicePerKm;

        var annualTimeCost = vp.AnnualInsurance + vp.AnnualVehicleTax + vp.MonthlyFinancingCost * 12m + vp.AnnualOtherCosts;
        var timePerDay = vp.OperatingDaysPerYear > 0 ? annualTimeCost / vp.OperatingDaysPerYear : 0m;
        var timePerKm = vp.ExpectedAnnualKilometres > 0 ? annualTimeCost / vp.ExpectedAnnualKilometres : 0m;

        derived["vehicleDistanceCostPerKm"] = Round4(distancePerKm);
        derived["vehicleTimeCostPerDay"] = Round(timePerDay);
        derived["vehicleTimeCostPerKm"] = Round4(timePerKm);
        derived["vehicleTotalCostPerKm"] = Round4(distancePerKm + timePerKm);

        var total = 0m;
        if (km > 0)
        {
            Add("Vehicle: depreciation", km, "km", depreciationPerKm, Inv($"({vp.PurchasePrice:0.00} − {vp.ExpectedResidualValue:0.00}) ÷ {vp.ExpectedUsefulKilometres:0.##} km."));
            Add("Vehicle: fuel", km, "km", fuelPerKm, Inv($"{vp.FuelConsumptionPer100Km:0.##} l/100 km × {vp.FuelPricePerLitre:0.000}/l."));
            Add("Vehicle: tyres", km, "km", tyresPerKm, Inv($"{vp.TyreReplacementCost:0.00} ÷ {vp.TyreLifespanKm:0.##} km."));
            Add("Vehicle: brakes", km, "km", brakesPerKm, Inv($"{vp.BrakeReplacementCost:0.00} ÷ {vp.BrakeLifespanKm:0.##} km."));
            Add("Vehicle: servicing", km, "km", servicePerKm, Inv($"{vp.ServiceCost:0.00} every {vp.ServiceIntervalKm:0.##} km."));
        }

        var days = qty.Days ?? 0m;
        if (days > 0)
        {
            Add("Vehicle: insurance, tax, financing", days, "day", timePerDay, Inv($"{annualTimeCost:0.00}/year ÷ {vp.OperatingDaysPerYear} operating days."));
        }
        else if (km > 0)
        {
            Add("Vehicle: insurance, tax, financing", km, "km", timePerKm, Inv($"{annualTimeCost:0.00}/year ÷ {vp.ExpectedAnnualKilometres:0.##} km/year (no days given)."));
        }
        else
        {
            warnings.Add(Inv($"No vehicle cost added: the cost profile links vehicle '{vp.Name}', which is costed per kilometre or per day, but the job has 0 kilometres and 0 days. Enter the kilometres (or days) under Volumes, or unlink the vehicle from the cost profile."));
        }

        return total;

        void Add(string label, decimal quantity, string unit, decimal unitCost, string explanation)
        {
            if (unitCost == 0m)
            {
                return;
            }

            var lineTotal = Round(unitCost * quantity);
            total += lineTotal;
            lines.Add(new CostLine(GroupVehicle, label, quantity, unit, Round4(unitCost), lineTotal, explanation));
        }
    }

    private static decimal AddLabourLines(LabourProfile lp, PricingQuantities qty, List<CostLine> lines, Dictionary<string, decimal> derived, List<string> warnings)
    {
        var annualCost = lp.AnnualGrossSalary * (1 + lp.EmployerContributionPercent / 100m) + lp.AnnualAdditionalCosts;
        var hoursPerDay = lp.PaidHoursPerWeek / 5m;
        var paidHours = lp.PaidHoursPerWeek * 52m;
        var absentHours = (lp.AnnualLeaveDays + lp.PublicHolidayDays + lp.TrainingAndSickDays) * hoursPerDay;
        var availableHours = Math.Max(0m, paidHours - absentHours);
        var productiveHours = availableHours * lp.BillableUtilisationPercent / 100m;
        var costPerHour = productiveHours > 0 ? annualCost / productiveHours : 0m;

        derived["labourAnnualCost"] = Round(annualCost);
        derived["labourProductiveHoursPerYear"] = Round(productiveHours);
        derived["labourCostPerProductiveHour"] = Round4(costPerHour);
        derived["labourCostPerDay"] = Round(costPerHour * (hoursPerDay > 0 ? hoursPerDay : HoursPerWorkingDay));

        var hours = qty.Hours ?? 0m;
        var unit = "hour";
        if (hours == 0m && qty.Days is > 0)
        {
            hours = qty.Days.Value * (hoursPerDay > 0 ? hoursPerDay : HoursPerWorkingDay);
            unit = "hour (from days)";
        }

        if (hours <= 0m)
        {
            warnings.Add(Inv($"No labour cost added: the cost profile links labour profile '{lp.Name}', which is costed per hour, but the job has 0 hours and 0 days. Enter the hours (or working days) under Volumes, or unlink the labour profile from the cost profile."));
            return 0m;
        }

        if (productiveHours <= 0m)
        {
            warnings.Add(Inv($"Labour profile '{lp.Name}' has zero productive hours; check paid hours and absence days."));
            return 0m;
        }

        var total = Round(costPerHour * hours);
        lines.Add(new CostLine(GroupLabour, Inv($"Labour: {lp.Name}"), hours, unit, Round4(costPerHour), total,
            Inv($"{annualCost:0.00}/year ÷ {productiveHours:0.#} productive hours = {costPerHour:0.00}/h × {hours:0.##} h.")));
        return total;
    }

    private static PricingResult Build(
        PricingRequest request,
        PricingProfile? profile,
        TaxTreatment taxTreatment,
        decimal standardVatRate,
        List<string> errors,
        List<string> warnings,
        List<CostLine> costLines,
        List<PriceLine> priceLines,
        Dictionary<string, decimal> derived,
        decimal basePrice,
        decimal net,
        decimal direct = 0m,
        decimal overhead = 0m,
        decimal vehicle = 0m,
        decimal labour = 0m,
        decimal risk = 0m)
    {
        var totalCost = direct + overhead + vehicle + labour + risk;
        var vatRate = TaxTreatmentResolver.VatRateFor(taxTreatment, standardVatRate);
        var vat = Round(net * vatRate);
        var gross = net + vat;
        var profit = net - totalCost;
        var marginPercent = net > 0 ? Round(profit / net * 100m) : 0m;
        var markupPercent = totalCost > 0 ? Round(profit / totalCost * 100m) : 0m;
        var status = errors.Count > 0 ? CalculationStatus.Error : warnings.Count > 0 ? CalculationStatus.Warning : CalculationStatus.Ok;

        return new PricingResult(
            status,
            errors,
            warnings,
            profile?.BusinessUnit ?? request.ServiceType.BusinessUnit(),
            request.ServiceType,
            profile?.Id,
            profile?.Version,
            profile?.Name,
            profile?.CostProfileId,
            profile?.CostProfile?.Version,
            profile?.Strategy,
            profile?.Currency ?? "EUR",
            costLines,
            direct,
            overhead,
            vehicle,
            labour,
            risk,
            totalCost,
            priceLines,
            basePrice,
            net,
            taxTreatment,
            vatRate,
            vat,
            TaxTreatmentResolver.NoteFor(taxTreatment),
            gross,
            Round(profit),
            marginPercent,
            markupPercent,
            derived);
    }

    public static decimal Annualise(decimal amount, CostFrequency frequency) => frequency switch
    {
        CostFrequency.Daily => amount * WorkingDaysPerYear,
        CostFrequency.Weekly => amount * 52m,
        CostFrequency.Monthly => amount * 12m,
        CostFrequency.Quarterly => amount * 4m,
        _ => amount,
    };

    private static bool IsEffective(DateOnly? from, DateOnly? to, DateOnly today) =>
        (from is null || from <= today) && (to is null || to >= today);

    private static string UnitName(AllocationMethod method) => method switch
    {
        AllocationMethod.PerKilometre => "km",
        AllocationMethod.PerHour => "hour",
        AllocationMethod.PerWorkingDay => "day",
        AllocationMethod.PerDelivery => "delivery",
        AllocationMethod.PerStop => "stop",
        AllocationMethod.PerParcel => "parcel",
        AllocationMethod.PerRoute => "route",
        AllocationMethod.PerProject => "project",
        AllocationMethod.PerMonth => "month",
        _ => "job",
    };

    public static decimal Round(decimal value) => decimal.Round(value, 2, MidpointRounding.AwayFromZero);

    private static decimal Round4(decimal value) => decimal.Round(value, 4, MidpointRounding.AwayFromZero);

    private static string Inv(FormattableString value) => value.ToString(CultureInfo.InvariantCulture);
}
