# soFlottOS

A B2B courier platform for a small German operator: customers book deliveries,
an admin dispatches drivers, drivers deliver and capture a signature, and every
order produces a VAT-compliant invoice automatically.

Three applications, one repository, one shared PostgreSQL database:

| Folder | What it is | Local URL |
|---|---|---|
| `apps/api` | ASP.NET Core 10 backend (PostgreSQL, JWT, EF Core) | `http://localhost:5235` |
| `apps/web` | public Next.js 16 site + customer/driver courier portal | `http://localhost:3000` |
| `apps/admin` | internal Next.js 16 administration console, **not public**, deployed separately | `http://localhost:3001` |
| `docs/API-CONTRACT.md` | the single contract both apps follow |
| `compose.yml` | local PostgreSQL |
| `scripts/dotnetw.mjs` | finds `dotnet` on `PATH` or in `~/.dotnet` |

## How the apps talk

```
customer/driver ──► apps/web   (Next.js route handlers) ──┐
                                                          ├──► ASP.NET Core API ──► PostgreSQL
admin ───────────► apps/admin (Next.js route handlers) ──┘
                   (/api/auth/*, /api/proxy/*)
```

Both frontends use the same API, so they always see the same data. They are
deliberately separate deployments: `apps/admin` only accepts `Admin` accounts
(session cookie `soflott_admin_session`, `noindex`, no public links) and should
live on a private hostname such as `admin.soflott.de`, ideally behind VPN/IP
allow-listing or SSO. `apps/web` rejects `Admin` logins with `403`.

The browser never sees the JWT. Logging in stores it in an **HTTP-only cookie**;
every data call goes to `/api/proxy/...` on the Next.js server, which attaches the
`Authorization` header and forwards the request to the backend. That keeps traffic
same-origin and keeps the token out of reach of JavaScript.

## Roles

| Role | App | Can do |
|---|---|---|
| `Admin` | `apps/admin` | dashboard, CRM, book for clients, add drivers, dispatch orders, invoices |
| `Client` | `apps/web` | book deliveries, track them, read and print own invoices |
| `Driver` | `apps/web` | go online/offline, see assigned jobs, start transit, capture proof of delivery |

## Getting started

In Rider, open `soFlottOS.sln` and select `soFlottOS.Api: http` to run the API.
This is the repository's only solution file. If Rider shows "No loaded projects",
close the solution and reopen `soFlottOS.sln`.

Before starting the API, configure `Jwt:SigningKey` (at least 32 random
characters) and `ConnectionStrings:Postgres` in .NET User Secrets or environment
variables. Development uses offline `GeoDistance` routing by default; set
`Routing:Provider=OpenRouteService` and configure `Routing:ApiKey` to use live
routing. Do not put credentials in configuration files.

```bash
npm run db:up                 # 1. start PostgreSQL in Docker
npm run dev:api               # 2. backend on http://localhost:5235

cp apps/web/.env.example apps/web/.env.local
npm run install:web           # 3. frontend dependencies
npm run dev:web               # 4. portal on http://localhost:3000

cp apps/admin/.env.example apps/admin/.env.local
npm run install:admin         # 5. admin console dependencies
npm run dev:admin             # 6. admin console on http://localhost:3001
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
PostgreSQL must be running, and `Jwt:SigningKey` and `ConnectionStrings:Postgres` must
already be configured as described above. If you run the API in Rider, restart
`soFlottOS.Api: http` instead of running `npm run dev:api`.

On successful creation, the API logs `Seeded development accounts: ...`.
Log in with one of these emails and the password you chose:

| Role | Email | Where |
|---|---|---|
| Admin | `admin@soflott.local` | `http://localhost:3001` |
| Client | `client@soflott.local` | `http://localhost:3000` |
| Driver | `driver@soflott.local` | `http://localhost:3000` |

**Seeding only runs in Development and when the database has no users.**
If any user already exists, all three accounts are skipped. Changing the seed
password does not update existing accounts. After creating them, you can run
`npm run seed:disable` to disable seeding on subsequent API starts; this does
not delete the accounts.

## Root scripts

| Command | Does |
|---|---|
| `npm run db:up` / `db:down` | start / stop PostgreSQL |
| `npm run dev:api` | run the backend |
| `npm run build:api` / `test:api` | build / unit-test the backend |
| `npm run tools:api` | restore the `dotnet-ef` CLI |
| `npm run seed:password -- 'YOUR_PASSWORD'` | save the development accounts' password in local User Secrets |
| `npm run seed:enable` / `seed:disable` | enable / disable development account creation on API startup |
| `npm run dev:web` / `dev:admin` | run the portal / admin console |
| `npm run check:web` / `check:admin` | lint + typecheck + build the portal / admin console |

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
Reset e-mails link to `Email:FrontendBaseUrl` (the portal), also for admins who
start recovery in the admin console; the new password then works in both apps.

### Customer booking availability

Admins manage **Availability** at `/availability` in the admin console: recurring weekday/time
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
Settings persist in PostgreSQL through the availability migration.

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
is enabled. `compose.yml` runs only PostgreSQL, so email settings do not belong on that
container.

See [email configuration and extension guide](apps/api/src/soFlottOS.Api/Services/Email/README.md).

## Documentation

* [`docs/API-CONTRACT.md`](docs/API-CONTRACT.md) — every endpoint, role and enum.
* [`apps/api/README.md`](apps/api/README.md) — backend layers and configuration.
* [`apps/web/README.md`](apps/web/README.md) — portal structure and conventions.
* [`apps/admin/README.md`](apps/admin/README.md) — admin console, access control and deployment.
