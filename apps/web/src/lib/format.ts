// ---------------------------------------------------------------------------
// Number, currency and date formatting.
//
// Prices are always in euro, but thousand separators, date order and the word
// used for "hours" change with the language. `createFormatters(locale)` returns
// the whole set bound to one language; client components get it through
// `useFormatters()`.
// ---------------------------------------------------------------------------

import { defaultLocale, type Locale } from "@/i18n/config";
import { BUSINESS_TIME_ZONE } from "@/lib/business-time";

/** Full BCP-47 tags used by the Intl APIs. */
const intlLocales: Record<Locale, string> = {
  de: "de-DE",
  en: "en-GB",
};

const hourLabels: Record<Locale, string> = {
  de: "Std.",
  en: "h",
};

export interface Formatters {
  formatCurrency: (value: number) => string;
  formatDate: (value?: string | null) => string;
  formatDistance: (value: number) => string;
  formatDuration: (minutes: number) => string;
  formatCompactNumber: (value: number) => string;
}

export function createFormatters(locale: Locale): Formatters {
  const intlLocale = intlLocales[locale];

  const currencyFormatter = new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  });

  const dateFormatter = new Intl.DateTimeFormat(intlLocale, {
    timeZone: BUSINESS_TIME_ZONE,
    dateStyle: "medium",
    timeStyle: "short",
  });

  const compactFormatter = new Intl.NumberFormat(intlLocale, {
    notation: "compact",
    maximumFractionDigits: 1,
  });

  return {
    formatCurrency: (value) => currencyFormatter.format(value),

    formatDate: (value) => (value ? dateFormatter.format(new Date(value)) : "—"),

    formatDistance: (value) => `${value.toFixed(1)} km`,

    formatDuration: (minutes) => {
      if (minutes < 60) {
        return `${minutes} min`;
      }

      const hours = Math.floor(minutes / 60);
      const remainder = minutes % 60;
      const hourLabel = hourLabels[locale];
      return remainder === 0 ? `${hours} ${hourLabel}` : `${hours} ${hourLabel} ${remainder} min`;
    },

    formatCompactNumber: (value) => compactFormatter.format(value),
  };
}

// Default (German) formatters for places that have no language context, such as
// metadata helpers and structured data.
const fallback = createFormatters(defaultLocale);

export const formatCurrency = fallback.formatCurrency;
export const formatDate = fallback.formatDate;
export const formatDistance = fallback.formatDistance;
export const formatDuration = fallback.formatDuration;
export const formatCompactNumber = fallback.formatCompactNumber;
