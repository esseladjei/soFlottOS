// ---------------------------------------------------------------------------
// Copy for the admin Cost & Pricing engine. Every input has a label, a short
// hint (shown as tooltip) and an example so an admin without accounting
// background can configure costs and prices with confidence.
// ---------------------------------------------------------------------------

import type {
  AllocationMethod, BusinessUnit, CalculationStatus, CostFrequency, CostType, PricingAuditAction, PricingStrategyType,
  PricingUnit, RiskAllowanceMethod, ServiceType, TaxTreatment,
} from "@/types/api";

/** Label + tooltip + example for one form field. */
export interface FieldCopy {
  label: string;
  hint: string;
  example?: string;
}

export interface PricingContent {
  common: {
    saved: string;
    create: string;
    edit: string;
    save: string;
    cancel: string;
    newEntry: string;
    active: string;
    inactive: string;
    version: string;
    derived: string;
    noData: string;
    example: string;
    actions: string;
    status: string;
    perYear: string;
    perKm: string;
    perHour: string;
    perDay: string;
    optional: string;
  };
  enums: {
    businessUnit: Record<BusinessUnit, string>;
    serviceType: Record<ServiceType, string>;
    costType: Record<CostType, string>;
    costFrequency: Record<CostFrequency, string>;
    allocationMethod: Record<AllocationMethod, string>;
    pricingUnit: Record<PricingUnit, string>;
    strategy: Record<PricingStrategyType, string>;
    riskMethod: Record<RiskAllowanceMethod, string>;
    taxTreatment: Record<TaxTreatment, string>;
    calculationStatus: Record<CalculationStatus, string>;
    auditAction: Record<PricingAuditAction, string>;
  };
  overview: {
    title: string;
    description: string;
    howItWorks: string;
    steps: { title: string; description: string; href: string }[];
    counts: { costItems: string; vehicleProfiles: string; labourProfiles: string; costProfiles: string; pricingProfiles: string };
    coverageTitle: string;
    coverageDescription: string;
    covered: string;
    missing: string;
    invoiceCode: string;
    invoiceCodeHint: string;
    recentTitle: string;
    recentEmpty: string;
    simulation: string;
    order: (id: number) => string;
  };
  costs: {
    title: string;
    description: string;
    categoriesTitle: string;
    categoriesHint: string;
    itemsTitle: string;
    itemsHint: string;
    allUnits: string;
    fields: {
      name: FieldCopy;
      description: FieldCopy;
      businessUnit: FieldCopy;
      category: FieldCopy;
      costType: FieldCopy;
      amount: FieldCopy;
      frequency: FieldCopy;
      allocationMethod: FieldCopy;
      allocationDenominator: FieldCopy;
      effectiveFrom: FieldCopy;
      effectiveTo: FieldCopy;
      isActive: FieldCopy;
    };
    columns: { annual: string; unitCost: string; items: string };
  };
  vehicles: {
    title: string;
    description: string;
    fields: Record<"name" | "description" | "purchasePrice" | "purchaseDate" | "expectedResidualValue" | "expectedUsefulKilometres" | "fuelConsumptionPer100Km" | "fuelPricePerLitre" | "tyreReplacementCost" | "tyreLifespanKm" | "brakeReplacementCost" | "brakeLifespanKm" | "serviceCost" | "serviceIntervalKm" | "annualInsurance" | "annualVehicleTax" | "monthlyFinancingCost" | "annualOtherCosts" | "operatingDaysPerYear" | "expectedAnnualKilometres", FieldCopy>;
    sections: { purchase: string; running: string; time: string };
    derived: Record<"depreciationPerKm" | "fuelPerKm" | "tyresPerKm" | "brakesPerKm" | "servicePerKm" | "distanceCostPerKm" | "annualTimeCost" | "timeCostPerDay" | "timeCostPerKm" | "totalCostPerKm", string>;
    derivedHint: string;
  };
  labour: {
    title: string;
    description: string;
    fields: Record<"name" | "description" | "businessUnit" | "resourceType" | "annualGrossSalary" | "employerContributionPercent" | "annualAdditionalCosts" | "paidHoursPerWeek" | "annualLeaveDays" | "publicHolidayDays" | "trainingAndSickDays" | "billableUtilisationPercent", FieldCopy>;
    derived: Record<"annualEmploymentCost" | "paidHoursPerYear" | "availableHoursPerYear" | "productiveHoursPerYear" | "costPerProductiveHour" | "costPerDay", string>;
    derivedHint: string;
  };
  costProfiles: {
    title: string;
    description: string;
    fields: Record<"name" | "description" | "businessUnit" | "vehicleProfile" | "labourProfile" | "riskAllowanceMethod" | "riskAllowanceValue" | "costItems", FieldCopy>;
    none: string;
    itemsSelected: (count: number) => string;
  };
  profiles: {
    title: string;
    description: string;
    fields: Record<"name" | "description" | "businessUnit" | "serviceType" | "client" | "costProfile" | "strategy" | "markupPercent" | "targetMarginPercent" | "fixedPrice" | "minimumPrice" | "minimumMarginPercent" | "isDefault" | "effectiveFrom" | "effectiveTo", FieldCopy>;
    strategyHelp: Record<PricingStrategyType, string>;
    profitTitle: string;
    profitHelp: Record<PricingStrategyType, string>;
    customerPrice: {
      title: string;
      net: string;
      taxHint: string;
      costPlus: (percent: number) => string;
      targetMargin: (percent: number) => string;
      variableHint: string;
      rateHint: string;
      missing: string;
      minimum: (amount: string) => string;
      included: (quantity: number) => string;
      calculate: string;
      saveFirst: string;
    };
    marginVsMarkup: string;
    allServices: string;
    allClients: string;
    noCostProfile: string;
    ratesTitle: string;
    ratesHint: string;
    rate: { label: FieldCopy; unit: FieldCopy; rate: FieldCopy; includedQuantity: FieldCopy };
    addRate: string;
    removeRate: string;
    defaultBadge: string;
    clientBadge: string;
  };
  simulator: {
    title: string;
    description: string;
    serviceType: FieldCopy;
    client: FieldCopy;
    profile: FieldCopy;
    autoProfile: string;
    quantitiesTitle: string;
    quantitiesHint: string;
    needs: { title: string; vehicle: string; labour: string; items: string; none: string; noCostProfile: string };
    quantities: Record<"kilometres" | "hours" | "days" | "deliveries" | "stops" | "parcels" | "routes" | "projects" | "months", string>;
    extraCostsTitle: string;
    extraCostsHint: string;
    surchargesTitle: string;
    discountsTitle: string;
    adjustmentsHint: string;
    label: string;
    amount: string;
    percent: string;
    add: string;
    remove: string;
    overrideTitle: string;
    overridePrice: FieldCopy;
    overrideReason: FieldCopy;
    scenarioName: FieldCopy;
    run: string;
    running: string;
    scenarioSaved: string;
    result: {
      title: string;
      costs: string;
      price: string;
      summary: string;
      totalCost: string;
      directCosts: string;
      overhead: string;
      vehicle: string;
      labour: string;
      risk: string;
      netPrice: string;
      vat: (percent: number) => string;
      gross: string;
      profit: string;
      margin: string;
      markup: string;
      warnings: string;
      errors: string;
      profileUsed: (name: string, version: number) => string;
      noProfile: string;
      columns: { item: string; quantity: string; unitCost: string; total: string; explanation: string; amount: string };
    };
    history: string;
  };
  audit: {
    title: string;
    description: string;
    columns: { when: string; entity: string; action: string; summary: string; user: string };
  };
  client: {
    taxTreatment: FieldCopy;
    automatic: string;
    effective: string;
  };
  invoice: {
    service: string;
    taxTreatment: string;
    numberHint: string;
  };
}

