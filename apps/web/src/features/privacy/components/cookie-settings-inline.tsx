"use client";

import { useCookieConsent } from "@/features/privacy/hooks/use-cookie-consent";
import { CookieSettingsPanel } from "@/features/privacy/components/cookie-settings-panel";

/** The full cookie settings, shown inline on the cookie page. */
export function CookieSettingsInline() {
  const { consent } = useCookieConsent();

  // A new decision (here or in another tab) rebuilds the form from the stored choice.
  return <CookieSettingsPanel key={consent === undefined ? "pending" : (consent?.id ?? "none")} variant="page" />;
}
