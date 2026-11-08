// ---------------------------------------------------------------------------
// Languages of the admin console. German is the default; the choice is kept in
// the `soflott_locale` cookie (console URLs carry no language segment).
// ---------------------------------------------------------------------------

/** The languages the console is translated into. */
export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

/** Used when we cannot tell what the visitor wants. */
export const defaultLocale: Locale = "de";

/** Remembers the language an admin picked. Not security relevant. */
export const LOCALE_COOKIE_NAME = "soflott_locale";

export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;


/** Narrowing helper: is this unknown string one of our locales? */
export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Labels shown in the language switcher, always written in their own language. */
export const localeLabels: Record<Locale, { short: string; long: string }> = {
  de: { short: "DE", long: "Deutsch" },
  en: { short: "EN", long: "English" },
};
