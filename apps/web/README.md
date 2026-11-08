# soFlottOS Web

Next.js frontend for the soFlottOS B2B courier platform. It uses the App Router, TypeScript, Tailwind CSS, TanStack Query, React Hook Form, Zod, sonner toasts, and a small PWA shell.

## Folder structure

- `src/app` — routes. Route groups keep public marketing pages, auth pages, and the client/driver workspaces separate:
  - `(marketing)` for `/`, `/platform`, `/operations`, `/security`
  - `(auth)` for `/login` and `/register`
  - `(client)` for booking, orders, and invoices
  - `(driver)` for mobile-first driver PWA jobs and proof of delivery
  - `api` for Next.js route handlers (`auth`, `session`, and `proxy`)
- `src/features/<area>` — area-specific API calls, React Query hooks, Zod schemas, and components.
- `src/components/ui` — small reusable UI primitives.
- `src/components/layout` — role shells, page headers, and loading/empty/error states.
- `src/lib/api` — backend fetch/proxy helpers and browser `apiFetch` error handling.
- `src/lib/auth` — HTTP-only `soflott_session` cookie encoding and public session helpers.
- `src/lib/format.ts` — German date and EUR formatting.
- `src/types/api.ts` — frozen frontend copy of the backend contract. Do not edit casually.

Each feature/route folder has a short README or header comment to explain its purpose for new Next.js users.

## Auth, session, and proxy flow

1. The browser posts credentials to `/api/auth/login` or registration data to `/api/auth/register`.
2. That Next.js route calls the ASP.NET backend server-side (`/api/auth/login`, `/api/auth/register/client`, or `/api/auth/register/driver`).
3. The backend returns an `AuthResponse` with a JWT. Next.js stores it in an HTTP-only base64url cookie named `soflott_session`.
4. The browser only receives the safe public `Session` (`userId`, `email`, `fullName`, `role`, optional `clientId`, `expiresAtUtc`).
5. Client components call `/api/proxy/<backend-path>` through React Query hooks. The proxy reads the cookie and forwards the JWT to the backend.
6. `middleware.ts` protects `/client` and `/driver`, redirects anonymous users to `/login?redirectTo=...`, redirects signed-in users away from auth pages, and enforces role boundaries.
7. Administrators use the separate internal console in `apps/admin`. This portal's `/api/auth/login` answers `403` for `Admin` accounts, and `getSession()`/middleware/proxy treat an Admin cookie as signed out.

## Environment variables

Copy `.env.example` to `.env.local` if you need local overrides.

| Variable | Purpose | Default |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public site origin used by metadata and SEO routes | `http://localhost:3000` |
| `SOFLOTT_API_BASE_URL` | ASP.NET backend base URL used only by Next.js server route handlers | `http://localhost:5235` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 ID; loaded only after Analytics consent | unset (off) |
| `NEXT_PUBLIC_GOOGLE_ADS_ID` | Google Ads ID; loaded only after Marketing consent | unset (off) |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta pixel ID; loaded only after Marketing consent | unset (off) |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag ID; loaded only after Marketing consent | unset (off) |
| `NEXT_PUBLIC_CONSENT_EVIDENCE` | Set to `false` to stop sending consent decisions to the API | on |

## Cookie consent and privacy

`src/features/privacy` implements the GDPR/TDDDG consent system from
`FeatureSpecs/Cookie_PrivacySpec.txt` on the public marketing site.

- **Categories:** Necessary (always on), Analytics, Ads & Marketing, Preferences.
  The decision is stored in the first-party `soflott_consent` cookie (180 days,
  `SameSite=Lax`, notice version `1.0`). A missing, malformed, expired or
  other-version cookie counts as "no consent" and shows the banner again;
  raise `CONSENT_VERSION` in `lib/consent-model.ts` to force fresh consent.
- **Nothing optional runs before consent.** `ConsentScripts` mounts Google
  Consent Mode v2 with every signal `denied`, and loads GA4, Google Ads, Meta,
  LinkedIn and Vercel Analytics only when the visitor allows the category *and*
  the ID is configured. Withdrawing consent deletes the category's cookies and reloads.
- **UI:** `CookieBanner` (equal-weight Accept all / Reject optional / Settings),
  `CookieSettingsDialog`, the `/legal/cookies` page and a footer link that
  reopen the settings at any time. Texts live in `src/content/privacy`.
- **Evidence and requests:** each decision is posted best-effort to
  `/api/privacy/consent`; the privacy page hosts a data-subject request form and
  status lookup (`/api/privacy/data-request`). See `docs/API-CONTRACT.md`.
- **Legal pages:** `src/content/marketing/legal-de.ts` / `legal-en.ts` hold the
  20-section privacy policy, an AGB draft and the cookie page. They show a
  "draft" banner until `NEXT_PUBLIC_LEGAL_REVIEWED=true`.
- **Portal locale cookie:** `soflott_locale` is a Preferences cookie. Without
  Preferences consent it is session-only, and the consent enforcer deletes it.
- Only the marketing layout mounts the banner; the client/driver portal and the
  admin console set no optional cookies.

Run the consent tests with `node --test src/features/privacy/lib/consent.test.mjs`.

## Running locally

From `apps/web`:

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. The backend should run separately for interactive data, but `npm run build` does not fetch backend data.

## Client booking

Get quote validates only the four route coordinates (latitude -90 to 90,
longitude -180 to 180). Coordinates are required; addresses alone are not
geocoded. Validation and API errors appear in the form. Confirm order becomes
available after a successful quote for the current coordinates and validates
the remaining shipment details. Changing coordinates requires a new quote.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
