# soFlottOS API (ASP.NET Core)

One project, four folder layers. Requests flow **downwards** and never jump back up:

```
HTTP request
   |
   v
Controllers/   url + role check only
   |
   v
Services/      the business rules (pricing, VAT, dispatch, invoicing)
   |
   v
Data/          EF Core repositories + AppDbContext
   |
   v
Domain/        plain entities = the PostgreSQL tables
```

`Dtos/` holds the JSON shapes that cross the wire, `Common/` holds configuration,
errors and role constants. Every folder has its own `README.md`, and every file
starts with a comment explaining what it does.

## Why one project instead of four?

A solo developer gains nothing from four assemblies that must be kept in sync.
Folders give you the same separation of concerns with far less ceremony, and the
compiler still stops you from putting SQL in a controller as long as you follow
the arrow above.

## Layout

| Path | Purpose |
|---|---|
| `src/soFlottOS.Api/Program.cs` | startup: configuration, DI, HTTP pipeline, migrate + seed |
| `src/soFlottOS.Api/Controllers/` | `auth`, `clients`, `orders`, `driver`, `invoices`, `admin` endpoints |
| `src/soFlottOS.Api/Services/` | business rules, pricing/VAT, routing, security, notifications |
| `src/soFlottOS.Api/Data/` | `AppDbContext`, repositories, seeder, EF migrations |
| `src/soFlottOS.Api/Domain/` | entities and enums |
| `src/soFlottOS.Api/Dtos/` | request/response records (the public contract) |
| `src/soFlottOS.Api/Common/` | options, exceptions, problem-details handler, roles |
| `tests/soFlottOS.Api.Tests/` | unit tests for pricing and auth, no database needed |
| `.config/dotnet-tools.json` | local `dotnet-ef` CLI manifest |

## Commands

From the repository root:

```bash
npm run db:up        # start PostgreSQL
npm run dev:api      # run the API on http://localhost:5235
npm run build:api
npm run test:api
```

From `apps/api` (EF Core CLI needs this working directory):

```bash
dotnet tool restore
dotnet ef migrations add <Name> --project src/soFlottOS.Api --output-dir Data/Migrations
dotnet ef database update --project src/soFlottOS.Api
```

Migrations are applied automatically at startup when `Database:ApplyMigrationsOnStartup` is `true`.

## Configuration (`src/soFlottOS.Api/appsettings.json`)

| Section | What it controls |
|---|---|
| `ConnectionStrings:Postgres` | database connection |
| `Jwt` | token issuer, audience, signing key, lifetime |
| `Pricing` | base fee, rate per km, minimum charge, `VatRate` (0.19) |
| `Routing` | distance + geocoding: `OpenRouteService` (default — real `driving-car` distance, needs `ApiKey`) or `GeoDistance` (offline Haversine straight line, development only — it understates billable distance and draws a straight line on the map). Addresses are geocoded automatically — ORS Pelias when an `ApiKey` is set, otherwise key-less Nominatim (`GeocodingUrl`, `CountryCode`, `UserAgent`) |
| `Notifications` | `None` (log only) or `Twilio` |
| `Email` | Resend sender, frontend links, delivery retries and background polling; disabled by default |
| `Invoicing` | invoice number prefix, payment terms, and the seller details printed on every German invoice |
| `Privacy` | consent-evidence and privacy-request retention, internal notification inbox, sweep interval |
| `Database` | apply migrations on startup |
| `Seed` | demo accounts, development only |
| `Cors` | which frontend origins may call the API |

