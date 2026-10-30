"use client";

// ---------------------------------------------------------------------------
// Makes the current language available to CLIENT components.
//
// The root layout resolves the language on the server and hands it to this
// provider, so every button label, toast and validation message inside the
// signed-in application can be translated without another round trip.
// ---------------------------------------------------------------------------

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { getAppContent, type AppContent } from "@/content/app";
import {
  defaultLocale,
  LOCALE_COOKIE_MAX_AGE,
  LOCALE_COOKIE_NAME,
  type Locale,
} from "@/i18n/config";
import { createFormatters, type Formatters } from "@/lib/format";

interface LocaleContextValue {
  locale: Locale;
  content: AppContent;
  formatters: Formatters;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const value = useMemo<LocaleContextValue>(
    () => ({ locale, content: getAppContent(locale), formatters: createFormatters(locale) }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

function useLocaleContext(): LocaleContextValue {
  const value = useContext(LocaleContext);

  // A missing provider must never blank out the UI, so fall back to German.
  return (
    value ?? {
      locale: defaultLocale,
      content: getAppContent(defaultLocale),
      formatters: createFormatters(defaultLocale),
    }
  );
}

/** The language of the current page, e.g. "de". */
export function useLocale(): Locale {
  return useLocaleContext().locale;
}

/** All translated strings of the signed-in application. */
export function useAppContent(): AppContent {
  return useLocaleContext().content;
}

/** Date, currency and distance formatting bound to the current language. */
export function useFormatters(): Formatters {
  return useLocaleContext().formatters;
}

/**
 * Stores the chosen language. `middleware.ts` reads this cookie on the next
 * request and forwards the language to the server components.
 */
export function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
}
