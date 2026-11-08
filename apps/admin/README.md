# soFlottOS Admin

Internal administration console for soFlott (operations, CRM, drivers,
invoices, booking availability). **Not public** – deployed separately from the
customer portal (`apps/web`), ideally behind a private hostname
(e.g. `admin.soflott.de`) plus VPN/IP allow-listing or SSO at the edge.

Same stack as `apps/web`: Next.js App Router, TypeScript, Tailwind CSS,
TanStack Query, React Hook Form, Zod and sonner. It talks to the same
ASP.NET Core API (`apps/api`) and therefore the same MySQL database.

## Run locally

```bash
cp .env.example .env.local   # NEXT_PUBLIC_SITE_URL, SOFLOTT_API_BASE_URL
npm install
npm run dev                  # http://localhost:3001
```

From the repo root: `npm run dev:admin`, `npm run check:admin`.

## Routes

| Path | Purpose |
| --- | --- |
| `/login`, `/forgot-password`, `/reset-password` | public auth screens |
| `/` | dashboard (pending orders, assignment) |
| `/clients`, `/clients/[id]` | CRM, client pricing |
| `/drivers` | driver accounts |
| `/orders/new?clientId=…`, `/orders/[id]` | book on behalf of a client, order detail |
| `/invoices`, `/invoices/[id]` | invoice status and documents |
| `/availability` | booking availability settings |

## Access control

- `/api/auth/login` only accepts accounts with role `Admin` (others get `403`).
- The session is stored in the HTTP-only, `SameSite=Strict` cookie
  `soflott_admin_session` – a different name from the portal's
  `soflott_session`, so both apps can run on one host without sharing sessions.
- `middleware.ts`, `getSession()` and the `/api/proxy` handler only accept an
  unexpired Admin session; everything except the auth screens redirects to
  `/login`. The API still enforces `[Authorize(Roles = "Admin")]` server-side.
- Every response is sent with `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`
  and `Referrer-Policy: no-referrer`; `robots.txt` disallows everything.

Password-reset e-mails link to `Email:FrontendBaseUrl` (the customer portal).
The new password works in both apps.

## Folder structure

- `src/app/(auth)` – login and password recovery.
- `src/app/(console)` – the signed-in admin pages (served at the root).
- `src/app/api` – route handlers for auth, session and the backend proxy.
- `src/features/admin` – admin API calls, hooks, schemas, components.
- `src/features/client` – booking form and invoice document reused by admins.
- `src/features/auth` – login and password-recovery forms.
- `src/content/app` – German/English copy; `src/i18n` – locale handling.
- `src/lib`, `src/components`, `src/types/api.ts` – copies of the portal's
  helpers and the frozen API contract. Keep `types/api.ts` in sync with `apps/web`.

## Checks

```bash
npm run lint && npm run typecheck && npm run build
node --test src/features/auth/schemas.test.mjs
```
