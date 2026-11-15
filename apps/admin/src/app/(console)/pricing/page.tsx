"use client";

import { ArrowRight, CheckCircle2, CircleAlert } from "lucide-react";
import Link from "next/link";
import { ErrorState, LoadingState, PageHeader } from "@/components/layout/states";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HintBox } from "@/features/pricing/components/field";
import { percent } from "@/features/pricing/components/inputs";
import { usePricingOverview } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function PricingOverviewPage() {
  const content = useAppContent();
  const t = content.pricing.overview;
  const enums = content.pricing.enums;
  const { formatCurrency, formatDate } = useFormatters();
  const overview = usePricingOverview();

  const counts = overview.data
    ? ([
        [t.counts.costItems, overview.data.costItems, "/pricing/costs"],
        [t.counts.vehicleProfiles, overview.data.vehicleProfiles, "/pricing/vehicles"],
        [t.counts.labourProfiles, overview.data.labourProfiles, "/pricing/labour"],
        [t.counts.costProfiles, overview.data.costProfiles, "/pricing/cost-profiles"],
        [t.counts.pricingProfiles, overview.data.pricingProfiles, "/pricing/profiles"],
      ] as const)
    : [];

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />

      <section>
        <h2 className="mb-3 text-lg font-bold text-stone-900">{t.howItWorks}</h2>
        <ol className="grid gap-3 md:grid-cols-5">
          {t.steps.map((step, index) => (
            <li key={step.href}>
              <Link href={step.href} className="block h-full rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-orange-400 hover:shadow-md">
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-orange-500 text-sm font-bold text-white">{index + 1}</span>
                <p className="mt-3 font-bold text-stone-900">{step.title}</p>
                <p className="mt-1 text-sm text-stone-600">{step.description}</p>
                <ArrowRight aria-hidden className="mt-3 size-4 text-orange-600" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {overview.isLoading ? <LoadingState /> : null}
      {overview.isError ? <ErrorState message={content.common.requestFailed} /> : null}

      {overview.data ? (
        <>
          <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {counts.map(([label, value, href]) => (
              <Link key={href} href={href} className="rounded-2xl border border-stone-200 bg-white p-4 hover:border-orange-400">
                <p className="text-3xl font-extrabold tabular-nums text-stone-950">{value}</p>
                <p className="mt-1 text-sm text-stone-600">{label}</p>
              </Link>
            ))}
          </section>

          <Card>
            <CardHeader>
              <CardTitle>{t.coverageTitle}</CardTitle>
              <p className="text-sm text-stone-600">{t.coverageDescription}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <HintBox>{t.invoiceCodeHint}</HintBox>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500">
                      <th className="py-2 pr-3">{t.invoiceCode}</th>
                      <th className="py-2 pr-3">{content.pricing.simulator.serviceType.label}</th>
                      <th className="py-2 pr-3">{content.pricing.common.status}</th>
                      <th className="py-2 pr-3">{content.pricing.profiles.fields.strategy.label}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {overview.data.coverage.map((row) => (
                      <tr key={row.serviceType} className="border-b last:border-b-0">
                        <td className="py-2 pr-3 font-mono font-bold">{row.invoiceCode}</td>
                        <td className="py-2 pr-3">{enums.serviceType[row.serviceType]}</td>
                        <td className="py-2 pr-3">
                          {row.hasDefaultProfile ? (
                            <Badge variant="success"><CheckCircle2 aria-hidden className="mr-1 size-3" />{t.covered}{row.profileName ? ` · ${row.profileName}` : ""}</Badge>
                          ) : (
                            <Link href="/pricing/profiles"><Badge variant="warning"><CircleAlert aria-hidden className="mr-1 size-3" />{t.missing}</Badge></Link>
                          )}
                        </td>
                        <td className="py-2 pr-3 text-stone-600">{row.strategy ? enums.strategy[row.strategy] : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>{t.recentTitle}</CardTitle></CardHeader>
            <CardContent>
              {overview.data.recentCalculations.length === 0 ? <p className="text-sm text-stone-600">{t.recentEmpty}</p> : (
                <ul className="divide-y">
                  {overview.data.recentCalculations.map((calc) => (
                    <li key={calc.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                      <div>
                        <p className="font-semibold text-stone-900">{calc.name ?? (calc.orderId ? t.order(calc.orderId) : calc.calculationId)}</p>
                        <p className="text-xs text-stone-500">{enums.serviceType[calc.serviceType]} · {formatDate(calc.createdAt)} · {calc.isSimulation ? t.simulation : enums.calculationStatus[calc.status]}</p>
                      </div>
                      <div className="text-right tabular-nums">
                        <p className="font-bold">{formatCurrency(calc.finalNetSellingPrice)}</p>
                        <p className="text-xs text-stone-500">{content.pricing.simulator.result.margin}: {percent(calc.expectedMarginPercent)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
