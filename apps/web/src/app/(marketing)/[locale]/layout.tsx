// ---------------------------------------------------------------------------
// Root layout of the public website - one shell per language.
//
// The folder is called `[locale]`, so the first part of the URL ("de" or "en")
// arrives here as a parameter. Because this is the topmost layout of the
// marketing routes, it also renders `<html>` and `<body>` (via `RootShell`),
// which is what lets the German pages say `lang="de"` and the English pages
// `lang="en"`.
//
// URLs produced by this folder (see `[[...slug]]/page.tsx` and i18n/routes.ts):
//   /de, /de/about, /de/express/..., /de/digital/..., /de/legal/...
//   /en, /en/about, /en/express/..., /en/digital/..., /en/legal/...
// ---------------------------------------------------------------------------

import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { RootShell } from "@/components/layout/root-shell";
import { getMarketingContent } from "@/content/marketing";
import { ConsentProvider } from "@/features/privacy/components/consent-provider";
import { ConsentScripts } from "@/features/privacy/components/consent-scripts";
import { CookieBanner } from "@/features/privacy/components/cookie-banner";
import { CookieSettingsDialog } from "@/features/privacy/components/cookie-settings-dialog";
import { MarketingFooter } from "@/features/marketing/components/marketing-footer";
import { MarketingNav } from "@/features/marketing/components/marketing-nav";
import { OrganizationJsonLd } from "@/features/marketing/components/structured-data";
import { isLocale, locales } from "@/i18n/config";
import { baseMetadata, baseViewport } from "@/lib/metadata";

export const metadata = baseMetadata;
export const viewport = baseViewport;

/** Tells Next.js to pre-build /de and /en at deploy time. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/**
 * Only the languages listed above are valid URLs. Any other first segment
 * (e.g. "/foo") returns a real 404 instead of rendering a page.
 */
export const dynamicParams = false;

export default async function MarketingLocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // `/de` and `/en` are valid - anything else (e.g. `/foo`) is a 404.
  if (!isLocale(locale)) {
    notFound();
  }

  const content = getMarketingContent(locale);

  return (
    <RootShell locale={locale}>
      <ConsentProvider>
        <div className="flex min-h-dvh flex-col bg-white">
          {/* Keyboard users can jump straight to the content. */}
          <a
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-stone-900 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-white"
            href="#main"
          >
            {content.common.skipToContent}
          </a>

          <MarketingNav content={content} locale={locale} />

          <main className="flex-1" id="main">
            {children}
          </main>

          <MarketingFooter content={content} locale={locale} />

          {/* Invisible data that tells search engines who we are. */}
          <OrganizationJsonLd description={content.pages.home.meta.description} locale={locale} />
        </div>

        {/* Cookie consent: the banner, the settings dialog and the gate for optional scripts. */}
        <CookieBanner />
        <CookieSettingsDialog />
        <ConsentScripts />
      </ConsentProvider>
    </RootShell>
  );
}
