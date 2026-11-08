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
  invoiceNumber: string;
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
