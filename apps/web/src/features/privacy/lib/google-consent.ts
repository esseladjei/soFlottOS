// ---------------------------------------------------------------------------
// Google Consent Mode v2.
//
// The order matters: `gtag('consent', 'default', ...)` with everything denied
// must be in the dataLayer BEFORE gtag.js is loaded, and every later decision is
// passed on with `gtag('consent', 'update', ...)`. Nothing here loads a Google
// script by itself; see `trackers.ts`.
// ---------------------------------------------------------------------------

import type { ConsentChoices } from "@/features/privacy/lib/consent-model";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

type ConsentValue = "granted" | "denied";

export interface GoogleConsentSignals {
  ad_storage: ConsentValue;
  ad_user_data: ConsentValue;
  ad_personalization: ConsentValue;
  analytics_storage: ConsentValue;
  functionality_storage: ConsentValue;
  personalization_storage: ConsentValue;
  security_storage: ConsentValue;
}

const granted = (allowed: boolean): ConsentValue => (allowed ? "granted" : "denied");

/** Maps the four categories to the Consent Mode v2 signals. */
export function toGoogleConsent(choices: ConsentChoices): GoogleConsentSignals {
  return {
    ad_storage: granted(choices.marketing),
    ad_user_data: granted(choices.marketing),
    ad_personalization: granted(choices.marketing),
    analytics_storage: granted(choices.analytics),
    functionality_storage: granted(choices.preferences),
    personalization_storage: granted(choices.preferences),
    // Strictly necessary: session and security cookies.
    security_storage: "granted",
  };
}

export const DENIED_BY_DEFAULT = toGoogleConsent({ analytics: false, marketing: false, preferences: false });

/** Creates `dataLayer` and `gtag` and declares the all-denied default. Safe to call repeatedly. */
export function ensureGtag(): Gtag {
  if (window.gtag) return window.gtag;

  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js only understands the `arguments` object, not an array of values.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer?.push(arguments);
  };

  window.gtag("consent", "default", { ...DENIED_BY_DEFAULT, wait_for_update: 500 });
  return window.gtag;
}

let lastSignals: string | null = null;

/** Passes the current decision to Google; repeated identical updates are skipped. */
export function updateGoogleConsent(choices: ConsentChoices) {
  const gtag = ensureGtag();
  const signals = toGoogleConsent(choices);
  const key = JSON.stringify(signals);

  if (key !== lastSignals) {
    lastSignals = key;
    gtag("consent", "update", signals);
  }
}
