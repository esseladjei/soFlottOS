// Turns a `LinkItem` from the content files into a real href.
//
// Content authors write either:
//   { label: "Quote", page: "express/request-a-quote" }      -> "/de/express/request-a-quote"
//   { label: "Quote", page: "express/request-a-quote",
//     query: "type=subcontracting" }                         -> ".../request-a-quote?type=subcontracting"
//   { label: "Login", href: "/login" }                       -> "/login" (app route, as is)
import type { LinkItem } from "@/content/marketing/types";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routes";

export function resolveHref(locale: Locale, link: LinkItem): string {
  if (link.page) {
    const path = localePath(locale, link.page);
    return link.query ? `${path}?${link.query}` : path;
  }

  return link.href ?? localePath(locale);
}
