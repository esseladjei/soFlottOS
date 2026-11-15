/**
 * Shared API contract.
 *
 * Every type here mirrors a C# DTO in the ASP.NET API's DTO directory.
 * If you change a DTO in the backend, change it here too - this file is the only
 * place the frontend is allowed to describe backend payloads.
 */

/* ------------------------------------------------------------------ */
/* Enums (serialized as strings by the backend)                        */
/* ------------------------------------------------------------------ */

export const userRoles = ["Admin", "Client", "Driver"] as const;
export type UserRole = (typeof userRoles)[number];

export const driverAvailabilities = ["Offline", "Online", "Busy"] as const;
export type DriverAvailability = (typeof driverAvailabilities)[number];

export const orderStatuses = ["Pending", "Assigned", "InTransit", "Delivered", "Cancelled"] as const;
export type OrderStatus = (typeof orderStatuses)[number];

export const invoiceStatuses = ["Draft", "Sent", "Paid", "Overdue"] as const;
export type InvoiceStatus = (typeof invoiceStatuses)[number];

export const paymentMethods = ["BankTransfer", "PayPal"] as const;
export type PaymentMethod = (typeof paymentMethods)[number];

export const cargoCategories = ["Document", "SmallBox", "AutoPart", "Oversized"] as const;
export type CargoCategory = (typeof cargoCategories)[number];

/* Cost & pricing engine (mirrors Domain/Enums.cs) */
export const businessUnits = ["Express", "Digital"] as const;
export type BusinessUnit = (typeof businessUnits)[number];

export const serviceTypes = [
  "OnDemandDelivery", "ContractedRoute", "Subcontracting", "RecurringB2BAgreement",
  "SoftwareDevelopment", "ApiIntegration", "ItConsulting", "DigitalTransformation", "MaintenanceSupport",
] as const;
export type ServiceType = (typeof serviceTypes)[number];

export const costTypes = ["Fixed", "Variable", "SemiVariable", "OneTime"] as const;
export type CostType = (typeof costTypes)[number];

export const costFrequencies = ["OneTime", "Daily", "Weekly", "Monthly", "Quarterly", "Annually", "PerHour", "PerKilometre", "PerDelivery", "PerRoute", "PerProject"] as const;
export type CostFrequency = (typeof costFrequencies)[number];

export const allocationMethods = ["PerKilometre", "PerHour", "PerWorkingDay", "PerDelivery", "PerStop", "PerParcel", "PerRoute", "PerProject", "PerMonth", "WholeAmount"] as const;
export type AllocationMethod = (typeof allocationMethods)[number];

export const pricingUnits = ["Kilometre", "Hour", "Day", "Delivery", "Stop", "Parcel", "Route", "Project", "Month", "Fixed"] as const;
export type PricingUnit = (typeof pricingUnits)[number];

export const pricingStrategies = ["CostPlus", "TargetMargin", "FixedPrice", "RateCard"] as const;
export type PricingStrategyType = (typeof pricingStrategies)[number];

export const riskAllowanceMethods = ["None", "FixedAmount", "PercentageOfDirectCosts", "PercentageOfTotalCosts"] as const;
export type RiskAllowanceMethod = (typeof riskAllowanceMethods)[number];

export const taxTreatments = ["StandardGermanVat", "ReverseChargeEu", "NonTaxableThirdCountry"] as const;
export type TaxTreatment = (typeof taxTreatments)[number];

export const calculationStatuses = ["Ok", "Warning", "Error"] as const;
export type CalculationStatus = (typeof calculationStatuses)[number];

export const pricingAuditActions = ["Created", "Updated", "Deactivated", "NewVersion", "ManualOverride"] as const;
export type PricingAuditAction = (typeof pricingAuditActions)[number];

/* ------------------------------------------------------------------ */
/* Auth                                                                */
/* ------------------------------------------------------------------ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  locale: "en" | "de";
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface RegisterClientRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  password: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  taxIdNumber?: string | null;
}

export interface RegisterDriverRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  vehicleDescription?: string | null;
}

/** Returned by login/register. The raw `token` never leaves the Next.js server. */
export interface AuthResponse {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  token: string;
  expiresAtUtc: string;
  clientId?: number | null;
}

