// ---------------------------------------------------------------------------
// Removing cookies of categories the visitor has not allowed (or withdrew).
//
// A script can only delete cookies that belong to our own site. Cookies that a
// third-party domain set in its own context (for example LinkedIn's) are out of
// reach; the cookie notice says so. Google's and Meta's measurement cookies are
// first-party cookies written by their scripts, so they can be removed here -
// and the page reloads on withdrawal so the scripts stop running anyway.
// ---------------------------------------------------------------------------

import { LOCALE_COOKIE_NAME } from "@/i18n/config";
import type { OptionalCategory } from "@/features/privacy/lib/consent-model";

const categoryCookies: Record<OptionalCategory, readonly (string | RegExp)[]> = {
  analytics: ["_ga", /^_ga_/, "_gid", /^_gat/],
  marketing: [/^_gcl_/, /^_gac_/, "_fbp", "_fbc", "li_fat_id"],
  preferences: [LOCALE_COOKIE_NAME],
};

function cookieNames(): string[] {
  return document.cookie
    .split(";")
    .map((part) => part.split("=")[0]?.trim())
    .filter((name): name is string => Boolean(name));
}

/** "www.soflott.de" -> ["www.soflott.de", ".www.soflott.de", ".soflott.de"] */
function domainVariants(hostname: string): (string | null)[] {
  const parts = hostname.split(".");
  const variants: (string | null)[] = [null, hostname, `.${hostname}`];

  for (let start = 1; start < parts.length - 1; start++) {
    variants.push(`.${parts.slice(start).join(".")}`);
  }
  return variants;
}

function expire(name: string) {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  for (const domain of domainVariants(window.location.hostname)) {
    const scope = domain ? `; Domain=${domain}` : "";
    document.cookie = `${name}=; Path=/; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${scope}; SameSite=Lax${secure}`;
  }
}

/** Deletes every known cookie of the given categories. */
export function clearCookiesFor(categories: readonly OptionalCategory[]) {
  if (typeof document === "undefined") return;

  const present = cookieNames();
  for (const category of categories) {
    for (const pattern of categoryCookies[category]) {
      const matches = typeof pattern === "string" ? present.filter((name) => name === pattern) : present.filter((name) => pattern.test(name));
      matches.forEach(expire);
    }
  }
}