const enumsEn: PricingContent["enums"] = {
  businessUnit: { Express: "soFlott Express (logistics)", Digital: "soFlott Digital (IT)" },
  serviceType: {
    OnDemandDelivery: "On-demand B2B delivery",
    ContractedRoute: "Contracted route",
    Subcontracting: "Subcontracting (carrier work)",
    RecurringB2BAgreement: "Recurring B2B agreement",
    SoftwareDevelopment: "Software development",
    ApiIntegration: "API & systems integration",
    ItConsulting: "IT consulting",
    DigitalTransformation: "Digital transformation",
    MaintenanceSupport: "Maintenance & support",
  },
  costType: { Fixed: "Fixed", Variable: "Variable", SemiVariable: "Semi-variable", OneTime: "One-time" },
  costFrequency: {
    OneTime: "One-time", Daily: "Daily", Weekly: "Weekly", Monthly: "Monthly", Quarterly: "Quarterly", Annually: "Annually",
    PerHour: "Per hour", PerKilometre: "Per kilometre", PerDelivery: "Per delivery", PerRoute: "Per route", PerProject: "Per project",
  },
  allocationMethod: {
    PerKilometre: "Per kilometre", PerHour: "Per hour", PerWorkingDay: "Per working day", PerDelivery: "Per delivery", PerStop: "Per stop",
    PerParcel: "Per parcel", PerRoute: "Per route", PerProject: "Per project", PerMonth: "Per month", WholeAmount: "Whole amount once",
  },
  pricingUnit: { Kilometre: "per km", Hour: "per hour", Day: "per day", Delivery: "per delivery", Stop: "per stop", Parcel: "per parcel", Route: "per route", Project: "per project", Month: "per month", Fixed: "fixed amount" },
  strategy: { CostPlus: "Cost-plus (markup on cost)", TargetMargin: "Target margin (share of price)", FixedPrice: "Fixed price", RateCard: "Rate card (base fee + unit rates)" },
  riskMethod: { None: "No risk allowance", FixedAmount: "Fixed amount", PercentageOfDirectCosts: "% of direct costs", PercentageOfTotalCosts: "% of total costs" },
  taxTreatment: { StandardGermanVat: "Germany – 19% VAT", ReverseChargeEu: "EU business – reverse charge (0%)", NonTaxableThirdCountry: "Outside EU – not taxable in Germany (0%)" },
  calculationStatus: { Ok: "OK", Warning: "Check warnings", Error: "Error" },
  auditAction: { Created: "Created", Updated: "Updated", Deactivated: "Deactivated", NewVersion: "New version", ManualOverride: "Manual override" },
};

