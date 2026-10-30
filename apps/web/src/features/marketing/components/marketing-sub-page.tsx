// ---------------------------------------------------------------------------
// One component that renders every sub-page (services, pricing, platform, ...).
//
// All six pages share the same layout, only the words differ - that is why
// there is a single component instead of six near-identical files.
// ---------------------------------------------------------------------------

import { ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SubPageContent } from "@/content/marketing/types";
import { MarketingIcon } from "@/features/marketing/components/icon";
import { Section } from "@/features/marketing/components/section";
import { resolveHref } from "@/features/marketing/lib/links";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function MarketingSubPage({
  locale,
  page,
}: {
  locale: Locale;
  page: SubPageContent;
}) {
  return (
    <>
      {/* Page header */}
      <section className="border-b border-stone-200 bg-gradient-to-b from-orange-50 to-white py-16 md:py-20">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
            {page.eyebrow}
          </p>
          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-display)] text-4xl font-extrabold leading-tight tracking-tight text-stone-950 md:text-5xl">
            {page.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">{page.intro}</p>
        </div>
      </section>

      {/* Lead paragraphs - the SEO body copy. */}
      {page.lead.length > 0 ? (
        <Section>
          <div className="max-w-3xl space-y-4">
            {page.lead.map((paragraph) => (
              <p className="text-base leading-8 text-stone-600" key={paragraph}>
                {paragraph}
              </p>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Content sections, alternating background colour for rhythm. */}
      {page.sections.map((section, index) => (
        <Section className={index % 2 === 0 ? "bg-stone-50" : undefined} key={section.title}>
          <div className="max-w-3xl">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950 md:text-3xl">
              {section.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-stone-600">{section.description}</p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <Card className="p-6" key={item.title}>
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MarketingIcon className="size-5" name={item.icon} />
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-stone-950">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
              </Card>
            ))}
          </div>
        </Section>
      ))}

      {/* Quick scannable proof points. */}
      {page.highlights.length > 0 ? (
        <Section>
          <ul className="grid gap-3 sm:grid-cols-2">
            {page.highlights.map((highlight) => (
              <li
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-700"
                key={highlight}
              >
                <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-600" />
                {highlight}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {/* Optional page-specific FAQ (also fed to Google as structured data). */}
      {page.faq && page.faq.length > 0 ? (
        <Section className="bg-stone-50">
          <div className="mx-auto max-w-3xl space-y-3">
            {page.faq.map((item) => (
              <details
                className="group rounded-2xl border border-stone-200 bg-white p-5"
                key={item.question}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold text-stone-900">
                  {item.question}
                  <span className="shrink-0 text-xl text-orange-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-7 text-stone-600">{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Closing call to action */}
      <section className="bg-stone-950 py-16 text-white md:py-20">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight">
            {page.cta.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-300">{page.cta.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              className={buttonVariants({ size: "lg" })}
              href={resolveHref(locale, page.cta.primaryCta)}
            >
              {page.cta.primaryCta.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              href={resolveHref(locale, page.cta.secondaryCta)}
            >
              {page.cta.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
