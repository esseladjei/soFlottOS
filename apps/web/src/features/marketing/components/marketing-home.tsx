// ---------------------------------------------------------------------------
// The home page.
//
// It is one long page made of 13 sections, each reading its words from
// `content.home`. Nothing here is written in German or English - swap the
// content object and the whole page changes language.
//
// Section order (classic B2B landing page flow):
//   hero -> trust bar -> comparison -> USPs -> segments -> cargo -> process ->
//   platform -> pricing -> offer -> service area -> FAQ -> final CTA
// ---------------------------------------------------------------------------

import { ArrowRight, Check, Phone, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BrandTagline } from "@/components/ui/brand-tagline";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { MarketingContent } from "@/content/marketing/types";
import { MarketingIcon } from "@/features/marketing/components/icon";
import { Section, SectionIntro } from "@/features/marketing/components/section";
import { resolveHref } from "@/features/marketing/lib/links";
import type { Locale } from "@/i18n/config";
import { siteConfig, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function MarketingHome({
  locale,
  content,
}: {
  locale: Locale;
  content: MarketingContent;
}) {
  const t = content.home;

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative overflow-hidden border-b border-stone-200 bg-gradient-to-b from-orange-50 via-white to-white">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <Badge variant="info">{t.hero.eyebrow}</Badge>

            <h1 className="mt-5 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-[1.08] tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
              {t.hero.headlineLead}{" "}
              <span className="text-orange-600">{t.hero.headlineHighlight}</span>
            </h1>

            <BrandTagline locale={locale} className="mt-5 border-l-4 border-orange-500 pl-4 font-[family-name:var(--font-display)] text-xl sm:text-2xl" />

            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-600">{t.hero.subheadline}</p>

            <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
              {t.hero.bullets.map((bullet) => (
                <li className="flex items-start gap-2 text-sm font-semibold text-stone-700" key={bullet}>
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-600" />
                  {bullet}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                className={buttonVariants({ size: "lg" })}
                href={resolveHref(locale, t.hero.primaryCta)}
              >
                {t.hero.primaryCta.label}
                <ArrowRight aria-hidden className="size-4" />
              </Link>
              <Link
                className={buttonVariants({ variant: "outline", size: "lg" })}
                href={resolveHref(locale, t.hero.secondaryCta)}
              >
                {t.hero.secondaryCta.label}
              </Link>
            </div>

            <p className="mt-4 text-sm text-stone-500">{t.hero.note}</p>
          </div>

          {/* A small "fake dashboard" that shows what the platform feels like. */}
          <Card className="p-6 shadow-xl shadow-stone-900/5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">
              {t.hero.panel.eyebrow}
            </p>
            <p className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold text-stone-950">
              {t.hero.panel.title}
            </p>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3">
              {t.hero.panel.stats.map((stat) => (
                <div className="rounded-xl bg-stone-50 p-4" key={stat.label}>
                  <dt className="text-xs font-bold uppercase tracking-wide text-stone-500">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 font-[family-name:var(--font-display)] text-2xl font-extrabold text-stone-950">
                    {stat.value}
                  </dd>
                  <p className="mt-1 text-xs leading-5 text-stone-500">{stat.caption}</p>
                </div>
              ))}
            </dl>

            <div className="mt-5 rounded-xl border border-stone-200 p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-stone-500">
                  <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
                  {t.hero.panel.liveLabel}
                </span>
                <Badge variant="success">{t.hero.panel.liveValue}</Badge>
              </div>
              <p className="mt-3 text-sm font-bold text-stone-900">
                {t.hero.panel.routeFrom}
                <span className="px-2 text-orange-500">{t.hero.panel.routeSeparator}</span>
                {t.hero.panel.routeTo}
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* ----------------------------------------------------------- trust bar */}
      <section className="border-b border-stone-200 bg-stone-50 py-6">
        <ul className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-4 sm:px-6">
          {t.trustBar.map((item) => (
            <li className="flex items-center gap-2 text-sm font-bold text-stone-700" key={item.label}>
              <MarketingIcon className="size-4 text-orange-500" name={item.icon} />
              {item.label}
            </li>
          ))}
        </ul>
      </section>

      {/* ---------------------------------------------------------- comparison */}
      <Section>
        <SectionIntro eyebrow={t.comparison.eyebrow} intro={t.comparison.intro} title={t.comparison.title} />

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-stone-200">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-stone-50">
                <th className="w-1/3 px-4 py-4 font-extrabold text-stone-500" scope="col" />
                <th className="px-4 py-4 font-extrabold text-stone-500" scope="col">
                  {t.comparison.columnOther}
                </th>
                <th className="bg-orange-50 px-4 py-4 font-extrabold text-orange-700" scope="col">
                  {t.comparison.columnSoFlott}
                </th>
              </tr>
            </thead>
            <tbody>
              {t.comparison.rows.map((row) => (
                <tr className="border-t border-stone-200" key={row.label}>
                  <th className="px-4 py-4 font-bold text-stone-900" scope="row">
                    {row.label}
                  </th>
                  <td className="px-4 py-4 text-stone-600">
                    <span className="flex items-start gap-2">
                      <X aria-hidden className="mt-0.5 size-4 shrink-0 text-stone-400" />
                      {row.other}
                    </span>
                  </td>
                  <td className="bg-orange-50/60 px-4 py-4 font-semibold text-stone-900">
                    <span className="flex items-start gap-2">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-orange-600" />
                      {row.soFlott}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- usps */}
      <Section className="bg-stone-50">
        <SectionIntro eyebrow={t.usps.eyebrow} intro={t.usps.intro} title={t.usps.title} />

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {t.usps.items.map((item) => (
            <Card className="flex flex-col p-6" key={item.title}>
              <span className="flex size-11 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <MarketingIcon className="size-5" name={item.icon} />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold text-stone-950">
                {item.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-6 text-stone-600">{item.description}</p>
              <p className="mt-4 border-t border-stone-200 pt-4 text-xs font-bold uppercase tracking-wide text-orange-600">
                {item.proof}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------ segments */}
      <Section>
        <SectionIntro eyebrow={t.segments.eyebrow} intro={t.segments.intro} title={t.segments.title} />

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {t.segments.items.map((segment) => (
            <Card className="p-6" key={segment.name}>
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-stone-900 text-white">
                  <MarketingIcon className="size-5" name={segment.icon} />
                </span>
                <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-stone-950">
                  {segment.name}
                </h3>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="text-xs font-extrabold uppercase tracking-wide text-stone-500">
                    {t.segments.painLabel}
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-600">{segment.pain}</dd>
                </div>
                <div>
                  <dt className="text-xs font-extrabold uppercase tracking-wide text-stone-500">
                    {t.segments.cargoLabel}
                  </dt>
                  <dd className="mt-1 leading-6 text-stone-600">{segment.cargo}</dd>
                </div>
              </dl>

              <p className="mt-5 rounded-xl bg-orange-50 p-4 text-sm font-semibold leading-6 text-orange-950">
                {segment.hook}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            className={buttonVariants({ variant: "outline" })}
            href={resolveHref(locale, t.segments.cta)}
          >
            {t.segments.cta.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </Section>

      {/* --------------------------------------------------------------- cargo */}
      <Section className="bg-stone-50">
        <SectionIntro eyebrow={t.cargo.eyebrow} intro={t.cargo.intro} title={t.cargo.title} />

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.cargo.groups.map((group) => (
            <Card className="p-6" key={group.title}>
              <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                <MarketingIcon className="size-5" name={group.icon} />
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-stone-950">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li className="flex items-start gap-2 text-sm leading-6 text-stone-600" key={item}>
                    <Check aria-hidden className="mt-1 size-3.5 shrink-0 text-orange-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-stone-500">{t.cargo.note}</p>
      </Section>

      {/* ------------------------------------------------------------- process */}
      <Section>
        <SectionIntro eyebrow={t.process.eyebrow} intro={t.process.intro} title={t.process.title} />

        <ol className="mt-10 grid gap-5 md:grid-cols-5">
          {t.process.steps.map((step, index) => (
            <li className="relative rounded-2xl border border-stone-200 bg-white p-5" key={step.title}>
              <span className="flex size-9 items-center justify-center rounded-full bg-orange-500 font-[family-name:var(--font-display)] text-sm font-extrabold text-white">
                {index + 1}
              </span>
              <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-stone-950">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ------------------------------------------------------------ platform */}
      <Section className="bg-stone-950 text-white">
        <div className="max-w-3xl">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-400">
            {t.platform.eyebrow}
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
            {t.platform.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-300">{t.platform.intro}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {t.platform.items.map((item) => (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6" key={item.title}>
              <span className="flex size-11 items-center justify-center rounded-xl bg-orange-500/20 text-orange-300">
                <MarketingIcon className="size-5" name={item.icon} />
              </span>
              <h3 className="mt-5 font-[family-name:var(--font-display)] text-lg font-bold">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-stone-300">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={resolveHref(locale, t.platform.cta)}
          >
            {t.platform.cta.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      </Section>

      {/* ------------------------------------------------------------- pricing */}
      <Section>
        <SectionIntro eyebrow={t.pricing.eyebrow} intro={t.pricing.intro} title={t.pricing.title} />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 sm:grid-cols-2">
            {t.pricing.points.map((point) => (
              <Card className="p-5" key={point.title}>
                <span className="flex size-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
                  <MarketingIcon className="size-5" name={point.icon} />
                </span>
                <h3 className="mt-4 font-[family-name:var(--font-display)] text-base font-bold text-stone-950">
                  {point.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{point.description}</p>
              </Card>
            ))}
          </div>

          {/* Worked example - removes the "what will this cost me?" doubt. */}
          <Card className="h-fit p-6">
            <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-stone-950">
              {t.pricing.example.title}
            </h3>

            <dl className="mt-5 space-y-3 text-sm">
              {t.pricing.example.rows.map((row) => (
                <div className="flex items-baseline justify-between gap-4" key={row.label}>
                  <dt className="text-stone-600">{row.label}</dt>
                  <dd className="font-bold tabular-nums text-stone-900">{row.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-stone-200 pt-4">
              <span className="font-bold text-stone-900">{t.pricing.example.totalLabel}</span>
              <span className="font-[family-name:var(--font-display)] text-2xl font-extrabold tabular-nums text-orange-600">
                {t.pricing.example.totalValue}
              </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-stone-500">{t.pricing.example.note}</p>

            <Link
              className={cn(buttonVariants({ size: "lg" }), "mt-6 w-full")}
              href={resolveHref(locale, t.pricing.cta)}
            >
              {t.pricing.cta.label}
            </Link>
          </Card>
        </div>
      </Section>

      {/* --------------------------------------------------------------- offer */}
      <Section className="bg-orange-50">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="info">{t.offer.eyebrow}</Badge>
          <h2 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-stone-950 md:text-4xl">
            {t.offer.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-700">{t.offer.description}</p>
          <Link
            className={cn(buttonVariants({ size: "lg" }), "mt-7")}
            href={resolveHref(locale, t.offer.cta)}
          >
            {t.offer.cta.label}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
          <p className="mt-3 text-sm text-stone-600">{t.offer.note}</p>
        </div>
      </Section>

      {/* ---------------------------------------------------------------- area */}
      <Section>
        <SectionIntro eyebrow={t.area.eyebrow} intro={t.area.intro} title={t.area.title} />

        <ul className="mx-auto mt-8 flex max-w-4xl flex-wrap justify-center gap-2">
          {t.area.cities.map((city) => (
            <li
              className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-700"
              key={city}
            >
              {city}
            </li>
          ))}
        </ul>

        <p className="mt-6 text-center text-sm text-stone-500">{t.area.note}</p>
      </Section>

      {/* ----------------------------------------------------------------- faq */}
      <Section className="bg-stone-50">
        <SectionIntro eyebrow={t.faq.eyebrow} intro={t.faq.intro} title={t.faq.title} />

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {t.faq.items.map((item) => (
            <details
              className="group rounded-2xl border border-stone-200 bg-white p-5 open:shadow-sm"
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

      {/* ----------------------------------------------------------- final cta */}
      <section className="bg-stone-950 py-20 text-white">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight md:text-4xl">
            {t.finalCta.title}
          </h2>
          <p className="mt-4 text-base leading-7 text-stone-300">{t.finalCta.description}</p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              className={buttonVariants({ size: "lg" })}
              href={resolveHref(locale, t.finalCta.primaryCta)}
            >
              {t.finalCta.primaryCta.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              className={cn(buttonVariants({ variant: "secondary", size: "lg" }))}
              href={resolveHref(locale, t.finalCta.secondaryCta)}
            >
              {t.finalCta.secondaryCta.label}
            </Link>
          </div>

          <a
            className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-orange-300 hover:text-orange-200"
            href={telHref}
          >
            <Phone aria-hidden className="size-4" />
            {t.finalCta.phoneLabel} {siteConfig.phone}
          </a>
        </div>
      </section>
    </>
  );
}
