// Visible breadcrumb trail ("Home / soFlott Express / How it works").
// The same trail is emitted as BreadcrumbList JSON-LD by `MarketingPageView`.

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";

export function Breadcrumb({
  locale,
  items,
  label,
}: {
  locale: Locale;
  items: { page: MarketingPage; label: string }[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="text-sm">
      <ol className="flex flex-wrap items-center gap-1 text-stone-600">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li className="flex items-center gap-1" key={item.page}>
              {index > 0 ? <ChevronRight aria-hidden className="size-3.5 text-stone-400" /> : null}
              {last ? (
                <span aria-current="page" className="font-semibold text-stone-900">
                  {item.label}
                </span>
              ) : (
                <Link className="hover:text-stone-950 hover:underline" href={localePath(locale, item.page)}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
