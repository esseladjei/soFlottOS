// Second navigation bar shown on every page of a division
// (soFlott Express or soFlott Digital): division name, a dropdown with all of
// its pages (showing the current one) and the division's call to action.

import Link from "next/link";
import type { MarketingContent } from "@/content/marketing/types";
import { DivisionMenu } from "@/features/marketing/components/division-menu";
import { resolveHref } from "@/features/marketing/lib/links";
import { buttonBase, divisionThemes } from "@/features/marketing/lib/theme";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { cn } from "@/lib/utils";

export function DivisionSubnav({
  locale,
  division,
  current,
  content,
}: {
  locale: Locale;
  division: "express" | "digital";
  current: MarketingPage;
  content: MarketingContent;
}) {
  const info = content.divisions[division];
  const theme = divisionThemes[division];
  const links = info.items.map((page) => ({
    href: localePath(locale, page),
    label: content.pages[page].label,
    active: page === current,
  }));

  return (
    <div className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 sm:px-6 lg:gap-6 lg:px-8">
        <Link className="hidden shrink-0 items-baseline gap-2 sm:flex" href={localePath(locale, division)}>
          <span className={cn("text-sm font-extrabold", theme.accent)}>{info.name}</span>
          <span className="hidden text-xs text-stone-500 xl:inline">{info.tagline}</span>
        </Link>
        <DivisionMenu label={info.ariaLabel} links={links} theme={theme} />
        <Link
          className={cn(buttonBase, theme.button, theme.ring, "ml-auto min-h-11 shrink-0 px-4 py-2")}
          href={resolveHref(locale, info.cta)}
        >
          {info.cta.label}
        </Link>
      </div>
    </div>
  );
}