export const pricingEn: PricingContent = {
  common: {
    saved: "Pricing configuration saved.",
    create: "Create",
    edit: "Edit",
    save: "Save",
    cancel: "Cancel",
    newEntry: "New",
    active: "Active",
    inactive: "Inactive",
    version: "Version",
    derived: "Calculated by the engine",
    noData: "Nothing configured yet.",
    example: "Example",
    actions: "Actions",
    status: "Status",
    perYear: "/ year",
    perKm: "/ km",
    perHour: "/ hour",
    perDay: "/ day",
    optional: "optional",
  },
  enums: enumsEn,
  overview: {
    title: "Cost & pricing",
    description: "One place to define what a service costs soFlott and how it is priced. Every order and invoice uses these rules, so the numbers stay consistent across logistics and IT.",
    howItWorks: "How it works – five steps",
    steps: [
      { title: "1. Record your costs", description: "Rent, insurance, software, fuel… grouped into categories. Each cost says how often it occurs and how it is spread (per km, per hour, per day).", href: "/pricing/costs" },
      { title: "2. Describe vehicles", description: "Purchase price, fuel, tyres, servicing. The engine turns this into a cost per kilometre and per day.", href: "/pricing/vehicles" },
      { title: "3. Describe people", description: "Salary, employer contributions, leave and utilisation become a cost per productive hour.", href: "/pricing/labour" },
      { title: "4. Bundle into cost profiles", description: "Pick a vehicle, a labour profile, overhead items and a risk buffer. This is the full cost base for one kind of work.", href: "/pricing/cost-profiles" },
      { title: "5. Set pricing profiles", description: "Choose how to price each service: markup, target margin, fixed price or a rate card. Assign a default per service or a special one per client.", href: "/pricing/profiles" },
    ],
    counts: { costItems: "Cost items", vehicleProfiles: "Vehicle profiles", labourProfiles: "Labour profiles", costProfiles: "Cost profiles", pricingProfiles: "Pricing profiles" },
    coverageTitle: "Service coverage",
    coverageDescription: "Every service needs one default pricing profile. Red rows cannot be quoted or invoiced until you add one.",
    covered: "Ready",
    missing: "No default profile",
    invoiceCode: "Invoice code",
    invoiceCodeHint: "The three-letter code in every invoice number, e.g. SOFLOTT-DLV-2026-0007 is an on-demand delivery.",
    recentTitle: "Recent calculations",
    recentEmpty: "No calculations yet – try the simulator.",
    simulation: "Simulation",
    order: (id) => `Order #${id}`,
  },
  costs: {
    title: "Cost items",
    description: "The foundation of every price. Record each recurring or one-off cost once; the engine spreads it over kilometres, hours or days automatically.",
    categoriesTitle: "Categories",
    categoriesHint: "Categories only group costs for reporting (e.g. Vehicle, Staff, Office, Software). Add one before adding items.",
    itemsTitle: "Cost items",
    itemsHint: "An item is one cost line with an amount, how often it occurs and how it is allocated to work.",
    allUnits: "Both units",
    fields: {
      name: { label: "Name", hint: "Short, recognisable name of the cost.", example: "Office rent Berlin" },
      description: { label: "Description", hint: "Optional note for colleagues.", example: "Lease until 2027, incl. utilities" },
      businessUnit: { label: "Business unit", hint: "Leave empty when the cost serves both logistics and IT (e.g. accounting software).", example: "soFlott Express" },
      category: { label: "Category", hint: "Reporting group this cost belongs to.", example: "Office & admin" },
      costType: { label: "Cost behaviour", hint: "Fixed = same every month (rent). Variable = grows with activity (fuel). One-time = paid once (laptop).", example: "Fixed" },
      amount: { label: "Amount (€)", hint: "Net amount per occurrence, without VAT.", example: "1200.00" },
      frequency: { label: "How often", hint: "How often the amount is paid. 'Per km / per hour…' means the amount already is a unit cost and needs no spreading.", example: "Monthly" },
      allocationMethod: { label: "Spread over", hint: "How the yearly total is divided onto work. 'Whole amount once' adds it to every calculation unchanged (set-up fees).", example: "Per kilometre" },
      allocationDenominator: { label: "Yearly volume", hint: "Expected yearly volume for the chosen spread, e.g. total km driven per year. Yearly cost ÷ this = cost per unit.", example: "48000 km → 14,400 €/yr ÷ 48,000 = 0.30 €/km" },
      effectiveFrom: { label: "Valid from", hint: "Leave empty for 'always'. Use when a cost changes on a known date (new lease).", example: "2026-01-01" },
      effectiveTo: { label: "Valid until", hint: "Leave empty for 'open-ended'.", example: "2026-12-31" },
      isActive: { label: "Active", hint: "Inactive items are kept for history but not used in new calculations." },
    },
    columns: { annual: "Per year", unitCost: "Unit cost", items: "Items" },
  },
  vehicles: {
    title: "Vehicle profiles",
    description: "Describe each vehicle type once. The engine converts purchase, wear and running costs into a precise cost per kilometre and per operating day.",
    sections: { purchase: "Purchase & depreciation", running: "Running costs per kilometre", time: "Time-based costs per year" },
    fields: {
      name: { label: "Name", hint: "Vehicle type or registration.", example: "Sprinter van B-SF 1234" },
      description: { label: "Description", hint: "Optional note.", example: "3.5 t, Euro 6" },
      purchasePrice: { label: "Purchase price (€)", hint: "Net price paid for the vehicle.", example: "32000" },
      purchaseDate: { label: "Purchase date", hint: "For your records only." },
      expectedResidualValue: { label: "Expected resale value (€)", hint: "What you expect to sell it for at the end of its life.", example: "8000" },
      expectedUsefulKilometres: { label: "Useful life (km)", hint: "Total km you expect to drive before selling. (Price − resale) ÷ this = depreciation per km.", example: "240000 → (32,000 − 8,000) ÷ 240,000 = 0.10 €/km" },
      fuelConsumptionPer100Km: { label: "Consumption (l/100 km)", hint: "Average fuel or energy use.", example: "8.5" },
      fuelPricePerLitre: { label: "Fuel price (€/l)", hint: "Current average net price.", example: "1.65" },
      tyreReplacementCost: { label: "Tyre set (€)", hint: "Cost of one full set of tyres incl. fitting.", example: "600" },
      tyreLifespanKm: { label: "Tyre life (km)", hint: "Km one set lasts.", example: "40000" },
      brakeReplacementCost: { label: "Brake job (€)", hint: "Cost of pads and discs.", example: "450" },
      brakeLifespanKm: { label: "Brake life (km)", hint: "Km between brake jobs.", example: "60000" },
      serviceCost: { label: "Service cost (€)", hint: "Cost of one regular service.", example: "350" },
      serviceIntervalKm: { label: "Service interval (km)", hint: "Km between services.", example: "30000" },
      annualInsurance: { label: "Insurance (€/yr)", hint: "Yearly premium." , example: "1800" },
      annualVehicleTax: { label: "Vehicle tax (€/yr)", hint: "Yearly Kfz-Steuer.", example: "280" },
      monthlyFinancingCost: { label: "Financing (€/month)", hint: "Leasing or loan instalment. Leave 0 if bought outright.", example: "420" },
      annualOtherCosts: { label: "Other (€/yr)", hint: "Parking, telematics, cleaning…", example: "600" },
      operatingDaysPerYear: { label: "Operating days / yr", hint: "Days the vehicle is actually used. Yearly time costs ÷ this = cost per day.", example: "250" },
      expectedAnnualKilometres: { label: "Km per year", hint: "Used to express time-based costs per km when no days are given.", example: "60000" },
    },
    derived: {
      depreciationPerKm: "Depreciation", fuelPerKm: "Fuel", tyresPerKm: "Tyres", brakesPerKm: "Brakes", servicePerKm: "Servicing",
      distanceCostPerKm: "Distance cost per km", annualTimeCost: "Time costs per year", timeCostPerDay: "Time cost per day", timeCostPerKm: "Time cost per km", totalCostPerKm: "Total cost per km",
    },
    derivedHint: "These figures update after saving and are what cost profiles use.",
  },
  labour: {
    title: "Labour profiles",
    description: "What one hour of a driver, developer or consultant really costs – including employer contributions, holidays and non-billable time.",
    fields: {
      name: { label: "Name", hint: "Role or person.", example: "Driver (full-time)" },
      description: { label: "Description", hint: "Optional note." },
      businessUnit: { label: "Business unit", hint: "Which division this role belongs to." },
      resourceType: { label: "Role", hint: "Free text used in reports.", example: "Driver, Developer, Consultant" },
      annualGrossSalary: { label: "Gross salary (€/yr)", hint: "Yearly gross salary before employer contributions.", example: "36000" },
      employerContributionPercent: { label: "Employer contributions (%)", hint: "Social security, pension, insurance paid on top of gross. Germany ≈ 21%.", example: "21" },
      annualAdditionalCosts: { label: "Additional costs (€/yr)", hint: "Training, equipment, phone, uniform…", example: "1500" },
      paidHoursPerWeek: { label: "Paid hours / week", hint: "Contract hours.", example: "40" },
      annualLeaveDays: { label: "Leave days / yr", hint: "Paid holiday.", example: "28" },
      publicHolidayDays: { label: "Public holidays / yr", hint: "Berlin has about 10.", example: "10" },
      trainingAndSickDays: { label: "Training & sick days / yr", hint: "Realistic estimate of non-working paid days.", example: "12" },
      billableUtilisationPercent: { label: "Billable utilisation (%)", hint: "Share of available hours actually spent on paid work. Drivers ≈ 85%, consultants ≈ 70%.", example: "80" },
    },
    derived: {
      annualEmploymentCost: "Total employment cost per year", paidHoursPerYear: "Paid hours per year", availableHoursPerYear: "Available hours (after leave)",
      productiveHoursPerYear: "Productive (billable) hours", costPerProductiveHour: "Cost per productive hour", costPerDay: "Cost per working day",
    },
    derivedHint: "Cost per productive hour is the number the engine multiplies with the hours of a job.",
  },
  costProfiles: {
    title: "Cost profiles",
    description: "A cost profile bundles everything one kind of work consumes: a vehicle, a person, overhead items and a safety buffer. Pricing profiles point to a cost profile to know their cost base.",
    fields: {
      name: { label: "Name", hint: "What kind of work this cost base describes.", example: "Van + driver, Berlin" },
      description: { label: "Description", hint: "Optional note." },
      businessUnit: { label: "Business unit", hint: "Logistics or IT." },
      vehicleProfile: { label: "Vehicle", hint: "Adds the vehicle's per-km and per-day cost. Leave empty for IT work." },
      labourProfile: { label: "Labour", hint: "Adds the cost per productive hour for the hours of a job." },
      riskAllowanceMethod: { label: "Risk buffer", hint: "Cushion for waiting time, re-deliveries, scope creep. Added to cost before pricing." },
      riskAllowanceValue: { label: "Risk value", hint: "Amount in € or percentage depending on the method above.", example: "5 (%)" },
      costItems: { label: "Overhead items", hint: "Tick the cost items this work should carry a share of (rent, insurance, software…)." },
    },
    none: "None",
    itemsSelected: (count) => `${count} item(s) selected`,
  },
  profiles: {
    title: "Pricing profiles",
    description: "How a service is priced. Set one default per service type and, if needed, a special profile for a single client – the client profile wins.",
    fields: {
      name: { label: "Name", hint: "Recognisable name.", example: "Standard courier tariff 2026" },
      description: { label: "Description", hint: "Optional note." },
      businessUnit: { label: "Business unit", hint: "Logistics or IT." },
      serviceType: { label: "Service", hint: "Which service this profile prices. Leave empty for a client-wide profile." },
      client: { label: "Client", hint: "Fill only for a client-specific deal. Leave empty for a default profile." },
      costProfile: { label: "Cost profile", hint: "Needed for cost-plus and target-margin pricing; also used to show margin for rate cards and fixed prices." },
      strategy: { label: "Strategy", hint: "The formula used to turn cost into price." },
      markupPercent: { label: "Markup (%)", hint: "Added on top of cost. Cost 100 € + 25% = 125 €.", example: "25" },
      targetMarginPercent: { label: "Target margin (%)", hint: "Share of the price that is profit. Cost 100 € at 25% margin = 133.33 €.", example: "25" },
      fixedPrice: { label: "Customer price before VAT (€)", hint: "The fixed amount the customer pays, before VAT and any job-specific adjustments.", example: "4500" },
      minimumPrice: { label: "Minimum price (€)", hint: "The price never drops below this.", example: "25" },
      minimumMarginPercent: { label: "Minimum margin (%) – warning threshold", hint: "Does not change the price. The engine warns when the achieved margin (price − cost) ÷ price falls below this.", example: "10" },
      isDefault: { label: "Default for this service", hint: "Used whenever no client-specific profile exists. Only one default per service." },
      effectiveFrom: { label: "Valid from", hint: "Leave empty for 'now'." },
      effectiveTo: { label: "Valid until", hint: "Leave empty for 'open-ended'." },
    },
    strategyHelp: {
      CostPlus: "Price = total cost × (1 + markup). Simple and transparent; good for subcontracting.",
      TargetMargin: "Price = total cost ÷ (1 − margin). Guarantees the margin you want on the final price; good for routes and retainers.",
      FixedPrice: "You set the price. The engine still shows cost, profit and margin so you see if the deal is healthy.",
      RateCard: "Price = sum of rate lines (e.g. base fee + € per km). Best for on-demand deliveries and hourly IT work.",
    },
    profitTitle: "Profit",
    customerPrice: {
      title: "Customer pays",
      net: "Before VAT",
      taxHint: "VAT depends on the client. Job-specific surcharges, discounts and overrides can change the final amount.",
      costPlus: (percent) => `Job cost + ${percent}% markup`,
      targetMargin: (percent) => `Price calculated for ${percent}% profit margin`,
      variableHint: "The amount depends on this job's costs. Calculate a job to see the customer price, VAT and your profit.",
      rateHint: "These are customer rates, not your costs. The total depends on the job quantities.",
      missing: "Set a price or add rate lines below.",
      minimum: (amount) => `Minimum before job adjustments: ${amount}`,
      included: (quantity) => `First ${quantity} units included`,
      calculate: "Calculate customer total",
      saveFirst: "Save this profile first, then calculate the customer total.",
    },
    profitHelp: {
      CostPlus: "Your profit is the markup: the engine adds it on top of the total cost. Enter it below.",
      TargetMargin: "Your profit is the target margin: the engine works out the price so that this share of it is profit. Enter it below.",
      FixedPrice: "There is no margin input here – the margin is whatever is left after costs (price − cost). Use 'Minimum margin' to be warned when a deal is too thin, or switch to Target margin to have the price calculated from cost + desired profit.",
      RateCard: "There is no margin input here – the price comes from the rate lines, and the margin is whatever is left after costs (price − cost). Set the rates high enough to cover the linked costs, use 'Minimum margin' to be warned when they don't, or switch to Target margin / Cost plus to have the price calculated from cost + desired profit.",
    },
    marginVsMarkup: "Margin and markup are not the same: 25% markup on 100 € cost gives 125 € (20% margin); 25% margin gives 133.33 €.",
    allServices: "All services (client-wide)",
    allClients: "All clients (default)",
    noCostProfile: "No cost profile",
    ratesTitle: "Rate lines",
    ratesHint: "Each line is multiplied with the matching quantity. A 'fixed amount' line is charged once.",
    rate: {
      label: { label: "Label", hint: "Appears on the breakdown.", example: "Base fee" },
      unit: { label: "Unit", hint: "What the rate is multiplied with." },
      rate: { label: "Rate (€)", hint: "Net price per unit.", example: "1.35" },
      includedQuantity: { label: "Included", hint: "Units included for free before the rate applies.", example: "5 km" },
    },
    addRate: "Add rate line",
    removeRate: "Remove",
    defaultBadge: "Default",
    clientBadge: "Client deal",
  },
  simulator: {
    title: "Price simulator",
    description: "Try a quote before committing. Enter the volumes, see every cost and price line, and save interesting scenarios for later.",
    serviceType: { label: "Service", hint: "Decides which pricing profile is used and the code on the invoice." },
    client: { label: "Client", hint: "Picks the client's special profile (if any) and the VAT treatment from its country." },
    profile: { label: "Pricing profile", hint: "Leave on automatic to use the normal resolution (client → service default)." },
    autoProfile: "Automatic",
    quantitiesTitle: "Volumes",
    quantitiesHint: "Only fill what the job needs. Costs are allocated per unit (e.g. per km, per hour), so a cost profile with a driver needs hours, one with a van needs kilometres or days.",
    needs: {
      title: "This profile's cost base needs:",
      vehicle: "Kilometres or days (vehicle '{name}')",
      labour: "Hours or days (labour profile '{name}')",
      items: "{count} cost item(s) allocated by their own unit",
      none: "No cost base linked – only the extra costs you enter below count as cost.",
      noCostProfile: "Pick a pricing profile (or leave on automatic and run once) to see which volumes it needs.",
    },
    quantities: { kilometres: "Kilometres", hours: "Hours", days: "Days", deliveries: "Deliveries", stops: "Stops", parcels: "Parcels", routes: "Routes", projects: "Projects", months: "Months" },
    extraCostsTitle: "Extra costs",
    extraCostsHint: "One-off costs for this job only, e.g. tolls or a third-party licence.",
    surchargesTitle: "Surcharges",
    discountsTitle: "Discounts",
    adjustmentsHint: "Fixed € or a percentage of the net price.",
    label: "Label",
    amount: "Amount",
    percent: "%",
    add: "Add",
    remove: "Remove",
    overrideTitle: "Manual price",
    overridePrice: { label: "Override price (€)", hint: "Replaces the calculated price. Always give a reason – it is written to the audit log." },
    overrideReason: { label: "Reason", hint: "Why the price was set manually.", example: "Pilot customer, agreed by management" },
    scenarioName: { label: "Save as scenario", hint: "Give the simulation a name to keep it in the history." , example: "Hermes Q3 offer" },
    run: "Calculate",
    running: "Calculating…",
    scenarioSaved: "Scenario saved.",
    result: {
      title: "Result",
      costs: "Cost breakdown",
      price: "Price build-up",
      summary: "Summary",
      totalCost: "Total estimated cost",
      directCosts: "Direct costs",
      overhead: "Allocated overhead",
      vehicle: "Vehicle",
      labour: "Labour",
      risk: "Risk buffer",
      netPrice: "Net price",
      vat: (percent) => `VAT ${percent}%`,
      gross: "Gross price",
      profit: "Expected profit",
      margin: "Margin",
      markup: "Markup",
      warnings: "Warnings",
      errors: "Errors",
      profileUsed: (name, version) => `Profile: ${name} (v${version})`,
      noProfile: "No pricing profile found.",
      columns: { item: "Item", quantity: "Qty", unitCost: "Unit cost", total: "Total", explanation: "How", amount: "Amount" },
    },
    history: "Saved scenarios",
  },
  audit: {
    title: "Change log",
    description: "Who changed what in the pricing configuration, and every manual price override.",
    columns: { when: "When", entity: "Object", action: "Action", summary: "Summary", user: "User" },
  },
  client: {
    taxTreatment: { label: "VAT treatment", hint: "Normally derived from the country: Germany 19%, EU businesses reverse charge, UK/UAE not taxable. Override only in special cases." },
    automatic: "Automatic (from country)",
    effective: "Applied VAT treatment",
  },
  invoice: {
    service: "Service",
    taxTreatment: "VAT treatment",
    numberHint: "Invoice numbers are PREFIX-SERVICE-YEAR-SEQUENCE; the service code shows what was billed.",
  },
};