Never commit real secrets. Configure `Jwt__SigningKey` (at least 32 random
characters) and `ConnectionStrings__Postgres` with environment variables or .NET
User Secrets. OpenRouteService routing requires `Routing__ApiKey`; local
development defaults to offline `GeoDistance`. To seed development accounts,
run `npm run seed:password -- 'YOUR_PASSWORD'` and `npm run seed:enable` from the
repository root, then start or restart the API. These scripts save
`Seed:DefaultPassword` and `Seed:Enabled` in local User Secrets. Seeding runs only
in Development when the database has no users; it does not update existing
passwords. See [development account setup](../../README.md#creating-development-accounts)
for password requirements and login emails. Environment variables
`Seed__Enabled=true` and `Seed__DefaultPassword` are an alternative.

Transactional emails are staged in the same EF context as the business change.
Booking uses a transaction across order, invoice and outbox saves. Delivery uses
Resend's HTTP API with durable retries and idempotency keys, independently of the
existing SMS notifications. Invoice and delivery-certificate attachments are
printable HTML, not PDF. Account-creation messages acknowledge registration;
they do not introduce email verification or change login behavior.

See [`src/soFlottOS.Api/Services/Email/README.md`](src/soFlottOS.Api/Services/Email/README.md)
for required configuration, recipient policy, supported events, and extension points.
Tests use the operating system SQLite library (no bundled native SQLite dependency);
Linux test runners need `libsqlite3`.

## Privacy / consent

The frontend keeps the visitor's cookie choice in a first-party cookie. The API
stores only minimal **consent evidence** and manages GDPR data-subject requests
(Art. 12(3): answer within one month).

**Data minimisation:** consent evidence is a random record id (generated by the
browser), the previous record id, the policy version, the action, three
category flags and a server UTC timestamp. **No IP address, user agent or other
personal identifier is stored or logged.** "Necessary" cookies are implicitly
always on and are not stored. The `privacy` rate limiter uses the client IP only
as an in-memory counter key.

| Endpoint | Access | Result |
|---|---|---|
| `POST /api/privacy/consent` | anonymous, rate limited | `204`; recording the same `id` again is a no-op; `400` if invalid |
| `GET /api/privacy/consent/history?consentId={guid}&take=50` | Admin | chain of decisions ending at `consentId`, newest first (max 100); `404` if unknown |
| `POST /api/privacy/data-request` | anonymous, rate limited | `201` `{id, status, createdAt, dueAt}` |
| `GET /api/privacy/data-request/{id}` | anonymous, rate limited | `{id, type, status, createdAt, dueAt, completedAt}` only (the GUID is the access capability); `404` if unknown |
| `GET /api/privacy/data-requests?status=Received` | Admin | newest first (max 200), including email, name, message, locale and handler note |
| `PUT /api/privacy/data-requests/{id}/status` | Admin | `200` with the admin view; `Completed`/`Rejected` set `completedAt` |

Request `type` is `Access`, `Deletion`, `Correction`, `Export`, `Restriction` or
`Objection`; `status` is `Received`, `InProgress`, `Completed` or `Rejected`;
`locale` is `de` or `en` (anything else becomes `de`). Creating a request queues
two emails through the existing outbox: a localized acknowledgement to the
requester (reference id and due date, the free-text message is not echoed) and an
internal notice to `Privacy:NotificationEmail` that carries no requester data.
Email delivery needs `Email:Enabled=true`.

| Key | Default | Meaning |
|---|---|---|
| `Privacy:ConsentEvidenceRetentionDays` | `1095` | consent records older than this are deleted |
| `Privacy:CompletedRequestRetentionDays` | `1095` | `Completed`/`Rejected` requests are deleted this long after completion |
| `Privacy:NotificationEmail` | `info@soflott.de` | internal inbox told about new requests |
| `Privacy:RetentionSweepIntervalHours` | `24` | how often `DataRetentionService` runs (also once at startup) |

The sweep logs only counts. Open requests are never purged. The tables are
`ConsentRecords` and `PrivacyRequests` (migration `AddPrivacyConsentAndRequests`).

## Error format

Services throw `NotFoundException`, `ValidationException`, `ConflictException`,
`UnauthorizedException`, `ForbiddenException` or `ExternalServiceException`.
`ApiExceptionHandler` turns them into RFC 7807 JSON, which the frontend displays.

## Endpoints

See [`../../docs/API-CONTRACT.md`](../../docs/API-CONTRACT.md), or open
`http://localhost:5235/openapi/v1.json` while the API runs in development.
