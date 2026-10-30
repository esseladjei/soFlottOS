# soFlottOS API contract (v1 MVP)

This document is the single source of truth shared by the C# backend (`apps/api`) and the
Next.js frontend (`apps/web`). Every endpoint below is implemented by a controller in
`apps/api/src/soFlottOS.Api/Controllers` and consumed by a typed client in
`apps/web/src/lib/api`.

* Base URL: `http://localhost:5235` (configured through `SOFLOTT_API_BASE_URL`).
* Auth: `Authorization: Bearer <jwt>`. The browser never sees the JWT - the Next.js
  server stores it in an HTTP-only cookie and forwards it through `/api/proxy/*`.
* Errors: RFC 7807 problem details (`{ title, detail, status, traceId, errors? }`).
* Enums are serialized as strings.
* User-facing email and SMS messages support German (`de`, default) and English (`en`).
  The Next.js proxy forwards the signed-in workspace language to the API.

## Enums

| Enum | Values |
| --- | --- |
| `UserRole` | `Admin`, `Client`, `Driver` |
| `DriverAvailability` | `Offline`, `Online`, `Busy` |
| `OrderStatus` | `Pending`, `Assigned`, `InTransit`, `Delivered`, `Cancelled` |
| `InvoiceStatus` | `Draft`, `Sent`, `Paid`, `Overdue` |
| `PaymentMethod` | `BankTransfer`, `PayPal` |
| `CargoCategory` | `Document`, `SmallBox`, `AutoPart`, `Oversized` |

## Auth - `/api/auth` (anonymous unless stated)

| Method | Route | Body | Response |
| --- | --- | --- | --- |
| POST | `/api/auth/login` | `LoginRequest` | `AuthResponse` |
| POST | `/api/auth/register/client` | `RegisterClientRequest` | `AuthResponse` |
| POST | `/api/auth/register/driver` | `RegisterDriverRequest` | `AuthResponse` |
| POST | `/api/auth/forgot-password` | `ForgotPasswordRequest` | `204` (same response whether or not the account exists) |
| POST | `/api/auth/reset-password` | `ResetPasswordRequest` | `204` |
| GET | `/api/auth/me` *(any role)* | - | `CurrentUserResponse` |

## Clients (CRM) - `/api/clients`

| Method | Route | Roles | Response |
| --- | --- | --- | --- |
| GET | `/api/clients` | Admin | `ClientSummary[]` |
| POST | `/api/clients` | Admin | `ClientDetail` |
| GET | `/api/clients/me` | Client | `ClientDetail` |
| GET | `/api/clients/{id}` | Admin, owning Client | `ClientDetail` |
| PUT | `/api/clients/{id}` | Admin, owning Client | `ClientDetail` |

## Orders - `/api/orders`

| Method | Route | Roles | Body | Response |
| --- | --- | --- | --- | --- |
| POST | `/api/orders/quote` | Admin, Client | `QuoteOrderRequest` | `OrderQuote` |
| POST | `/api/orders` | Admin, Client | `CreateOrderRequest` | `Order` (invoice auto-created) |
| GET | `/api/orders` | Admin | `?status=` optional | `Order[]` |
| GET | `/api/orders/mine` | Client | - | `Order[]` |
| GET | `/api/orders/{id}` | Admin, owning Client, assigned Driver | - | `Order` |
| PUT | `/api/orders/{id}/assign` | Admin | `AssignOrderRequest` | `Order` |
| PUT | `/api/orders/{id}/cancel` | Admin, owning Client | - | `Order` |

## Driver - `/api/driver` (Driver role)

| Method | Route | Body | Response |
| --- | --- | --- | --- |
| GET | `/api/driver/me` | - | `DriverProfile` |
| PUT | `/api/driver/availability` | `UpdateAvailabilityRequest` | `DriverProfile` |
| GET | `/api/driver/jobs` | - | `Order[]` |
| PUT | `/api/driver/jobs/{id}/start` | - | `Order` |
| POST | `/api/driver/jobs/{id}/pod` | `ProofOfDeliveryRequest` | `Order` |

