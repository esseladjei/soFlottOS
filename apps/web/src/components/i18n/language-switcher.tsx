"use client";

// ---------------------------------------------------------------------------
// Lets a visitor switch between German and English.
//
// Two modes, because the two halves of the product remember the language
// differently:
//
//   "path"    public website - the language is part of the URL ("/de/pricing").
//             Rendered as REAL links so search engines can follow them and the
//             site keeps working without JavaScript.
//
//   "cookie"  signed-in application - URLs like "/client/orders" have no
//             language segment, so the choice is stored in the language cookie
//             and the current page is re-rendered on the server.
// ---------------------------------------------------------------------------

import { usePathname, useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/locale-provider";
import { switchLocalePath } from "@/i18n/routes";
import { cn } from "@/lib/utils";

const itemClass = "rounded-[10px] px-2.5 py-1.5 text-xs font-bold transition";

const activeClass = "bg-stone-900 text-white";

const inactiveClass = "text-stone-500 hover:bg-stone-100 hover:text-stone-900";

export function LanguageSwitcher({
  locale,
  label,
  mode = "path",
  className,
}: {
  locale: Locale;
  label: string;
  mode?: "path" | "cookie";
  className?: string;
}) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();

  const select = (next: Locale) => {
    rememberLocale(next);
    // The server reads the cookie through `middleware.ts`, so re-rendering the
    // current route is enough - no navigation needed.
    router.refresh();
  };

  return (
    <div
      aria-label={label}
      className={cn(
        "flex items-center gap-0.5 rounded-xl border border-stone-200 bg-white p-0.5",
        className,
      )}
      role="group"
    >
      {locales.map((item) => {
        const active = item === locale;
        const classes = cn(itemClass, active ? activeClass : inactiveClass);

        if (mode === "cookie") {
          return (
            <button
              aria-current={active ? "true" : undefined}
              className={classes}
              key={item}
              onClick={() => select(item)}
              title={localeLabels[item].long}
              type="button"
            >
              {localeLabels[item].short}
            </button>
          );
        }

        return (
          <a
            aria-current={active ? "true" : undefined}
            className={classes}
            href={switchLocalePath(pathname, item)}
            hrefLang={item}
            key={item}
            title={localeLabels[item].long}
          >
            {localeLabels[item].short}
          </a>
        );
      })}
    </div>
  );
}
