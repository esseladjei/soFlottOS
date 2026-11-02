# soFlottOS

A B2B courier platform for a small German operator: customers book deliveries,
an admin dispatches drivers, drivers deliver and capture a signature, and every
order produces a VAT-compliant invoice automatically.

Two applications, one repository:

| Folder | What it is |
|---|---|
| `apps/api` | ASP.NET Core 10 backend (MySQL, JWT, EF Core) |
| `apps/web` | Next.js 16 frontend (App Router, TypeScript, Tailwind, TanStack Query) |
| `docs/API-CONTRACT.md` | the single contract both apps follow |
| `compose.yml` | local MySQL |
| `scripts/dotnetw.mjs` | finds `dotnet` on `PATH` or in `~/.dotnet` |

## How the two apps talk

```
browser ──► Next.js route handlers ──► ASP.NET Core API ──► MySQL
            (/api/auth/*, /api/proxy/*)
```

The browser never sees the JWT. Logging in stores it in an **HTTP-only cookie**;
every data call goes to `/api/proxy/...` on the Next.js server, which attaches the
`Authorization` header and forwards the request to the backend. That keeps traffic
same-origin and keeps the token out of reach of JavaScript.

## Roles

| Role | Can do |
|---|---|
| `Admin` | dashboard, CRM, book for clients, add drivers, dispatch orders, invoices |
| `Client` | book deliveries, track them, read and print own invoices |
| `Driver` | go online/offline, see assigned jobs, start transit, capture proof of delivery |

## Getting started

In Rider, open `soFlottOS.sln` and select `soFlottOS.Api: http` to run the API.
This is the repository's only solution file. If Rider shows "No loaded projects",
close the solution and reopen `soFlottOS.sln`.

Before starting the API, configure `Jwt:SigningKey` (at least 32 random
characters) and `ConnectionStrings:MySql` in .NET User Secrets or environment
variables. Development uses offline `GeoDistance` routing by default; set
`Routing:Provider=OpenRouteService` and configure `Routing:ApiKey` to use live
routing. Do not put credentials in configuration files.

```bash
npm run db:up                 # 1. start MySQL in Docker
npm run dev:api               # 2. backend on http://localhost:5235

cp apps/web/.env.example apps/web/.env.local
npm run install:web           # 3. frontend dependencies
npm run dev:web               # 4. frontend on http://localhost:3000
```

### Creating development accounts

Seeding automatically creates the three accounts below when the API starts.
Before starting (or restarting) the API, run these commands from the repository
root to save the seed settings in local .NET User Secrets, outside source control:

```bash
npm run seed:password -- 'REPLACE_WITH_YOUR_OWN_PASSWORD'
npm run seed:enable
npm run dev:api
```

Replace `REPLACE_WITH_YOUR_OWN_PASSWORD` with a unique password of at least
12 characters, including uppercase and lowercase letters, a number and a symbol.
Keep the surrounding single quotes. The password command can appear in your
terminal history and npm output; do not share those logs.
MySQL must be running, and `Jwt:SigningKey` and `ConnectionStrings:MySql` must
already be configured as described above. If you run the API in Rider, restart
`soFlottOS.Api: http` instead of running `npm run dev:api`.

On successful creation, the API logs `Seeded development accounts: ...`.
Open the frontend at `http://localhost:3000` and log in with one of these emails
and the password you chose:

| Role | Email |
|---|---|
| Admin | `admin@soflott.local` |
| Client | `client@soflott.local` |
| Driver | `driver@soflott.local` |

**Seeding only runs in Development and when the database has no users.**
If any user already exists, all three accounts are skipped. Changing the seed
password does not update existing accounts. After creating them, you can run
`npm run seed:disable` to disable seeding on subsequent API starts; this does
not delete the accounts.

## Root scripts

