# Services — "the business rules"

The layer that decides *what may happen*. Controllers call these; these call repositories.

* `AuthService` — login and self-service signup.
* `ClientService` — the CRM (customer records and negotiated rates).
* `OrderService` — quoting, booking (which also creates the invoice), dispatching, cancelling.
* `DriverService` — availability state machine, start transit, proof of delivery.
* `InvoiceService` — consecutive invoice numbers, status changes, printable detail.
* `AdminService` — the dashboard KPIs.
* `PricingService` — base fee + km rate, minimum charge, 19% German VAT.
* `RoutingService` — distance between two points (straight line, or OpenRouteService).
* `Mapping.cs` — converts entities into the DTOs the frontend receives.
* `Security/` — password hashing (BCrypt) and JWT creation.
* `Notifications/` — outbox queue, sender and the background worker that drains it.
* `Email/` — typed transactional templates, recipient policy, durable email outbox,
  Resend transport and retrying worker. See its README for configuration and extensions.
