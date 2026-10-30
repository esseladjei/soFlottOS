// ---------------------------------------------------------------------------
// Picks the right translation for a language.
//
// Usage inside a server component:
//   const t = getMarketingContent(locale);
//   <h1>{t.home.hero.headlineLead}</h1>
// ---------------------------------------------------------------------------

import { de } from "@/content/marketing/de";
import { en } from "@/content/marketing/en";
import type { MarketingContent } from "@/content/marketing/types";
import type { Locale } from "@/i18n/config";

const dictionaries: Record<Locale, MarketingContent> = { de, en };

export function getMarketingContent(locale: Locale): MarketingContent {
  return dictionaries[locale];
}

export type { MarketingContent };
