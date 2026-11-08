// ---------------------------------------------------------------------------
// Reading the current language inside SERVER components.
//
// Console URLs have no language segment; the choice lives in the
// `soflott_locale` cookie, which is what this helper reads.
// ---------------------------------------------------------------------------

import { cookies } from "next/headers";
import { defaultLocale, isLocale, LOCALE_COOKIE_NAME, type Locale } from "@/i18n/config";

export async function getRequestLocale(): Promise<Locale> {
  const value = (await cookies()).get(LOCALE_COOKIE_NAME)?.value;
  return isLocale(value) ? value : defaultLocale;
}
