// ---------------------------------------------------------------------------
// The consent record and the rules for reading it back.
//
// This file must stay free of browser APIs: the same code validates the
// `soflott_consent` cookie in the browser AND in `middleware.ts` (edge runtime).
// A stored value is only trusted when every field checks out; anything else -
// malformed JSON, an old notice version, an expired decision - counts as "no
// consent" and brings the banner back.
// ---------------------------------------------------------------------------

/** First-party cookie that remembers the visitor's decision. */
export const CONSENT_COOKIE_NAME = "soflott_consent";

/**
 * Version of the consent notice. Raise it whenever the categories, purposes or
 * providers change in a way that needs fresh consent - every stored decision
 * with another version is then ignored and the banner is shown again.
 */
export const CONSENT_VERSION = "1.0";

/** A decision is asked for again after this many days (renewal). */
export const CONSENT_MAX_AGE_DAYS = 180;

export const CONSENT_MAX_AGE_SECONDS = CONSENT_MAX_AGE_DAYS * 24 * 60 * 60;

export const consentCategories = ["necessary", "analytics", "marketing", "preferences"] as const;

export type ConsentCategory = (typeof consentCategories)[number];

/** Categories the visitor can switch on or off. */
export const optionalCategories = ["analytics", "marketing", "preferences"] as const;

export type OptionalCategory = (typeof optionalCategories)[number];

export type ConsentChoices = Record<OptionalCategory, boolean>;

/** How the decision was made; stored as consent evidence. */
export type ConsentAction = "AcceptAll" | "RejectOptional" | "Custom";

export interface ConsentState extends ConsentChoices {
  /** Random identifier of this decision (links evidence records, carries no personal data). */
  id: string;
  /** Strictly necessary technologies cannot be switched off. */
  necessary: true;
  version: string;
  /** ISO timestamp of the decision. */
  updatedAt: string;
}

export const NO_CONSENT: ConsentChoices = { analytics: false, marketing: false, preferences: false };

export const ACCEPT_ALL: ConsentChoices = { analytics: true, marketing: true, preferences: true };

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Tolerated clock difference between the device and the stored timestamp. */
const CLOCK_SKEW_MS = 5 * 60 * 1000;

export function isConsentId(value: unknown): value is string {
  return typeof value === "string" && UUID_PATTERN.test(value);
}

/** Cookie values are URL-encoded JSON; some runtimes hand over the decoded text. */
function readJson(raw: string): unknown {
  try {
    return JSON.parse(raw.startsWith("{") ? raw : decodeURIComponent(raw));
  } catch {
    return null;
  }
}

/**
 * Turns the raw cookie value into a trusted consent state, or `null` when the
 * value is missing, malformed, from another notice version or expired.
 */
export function parseConsent(raw: string | null | undefined, now: number = Date.now()): ConsentState | null {
  if (!raw) return null;

  const data = readJson(raw);
  if (typeof data !== "object" || data === null) return null;

  const { id, necessary, analytics, marketing, preferences, version, updatedAt } = data as Record<string, unknown>;

  if (
    !isConsentId(id) ||
    necessary !== true ||
    typeof analytics !== "boolean" ||
    typeof marketing !== "boolean" ||
    typeof preferences !== "boolean" ||
    version !== CONSENT_VERSION ||
    typeof updatedAt !== "string"
  ) {
    return null;
  }

  const decidedAt = Date.parse(updatedAt);
  if (Number.isNaN(decidedAt) || decidedAt > now + CLOCK_SKEW_MS) return null;
  if (now - decidedAt > CONSENT_MAX_AGE_SECONDS * 1000) return null;

  return { id, necessary: true, analytics, marketing, preferences, version, updatedAt };
}

/** The identifier of an earlier decision, even if that decision is no longer valid. */
export function peekConsentId(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const data = readJson(raw);
  const id = typeof data === "object" && data !== null ? (data as Record<string, unknown>).id : null;
  return isConsentId(id) ? id : null;
}

export function createConsentState(choices: ConsentChoices, id: string, now: Date = new Date()): ConsentState {
  return {
    id,
    necessary: true,
    analytics: choices.analytics,
    marketing: choices.marketing,
    preferences: choices.preferences,
    version: CONSENT_VERSION,
    updatedAt: now.toISOString(),
  };
}

export function serializeConsent(state: ConsentState): string {
  return encodeURIComponent(
    JSON.stringify({
      id: state.id,
      necessary: true,
      analytics: state.analytics,
      marketing: state.marketing,
      preferences: state.preferences,
      version: state.version,
      updatedAt: state.updatedAt,
    }),
  );
}

export function actionFor(choices: ConsentChoices): ConsentAction {
  if (choices.analytics && choices.marketing && choices.preferences) return "AcceptAll";
  if (!choices.analytics && !choices.marketing && !choices.preferences) return "RejectOptional";
  return "Custom";
}

/** Has the visitor allowed `category`? Missing consent means no. */
export function isAllowed(state: ConsentChoices | null | undefined, category: OptionalCategory): boolean {
  return state?.[category] === true;
}
