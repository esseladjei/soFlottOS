// Turns a `LinkItem` from the content files into a real href.
//
// Content authors write either:
//   { label: "Preise", page: "pricing" }   -> "/de/pricing" (language aware)
//   { label: "Login",  href: "/login"  }   -> "/login"      (app route, as is)
import type { LinkItem } from "@/content/marketing/types";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routes";

export function resolveHref(locale: Locale, link: LinkItem): string {
  if (link.page) {
    return localePath(locale, link.page);
  }

  return link.href ?? localePath(locale);
}
