"use client";

// Mobile menu for the top navigation. A native <details> element keeps it
// usable without JavaScript; the script only closes it after navigation and on
// Escape.

import { Menu } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export interface MenuLink {
  href: string;
  label: string;
}

export function MarketingMenu({
  links,
  cta,
  login,
  label,
  navLabel,
}: {
  links: MenuLink[];
  cta: MenuLink;
  login: string;
  /** Accessible name of the toggle button. */
  label: string;
  /** Accessible name of the navigation landmark. */
  navLabel: string;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const close = () => {
    if (menu.current) menu.current.open = false;
  };

  return (
    <details
      className="lg:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          close();
          menu.current?.querySelector("summary")?.focus();
        }
      }}
      ref={menu}
    >
      <summary
        aria-label={label}
        className="flex size-11 cursor-pointer list-none items-center justify-center rounded-lg border border-stone-200 text-stone-700 transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 [&::-webkit-details-marker]:hidden"
      >
        <Menu aria-hidden className="size-5" />
      </summary>
      <div className="absolute inset-x-0 top-full max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-stone-200 bg-white p-4 shadow-lg sm:px-6">
        <nav aria-label={navLabel} className="grid gap-1 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              className="rounded-lg px-3 py-3 text-base font-semibold text-stone-800 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              href={link.href}
              key={link.href}
              onClick={close}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-3 flex flex-wrap gap-3 border-t border-stone-100 pt-4">
          <Link
            className="inline-flex min-h-11 items-center rounded-xl border border-stone-300 px-4 text-sm font-bold text-stone-900 hover:bg-stone-100"
            href="/login"
            onClick={close}
          >
            {login}
          </Link>
          <Link
            className="inline-flex min-h-11 items-center rounded-xl bg-stone-900 px-4 text-sm font-bold text-white hover:bg-stone-800"
            href={cta.href}
            onClick={close}
          >
            {cta.label}
          </Link>
        </div>
      </div>
    </details>
  );
}