export interface CurrentUserResponse {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  clientId?: number | null;
  driverAvailability?: DriverAvailability | null;
}

/** What the browser is allowed to know about the signed-in user. */
export interface Session {
  userId: number;
  email: string;
  fullName: string;
  role: UserRole;
  clientId?: number | null;
  expiresAtUtc: string;
}

/* ------------------------------------------------------------------ */
/* Clients (CRM)                                                       */
/* ------------------------------------------------------------------ */

export interface SaveClientRequest {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  taxIdNumber?: string | null;
  specialDeliveryInstructions?: string | null;
  defaultBaseFee?: number | null;
  defaultRatePerKilometer?: number | null;
  /** Admin only: forces a VAT treatment instead of deriving it from the country. */
  taxTreatmentOverride?: TaxTreatment | null;
}

export interface ClientSummary {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  city: string;
  postalCode: string;
  activeOrders: number;
  totalOrders: number;
  createdAt: string;
}

export interface ClientDetail extends ClientSummary {
  userId?: number | null;
  street: string;
  country: string;
  taxIdNumber?: string | null;
  specialDeliveryInstructions?: string | null;
  defaultBaseFee?: number | null;
  defaultRatePerKilometer?: number | null;
  taxTreatmentOverride?: TaxTreatment | null;
  /** The VAT treatment the engine will actually apply (override or derived from the country). */
  effectiveTaxTreatment: TaxTreatment;
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

export interface QuoteOrderRequest {
  clientId?: number | null;
  pickupAddress: string;
  dropoffAddress: string;
}

/** A single point of the driving path, ready to be drawn on the map. */
export interface RoutePoint {
  lat: number;
  lng: number;
}

/** An address resolved to coordinates by the geocoder, with the provider's own label. */
export interface RouteEndpoint extends RoutePoint {
  label: string;
}

export interface OrderQuote {
  distanceKm: number;
  estimatedDurationMinutes: number;
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  vatRate: number;
  routingSource: string;
  baseFee: number;
  ratePerKilometer: number;
  distanceCost: number;
  minimumChargeApplied: boolean;
  taxTreatment: TaxTreatment;
  taxNote?: string | null;
  pickup: RouteEndpoint;
  dropoff: RouteEndpoint;
  geometry: RoutePoint[];
}

export interface CreateOrderRequest {
  /** Admins must send a clientId; clients may omit it (their own account is used). */
  clientId?: number | null;
  cargoCategory: CargoCategory;
  weightKg: number;
  pickupAddress: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  pickupContactName?: string | null;
  pickupPhone?: string | null;
  dropoffAddress: string;
  dropoffLat?: number | null;
  dropoffLng?: number | null;
  dropoffContactName?: string | null;
  dropoffPhone?: string | null;
  /** Free text, e.g. "Ring the back doorbell and ask for Hans". */
  specialInstructions?: string | null;
  paymentMethod: PaymentMethod;
  externalReference?: string | null;
}

export interface AssignOrderRequest {
  driverUserId: number;
}

export interface ProofOfDeliveryRequest {
  recipientName: string;
  /** Base64 PNG data URL captured by the HTML canvas signature pad. */
  signatureDataUrl: string;
  gpsLatitude: number;
  gpsLongitude: number;
}

export interface ProofOfDelivery {
  orderId: number;
  recipientName: string;
  signatureDataUrl: string;
  gpsLatitude: number;
  gpsLongitude: number;
  deliveredAt: string;
}

export interface Order {
  id: number;
  clientId: number;
  clientCompanyName: string;
  assignedDriverId?: number | null;
  assignedDriverName?: string | null;
  cargoCategory: CargoCategory;
  weightKg: number;
  pickupAddress: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  pickupContactName?: string | null;
  pickupPhone?: string | null;
  dropoffAddress: string;
  dropoffLat?: number | null;
  dropoffLng?: number | null;
  dropoffContactName?: string | null;
  dropoffPhone?: string | null;
  specialInstructions?: string | null;
  externalReference?: string | null;
  distanceKm: number;
  estimatedDurationMinutes: number;
  netPrice: number;
  vatAmount: number;
  grossPrice: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  createdAt: string;
  assignedAt?: string | null;
  pickedUpAt?: string | null;
  deliveredAt?: string | null;
  invoiceId?: number | null;
  invoiceNumber?: string | null;
  proofOfDelivery?: ProofOfDelivery | null;
}

/* ------------------------------------------------------------------ */
/* Driver                                                              */
/* ------------------------------------------------------------------ */

export interface DriverProfile {
  userId: number;
  fullName: string;
  email: string;
  phone?: string | null;
  vehicleDescription?: string | null;
  availability: DriverAvailability;
  activeJobs: number;
  completedJobs: number;
  revenueGenerated: number;
}

export interface UpdateAvailabilityRequest {
  /** Drivers may only choose Online or Offline; Busy is set by the system. */
  availability: Extract<DriverAvailability, "Online" | "Offline">;
}

/* ------------------------------------------------------------------ */
/* Invoices                                                            */
/* ------------------------------------------------------------------ */

export interface Invoice {
  id: number;
  /** `{prefix}-{serviceCode}-{year}-{sequence}`, e.g. SOFLOTT-DLV-2026-0001. */
  invoiceNumber: string;
  serviceType: ServiceType;
  serviceCode: string;
  serviceLabel: string;
  taxTreatment: TaxTreatment;
  /** Legal note printed when no German VAT is charged (reverse charge / not taxable). */
  taxNote?: string | null;
  clientId: number;
  clientCompanyName: string;
  orderId: number;
  netTotal: number;
  vatRate: number;
  vatTotal: number;
  grossTotal: number;
  status: InvoiceStatus;
  paymentMethod: PaymentMethod;
  issuedAt: string;
  dueDate: string;
}

/** Legal seller details printed on the German "Rechnung". */
export interface InvoiceIssuer {
  companyName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  taxIdNumber: string;
  email: string;
  phone: string;
  iban?: string | null;
  bic?: string | null;
  bankName?: string | null;
  paypalHandle?: string | null;
}

export interface InvoiceDetail extends Invoice {
  issuer: InvoiceIssuer;
  client: ClientDetail;
  order: Order;
  paymentTermsDays: number;
}

export interface UpdateInvoiceStatusRequest {
  status: InvoiceStatus;
}

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

export interface AdminDashboard {
  pendingOrders: number;
  activeOrders: number;
  deliveredToday: number;
  onlineDrivers: number;
  busyDrivers: number;
  totalClients: number;
  revenueNetThisMonth: number;
  revenueGrossThisMonth: number;
  outstandingInvoiceTotal: number;
  openInvoices: number;
}

/* ------------------------------------------------------------------ */
/* Errors                                                              */
/* ------------------------------------------------------------------ */

export interface ApiProblemDetails {
  title?: string;
  detail?: string;
  status?: number;
  traceId?: string;
  errors?: Record<string, string[]>;
}

export interface BookingWindow {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface SaveBookingAvailabilityRequest {
  scheduleEnabled: boolean;
  isBusy: boolean;
  windows: BookingWindow[];
}

export interface BookingAvailability extends SaveBookingAvailabilityRequest {
  timeZone: string;
  canBook: boolean;
  unavailableReason: "Busy" | "OutsideHours" | null;
  evaluatedAt: string;
}

/* ------------------------------------------------------------------ */
/* Cost & pricing engine (mirrors Dtos/Pricing/PricingDtos.cs)         */
/* ------------------------------------------------------------------ */

export interface SaveCostCategoryRequest {
  name: string;
  description?: string | null;
  businessUnit?: BusinessUnit | null;
  isActive: boolean;
}

export interface CostCategory extends SaveCostCategoryRequest {
  id: number;
  itemCount: number;
}

export interface SaveCostItemRequest {
  name: string;
  description?: string | null;
  costCategoryId: number;
  businessUnit?: BusinessUnit | null;
  costType: CostType;
  amount: number;
  frequency: CostFrequency;
  allocationMethod: AllocationMethod;
  allocationDenominator?: number | null;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  isActive: boolean;
  currency: string;
}

export interface CostItem extends SaveCostItemRequest {
  id: number;
  costCategoryName: string;
  annualAmount?: number | null;
  unitCost?: number | null;
}

export interface SaveVehicleProfileRequest {
  name: string;
  description?: string | null;
  purchasePrice: number;
  purchaseDate?: string | null;
  expectedResidualValue: number;
  expectedUsefulKilometres: number;
  fuelConsumptionPer100Km: number;
  fuelPricePerLitre: number;
  tyreReplacementCost: number;
  tyreLifespanKm: number;
  brakeReplacementCost: number;
  brakeLifespanKm: number;
  serviceCost: number;
  serviceIntervalKm: number;
  annualInsurance: number;
  annualVehicleTax: number;
  monthlyFinancingCost: number;
  annualOtherCosts: number;
  operatingDaysPerYear: number;
  expectedAnnualKilometres: number;
  isActive: boolean;
}

export interface VehicleCostSummary {
  depreciationPerKm: number;
  fuelPerKm: number;
  tyresPerKm: number;
  brakesPerKm: number;
  servicePerKm: number;
  distanceCostPerKm: number;
  annualTimeCost: number;
  timeCostPerDay: number;
  timeCostPerKm: number;
  totalCostPerKm: number;
}

export interface VehicleProfile extends SaveVehicleProfileRequest {
  id: number;
  derived: VehicleCostSummary;
}

export interface SaveLabourProfileRequest {
  name: string;
  description?: string | null;
  businessUnit: BusinessUnit;
  resourceType: string;
  annualGrossSalary: number;
  employerContributionPercent: number;
  annualAdditionalCosts: number;
  paidHoursPerWeek: number;
  annualLeaveDays: number;
  publicHolidayDays: number;
  trainingAndSickDays: number;
  billableUtilisationPercent: number;
  isActive: boolean;
}

export interface LabourCostSummary {
  annualEmploymentCost: number;
  paidHoursPerYear: number;
  availableHoursPerYear: number;
  productiveHoursPerYear: number;
  costPerProductiveHour: number;
  costPerDay: number;
}

export interface LabourProfile extends SaveLabourProfileRequest {
  id: number;
  derived: LabourCostSummary;
}

export interface SaveCostProfileRequest {
  name: string;
  description?: string | null;
  businessUnit: BusinessUnit;
  vehicleProfileId?: number | null;
  labourProfileId?: number | null;
  riskAllowanceMethod: RiskAllowanceMethod;
  riskAllowanceValue: number;
  costItemIds: number[];
  isActive: boolean;
}

export interface CostProfile extends SaveCostProfileRequest {
  id: number;
  vehicleProfileName?: string | null;
  labourProfileName?: string | null;
  version: number;
}

export interface SavePricingRateRequest {
  label: string;
  unit: PricingUnit;
  rate: number;
  includedQuantity: number;
  sortOrder: number;
}

export interface PricingRate extends SavePricingRateRequest {
  id: number;
}

export interface SavePricingProfileRequest {
  name: string;
  description?: string | null;
  businessUnit: BusinessUnit;
  serviceType?: ServiceType | null;
  clientId?: number | null;
  costProfileId?: number | null;
  strategy: PricingStrategyType;
  markupPercent?: number | null;
  targetMarginPercent?: number | null;
  fixedPrice?: number | null;
  minimumPrice?: number | null;
  minimumMarginPercent?: number | null;
  isDefault: boolean;
  effectiveFrom?: string | null;
  effectiveTo?: string | null;
  rates: SavePricingRateRequest[];
  isActive: boolean;
  currency: string;
}

export interface PricingProfile extends Omit<SavePricingProfileRequest, "rates"> {
  id: number;
  serviceCode?: string | null;
  clientName?: string | null;
  costProfileName?: string | null;
  version: number;
  rates: PricingRate[];
}

export interface PricingQuantities {
  kilometres?: number | null;
  hours?: number | null;
  days?: number | null;
  deliveries?: number | null;
  stops?: number | null;
  parcels?: number | null;
  routes?: number | null;
  projects?: number | null;
  months?: number | null;
}

export interface PricingExtraCost {
  label: string;
  amount: number;
}

export interface PricingAdjustment {
  label: string;
  value: number;
  isPercent: boolean;
}

export interface CalculatePriceRequest {
  serviceType: ServiceType;
  clientId?: number | null;
  quantities?: PricingQuantities | null;
  extraCosts?: PricingExtraCost[] | null;
  surcharges?: PricingAdjustment[] | null;
  discounts?: PricingAdjustment[] | null;
  manualOverridePrice?: number | null;
  manualOverrideReason?: string | null;
  taxTreatmentOverride?: TaxTreatment | null;
  pricingProfileId?: number | null;
  saveAsScenarioName?: string | null;
}

export interface CostLine {
  group: string;
  label: string;
  quantity: number;
  unit: string;
  unitCost: number;
  total: number;
  explanation: string;
}

export interface PriceLine {
  label: string;
  amount: number;
  explanation: string;
  unit?: PricingUnit | null;
  rate?: number | null;
}

export interface PricingResult {
  status: CalculationStatus;
  errors: string[];
  warnings: string[];
  businessUnit: BusinessUnit;
  serviceType: ServiceType;
  pricingProfileId?: number | null;
  pricingProfileVersion?: number | null;
  pricingProfileName?: string | null;
  costProfileId?: number | null;
  costProfileVersion?: number | null;
  strategy?: PricingStrategyType | null;
  currency: string;
  costLines: CostLine[];
  directCosts: number;
  allocatedOverhead: number;
  vehicleCosts: number;
  labourCosts: number;
  riskAllowance: number;
  totalEstimatedCost: number;
  priceLines: PriceLine[];
  baseNetPrice: number;
  finalNetSellingPrice: number;
  taxTreatment: TaxTreatment;
  vatRate: number;
  vatAmount: number;
  taxNote?: string | null;
  finalGrossSellingPrice: number;
  expectedProfit: number;
  expectedMarginPercent: number;
  expectedMarkupPercent: number;
  derivedRates: Record<string, number>;
}

export interface PricingCalculation {
  id?: number | null;
  calculationId?: string | null;
  name?: string | null;
  isSimulation: boolean;
  orderId?: number | null;
  clientId?: number | null;
  createdAt?: string | null;
  result: PricingResult;
}

export interface PricingCalculationSummary {
  id: number;
  calculationId: string;
  name?: string | null;
  isSimulation: boolean;
  serviceType: ServiceType;
  clientId?: number | null;
  orderId?: number | null;
  totalEstimatedCost: number;
  finalNetSellingPrice: number;
  expectedMarginPercent: number;
  status: CalculationStatus;
  createdAt: string;
}

export interface PricingAuditEntry {
  id: number;
  entityType: string;
  entityId: number;
  action: PricingAuditAction;
  summary: string;
  userId?: number | null;
  createdAt: string;
}

export interface ServiceTypeInfo {
  serviceType: ServiceType;
  businessUnit: BusinessUnit;
  invoiceCode: string;
  label: string;
}

export interface TaxTreatmentInfo {
  taxTreatment: TaxTreatment;
  vatRate: number;
  note?: string | null;
}

export interface PricingReference {
  serviceTypes: ServiceTypeInfo[];
  standardVatRate: number;
  taxTreatments: TaxTreatmentInfo[];
}

export interface ServiceCoverage {
  serviceType: ServiceType;
  invoiceCode: string;
  hasDefaultProfile: boolean;
  profileName?: string | null;
  strategy?: PricingStrategyType | null;
}

export interface PricingOverview {
  costItems: number;
  vehicleProfiles: number;
  labourProfiles: number;
  costProfiles: number;
  pricingProfiles: number;
  coverage: ServiceCoverage[];
  recentCalculations: PricingCalculationSummary[];
}