const enumsDe: PricingContent["enums"] = {
  businessUnit: { Express: "soFlott Express (Logistik)", Digital: "soFlott Digital (IT)" },
  serviceType: {
    OnDemandDelivery: "B2B-Direktfahrt",
    ContractedRoute: "Vertragstour",
    Subcontracting: "Subunternehmertätigkeit",
    RecurringB2BAgreement: "Laufende B2B-Vereinbarung",
    SoftwareDevelopment: "Softwareentwicklung",
    ApiIntegration: "API- & Systemintegration",
    ItConsulting: "IT-Beratung",
    DigitalTransformation: "Digitale Transformation",
    MaintenanceSupport: "Wartung & Support",
  },
  costType: { Fixed: "Fix", Variable: "Variabel", SemiVariable: "Teilvariabel", OneTime: "Einmalig" },
  costFrequency: {
    OneTime: "Einmalig", Daily: "Täglich", Weekly: "Wöchentlich", Monthly: "Monatlich", Quarterly: "Quartalsweise", Annually: "Jährlich",
    PerHour: "Pro Stunde", PerKilometre: "Pro Kilometer", PerDelivery: "Pro Lieferung", PerRoute: "Pro Tour", PerProject: "Pro Projekt",
  },
  allocationMethod: {
    PerKilometre: "Pro Kilometer", PerHour: "Pro Stunde", PerWorkingDay: "Pro Arbeitstag", PerDelivery: "Pro Lieferung", PerStop: "Pro Stopp",
    PerParcel: "Pro Paket", PerRoute: "Pro Tour", PerProject: "Pro Projekt", PerMonth: "Pro Monat", WholeAmount: "Gesamtbetrag einmalig",
  },
  pricingUnit: { Kilometre: "pro km", Hour: "pro Stunde", Day: "pro Tag", Delivery: "pro Lieferung", Stop: "pro Stopp", Parcel: "pro Paket", Route: "pro Tour", Project: "pro Projekt", Month: "pro Monat", Fixed: "Festbetrag" },
  strategy: { CostPlus: "Kosten plus Aufschlag", TargetMargin: "Zielmarge (Anteil am Preis)", FixedPrice: "Festpreis", RateCard: "Preisliste (Grundgebühr + Einheitspreise)" },
  riskMethod: { None: "Kein Risikozuschlag", FixedAmount: "Festbetrag", PercentageOfDirectCosts: "% der direkten Kosten", PercentageOfTotalCosts: "% der Gesamtkosten" },
  taxTreatment: { StandardGermanVat: "Deutschland – 19 % USt", ReverseChargeEu: "EU-Unternehmen – Reverse Charge (0 %)", NonTaxableThirdCountry: "Drittland – nicht steuerbar in DE (0 %)" },
  calculationStatus: { Ok: "OK", Warning: "Hinweise prüfen", Error: "Fehler" },
  auditAction: { Created: "Angelegt", Updated: "Geändert", Deactivated: "Deaktiviert", NewVersion: "Neue Version", ManualOverride: "Manueller Preis" },
};

