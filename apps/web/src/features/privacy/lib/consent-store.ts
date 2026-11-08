// ---------------------------------------------------------------------------
// Browser-side storage of the consent decision.
//
// The cookie is the single source of truth. React reads it through
// `useSyncExternalStore` (see `hooks/use-cookie-consent.ts`), which is why this
// file exposes `subscribe` / `getSnapshot` like a tiny store. Decisions made in
// another tab are picked up through a BroadcastChannel and on window focus.
// ---------------------------------------------------------------------------

import {
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE_SECONDS,
  actionFor,
  createConsentState,
  parseConsent,
  peekConsentId,
  serializeConsent,
  type ConsentChoices,
  type ConsentState,
} from "@/features/privacy/lib/consent-model";
import { consentEvidenceEnabled } from "@/features/privacy/lib/privacy-config";

const CHANNEL_NAME = "soflott-consent";

const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

let lastRaw: string | null | undefined;
let lastState: ConsentState | null = null;

/** Reads one cookie from `document.cookie`; `null` when absent or on the server. */
export function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;

  const prefix = `${name}=`;
  for (const part of document.cookie.split(";")) {
    const cookie = part.trim();
    if (cookie.startsWith(prefix)) return cookie.slice(prefix.length);
  }
  return null;
}

/** The stored decision, or `null` when there is none that is still valid. */
export function getConsentSnapshot(): ConsentState | null {
  const raw = readCookie(CONSENT_COOKIE_NAME);

  // Parsing returns a new object; caching keeps the snapshot stable between reads.
  if (raw !== lastRaw) {
    lastRaw = raw;
    lastState = parseConsent(raw);
  }
  return lastState;
}

/** On the server the decision is unknown, so nothing is rendered until the browser has checked. */
export function getServerConsentSnapshot(): undefined {
  return undefined;
}

function notify() {
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);

  const incoming = typeof BroadcastChannel === "undefined" ? null : new BroadcastChannel(CHANNEL_NAME);
  incoming?.addEventListener("message", notify);
  window.addEventListener("focus", notify);

  return () => {
    listeners.delete(listener);
    incoming?.close();
    window.removeEventListener("focus", notify);
  };
}

function writeConsentCookie(state: ConsentState) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${serializeConsent(state)}; Path=/; Max-Age=${CONSENT_MAX_AGE_SECONDS}; SameSite=Lax${secure}`;
}

function newConsentId(): string {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID();

  // `randomUUID` only exists in secure contexts; build a v4 UUID by hand elsewhere.
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Sends the decision to the backend as consent evidence. Only the record id,
 * notice version, action and the chosen categories leave the browser - no IP
 * address, user agent or other identifier is added. Failure is ignored on
 * purpose: the cookie, not the backend, decides what runs.
 */
function reportEvidence(state: ConsentState, previousId: string | null) {
  if (!consentEvidenceEnabled) return;

  void fetch("/api/privacy/consent", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: state.id,
      previousId,
      version: state.version,
      action: actionFor(state),
      analytics: state.analytics,
      marketing: state.marketing,
      preferences: state.preferences,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

/** Stores a new decision and tells every subscriber (this tab and others). */
export function saveConsent(choices: ConsentChoices): ConsentState {
  const previousId = peekConsentId(readCookie(CONSENT_COOKIE_NAME));
  const state = createConsentState(choices, newConsentId());

  writeConsentCookie(state);
  notify();

  if (typeof BroadcastChannel !== "undefined") {
    channel ??= new BroadcastChannel(CHANNEL_NAME);
    channel.postMessage("changed");
  }

  reportEvidence(state, previousId);
  return state;
}
