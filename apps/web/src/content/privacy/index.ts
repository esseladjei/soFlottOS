import { de } from "@/content/privacy/de";
import { en } from "@/content/privacy/en";
import type { PrivacyContent } from "@/content/privacy/types";
import type { Locale } from "@/i18n/config";

const dictionaries: Record<Locale, PrivacyContent> = { de, en };

export function getPrivacyContent(locale: Locale): PrivacyContent {
  return dictionaries[locale];
}

export type { PrivacyContent };