export const pricingDe: PricingContent = {
  common: {
    saved: "Preiskonfiguration gespeichert.",
    create: "Anlegen",
    edit: "Bearbeiten",
    save: "Speichern",
    cancel: "Abbrechen",
    newEntry: "Neu",
    active: "Aktiv",
    inactive: "Inaktiv",
    version: "Version",
    derived: "Vom System berechnet",
    noData: "Noch nichts konfiguriert.",
    example: "Beispiel",
    actions: "Aktionen",
    status: "Status",
    perYear: "/ Jahr",
    perKm: "/ km",
    perHour: "/ Std.",
    perDay: "/ Tag",
    optional: "optional",
  },
  enums: enumsDe,
  overview: {
    title: "Kosten & Preise",
    description: "Ein Ort, um festzulegen, was eine Leistung soFlott kostet und wie sie bepreist wird. Jeder Auftrag und jede Rechnung nutzt diese Regeln – für Logistik und IT gleichermaßen.",
    howItWorks: "So funktioniert es – fünf Schritte",
    steps: [
      { title: "1. Kosten erfassen", description: "Miete, Versicherung, Software, Kraftstoff … in Kategorien gruppiert. Jede Kostenposition sagt, wie oft sie anfällt und wie sie verteilt wird (pro km, Stunde, Tag).", href: "/pricing/costs" },
      { title: "2. Fahrzeuge beschreiben", description: "Kaufpreis, Kraftstoff, Reifen, Wartung. Daraus entstehen Kosten pro Kilometer und pro Einsatztag.", href: "/pricing/vehicles" },
      { title: "3. Personal beschreiben", description: "Gehalt, Arbeitgeberanteile, Urlaub und Auslastung ergeben Kosten pro produktiver Stunde.", href: "/pricing/labour" },
      { title: "4. Zu Kostenprofilen bündeln", description: "Fahrzeug, Personal, Gemeinkosten und Risikopuffer auswählen. Das ist die vollständige Kostenbasis einer Leistungsart.", href: "/pricing/cost-profiles" },
      { title: "5. Preisprofile festlegen", description: "Pro Leistung die Preisstrategie wählen: Aufschlag, Zielmarge, Festpreis oder Preisliste. Standard je Leistung oder Sonderprofil je Kunde.", href: "/pricing/profiles" },
    ],
    counts: { costItems: "Kostenpositionen", vehicleProfiles: "Fahrzeugprofile", labourProfiles: "Personalprofile", costProfiles: "Kostenprofile", pricingProfiles: "Preisprofile" },
    coverageTitle: "Abdeckung je Leistung",
    coverageDescription: "Jede Leistung braucht ein Standard-Preisprofil. Rote Zeilen können weder angeboten noch abgerechnet werden.",
    covered: "Bereit",
    missing: "Kein Standardprofil",
    invoiceCode: "Rechnungskürzel",
    invoiceCodeHint: "Das Kürzel steht in jeder Rechnungsnummer, z. B. SOFLOTT-DLV-2026-0007 ist eine Direktfahrt.",
    recentTitle: "Letzte Berechnungen",
    recentEmpty: "Noch keine Berechnungen – probieren Sie den Simulator.",
    simulation: "Simulation",
    order: (id) => `Auftrag #${id}`,
  },
  costs: {
    title: "Kostenpositionen",
    description: "Die Grundlage jedes Preises. Jede laufende oder einmalige Kostenposition einmal erfassen – das System verteilt sie automatisch auf Kilometer, Stunden oder Tage.",
    categoriesTitle: "Kategorien",
    categoriesHint: "Kategorien gruppieren Kosten nur für Auswertungen (z. B. Fahrzeug, Personal, Büro, Software). Zuerst eine Kategorie anlegen.",
    itemsTitle: "Kostenpositionen",
    itemsHint: "Eine Position ist eine Kostenzeile mit Betrag, Häufigkeit und Verteilung auf die Arbeit.",
    allUnits: "Beide Bereiche",
    fields: {
      name: { label: "Name", hint: "Kurzer, wiedererkennbarer Name.", example: "Büromiete Berlin" },
      description: { label: "Beschreibung", hint: "Optionale Notiz für Kolleg:innen.", example: "Mietvertrag bis 2027, inkl. Nebenkosten" },
      businessUnit: { label: "Geschäftsbereich", hint: "Leer lassen, wenn die Kosten Logistik und IT gemeinsam dienen (z. B. Buchhaltungssoftware).", example: "soFlott Express" },
      category: { label: "Kategorie", hint: "Auswertungsgruppe dieser Kosten.", example: "Büro & Verwaltung" },
      costType: { label: "Kostenverhalten", hint: "Fix = jeden Monat gleich (Miete). Variabel = steigt mit der Aktivität (Kraftstoff). Einmalig = einmal gezahlt (Laptop).", example: "Fix" },
      amount: { label: "Betrag (€)", hint: "Nettobetrag je Fälligkeit, ohne USt.", example: "1200,00" },
      frequency: { label: "Häufigkeit", hint: "Wie oft der Betrag gezahlt wird. „Pro km / pro Stunde …“ heißt: Der Betrag ist bereits ein Stückkostensatz.", example: "Monatlich" },
      allocationMethod: { label: "Verteilung auf", hint: "Wie die Jahressumme auf die Arbeit verteilt wird. „Gesamtbetrag einmalig“ fließt unverändert in jede Berechnung (Einrichtungsgebühren).", example: "Pro Kilometer" },
      allocationDenominator: { label: "Jahresmenge", hint: "Erwartete Jahresmenge der gewählten Verteilung, z. B. gefahrene km pro Jahr. Jahreskosten ÷ Menge = Kosten je Einheit.", example: "48000 km → 14.400 €/Jahr ÷ 48.000 = 0,30 €/km" },
      effectiveFrom: { label: "Gültig ab", hint: "Leer = immer. Nutzen, wenn sich Kosten zu einem bekannten Datum ändern.", example: "2026-01-01" },
      effectiveTo: { label: "Gültig bis", hint: "Leer = unbefristet.", example: "2026-12-31" },
      isActive: { label: "Aktiv", hint: "Inaktive Positionen bleiben für die Historie erhalten, werden aber nicht mehr verwendet." },
    },
    columns: { annual: "Pro Jahr", unitCost: "Stückkosten", items: "Positionen" },
  },
  vehicles: {
    title: "Fahrzeugprofile",
    description: "Jeden Fahrzeugtyp einmal beschreiben. Das System rechnet Anschaffung, Verschleiß und Betriebskosten in präzise Kosten pro Kilometer und pro Einsatztag um.",
    sections: { purchase: "Anschaffung & Abschreibung", running: "Laufende Kosten pro Kilometer", time: "Zeitabhängige Kosten pro Jahr" },
    fields: {
      name: { label: "Name", hint: "Fahrzeugtyp oder Kennzeichen.", example: "Sprinter B-SF 1234" },
      description: { label: "Beschreibung", hint: "Optionale Notiz.", example: "3,5 t, Euro 6" },
      purchasePrice: { label: "Kaufpreis (€)", hint: "Netto gezahlter Preis.", example: "32000" },
      purchaseDate: { label: "Kaufdatum", hint: "Nur zur Dokumentation." },
      expectedResidualValue: { label: "Erwarteter Restwert (€)", hint: "Voraussichtlicher Verkaufserlös am Ende der Nutzung.", example: "8000" },
      expectedUsefulKilometres: { label: "Nutzungsdauer (km)", hint: "Gesamt-km bis zum Verkauf. (Preis − Restwert) ÷ km = Abschreibung pro km.", example: "240000 → (32.000 − 8.000) ÷ 240.000 = 0,10 €/km" },
      fuelConsumptionPer100Km: { label: "Verbrauch (l/100 km)", hint: "Durchschnittlicher Kraftstoff- oder Energieverbrauch.", example: "8,5" },
      fuelPricePerLitre: { label: "Kraftstoffpreis (€/l)", hint: "Aktueller Netto-Durchschnittspreis.", example: "1,65" },
      tyreReplacementCost: { label: "Reifensatz (€)", hint: "Kosten eines kompletten Satzes inkl. Montage.", example: "600" },
      tyreLifespanKm: { label: "Reifenlaufleistung (km)", hint: "Km, die ein Satz hält.", example: "40000" },
      brakeReplacementCost: { label: "Bremsen (€)", hint: "Kosten für Beläge und Scheiben.", example: "450" },
      brakeLifespanKm: { label: "Bremsenlaufleistung (km)", hint: "Km zwischen zwei Bremsenwechseln.", example: "60000" },
      serviceCost: { label: "Inspektion (€)", hint: "Kosten einer regulären Inspektion.", example: "350" },
      serviceIntervalKm: { label: "Inspektionsintervall (km)", hint: "Km zwischen Inspektionen.", example: "30000" },
      annualInsurance: { label: "Versicherung (€/Jahr)", hint: "Jahresprämie.", example: "1800" },
      annualVehicleTax: { label: "Kfz-Steuer (€/Jahr)", hint: "Jährliche Kfz-Steuer.", example: "280" },
      monthlyFinancingCost: { label: "Finanzierung (€/Monat)", hint: "Leasing- oder Kreditrate. 0 bei Barkauf.", example: "420" },
      annualOtherCosts: { label: "Sonstiges (€/Jahr)", hint: "Parken, Telematik, Reinigung …", example: "600" },
      operatingDaysPerYear: { label: "Einsatztage / Jahr", hint: "Tage, an denen das Fahrzeug tatsächlich fährt. Zeitkosten ÷ Tage = Kosten pro Tag.", example: "250" },
      expectedAnnualKilometres: { label: "Km pro Jahr", hint: "Zur Umrechnung der Zeitkosten pro km, wenn keine Tage angegeben sind.", example: "60000" },
    },
    derived: {
      depreciationPerKm: "Abschreibung", fuelPerKm: "Kraftstoff", tyresPerKm: "Reifen", brakesPerKm: "Bremsen", servicePerKm: "Wartung",
      distanceCostPerKm: "Streckenkosten pro km", annualTimeCost: "Zeitkosten pro Jahr", timeCostPerDay: "Zeitkosten pro Tag", timeCostPerKm: "Zeitkosten pro km", totalCostPerKm: "Gesamtkosten pro km",
    },
    derivedHint: "Diese Werte aktualisieren sich nach dem Speichern und werden von den Kostenprofilen genutzt.",
  },
  labour: {
    title: "Personalprofile",
    description: "Was eine Stunde Fahrer:in, Entwickler:in oder Berater:in wirklich kostet – inkl. Arbeitgeberanteilen, Urlaub und nicht abrechenbarer Zeit.",
    fields: {
      name: { label: "Name", hint: "Rolle oder Person.", example: "Fahrer (Vollzeit)" },
      description: { label: "Beschreibung", hint: "Optionale Notiz." },
      businessUnit: { label: "Geschäftsbereich", hint: "Zu welchem Bereich die Rolle gehört." },
      resourceType: { label: "Rolle", hint: "Freitext für Auswertungen.", example: "Fahrer, Entwickler, Berater" },
      annualGrossSalary: { label: "Bruttogehalt (€/Jahr)", hint: "Jahresbrutto vor Arbeitgeberanteilen.", example: "36000" },
      employerContributionPercent: { label: "Arbeitgeberanteile (%)", hint: "Sozialabgaben, die zusätzlich zum Brutto gezahlt werden. Deutschland ≈ 21 %.", example: "21" },
      annualAdditionalCosts: { label: "Zusatzkosten (€/Jahr)", hint: "Schulung, Ausstattung, Telefon, Kleidung …", example: "1500" },
      paidHoursPerWeek: { label: "Bezahlte Stunden / Woche", hint: "Vertragsstunden.", example: "40" },
      annualLeaveDays: { label: "Urlaubstage / Jahr", hint: "Bezahlter Urlaub.", example: "28" },
      publicHolidayDays: { label: "Feiertage / Jahr", hint: "Berlin hat etwa 10.", example: "10" },
      trainingAndSickDays: { label: "Schulungs- & Krankheitstage / Jahr", hint: "Realistische Schätzung bezahlter Ausfalltage.", example: "12" },
      billableUtilisationPercent: { label: "Abrechenbare Auslastung (%)", hint: "Anteil der verfügbaren Stunden mit bezahlter Arbeit. Fahrer ≈ 85 %, Berater ≈ 70 %.", example: "80" },
    },
    derived: {
      annualEmploymentCost: "Gesamte Personalkosten pro Jahr", paidHoursPerYear: "Bezahlte Stunden pro Jahr", availableHoursPerYear: "Verfügbare Stunden (nach Urlaub)",
      productiveHoursPerYear: "Produktive (abrechenbare) Stunden", costPerProductiveHour: "Kosten pro produktiver Stunde", costPerDay: "Kosten pro Arbeitstag",
    },
    derivedHint: "Die Kosten pro produktiver Stunde multipliziert das System mit den Stunden eines Auftrags.",
  },
  costProfiles: {
    title: "Kostenprofile",
    description: "Ein Kostenprofil bündelt alles, was eine Leistungsart verbraucht: Fahrzeug, Person, Gemeinkosten und Sicherheitspuffer. Preisprofile verweisen darauf als Kostenbasis.",
    fields: {
      name: { label: "Name", hint: "Welche Arbeit diese Kostenbasis beschreibt.", example: "Transporter + Fahrer, Berlin" },
      description: { label: "Beschreibung", hint: "Optionale Notiz." },
      businessUnit: { label: "Geschäftsbereich", hint: "Logistik oder IT." },
      vehicleProfile: { label: "Fahrzeug", hint: "Fügt die km- und Tageskosten des Fahrzeugs hinzu. Für IT leer lassen." },
      labourProfile: { label: "Personal", hint: "Fügt die Kosten pro produktiver Stunde für die Stunden eines Auftrags hinzu." },
      riskAllowanceMethod: { label: "Risikopuffer", hint: "Polster für Wartezeit, Zweitzustellung, Mehraufwand. Wird vor der Preisbildung zu den Kosten addiert." },
      riskAllowanceValue: { label: "Risikowert", hint: "Betrag in € oder Prozent je nach Methode.", example: "5 (%)" },
      costItems: { label: "Gemeinkosten", hint: "Kostenpositionen anhaken, die diese Arbeit anteilig tragen soll (Miete, Versicherung, Software …)." },
    },
    none: "Keins",
    itemsSelected: (count) => `${count} Position(en) ausgewählt`,
  },
  profiles: {
    title: "Preisprofile",
    description: "Wie eine Leistung bepreist wird. Ein Standard je Leistungsart und bei Bedarf ein Sonderprofil je Kunde – das Kundenprofil hat Vorrang.",
    fields: {
      name: { label: "Name", hint: "Wiedererkennbarer Name.", example: "Standard-Kuriertarif 2026" },
      description: { label: "Beschreibung", hint: "Optionale Notiz." },
      businessUnit: { label: "Geschäftsbereich", hint: "Logistik oder IT." },
      serviceType: { label: "Leistung", hint: "Welche Leistung dieses Profil bepreist. Leer für ein kundenweites Profil." },
      client: { label: "Kunde", hint: "Nur für eine kundenspezifische Vereinbarung ausfüllen. Leer für ein Standardprofil." },
      costProfile: { label: "Kostenprofil", hint: "Nötig für Aufschlag und Zielmarge; zeigt auch bei Preisliste und Festpreis die Marge." },
      strategy: { label: "Strategie", hint: "Die Formel, mit der aus Kosten ein Preis wird." },
      markupPercent: { label: "Aufschlag (%)", hint: "Auf die Kosten aufgeschlagen. Kosten 100 € + 25 % = 125 €.", example: "25" },
      targetMarginPercent: { label: "Zielmarge (%)", hint: "Anteil des Preises, der Gewinn ist. Kosten 100 € bei 25 % Marge = 133,33 €.", example: "25" },
      fixedPrice: { label: "Kundenpreis ohne Umsatzsteuer (€)", hint: "Der feste Kundenpreis vor Umsatzsteuer und auftragsspezifischen Anpassungen.", example: "4500" },
      minimumPrice: { label: "Mindestpreis (€)", hint: "Der Preis fällt nie darunter.", example: "25" },
      minimumMarginPercent: { label: "Mindestmarge (%) – Warnschwelle", hint: "Ändert den Preis nicht. Das System warnt, wenn die erreichte Marge (Preis − Kosten) ÷ Preis darunter liegt.", example: "10" },
      isDefault: { label: "Standard für diese Leistung", hint: "Wird genutzt, wenn kein Kundenprofil existiert. Nur ein Standard je Leistung." },
      effectiveFrom: { label: "Gültig ab", hint: "Leer = ab sofort." },
      effectiveTo: { label: "Gültig bis", hint: "Leer = unbefristet." },
    },
    strategyHelp: {
      CostPlus: "Preis = Gesamtkosten × (1 + Aufschlag). Einfach und transparent; gut für Subunternehmertätigkeit.",
      TargetMargin: "Preis = Gesamtkosten ÷ (1 − Marge). Sichert die gewünschte Marge auf den Endpreis; gut für Touren und Retainer.",
      FixedPrice: "Sie setzen den Preis. Das System zeigt trotzdem Kosten, Gewinn und Marge, damit Sie sehen, ob das Geschäft gesund ist.",
      RateCard: "Preis = Summe der Preiszeilen (z. B. Grundgebühr + € pro km). Ideal für Direktfahrten und IT nach Stunden.",
    },
    profitTitle: "Gewinn",
    customerPrice: {
      title: "Der Kunde zahlt",
      net: "Ohne Umsatzsteuer",
      taxHint: "Die Umsatzsteuer hängt vom Kunden ab. Auftragsspezifische Zuschläge, Rabatte und manuelle Preise können den Endbetrag ändern.",
      costPlus: (percent) => `Auftragskosten + ${percent}% Aufschlag`,
      targetMargin: (percent) => `Preis für ${percent}% Gewinnmarge berechnet`,
      variableHint: "Der Betrag hängt von den Kosten dieses Auftrags ab. Berechnen Sie einen Auftrag, um Kundenpreis, Umsatzsteuer und Gewinn zu sehen.",
      rateHint: "Das sind Kundenpreise, nicht Ihre Kosten. Der Gesamtbetrag hängt von den Auftragsmengen ab.",
      missing: "Legen Sie unten einen Preis oder Preiszeilen fest.",
      minimum: (amount) => `Mindestpreis vor Auftragsanpassungen: ${amount}`,
      included: (quantity) => `Die ersten ${quantity} Einheiten inklusive`,
      calculate: "Kundengesamtpreis berechnen",
      saveFirst: "Speichern Sie zuerst dieses Profil und berechnen Sie dann den Kundengesamtpreis.",
    },
    profitHelp: {
      CostPlus: "Ihr Gewinn ist der Aufschlag: das System rechnet ihn auf die Gesamtkosten drauf. Unten eingeben.",
      TargetMargin: "Ihr Gewinn ist die Zielmarge: das System berechnet den Preis so, dass dieser Anteil davon Gewinn ist. Unten eingeben.",
      FixedPrice: "Hier gibt es keine Margen-Eingabe – die Marge ist, was nach den Kosten übrig bleibt (Preis − Kosten). Nutzen Sie 'Mindestmarge', um bei zu dünnen Geschäften gewarnt zu werden, oder wechseln Sie zu Zielmarge, damit der Preis aus Kosten + gewünschtem Gewinn berechnet wird.",
      RateCard: "Hier gibt es keine Margen-Eingabe – der Preis ergibt sich aus den Preiszeilen, die Marge ist, was nach den Kosten übrig bleibt (Preis − Kosten). Setzen Sie die Sätze hoch genug, um die verknüpften Kosten zu decken, nutzen Sie 'Mindestmarge' als Warnung, oder wechseln Sie zu Zielmarge / Kosten plus, damit der Preis aus Kosten + gewünschtem Gewinn berechnet wird.",
    },
    marginVsMarkup: "Marge und Aufschlag sind nicht dasselbe: 25 % Aufschlag auf 100 € Kosten ergeben 125 € (20 % Marge); 25 % Marge ergeben 133,33 €.",
    allServices: "Alle Leistungen (kundenweit)",
    allClients: "Alle Kunden (Standard)",
    noCostProfile: "Kein Kostenprofil",
    ratesTitle: "Preiszeilen",
    ratesHint: "Jede Zeile wird mit der passenden Menge multipliziert. Ein „Festbetrag“ wird einmal berechnet.",
    rate: {
      label: { label: "Bezeichnung", hint: "Erscheint in der Aufschlüsselung.", example: "Grundgebühr" },
      unit: { label: "Einheit", hint: "Womit der Satz multipliziert wird." },
      rate: { label: "Satz (€)", hint: "Nettopreis je Einheit.", example: "1,35" },
      includedQuantity: { label: "Inklusive", hint: "Einheiten, die frei enthalten sind, bevor der Satz greift.", example: "5 km" },
    },
    addRate: "Preiszeile hinzufügen",
    removeRate: "Entfernen",
    defaultBadge: "Standard",
    clientBadge: "Kundenvereinbarung",
  },
  simulator: {
    title: "Preissimulator",
    description: "Ein Angebot ausprobieren, bevor Sie sich festlegen. Mengen eingeben, jede Kosten- und Preiszeile sehen und interessante Szenarien speichern.",
    serviceType: { label: "Leistung", hint: "Bestimmt das Preisprofil und das Kürzel auf der Rechnung." },
    client: { label: "Kunde", hint: "Wählt das Sonderprofil des Kunden (falls vorhanden) und die USt-Behandlung nach Land." },
    profile: { label: "Preisprofil", hint: "Auf Automatisch lassen für die normale Auflösung (Kunde → Standard der Leistung)." },
    autoProfile: "Automatisch",
    quantitiesTitle: "Mengen",
    quantitiesHint: "Nur ausfüllen, was der Auftrag braucht. Kosten werden pro Einheit umgelegt (z. B. pro km, pro Stunde): ein Kostenprofil mit Fahrer braucht Stunden, eines mit Transporter Kilometer oder Tage.",
    needs: {
      title: "Die Kostenbasis dieses Profils braucht:",
      vehicle: "Kilometer oder Tage (Fahrzeug '{name}')",
      labour: "Stunden oder Tage (Personalprofil '{name}')",
      items: "{count} Kostenposition(en), jeweils nach eigener Einheit umgelegt",
      none: "Keine Kostenbasis verknüpft – nur die unten eingegebenen Zusatzkosten zählen als Kosten.",
      noCostProfile: "Wählen Sie ein Preisprofil (oder lassen Sie Automatisch und rechnen einmal), um zu sehen, welche Mengen es braucht.",
    },
    quantities: { kilometres: "Kilometer", hours: "Stunden", days: "Tage", deliveries: "Lieferungen", stops: "Stopps", parcels: "Pakete", routes: "Touren", projects: "Projekte", months: "Monate" },
    extraCostsTitle: "Zusatzkosten",
    extraCostsHint: "Einmalige Kosten nur für diesen Auftrag, z. B. Maut oder eine Fremdlizenz.",
    surchargesTitle: "Zuschläge",
    discountsTitle: "Rabatte",
    adjustmentsHint: "Fester €-Betrag oder Prozent vom Nettopreis.",
    label: "Bezeichnung",
    amount: "Betrag",
    percent: "%",
    add: "Hinzufügen",
    remove: "Entfernen",
    overrideTitle: "Manueller Preis",
    overridePrice: { label: "Preis überschreiben (€)", hint: "Ersetzt den berechneten Preis. Immer eine Begründung angeben – sie landet im Änderungsprotokoll." },
    overrideReason: { label: "Begründung", hint: "Warum der Preis manuell gesetzt wurde.", example: "Pilotkunde, mit Geschäftsführung abgestimmt" },
    scenarioName: { label: "Als Szenario speichern", hint: "Der Simulation einen Namen geben, um sie in der Historie zu behalten.", example: "Hermes Angebot Q3" },
    run: "Berechnen",
    running: "Berechne …",
    scenarioSaved: "Szenario gespeichert.",
    result: {
      title: "Ergebnis",
      costs: "Kostenaufstellung",
      price: "Preisaufbau",
      summary: "Zusammenfassung",
      totalCost: "Geschätzte Gesamtkosten",
      directCosts: "Direkte Kosten",
      overhead: "Umgelegte Gemeinkosten",
      vehicle: "Fahrzeug",
      labour: "Personal",
      risk: "Risikopuffer",
      netPrice: "Nettopreis",
      vat: (percent) => `USt ${percent} %`,
      gross: "Bruttopreis",
      profit: "Erwarteter Gewinn",
      margin: "Marge",
      markup: "Aufschlag",
      warnings: "Hinweise",
      errors: "Fehler",
      profileUsed: (name, version) => `Profil: ${name} (v${version})`,
      noProfile: "Kein Preisprofil gefunden.",
      columns: { item: "Position", quantity: "Menge", unitCost: "Stückkosten", total: "Summe", explanation: "Herleitung", amount: "Betrag" },
    },
    history: "Gespeicherte Szenarien",
  },
  audit: {
    title: "Änderungsprotokoll",
    description: "Wer hat was an der Preiskonfiguration geändert – und jeder manuell gesetzte Preis.",
    columns: { when: "Wann", entity: "Objekt", action: "Aktion", summary: "Zusammenfassung", user: "Benutzer" },
  },
  client: {
    taxTreatment: { label: "USt-Behandlung", hint: "Normalerweise aus dem Land abgeleitet: Deutschland 19 %, EU-Unternehmen Reverse Charge, UK/VAE nicht steuerbar. Nur in Sonderfällen überschreiben." },
    automatic: "Automatisch (nach Land)",
    effective: "Angewandte USt-Behandlung",
  },
  invoice: {
    service: "Leistung",
    taxTreatment: "USt-Behandlung",
    numberHint: "Rechnungsnummern folgen PRÄFIX-LEISTUNG-JAHR-LAUFNUMMER; das Kürzel zeigt, was abgerechnet wurde.",
  },
};
