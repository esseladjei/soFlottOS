// ---------------------------------------------------------------------------
// /sitemap.xml - the list of pages we want search engines to index.
//
// Every indexable marketing page is listed once per language, and each entry
// links to its translations so it is treated as one page in two languages.
// Pages in `noindexPages` (e.g. case studies awaiting approval) and the
// signed-in app (/login, /register, portal) are deliberately left out.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { absoluteUrl, languageAlternates } from "@/features/marketing/lib/seo";
import { locales } from "@/i18n/config";
import { isIndexable, localePath, marketingPages } from "@/i18n/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const pages = marketingPages.filter(isIndexable);

  return locales.flatMap((locale) =>
    pages.map((page) => ({
      url: absoluteUrl(localePath(locale, page)),
      lastModified,
      changeFrequency: page === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "home" ? 1 : page === "express" || page === "digital" ? 0.9 : 0.7,
      alternates: { languages: languageAlternates(page) },
    })),
  );
}