Availability rules: assigning an order sets the driver to `Busy`; submitting proof of
delivery releases the driver back to `Online` when no active jobs remain. A driver may
switch between `Online` and `Offline`, never into `Busy` manually.

## Invoices - `/api/invoices`

| Method | Route | Roles | Response |
| --- | --- | --- | --- |
| GET | `/api/invoices` | Admin (`?status=`) | `Invoice[]` |
| GET | `/api/invoices/mine` | Client | `Invoice[]` |
| GET | `/api/invoices/{id}` | Admin, owning Client | `InvoiceDetail` (printable German Rechnung) |
| PUT | `/api/invoices/{id}/status` | Admin | `Invoice` |

Changing an invoice to `Paid` stages a payment-confirmation email; changing it to
`Overdue` stages a payment reminder. `Sent`, `Paid` and `Overdue` are displayed with
distinct status indicators in the admin and client workspaces. The invoice detail
page can be printed or saved as PDF from the browser.

## Booking availability - `/api/booking-availability`

| Method | Route | Roles | Body / response |
| --- | --- | --- | --- |
| GET | `/api/booking-availability` | Admin, Client | `BookingAvailabilityResponse` |
| PUT | `/api/booking-availability` | Admin only | `SaveBookingAvailabilityRequest` / `BookingAvailabilityResponse` |

Save body: `{ scheduleEnabled: boolean, isBusy: boolean, windows: [{ dayOfWeek: number, startTime: "HH:mm", endTime: "HH:mm" }] }`.
Days are `0` (Sunday) through `6` (Saturday). Up to 28 same-day, non-overlapping
windows are supported; adjacent windows and split shifts are allowed. Start must
precede end; end can be `24:00`. Split overnight windows across two days.
Malformed/overlapping windows return `400` without modifying saved settings.

The response includes the saved fields plus `timeZone: "Europe/Berlin"`,
`canBook: boolean`, `unavailableReason: "Busy" | "OutsideHours" | null` and
`evaluatedAt` (an offset-bearing instant). Availability is evaluated by the server
using German local time, including DST. Window start is inclusive; end is exclusive.
Busy overrides all windows. An enabled empty schedule blocks all customer bookings.
The default disabled schedule and busy-off preserve existing behavior.

Customer `POST /api/orders/quote` and `POST /api/orders` return `409` with a
localized soFlott busy/unavailable notice when closed. No order, invoice or
notification is created. Admin quote/booking bypasses this restriction.
The booking form refreshes status every 15 seconds and on focus, and rechecks
before submission; server-side enforcement remains authoritative.
These windows control immediate booking acceptance, not future pickup appointments.

## Admin - `/api/admin` (Admin role)

| Method | Route | Response |
| --- | --- | --- |
| GET | `/api/admin/dashboard` | `AdminDashboard` |
| GET | `/api/admin/drivers` | `DriverProfile[]` |
| POST | `/api/admin/drivers` | `RegisterDriverRequest` | `DriverProfile` |

Admin-created orders use the same `POST /api/orders` endpoint as client bookings and
must include `clientId`; admin quote requests should include the same `clientId` to
apply the client's negotiated rates. Pickup and drop-off street, house number, postal code and city
are collected separately in the UI and saved as complete addresses. Both contact
names and phone numbers are required. All four coordinates may be omitted together;
in that case the quote contains the base fee only until address geocoding is available.
Driver profiles include completed delivery counts and gross revenue from delivered jobs.

## Payload shapes

The exact TypeScript shape of every payload lives in
[`apps/web/src/types/api.ts`](../apps/web/src/types/api.ts) and mirrors the C# DTOs in
`apps/api/src/soFlottOS.Api/Dtos`.
