// Top navigation of the public website (corporate level).
//
// Links to the two divisions, About and Contact, plus the language switcher,
// the customer-portal login and a contact call to action. Every label comes
// from the content files, so the bar switches language automatically.

import Image from "next/image";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import type { MarketingContent } from "@/content/marketing/types";
import { MarketingMenu, type MenuLink } from "@/features/marketing/components/marketing-menu";
import { resolveHref } from "@/features/marketing/lib/links";
import { buttonBase, divisionThemes } from "@/features/marketing/lib/theme";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Label for a top-level nav entry: division name for divisions, page label otherwise. */
export function navLabel(content: MarketingContent, page: MarketingPage): string {
  if (page === "express" || page === "digital") return content.divisions[page].name;
  return content.pages[page].label;
}

export function MarketingNav({ locale, content }: { locale: Locale; content: MarketingContent }) {
  const { nav, common } = content;
  const links: MenuLink[] = nav.items.map((page) => ({
    href: localePath(locale, page),
    label: navLabel(content, page),
  }));
  const cta = { href: resolveHref(locale, nav.cta), label: nav.cta.label };
  const theme = divisionThemes.corporate;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="relative mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          aria-label={`${siteConfig.brand} – ${content.pages.home.label}`}
          className="w-fit shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-4"
          href={localePath(locale)}
        >
          <Image
            alt=""
            className="h-auto w-24 shrink-0"
            height={556}
            priority
            sizes="96px"
            src="/logo/soFlott_arrow_nav.png"
            width={908}
          />
        </Link>

        <nav aria-label={nav.ariaLabel} className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900"
              href={link.href}
              key={link.href}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher label={common.languageLabel} locale={locale} />
          <Link
            className="hidden whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-700 hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 md:inline-flex"
            href="/login"
          >
            {nav.login}
          </Link>
          <Link className={cn(buttonBase, theme.button, theme.ring, "hidden sm:inline-flex")} href={cta.href}>
            {cta.label}
          </Link>
          <MarketingMenu cta={cta} label={nav.menuLabel} links={links} login={nav.login} navLabel={nav.ariaLabel} />
        </div>
      </div>
    </header>
  );
}
