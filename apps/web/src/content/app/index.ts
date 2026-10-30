// ---------------------------------------------------------------------------
// Picks the right application translation for a language.
//
// Server components:  const t = getAppContent(await getRequestLocale());
// Client components:  const t = useAppContent();
// ---------------------------------------------------------------------------

import { de } from "@/content/app/de";
import { en } from "@/content/app/en";
import type { AppContent } from "@/content/app/types";
import type { Locale } from "@/i18n/config";

const dictionaries: Record<Locale, AppContent> = { de, en };

export function getAppContent(locale: Locale): AppContent {
  return dictionaries[locale];
}

export type { AppContent };
