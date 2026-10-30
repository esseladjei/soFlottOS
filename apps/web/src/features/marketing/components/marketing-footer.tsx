// Footer of the public website: sitemap-style link columns, contact details,
// the service area and the language switcher.

import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { BrandTagline } from "@/components/ui/brand-tagline";
import type { MarketingContent } from "@/content/marketing/types";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import type { Locale } from "@/i18n/config";
import { localePath } from "@/i18n/routes";
import { mailtoHref, siteConfig, telHref } from "@/lib/site";

export function MarketingFooter({
  locale,
  content,
}: {
  locale: Locale;
  content: MarketingContent;
}) {
  const { footer, common } = content;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-stone-50">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-[family-name:var(--font-display)] text-xl font-extrabold tracking-tight text-stone-950">
              {siteConfig.brand}
            </p>
            <BrandTagline locale={locale} className="mt-2 text-sm" />
            <p className="mt-3 max-w-xs text-sm leading-6 text-stone-600">{footer.tagline}</p>
            <LanguageSwitcher className="mt-5 w-fit" label={common.languageLabel} locale={locale} />
          </div>

          {footer.columns.map((column) => (
            <div key={column.title}>
              <p className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
                {column.title}
              </p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.page}>
                    <Link
                      className="text-sm font-semibold text-stone-700 hover:text-orange-600"
                      href={localePath(locale, link.page)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-stone-500">
              {footer.contactTitle}
            </p>
            <ul className="mt-4 space-y-2.5 text-sm font-semibold text-stone-700">
              <li>
                <a className="flex items-center gap-2 hover:text-orange-600" href={telHref}>
                  <Phone aria-hidden className="size-4 text-orange-500" />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a className="flex items-center gap-2 hover:text-orange-600" href={mailtoHref}>
                  <Mail aria-hidden className="size-4 text-orange-500" />
                  {siteConfig.email}
                </a>
              </li>
              {siteConfig.address.city ? (
                <li className="flex items-start gap-2 text-stone-600">
                  <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-500" />
                  <span>
                    {siteConfig.address.street ? (
                      <>
                        {siteConfig.address.street}
                        <br />
                      </>
                    ) : null}
                    {siteConfig.address.postalCode ? `${siteConfig.address.postalCode} ` : ""}
                    {siteConfig.address.city}
                  </span>
                </li>
              ) : null}
            </ul>

            <p className="mt-5 text-xs font-extrabold uppercase tracking-widest text-stone-500">
              {footer.serviceAreaTitle}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-600">{footer.serviceAreaText}</p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-stone-200 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{footer.copyright(year, siteConfig.companyName)}</p>
          <p>{footer.legalNote}</p>
        </div>
      </div>
    </footer>
  );
}
