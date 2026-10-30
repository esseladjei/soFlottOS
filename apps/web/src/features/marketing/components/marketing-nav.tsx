// Top navigation of the public website.
//
// Every label comes from the content files, every link is built with
// `localePath`, so the whole bar switches language automatically.

import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { BrandTagline } from "@/components/ui/brand-tagline";
import type { MarketingContent } from "@/content/marketing/types";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { MarketingMenu } from "@/features/marketing/components/marketing-menu";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MarketingNav({
  locale,
  content,
}: {
  locale: Locale;
  content: MarketingContent;
}) {
  const { nav, common } = content;

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="relative mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between gap-4 px-4 py-2 sm:px-6 lg:px-8">
        <Link
          aria-label={siteConfig.brand}
          className="w-fit shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
          href={localePath(locale)}
        >
          <Image
            alt={siteConfig.brand}
            className="h-auto w-24 shrink-0"
            height={556}
            priority
            sizes="96px"
            src="/logo/soFlott_arrow_nav.png"
            width={908}
          />
          <BrandTagline locale={locale} className="mt-1 text-[10px] leading-4 sm:text-xs" />
        </Link>

        <nav aria-label={nav.ariaLabel} className="hidden items-center gap-1 xl:flex">
          {nav.items.map((item) => (
            <Link
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-sm font-semibold text-stone-600 transition hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              href={localePath(locale, item.page)}
              key={item.page}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <LanguageSwitcher label={common.languageLabel} locale={locale} />
          <Link
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "hidden whitespace-nowrap md:inline-flex",
            )}
            href="/login"
          >
            {nav.login}
          </Link>
          <Link
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden whitespace-nowrap shadow-none sm:inline-flex",
            )}
            href="/register"
          >
            {nav.cta}
          </Link>
          <MarketingMenu locale={locale} nav={nav} />
        </div>
      </div>
    </header>
  );
}
