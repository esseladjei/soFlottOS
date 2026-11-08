"use client";

// ---------------------------------------------------------------------------
// Lets an admin switch between German and English. Console URLs have no
// language segment, so the choice is stored in the language cookie and the
// current page is re-rendered on the server.
// ---------------------------------------------------------------------------

import { useRouter } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/i18n/config";
import { rememberLocale } from "@/i18n/locale-provider";
import { cn } from "@/lib/utils";

const itemClass = "rounded-[10px] px-2.5 py-1.5 text-xs font-bold transition";

const activeClass = "bg-stone-900 text-white";

const inactiveClass = "text-stone-500 hover:bg-stone-100 hover:text-stone-900";

export function LanguageSwitcher({
  locale,
  label,
  className,
}: {
  locale: Locale;
  label: string;
  className?: string;
}) {
  const router = useRouter();

  const select = (next: Locale) => {
    rememberLocale(next);
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
        return (
          <button
            aria-current={active ? "true" : undefined}
            className={cn(itemClass, active ? activeClass : inactiveClass)}
            key={item}
            onClick={() => select(item)}
            title={localeLabels[item].long}
            type="button"
          >
            {localeLabels[item].short}
          </button>
        );
      })}
    </div>
  );
}
