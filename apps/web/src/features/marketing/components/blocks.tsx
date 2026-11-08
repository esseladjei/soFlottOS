// Renders the typed content blocks of a page (see `ContentBlock` in
// `content/marketing/types.ts`). One component per block kind; the content
// files decide the order, this file decides the look.

import { AlertTriangle, ArrowRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import type { ContentBlock, LinkItem, MarketingContent } from "@/content/marketing/types";
import { EnquiryForm } from "@/features/marketing/components/enquiry-form";
import { MarketingIcon } from "@/features/marketing/components/icon";
import { Section, SectionIntro } from "@/features/marketing/components/section";
import { resolveHref } from "@/features/marketing/lib/links";
import { buttonBase, divisionThemes, type DivisionTheme } from "@/features/marketing/lib/theme";
import type { Locale } from "@/i18n/config";
import { localePath, type Division, type MarketingPage } from "@/i18n/routes";
import { mailtoHref, siteConfig, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export interface BlockContext {
  locale: Locale;
  page: MarketingPage;
  division: Division;
  theme: DivisionTheme;
  content: MarketingContent;
}

/** Inbox for the current division; corporate pages use the company address. */
function divisionEmail(division: Division) {
  return division === "corporate" ? siteConfig.email : siteConfig.divisions[division].email;
}

export function CtaLink({
  locale,
  link,
  theme,
  variant = "primary",
  className,
}: {
  locale: Locale;
  link: LinkItem;
  theme: DivisionTheme;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      className={cn(buttonBase, theme.ring, variant === "primary" ? theme.button : theme.buttonOutline, className)}
      href={resolveHref(locale, link)}
    >
      {link.label}
      {variant === "primary" ? <ArrowRight aria-hidden className="size-4" /> : null}
    </Link>
  );
}

export function ContentBlocks({ blocks, ctx }: { blocks: ContentBlock[]; ctx: BlockContext }) {
  return (
    <>
      {blocks.map((block, index) => (
        <Block block={block} ctx={ctx} index={index} key={index} />
      ))}
    </>
  );
}

function Block({ block, ctx, index }: { block: ContentBlock; ctx: BlockContext; index: number }) {
  const { locale, theme, content } = ctx;
  const headingId = `block-${index}`;
  // Alternate background bands for rhythm on long pages.
  const band = index % 2 === 1 ? "bg-stone-50" : "bg-white";

  switch (block.kind) {
    case "cards":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} eyebrow={block.eyebrow} id={headingId} intro={block.intro} title={block.title} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <li className="rounded-2xl border border-stone-200 bg-white p-6" key={item.title}>
                <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", theme.accentSoft)}>
                  <MarketingIcon className="size-5" name={item.icon} />
                </span>
                <h3 className="mt-4 text-base font-bold text-stone-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{item.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "links":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} eyebrow={block.eyebrow} id={headingId} intro={block.intro} title={block.title} />
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {block.items.map((item) => (
              <li key={item.page}>
                <Link
                  className={cn(
                    "group flex h-full flex-col rounded-2xl border border-stone-200 bg-white p-6 transition hover:border-stone-400 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2",
                    theme.ring,
                  )}
                  href={localePath(locale, item.page)}
                >
                  <span className={cn("inline-flex size-10 items-center justify-center rounded-xl", theme.accentSoft)}>
                    <MarketingIcon className="size-5" name={item.icon} />
                  </span>
                  <span className="mt-4 text-base font-bold text-stone-950">{item.title}</span>
                  <span className="mt-2 flex-1 text-sm leading-6 text-stone-600">{item.description}</span>
                  <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-bold", theme.accent)}>
                    {content.pages[item.page].label}
                    <ArrowRight aria-hidden className="size-4 transition group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      );

    case "divisions":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro eyebrow={block.eyebrow} id={headingId} intro={block.intro} title={block.title} />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {block.items.map((item) => {
              const t = divisionThemes[item.division];
              return (
                <article className={cn("flex flex-col rounded-3xl border-t-4 bg-white p-7 shadow-sm ring-1 ring-stone-200", t.border)} key={item.division}>
                  <h3 className={cn("font-[family-name:var(--font-display)] text-2xl font-extrabold", t.accent)}>{item.name}</h3>
                  <p className="mt-3 text-base leading-7 text-stone-700">{item.summary}</p>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {item.points.map((point) => (
                      <li className="flex gap-2 text-sm text-stone-700" key={point}>
                        <CheckCircle2 aria-hidden className={cn("mt-0.5 size-4 shrink-0", t.accent)} />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <CtaLink className="mt-6 w-fit" link={item.cta} locale={locale} theme={t} />
                </article>
              );
            })}
          </div>
        </Section>
      );

    case "steps":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} eyebrow={block.eyebrow} id={headingId} intro={block.intro} title={block.title} />
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {block.steps.map((step, stepIndex) => (
              <li className="rounded-2xl border border-stone-200 bg-white p-6" key={step.title}>
                <span className={cn("inline-flex size-9 items-center justify-center rounded-full text-sm font-extrabold", theme.accentSoft)}>
                  {stepIndex + 1}
                </span>
                <h3 className="mt-4 text-base font-bold text-stone-950">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </Section>
      );

    case "compare":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} eyebrow={block.eyebrow} id={headingId} intro={block.intro} title={block.title} />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-stone-200 bg-white">
            <table className={cn("w-full text-left text-sm", block.columns.length > 2 ? "min-w-[48rem]" : "min-w-[36rem]")}>
              <caption className="sr-only">{block.title}</caption>
              <thead className="bg-stone-50 text-stone-950">
                <tr>
                  <td className="p-4" />
                  {block.columns.map((column) => (
                    <th className="p-4 font-bold" key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {block.rows.map((row) => (
                  <tr key={row.label}>
                    <th className="p-4 align-top font-semibold text-stone-900" scope="row">
                      {row.label}
                    </th>
                    {row.values.map((value, valueIndex) => (
                      <td className="p-4 align-top leading-6 text-stone-700" key={valueIndex}>
                        {value}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {block.ctas?.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {block.ctas.map((cta, ctaIndex) => (
                <CtaLink
                  key={cta.label}
                  link={cta}
                  locale={locale}
                  theme={theme}
                  variant={ctaIndex === 0 ? "primary" : "secondary"}
                />
              ))}
            </div>
          ) : null}
        </Section>
      );

    case "checklist":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} id={headingId} intro={block.intro} title={block.title} />
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {block.items.map((item) => (
              <li className="flex gap-3 rounded-xl border border-stone-200 bg-white p-4 text-sm leading-6 text-stone-700" key={item}>
                <CheckCircle2 aria-hidden className={cn("mt-0.5 size-5 shrink-0", theme.accent)} />
                {item}
              </li>
            ))}
          </ul>
        </Section>
      );

    case "text":
      return (
        <Section className={band} labelledBy={block.title ? headingId : undefined}>
          <div className="max-w-3xl">
            {block.title ? (
              <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950" id={headingId}>
                {block.title}
              </h2>
            ) : null}
            <div className="mt-4 space-y-4 text-base leading-7 text-stone-700">
              {block.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            {block.sections?.map((section) => (
              <div className="mt-8" key={section.title}>
                <h3 className="text-lg font-bold text-stone-950">{section.title}</h3>
                <div className="mt-2 space-y-3 text-base leading-7 text-stone-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>
      );

    case "notice":
      return (
        <Section className={cn(band, "py-8 md:py-10")}>
          <div className={cn("max-w-3xl rounded-2xl border-l-4 bg-white p-6 ring-1 ring-stone-200", theme.border)}>
            <p className="flex items-center gap-2 font-bold text-stone-950">
              <AlertTriangle aria-hidden className={cn("size-5", theme.accent)} />
              {block.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-stone-700">{block.text}</p>
          </div>
        </Section>
      );

    case "faq":
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} id={headingId} intro={block.intro} title={block.title} />
          <div className="mt-6 max-w-3xl divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            {block.items.map((item) => (
              <details className="group p-5" key={item.question}>
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-bold text-stone-950 [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span aria-hidden className="text-xl leading-none text-stone-500 transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-6 text-stone-700">{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>
      );

    case "form": {
      const topic = ctx.division === "corporate" ? "general" : ctx.division;
      return (
        <Section className={band} id="enquiry">
          <div className="max-w-3xl">
            <EnquiryForm
              defaultTopic={topic}
              emails={{
                express: siteConfig.divisions.express.email,
                digital: siteConfig.divisions.digital.email,
                general: siteConfig.email,
              }}
              forms={content.forms}
              intro={block.intro}
              kind={block.form}
              privacyHref={localePath(locale, "legal/privacy")}
              theme={theme}
              title={block.title}
            />
          </div>
        </Section>
      );
    }

    case "contact": {
      const email = divisionEmail(ctx.division);
      const { street, postalCode, city } = siteConfig.address;
      return (
        <Section className={band} labelledBy={headingId}>
          <SectionIntro accent={theme.accent} id={headingId} intro={block.intro} title={block.title} />
          <ul className="mt-6 grid gap-4 sm:grid-cols-3">
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <Mail aria-hidden className={cn("size-5", theme.accent)} />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-500">{content.common.email}</p>
              <a className="mt-1 block break-all font-semibold text-stone-950 hover:underline" href={`mailto:${email}`}>
                {email}
              </a>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <Phone aria-hidden className={cn("size-5", theme.accent)} />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-500">{content.common.phone}</p>
              <a className="mt-1 block font-semibold text-stone-950 hover:underline" href={telHref}>
                {siteConfig.phone}
              </a>
            </li>
            <li className="rounded-2xl border border-stone-200 bg-white p-5">
              <MapPin aria-hidden className={cn("size-5", theme.accent)} />
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-stone-500">{content.common.address}</p>
              <p className="mt-1 font-semibold text-stone-950">
                {siteConfig.companyName}
                <br />
                {city ? (
                  <>
                    {street ? (
                      <>
                        {street}
                        <br />
                      </>
                    ) : null}
                    {postalCode} {city}
                  </>
                ) : (
                  <span className="font-normal italic text-stone-500">{content.common.toBeCompleted}</span>
                )}
              </p>
            </li>
          </ul>
        </Section>
      );
    }

    case "imprint": {
      const { legal, address } = siteConfig;
      const missing = <span className="italic text-stone-500">{content.common.toBeCompleted}</span>;
      const register = [legal.registerCourt, legal.registerNumber].filter(Boolean).join(", ");
      const rows: [string, ReactNode][] = [
        [content.imprint.company, siteConfig.companyName],
        [
          content.imprint.address,
          address.street && address.city ? (
            <>
              {address.street}
              <br />
              {address.postalCode} {address.city}
              <br />
              {address.country === "DE" ? (locale === "de" ? "Deutschland" : "Germany") : address.country}
            </>
          ) : (
            missing
          ),
        ],
        [content.imprint.managingDirectors, legal.managingDirectors || missing],
        [content.imprint.register, register || missing],
        [content.imprint.vatId, legal.vatId || missing],
        [
          content.imprint.contact,
          <>
            {content.common.phone}: <a className="underline" href={telHref}>{siteConfig.phone}</a>
            <br />
            {content.common.email}: <a className="underline" href={mailtoHref}>{siteConfig.email}</a>
            {[siteConfig.divisions.express, siteConfig.divisions.digital].map((d) => (
              <span key={d.email}>
                <br />
                {d.name}: <a className="underline" href={`mailto:${d.email}`}>{d.email}</a>
              </span>
            ))}
          </>,
        ],
        [content.imprint.divisions, `${siteConfig.divisions.express.name}, ${siteConfig.divisions.digital.name}`],
      ];
      return (
        <Section className={band} labelledBy={headingId}>
          <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950" id={headingId}>
            {block.title}
          </h2>
          <dl className="mt-6 max-w-3xl divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-white">
            {rows.map(([label, value]) => (
              <div className="grid gap-1 p-4 sm:grid-cols-3 sm:gap-4" key={label}>
                <dt className="text-sm font-bold text-stone-900">{label}</dt>
                <dd className="text-sm leading-6 text-stone-700 sm:col-span-2">{value}</dd>
              </div>
            ))}
          </dl>
        </Section>
      );
    }
  }
}