| Command | Does |
|---|---|
| `npm run db:up` / `db:down` | start / stop MySQL |
| `npm run dev:api` | run the backend |
| `npm run build:api` / `test:api` | build / unit-test the backend |
| `npm run tools:api` | restore the `dotnet-ef` CLI |
| `npm run seed:password -- 'YOUR_PASSWORD'` | save the development accounts' password in local User Secrets |
| `npm run seed:enable` / `seed:disable` | enable / disable development account creation on API startup |
| `npm run dev:web` | run the frontend |
| `npm run check:web` | lint + typecheck + build the frontend |

## The business flow end to end

1. **Quote** — `POST /api/orders/quote` returns distance, net price, 19% MwSt and gross price.
2. **Book** — `POST /api/orders` creates the order *and* its invoice (status `Sent`) in one step.
3. **Dispatch** — an admin assigns an online driver; the driver becomes `Busy`. Admins can create driver accounts and review completed delivery and revenue totals.
4. **Deliver** — the driver starts transit, then submits recipient name, signature and GPS.
5. **Release** — with no active jobs left the driver automatically returns to `Online`.
6. **Get paid** — the admin marks the invoice `Paid` after checking the bank account or PayPal. The client receives a payment confirmation; overdue invoices can be marked for a reminder.

Clients and admins can book a delivery for a client. Pickup and drop-off addresses
are entered as separate street, house number, postal code and city fields; contact
names and phone numbers are required. Coordinates remain optional until address
geocoding is available. Invoice details can be printed or saved as PDF, and all
account roles can recover a forgotten password.
Passwords must be at least 12 characters and include uppercase and lowercase
letters, a number and a symbol; reset links expire after 30 minutes and can be
used once. Signed-in UI messages and transactional email/SMS use the account's
German or English language preference.

### Customer booking availability

Admins manage **Availability** at `/admin/availability`: recurring weekday/time
windows (including split shifts) and a **busy** switch that pauses customer
bookings immediately. Outside enabled windows, customers see a soFlott
unavailable notice and cannot quote or book; the API also rejects both operations
with `409`. Admins can still book on behalf of clients.

All windows use **Europe/Berlin**, with automatic German daylight-saving changes,
regardless of the browser or server time zone. Start times are inclusive and end
times exclusive. Use `24:00` as an end time and split overnight windows across
two days. An enabled schedule with no windows closes all customer bookings;
disabling the schedule allows bookings anytime unless busy. Existing installations
start with the schedule disabled and busy off, preserving their booking behavior.
Settings persist in MySQL through the availability migration.

Business time-zone conversion is centralized in API `Common/BusinessTime.cs`
(also used by email) and web `lib/business-time.ts` (used by shared date
formatters). Operational timestamps remain UTC; availability is evaluated against
the current Berlin wall clock, not a customer-selected future appointment.

## Transactional email (Resend)

The API includes branded German HTML/plain-text emails for customer and driver
account creation, customer onboarding, booking, dispatch/reassignment,
cancellation, transit, proof of delivery, invoices and payment updates.
Messages are persisted in a transactional outbox and sent by a background
worker; Resend outages do not fail completed business operations.

Email is **disabled by default**. Verify your sending domain in Resend, configure
`Email__Enabled=true`, `Email__ApiKey`, `Email__From`, `Email__ReplyTo`, and
`Email__FrontendBaseUrl` on the **API process**, and complete the `Invoicing`
company/address/tax/payment details. Keep credentials outside source control.
The included outbox migration is applied on API startup when migration auto-apply
is enabled. `compose.yml` runs only MySQL, so email settings do not belong on that
container.

See [email configuration and extension guide](apps/api/src/soFlottOS.Api/Services/Email/README.md).

## Documentation

* [`docs/API-CONTRACT.md`](docs/API-CONTRACT.md) — every endpoint, role and enum.
* [`apps/api/README.md`](apps/api/README.md) — backend layers and configuration.
* [`apps/web/README.md`](apps/web/README.md) — frontend structure and conventions.
