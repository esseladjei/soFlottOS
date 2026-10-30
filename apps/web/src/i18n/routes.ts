// ---------------------------------------------------------------------------
// The public site map, in one place.
//
// `marketingPages` lists every public page. The folder names under
// `app/(marketing)/[locale]/` must match these keys. Keeping the list here means
// the navigation, the footer, the sitemap and the hreflang tags can never drift
// apart from each other.
// ---------------------------------------------------------------------------

import { locales, type Locale } from "@/i18n/config";

/** Page keys = folder names. "home" is the index page of a locale. */
export const marketingPages = [
  "home",
  "services",
  "industries",
  "pricing",
  "platform",
  "security",
  "contact",
] as const;

export type MarketingPage = (typeof marketingPages)[number];

/** Sub-pages only (everything except the home page). */
export const marketingSubPages = marketingPages.filter(
  (page): page is Exclude<MarketingPage, "home"> => page !== "home",
);

/**
 * Builds an absolute-from-root path, e.g. localePath("de", "pricing") -> "/de/pricing".
 * Always use this instead of writing "/de/..." by hand.
 */
export function localePath(locale: Locale, page: MarketingPage = "home"): string {
  return page === "home" ? `/${locale}` : `/${locale}/${page}`;
}

/**
 * Swaps the language of the current URL, keeping the visitor on the same page.
 * "/de/pricing" + "en" -> "/en/pricing".
 */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  return `/${nextLocale}`;
}
