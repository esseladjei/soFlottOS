// The home page: "/de" and "/en".

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMarketingContent } from "@/content/marketing";
import { MarketingHome } from "@/features/marketing/components/marketing-home";
import { FaqJsonLd, ServiceJsonLd } from "@/features/marketing/components/structured-data";
import { buildPageMetadata } from "@/features/marketing/lib/seo";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const safeLocale = isLocale(locale) ? locale : defaultLocale;

  return buildPageMetadata({
    locale: safeLocale,
    page: "home",
    meta: getMarketingContent(safeLocale).home.meta,
  });
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = getMarketingContent(locale);

  return (
    <>
      <MarketingHome content={content} locale={locale} />

      {/* Rich results: the service we sell and the questions we answer. */}
      <ServiceJsonLd
        description={content.home.meta.description}
        locale={locale}
        name={content.home.hero.eyebrow}
      />
      <FaqJsonLd items={content.home.faq.items} />
    </>
  );
}
