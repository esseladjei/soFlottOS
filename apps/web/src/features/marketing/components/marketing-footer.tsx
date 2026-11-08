// Footer of the public website: one link column per division, a company
// column, contact details and the legal note that both divisions belong to
// soFlott UG (haftungsbeschränkt).

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { BrandTagline } from "@/components/ui/brand-tagline";
import { getPrivacyContent } from "@/content/privacy";
import type { MarketingContent } from "@/content/marketing/types";
import { PrivacyFooterLink } from "@/features/privacy/components/privacy-footer-link";
import type { Locale } from "@/i18n/config";
import { localePath, type MarketingPage } from "@/i18n/routes";
import { siteConfig, telHref } from "@/lib/site";

const legalPages: readonly MarketingPage[] = ["legal/imprint", "legal/privacy", "legal/terms"];
const legalLinkClass = "font-semibold text-stone-700 hover:text-stone-950 hover:underline";

export function MarketingFooter({ locale, content }: { locale: Locale; content: MarketingContent }) {
  const { footer, common, pages } = content;
  const year = new Date().getFullYear();
  const { street, postalCode, city } = siteConfig.address;

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-stone-950">
              {siteConfig.companyName}
            </p>
            <BrandTagline className="mt-1 text-sm" locale={locale} />
            <p className="mt-3 max-w-sm text-sm leading-6 text-stone-600">{footer.tagline}</p>

            <p className="mt-6 text-xs font-extrabold uppercase tracking-widest text-stone-500">
              {footer.contactTitle}
            </p>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-stone-700">
              <li>
                <a className="inline-flex items-center gap-2 hover:text-stone-950" href={telHref}>
                  <Phone aria-hidden className="size-4 text-stone-500" />
                  <span className="sr-only">{common.phone}: </span>
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 hover:text-stone-950" href={`mailto:${siteConfig.divisions.express.email}`}>
                  <Mail aria-hidden className="size-4 text-stone-500" />
                  <span className="sr-only">{common.email} ({siteConfig.divisions.express.name}): </span>
                  {siteConfig.divisions.express.email}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 hover:text-stone-950" href={`mailto:${siteConfig.divisions.digital.email}`}>
                  <Mail aria-hidden className="size-4 text-stone-500" />
                  <span className="sr-only">{common.email} ({siteConfig.divisions.digital.name}): </span>
                  {siteConfig.divisions.digital.email}
                </a>
              </li>
              <li>
                <a className="inline-flex items-center gap-2 hover:text-stone-950" href={`mailto:${siteConfig.email}`}>
                  <Mail aria-hidden className="size-4 text-stone-500" />
                  <span className="sr-only">{common.email} ({siteConfig.brand}): </span>
                  {siteConfig.email}
                </a>
              </li>
              {city ? (
                <li className="flex items-start gap-2 font-normal text-stone-600">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-stone-500" />
                  <span>
                    <span className="sr-only">{common.address}: </span>
                    {street ? (
                      <>
                        {street}
                        <br />
                      </>
                    ) : null}
                    {postalCode ? `${postalCode} ` : ""}
                    {city}
                  </span>
                </li>
              ) : null}
            </ul>
            <LanguageSwitcher className="mt-5 w-fit" label={common.languageLabel} locale={locale} />
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-stone-500">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((page) => (
                  <li key={page}>
                    <Link
                      className="text-sm font-semibold text-stone-700 hover:text-stone-950 hover:underline"
                      href={localePath(locale, page)}
                    >
                      {page === "express" || page === "digital" ? content.divisions[page].name : pages[page].label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-stone-200 pt-6 text-xs text-stone-600">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {legalPages.map((page) => (
              <li key={page}>
                <Link className={legalLinkClass} href={localePath(locale, page)}>
                  {pages[page].label}
                </Link>
              </li>
            ))}
            <li>
              <PrivacyFooterLink className={legalLinkClass} label={getPrivacyContent(locale).settings.open} />
            </li>
          </ul>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>{footer.copyright(year, siteConfig.companyName)}</p>
            <p>{footer.legalNote}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
