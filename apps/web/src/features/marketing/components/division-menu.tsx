"use client";

// Dropdown listing every page of a division. A native <details> element keeps
// it usable without JavaScript; the script closes it after navigation, on
// Escape and on a click outside.

import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { DivisionTheme } from "@/features/marketing/lib/theme";
import { cn } from "@/lib/utils";

export interface DivisionMenuLink {
  href: string;
  label: string;
  active: boolean;
}

export function DivisionMenu({
  links,
  label,
  theme,
}: {
  links: DivisionMenuLink[];
  /** Accessible name of the navigation landmark, e.g. "soFlott Express navigation". */
  label: string;
  theme: DivisionTheme;
}) {
  const menu = useRef<HTMLDetailsElement>(null);
  const current = links.find((link) => link.active) ?? links[0];
  const close = () => {
    if (menu.current) menu.current.open = false;
  };

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menu.current?.open && !menu.current.contains(event.target as Node)) close();
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  return (
    <nav aria-label={label} className="min-w-0">
      <details
        className="group relative"
        onKeyDown={(event) => {
          if (event.key === "Escape" && menu.current?.open) {
            close();
            menu.current.querySelector("summary")?.focus();
          }
        }}
        ref={menu}
      >
        <summary
          className={cn(
            "flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 [&::-webkit-details-marker]:hidden",
            theme.ring,
          )}
        >
          <span className="truncate">{current.label}</span>
          <ChevronDown aria-hidden className="size-4 shrink-0 text-stone-500 transition group-open:rotate-180" />
        </summary>

        <ul className="absolute left-0 top-full z-30 mt-2 grid w-[min(36rem,calc(100vw-2rem))] gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg sm:grid-cols-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                aria-current={link.active ? "page" : undefined}
                className={cn(
                  "flex min-h-11 items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2",
                  theme.ring,
                  link.active ? theme.accentSoft : "text-stone-700 hover:bg-stone-100",
                )}
                href={link.href}
                onClick={close}
              >
                {link.label}
                {link.active ? <Check aria-hidden className="size-4 shrink-0" /> : null}
              </Link>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
