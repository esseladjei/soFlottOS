// ---------------------------------------------------------------------------
// Factory that builds one sub-page route.
//
// The six sub-pages differ only by their page key, so instead of copying the
// same 40 lines six times we build them here. Each route file is then just:
//
//   const { generateMetadata, Page } = createSubPage("pricing");
//   export { generateMetadata };
//   export default Page;
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketingContent } from "@/content/marketing";
import { MarketingSubPage } from "@/features/marketing/components/marketing-sub-page";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/features/marketing/components/structured-data";
import { buildPageMetadata } from "@/features/marketing/lib/seo";
import { defaultLocale, isLocale, locales } from "@/i18n/config";
import type { MarketingPage } from "@/i18n/routes";

type SubPageKey = Exclude<MarketingPage, "home">;

type RouteParams = { params: Promise<{ locale: string }> };

export function createSubPage(key: SubPageKey) {
  async function generateMetadata({ params }: RouteParams): Promise<Metadata> {
    const { locale } = await params;
    const safeLocale = isLocale(locale) ? locale : defaultLocale;

    return buildPageMetadata({
      locale: safeLocale,
      page: key,
      meta: getMarketingContent(safeLocale).pages[key].meta,
    });
  }

  async function Page({ params }: RouteParams) {
    const { locale } = await params;

    if (!isLocale(locale)) {
      notFound();
    }

    const content = getMarketingContent(locale);
    const page = content.pages[key];
    const navLabel = content.nav.items.find((item) => item.page === key)?.label ?? page.title;

    return (
      <>
        <MarketingSubPage locale={locale} page={page} />

        <BreadcrumbJsonLd
          homeLabel={content.nav.ariaLabel}
          locale={locale}
          page={key}
          pageLabel={navLabel}
        />
        {page.faq && page.faq.length > 0 ? <FaqJsonLd items={page.faq} /> : null}
      </>
    );
  }

  function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
  }

  return { generateMetadata, Page, generateStaticParams };
}
