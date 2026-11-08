// ---------------------------------------------------------------------------
// Everything Google needs, in one helper.
//
// `buildPageMetadata` produces the <title>, <meta description>, keywords, the
// canonical URL, the hreflang alternates (de / en / x-default) and the Open
// Graph + Twitter cards for a single marketing page.
//
// Why hreflang matters: it tells Google that /de/express and /en/express are
// the SAME page in two languages, so they do not compete with each other.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import type { PageMeta } from "@/content/marketing/types";
import { defaultLocale, locales, openGraphLocales, type Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";

/** Absolute URL for a marketing page, e.g. https://example.com/de/express */
export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

/** { de: "/de/express", en: "/en/express", "x-default": "/de/express" } */
export function languageAlternates(page: MarketingPage): Record<string, string> {
  const alternates: Record<string, string> = {};

  for (const locale of locales) {
    alternates[locale] = absoluteUrl(localePath(locale, page));
  }

  // x-default is what Google shows when it knows no better - we point it at the
  // default language.
  alternates["x-default"] = absoluteUrl(localePath(defaultLocale, page));

  return alternates;
}

export function buildPageMetadata({
  locale,
  page,
  meta,
  indexable = true,
}: {
  locale: Locale;
  page: MarketingPage;
  meta: PageMeta;
  /** false -> `noindex, follow` (e.g. pages awaiting owner approval). */
  indexable?: boolean;
}): Metadata {
  const canonical = absoluteUrl(localePath(locale, page));

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    ...(indexable ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical,
      languages: languageAlternates(page),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.brand,
      title: meta.title,
      description: meta.description,
      url: canonical,
      locale: openGraphLocales[locale],
      alternateLocale: locales
        .filter((item) => item !== locale)
        .map((item) => openGraphLocales[item]),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
  };
}
