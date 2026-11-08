"use client";

// ---------------------------------------------------------------------------
// Holds the visitor's cookie decision for the public website.
//
// The decision lives in the `soflott_consent` cookie; this provider only mirrors
// it into React (see `consent-store.ts`) and exposes the actions. Components
// read it with `useCookieConsent()`.
// ---------------------------------------------------------------------------

import { useCallback, useMemo, useState, useSyncExternalStore, type ReactNode } from "react";
import { getPrivacyContent } from "@/content/privacy";
import { ConsentContext, type CookieConsentApi } from "@/features/privacy/hooks/use-cookie-consent";
import { ACCEPT_ALL, NO_CONSENT, type ConsentChoices } from "@/features/privacy/lib/consent-model";
import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  saveConsent,
  subscribeConsent,
} from "@/features/privacy/lib/consent-store";
import { useLocale } from "@/i18n/locale-provider";

export function ConsentProvider({ children }: { children: ReactNode }) {
  const content = getPrivacyContent(useLocale());
  const consent = useSyncExternalStore(subscribeConsent, getConsentSnapshot, getServerConsentSnapshot);

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  const save = useCallback(
    (choices: ConsentChoices) => {
      saveConsent(choices);
      setSettingsOpen(false);
      setAnnouncement(content.settings.saved);
    },
    [content.settings.saved],
  );

  const api = useMemo<CookieConsentApi>(
    () => ({
      consent,
      isSettingsOpen,
      openSettings: () => setSettingsOpen(true),
      closeSettings: () => setSettingsOpen(false),
      save,
      acceptAll: () => save(ACCEPT_ALL),
      rejectOptional: () => save(NO_CONSENT),
    }),
    [consent, isSettingsOpen, save],
  );

  return (
    <ConsentContext.Provider value={api}>
      {children}
      {/* Screen readers are told that the choice was stored; the banner itself disappears. */}
      <p aria-live="polite" className="sr-only" role="status">
        {announcement}
      </p>
    </ConsentContext.Provider>
  );
}
