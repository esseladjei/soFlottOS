"use client";

import { createContext, useContext } from "react";
import type { ConsentChoices, ConsentState } from "@/features/privacy/lib/consent-model";

export interface CookieConsentApi {
  /** `undefined` until the browser has read the cookie, `null` when no valid decision exists. */
  consent: ConsentState | null | undefined;
  /** Whether the settings dialog is open. */
  isSettingsOpen: boolean;
  openSettings: () => void;
  closeSettings: () => void;
  /** Stores the choices as a new decision. */
  save: (choices: ConsentChoices) => void;
  acceptAll: () => void;
  rejectOptional: () => void;
}

const noop = () => undefined;

export const fallbackConsentApi: CookieConsentApi = {
  consent: undefined,
  isSettingsOpen: false,
  openSettings: noop,
  closeSettings: noop,
  save: noop,
  acceptAll: noop,
  rejectOptional: noop,
};

export const ConsentContext = createContext<CookieConsentApi>(fallbackConsentApi);

/** Reads and changes the visitor's cookie decision. Works inside `ConsentProvider`. */
export function useCookieConsent(): CookieConsentApi {
  return useContext(ConsentContext);
}
