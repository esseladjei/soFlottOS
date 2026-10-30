// ---------------------------------------------------------------------------
// Which languages the public website speaks.
//
// German ("de") is the DEFAULT because soFlott serves German B2B customers.
// English ("en") is offered so international companies can read the site too.
//
// Every public page lives under a /<locale>/ prefix, e.g. "/de/pricing" and
// "/en/pricing". Explicit prefixes are the clearest setup for Google: each
// language has its own stable URL, and we can point hreflang tags at them.
// ---------------------------------------------------------------------------

/** The languages the marketing site is translated into. */
export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

/** Used when we cannot tell what the visitor wants. */
export const defaultLocale: Locale = "de";

/**
 * Remembers the language a visitor picked, so "/" sends them back to it.
 * Not security relevant, therefore readable by JavaScript.
 */
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

/** Value for the Open Graph `og:locale` tag. */
export const openGraphLocales: Record<Locale, string> = {
  de: "de_DE",
  en: "en_GB",
};

/**
 * Picks the best language from a browser `Accept-Language` header.
 * Falls back to German, which is what most visitors of a German courier want.
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) {
    return defaultLocale;
  }

  const ranked = acceptLanguage
    .split(",")
    .map((part) => {
      const [tag, quality] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), quality: quality ? Number(quality) : 1 };
    })
    .sort((a, b) => b.quality - a.quality);

  for (const { tag } of ranked) {
    const base = tag.split("-")[0];
    if (isLocale(base)) {
      return base;
    }
  }

  return defaultLocale;
}
