// ---------------------------------------------------------------------------
// /sitemap.xml - the list of pages we want Google to index.
//
// Every marketing page is listed once per language, and each entry links to its
// translations so Google treats them as one page in two languages.
// ---------------------------------------------------------------------------

import type { MetadataRoute } from "next";
import { languageAlternates, absoluteUrl } from "@/features/marketing/lib/seo";
import { locales } from "@/i18n/config";
import { localePath, marketingPages } from "@/i18n/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const marketing = locales.flatMap((locale) =>
    marketingPages.map((page) => ({
      url: absoluteUrl(localePath(locale, page)),
      lastModified,
      changeFrequency: page === "home" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "home" ? 1 : 0.8,
      alternates: { languages: languageAlternates(page) },
    })),
  );

  // The app itself does not need to rank, but the entry points may be indexed.
  const app = ["/login", "/register"].map((path) => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.3,
  }));

  return [...marketing, ...app];
}
