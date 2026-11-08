// ---------------------------------------------------------------------------
// The public site map, in one place.
//
// soFlott UG (haftungsbeschränkt) is the parent company with two commercial
// divisions, each living in its own sub-directory:
//
//   /<locale>/                      corporate homepage (routes to a division)
//   /<locale>/about, /contact, /legal/*
//   /<locale>/express/...           soFlott Express - courier & logistics
//   /<locale>/digital/...           soFlott Digital - IT consulting & software
//
// Every public page is a key in `marketingPages`. The navigation, the footer,
// the division sub-navigation, breadcrumbs, the sitemap and the hreflang tags
// are all generated from this list, so they can never drift apart.
// Slugs are English in both languages (as in the implementation brief); the
// language lives in the first URL segment.
// ---------------------------------------------------------------------------

import { locales, type Locale } from "@/i18n/config";

export const expressPages = [
  "express",
  "express/direct-b2b-delivery",
  "express/logistics-subcontracting",
  "express/contracted-delivery-routes",
  "express/service-areas",
  "express/how-it-works",
  "express/request-a-quote",
  "express/contact",
] as const;

export const digitalPages = [
  "digital",
  "digital/it-consulting",
  "digital/software-development",
  "digital/api-integration",
  "digital/application-modernisation",
  "digital/contract-software-engineering",
  "digital/support-and-maintenance",
  "digital/case-studies",
  "digital/request-a-proposal",
  "digital/contact",
] as const;

export const corporatePages = [
  "home",
  "about",
  "contact",
  "legal/imprint",
  "legal/privacy",
  "legal/terms",
  "legal/cookies",
] as const;

/** Page keys = URL paths after the locale. "home" is the locale index page. */
export const marketingPages = [...corporatePages, ...expressPages, ...digitalPages] as const;

export type MarketingPage = (typeof marketingPages)[number];
export type ExpressPage = (typeof expressPages)[number];
export type DigitalPage = (typeof digitalPages)[number];

export type Division = "corporate" | "express" | "digital";

/**
 * Pages that exist but must not be indexed yet.
 * Case studies stay hidden from search engines until real, client-approved
 * project examples are published (brief 4.4 / 4.7).
 */
export const noindexPages: readonly MarketingPage[] = ["digital/case-studies"];

export function isIndexable(page: MarketingPage): boolean {
  return !noindexPages.includes(page);
}

export function isMarketingPage(value: string): value is MarketingPage {
  return (marketingPages as readonly string[]).includes(value);
}

/** Which division a page belongs to - decides colours and sub-navigation. */
export function pageDivision(page: MarketingPage): Division {
  if (page === "express" || page.startsWith("express/")) return "express";
  if (page === "digital" || page.startsWith("digital/")) return "digital";
  return "corporate";
}

/**
 * Breadcrumb trail from the homepage down to `page`, e.g.
 * "express/how-it-works" -> ["home", "express", "express/how-it-works"].
 * "legal/imprint" has no "legal" index page, so it hangs off the homepage.
 */
export function pageTrail(page: MarketingPage): MarketingPage[] {
  if (page === "home") return ["home"];

  const trail: MarketingPage[] = ["home"];
  const parts = page.split("/");

  for (let index = 1; index <= parts.length; index += 1) {
    const candidate = parts.slice(0, index).join("/");
    if (isMarketingPage(candidate)) trail.push(candidate);
  }

  return trail;
}

/** URL slug segments for the optional catch-all route. "home" -> []. */
export function pageSlug(page: MarketingPage): string[] {
  return page === "home" ? [] : page.split("/");
}

/** Inverse of `pageSlug`; returns null for unknown paths. */
export function pageFromSlug(slug: readonly string[] | undefined): MarketingPage | null {
  const key = !slug || slug.length === 0 ? "home" : slug.join("/");
  return isMarketingPage(key) ? key : null;
}

/**
 * Builds an absolute-from-root path, e.g.
 * localePath("de", "express/how-it-works") -> "/de/express/how-it-works".
 * Always use this instead of writing "/de/..." by hand.
 */
export function localePath(locale: Locale, page: MarketingPage = "home"): string {
  return page === "home" ? `/${locale}` : `/${locale}/${page}`;
}

/**
 * Swaps the language of the current URL, keeping the visitor on the same page.
 * "/de/express" + "en" -> "/en/express".
 */
export function switchLocalePath(pathname: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && (locales as readonly string[]).includes(segments[0])) {
    segments[0] = nextLocale;
    return `/${segments.join("/")}`;
  }

  return `/${nextLocale}`;
}
