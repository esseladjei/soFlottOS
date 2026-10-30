"use client";

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import { buttonVariants } from "@/components/ui/button";
import type { MarketingContent } from "@/content/marketing/types";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routes";
import { cn } from "@/lib/utils";

export function MarketingMenu({
  locale,
  nav,
}: {
  locale: Locale;
  nav: MarketingContent["nav"];
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <details
      className="xl:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          menu.current?.querySelector("summary")?.focus();
        }
      }}
      ref={menu}
    >
      <summary
        aria-label={nav.ariaLabel}
        className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 [&::-webkit-details-marker]:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </summary>
      <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-stone-200 bg-white p-4 shadow-lg sm:px-6">
        <nav aria-label={nav.ariaLabel} className="grid grid-cols-2 gap-2">
          {nav.items.map((item) => (
            <Link
              className="rounded-lg px-3 py-3 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              href={localePath(locale, item.page)}
              key={item.page}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex flex-wrap gap-3 border-t border-stone-100 pt-4">
          <Link
            className={buttonVariants({ variant: "outline", size: "sm" })}
            href="/login"
            onClick={close}
          >
            {nav.login}
          </Link>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "shadow-none")}
            href="/register"
            onClick={close}
          >
            {nav.cta}
          </Link>
        </div>
      </div>
    </details>
  );
}
