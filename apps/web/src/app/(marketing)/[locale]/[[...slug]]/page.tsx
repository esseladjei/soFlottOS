// ---------------------------------------------------------------------------
// Every public page of the website, from one route.
//
// `[[...slug]]` is an optional catch-all: "/de" has no slug, "/de/express/
// how-it-works" has ["express", "how-it-works"]. The slug is looked up in the
// site map (`i18n/routes.ts`); unknown paths are a real 404. All pages are
// pre-rendered at build time for both languages.
// ---------------------------------------------------------------------------

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketingContent } from "@/content/marketing";
import { MarketingPageView } from "@/features/marketing/components/marketing-page";
import { buildPageMetadata } from "@/features/marketing/lib/seo";
import { isLocale, locales } from "@/i18n/config";
import { isIndexable, marketingPages, pageFromSlug, pageSlug } from "@/i18n/routes";

type Params = Promise<{ locale: string; slug?: string[] }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => marketingPages.map((page) => ({ locale, slug: pageSlug(page) })));
}

async function resolve(params: Params) {
  const { locale, slug } = await params;
  const page = pageFromSlug(slug);
  if (!isLocale(locale) || !page) notFound();
  return { locale, page };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, page } = await resolve(params);
  const content = getMarketingContent(locale);
  return buildPageMetadata({ locale, page, meta: content.pages[page].meta, indexable: isIndexable(page) });
}

export default async function MarketingPageRoute({ params }: { params: Params }) {
  const { locale, page } = await resolve(params);
  return <MarketingPageView content={getMarketingContent(locale)} locale={locale} page={page} />;
}
