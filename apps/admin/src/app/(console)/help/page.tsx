"use client";

import { BookOpen, Calculator, ExternalLink } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/states";
import { pricingHelp } from "@/content/app/pricing-help";
import { useLocale } from "@/i18n/locale-provider";

export default function HelpPage() {
  const t = pricingHelp[useLocale()];

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      <div className="flex max-w-4xl items-start gap-3 border-l-4 border-emerald-600 bg-emerald-50 px-5 py-4 text-base leading-relaxed text-emerald-950">
        <BookOpen aria-hidden className="mt-1 size-5 shrink-0" />
        <p>{t.principle}</p>
      </div>
      <div className="grid items-start gap-10 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <nav aria-label={t.contents} className="space-y-4 lg:sticky lg:top-6">
          <h2 className="font-semibold text-stone-950">{t.contents}</h2>
          <ul className="space-y-1 border-l border-stone-200">
            {t.sections.map((section) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className="block rounded-r-lg px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-950 focus-visible:outline-2 focus-visible:outline-orange-600">{section.title}</a>
              </li>
            ))}
          </ul>
          <Link href="/pricing/simulator" className="inline-flex items-center gap-2 rounded text-sm font-semibold text-emerald-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-emerald-700">
            <Calculator aria-hidden className="size-4 shrink-0" />{t.simulator}
          </Link>
        </nav>
        <article className="min-w-0 max-w-4xl space-y-12">
          {t.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-8 space-y-5 border-b border-stone-200 pb-10 last:border-b-0">
              <h2 id={`${section.id}-title`} className="text-2xl font-semibold tracking-tight text-stone-950">{section.title}</h2>
              {section.paragraphs?.map((paragraph) => <p key={paragraph} className="max-w-[75ch] text-sm leading-7 text-stone-700">{paragraph}</p>)}
              {section.table ? (
                <div className="overflow-x-auto rounded-lg border border-stone-200">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">{section.title}</caption>
                    <thead className="bg-stone-100 text-stone-800">
                      <tr>{section.table.headers.map((header) => <th key={header} scope="col" className="px-4 py-3 font-semibold">{header}</th>)}</tr>
                    </thead>
                    <tbody>
                      {section.table.rows.map((row) => (
                        <tr key={row[0]} className="border-t border-stone-200 align-top">
                          {row.map((cell, index) => index === 0
                            ? <th key={index} scope="row" className="px-4 py-3 font-medium text-stone-950">{cell}</th>
                            : <td key={index} className="px-4 py-3 leading-relaxed text-stone-700 tabular-nums">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
              {section.entries ? (
                <div className="space-y-6">
                  {section.entries.map((entry) => (
                    <div key={entry.title} className="max-w-[75ch] space-y-2">
                      <h3 className="font-semibold text-stone-950">{entry.title}</h3>
                      <p className="text-sm leading-7 text-stone-700">{entry.text}</p>
                      {entry.href ? (
                        <Link href={entry.href} aria-label={`${t.openPage}: ${entry.title}`} className="inline-flex items-center gap-1.5 rounded text-sm font-medium text-orange-800 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-orange-600">
                          {t.openPage}<ExternalLink aria-hidden className="size-3.5" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </article>
      </div>
    </div>
  );
}
