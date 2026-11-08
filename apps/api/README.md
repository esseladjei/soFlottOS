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

## Error format

Services throw `NotFoundException`, `ValidationException`, `ConflictException`,
`UnauthorizedException`, `ForbiddenException` or `ExternalServiceException`.
`ApiExceptionHandler` turns them into RFC 7807 JSON, which the frontend displays.

## Endpoints

See [`../../docs/API-CONTRACT.md`](../../docs/API-CONTRACT.md), or open
`http://localhost:5235/openapi/v1.json` while the API runs in development.
