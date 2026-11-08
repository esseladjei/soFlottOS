// ---------------------------------------------------------------------------
// Which optional services this deployment uses, and which cookies exist.
//
// Every tracker is OFF unless its ID is set in the environment, and an ID that
// does not look right is ignored. So a missing or mistyped variable can only
// ever mean "no tracking", never "tracking without consent". The cookie
// inventory below is generated from the same switches, so the cookie tables
// shown to visitors only list technologies that can really occur.
//
// NEXT_PUBLIC_* values must be written out in full (no destructuring) so Next.js
// can inline them into the browser bundle.
// ---------------------------------------------------------------------------

import { LOCALE_COOKIE_NAME } from "@/i18n/config";
import { CONSENT_COOKIE_NAME, type ConsentCategory } from "@/features/privacy/lib/consent-model";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";

function pick(value: string | undefined, pattern: RegExp): string | null {
  const trimmed = value?.trim();
  return trimmed && pattern.test(trimmed) ? trimmed : null;
}

export const trackerIds = {
  /** Google Analytics 4 measurement ID, e.g. G-ABC123DEF4. */
  googleAnalytics: pick(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID, /^G-[A-Z0-9]{4,20}$/),
  /** Google Ads conversion ID, e.g. AW-123456789. */
  googleAds: pick(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID, /^AW-\d{5,15}$/),
  /** Meta Pixel ID (covers Facebook and Instagram ads). */
  metaPixel: pick(process.env.NEXT_PUBLIC_META_PIXEL_ID, /^\d{5,20}$/),
  /** LinkedIn Insight Tag partner ID. */
  linkedIn: pick(process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID, /^\d{3,12}$/),
} as const;

/** Reports each consent decision to the backend as evidence. Set to "false" to switch off. */
export const consentEvidenceEnabled = process.env.NEXT_PUBLIC_CONSENT_EVIDENCE !== "false";

export type CookieId =
  | "consent"
  | "session"
  | "locale"
  | "ga"
  | "gaProperty"
  | "googleAds"
  | "metaPixel"
  | "linkedIn"
  | "vercelAnalytics";

export interface CookieDefinition {
  id: CookieId;
  category: ConsentCategory;
  /** Cookie name as shown in the table. */
  name: string;
  provider: string;
  /** Set by another domain; soFlott cannot read or delete it. */
  thirdParty: boolean;
}

const COMPANY = "soFlott UG";
const GOOGLE = "Google Ireland Limited";

const allCookies: (CookieDefinition & { enabled: boolean })[] = [
  { id: "consent", category: "necessary", name: CONSENT_COOKIE_NAME, provider: COMPANY, thirdParty: false, enabled: true },
  { id: "session", category: "necessary", name: SESSION_COOKIE_NAME, provider: COMPANY, thirdParty: false, enabled: true },
  { id: "locale", category: "preferences", name: LOCALE_COOKIE_NAME, provider: COMPANY, thirdParty: false, enabled: true },
  { id: "ga", category: "analytics", name: "_ga", provider: GOOGLE, thirdParty: false, enabled: trackerIds.googleAnalytics !== null },
  {
    id: "gaProperty",
    category: "analytics",
    name: "_ga_<ID>",
    provider: GOOGLE,
    thirdParty: false,
    enabled: trackerIds.googleAnalytics !== null,
  },
  {
    id: "googleAds",
    category: "marketing",
    name: "_gcl_au, _gcl_aw, _gac_*",
    provider: GOOGLE,
    thirdParty: false,
    enabled: trackerIds.googleAds !== null,
  },
  {
    id: "metaPixel",
    category: "marketing",
    name: "_fbp, _fbc",
    provider: "Meta Platforms Ireland Limited",
    thirdParty: false,
    enabled: trackerIds.metaPixel !== null,
  },
  {
    id: "linkedIn",
    category: "marketing",
    name: "li_fat_id, lidc, bcookie",
    provider: "LinkedIn Ireland Unlimited Company",
    thirdParty: true,
    enabled: trackerIds.linkedIn !== null,
  },
  {
    id: "vercelAnalytics",
    category: "analytics",
    name: "Vercel Web Analytics",
    provider: "Vercel Inc.",
    thirdParty: false,
    enabled: true,
  },
];

/** Every cookie or cookie-like technology that can occur on this deployment. */
export const cookieInventory: readonly CookieDefinition[] = allCookies
  .filter((cookie) => cookie.enabled)
  .map(({ id, category, name, provider, thirdParty }) => ({ id, category, name, provider, thirdParty }));

export function cookiesIn(category: ConsentCategory): CookieDefinition[] {
  return cookieInventory.filter((cookie) => cookie.category === category);
}

/** Whether any optional technology is configured at all. */
export const hasOptionalTrackers = Object.values(trackerIds).some((id) => id !== null);
