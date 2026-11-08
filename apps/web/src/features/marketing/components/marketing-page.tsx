// ---------------------------------------------------------------------------
// One component renders every public page:
//
//   division sub-navigation (Express / Digital pages only)
//   hero with breadcrumb, headline, intro, key points and CTAs
//   the page's content blocks, in order
//   closing call to action
//   JSON-LD: breadcrumb, Service (division service pages) and FAQ
//
// The look follows the division: orange for soFlott Express, sky blue for
// soFlott Digital, neutral stone for the corporate pages.
// ---------------------------------------------------------------------------

import { CheckCircle2, Info } from "lucide-react";
import type { MarketingContent } from "@/content/marketing/types";
import { ContentBlocks, CtaLink } from "@/features/marketing/components/blocks";
import { Breadcrumb } from "@/features/marketing/components/breadcrumb";
import { DivisionSubnav } from "@/features/marketing/components/division-subnav";
import { navLabel } from "@/features/marketing/components/marketing-nav";
import { Section } from "@/features/marketing/components/section";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/features/marketing/components/structured-data";
import { divisionThemes } from "@/features/marketing/lib/theme";
import type { Locale } from "@/i18n/config";
import { pageDivision, pageTrail, type MarketingPage } from "@/i18n/routes";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Pages that describe a service and therefore get Service JSON-LD. */
const servicePages: readonly MarketingPage[] = [
  "express/direct-b2b-delivery",
  "express/logistics-subcontracting",
  "express/contracted-delivery-routes",
  "digital/it-consulting",
  "digital/software-development",
  "digital/api-integration",
  "digital/application-modernisation",
  "digital/contract-software-engineering",
  "digital/support-and-maintenance",
];

export function MarketingPageView({
  locale,
  page,
  content,
}: {
  locale: Locale;
  page: MarketingPage;
  content: MarketingContent;
}) {
  const data = content.pages[page];
  const division = pageDivision(page);
  const theme = divisionThemes[division];
  const isHome = page === "home";
  const trail = pageTrail(page).map((key) => ({ page: key, label: navLabel(content, key) }));
  const faqs = data.blocks.flatMap((block) => (block.kind === "faq" ? block.items : []));
  const showLegalDraft = page.startsWith("legal/") && !siteConfig.legal.reviewed;

  return (
    <>
      {division !== "corporate" ? (
        <DivisionSubnav content={content} current={page} division={division} locale={locale} />
      ) : null}

      <div className={theme.hero}>
        <div className="mx-auto w-full max-w-6xl px-4 pb-14 pt-8 sm:px-6 md:pb-20 md:pt-10">
          {!isHome ? <Breadcrumb items={trail} label={content.common.breadcrumbLabel} locale={locale} /> : null}

          <div className={cn("max-w-3xl", isHome ? "pt-6 md:pt-12" : "pt-8")}>
            <p className={cn("text-xs font-extrabold uppercase tracking-[0.2em]", theme.accent)}>{data.hero.eyebrow}</p>
            <h1 className="mt-3 text-balance font-[family-name:var(--font-display)] text-4xl font-extrabold tracking-tight text-stone-950 md:text-5xl">
              {data.hero.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-stone-700">{data.hero.intro}</p>

            {division !== "corporate" && page === division ? (
              <p className="mt-3 text-sm text-stone-500">{content.common.divisionOf}</p>
            ) : null}

            {data.hero.points?.length ? (
              <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                {data.hero.points.map((point) => (
                  <li className="flex gap-2 text-sm font-semibold text-stone-800" key={point}>
                    <CheckCircle2 aria-hidden className={cn("mt-0.5 size-4 shrink-0", theme.accent)} />
                    {point}
                  </li>
                ))}
              </ul>
            ) : null}

            {data.hero.primaryCta || data.hero.secondaryCta ? (
              <div className="mt-8 flex flex-wrap gap-3">
                {data.hero.primaryCta ? <CtaLink link={data.hero.primaryCta} locale={locale} theme={theme} /> : null}
                {data.hero.secondaryCta ? (
                  <CtaLink link={data.hero.secondaryCta} locale={locale} theme={theme} variant="secondary" />
                ) : null}
              </div>
            ) : null}
          </div>

          {showLegalDraft ? (
            <p className="mt-8 flex max-w-3xl gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="note">
              <Info aria-hidden className="mt-0.5 size-4 shrink-0" />
              {content.common.legalDraft}
            </p>
          ) : null}
        </div>
      </div>

      <ContentBlocks blocks={data.blocks} ctx={{ locale, page, division, theme, content }} />

      {data.cta ? (
        <Section className="bg-stone-950" labelledBy="page-cta">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-white md:text-3xl" id="page-cta">
                {data.cta.title}
              </h2>
              <p className="mt-3 text-base leading-7 text-stone-300">{data.cta.description}</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <CtaLink className="focus-visible:ring-offset-stone-950" link={data.cta.primaryCta} locale={locale} theme={theme} />
              {data.cta.secondaryCta ? (
                <CtaLink
                  className="border-stone-600 bg-transparent text-white hover:bg-stone-800"
                  link={data.cta.secondaryCta}
                  locale={locale}
                  theme={theme}
                  variant="secondary"
                />
              ) : null}
            </div>
          </div>
        </Section>
      ) : null}

      {!isHome ? <BreadcrumbJsonLd items={trail} locale={locale} /> : null}
      {servicePages.includes(page) && division !== "corporate" ? (
        <ServiceJsonLd
          areaServed={division === "express" ? siteConfig.serviceArea : undefined}
          brand={siteConfig.divisions[division].name}
          description={data.meta.description}
          locale={locale}
          name={data.label}
          page={page}
        />
      ) : null}
      {faqs.length ? <FaqJsonLd items={faqs} /> : null}
    </>
  );
}
