"use client";

import { AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { percent } from "@/features/pricing/components/inputs";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import type { PricingResult } from "@/types/api";

export function PricingResultView({ result }: { result: PricingResult }) {
  const content = useAppContent();
  const t = content.pricing.simulator.result;
  const enums = content.pricing.enums;
  const { formatCurrency } = useFormatters();
  const failed = result.status === "Error";

  const summaryRows: [string, string, boolean?][] = [
    [t.directCosts, formatCurrency(result.directCosts)],
    [t.overhead, formatCurrency(result.allocatedOverhead)],
    [t.vehicle, formatCurrency(result.vehicleCosts)],
    [t.labour, formatCurrency(result.labourCosts)],
    [t.risk, formatCurrency(result.riskAllowance)],
    [t.totalCost, formatCurrency(result.totalEstimatedCost), true],
    [t.netPrice, formatCurrency(result.finalNetSellingPrice), true],
    [t.vat(Math.round(result.vatRate * 100)), formatCurrency(result.vatAmount)],
    [t.gross, formatCurrency(result.finalGrossSellingPrice), true],
    [t.profit, formatCurrency(result.expectedProfit)],
    [t.margin, percent(result.expectedMarginPercent)],
    [t.markup, percent(result.expectedMarkupPercent)],
  ];

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>{t.title}</CardTitle>
          <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
            <Badge variant={failed ? "danger" : result.status === "Warning" ? "warning" : "success"}>{enums.calculationStatus[result.status]}</Badge>
            <Badge variant="neutral">{enums.taxTreatment[result.taxTreatment]}</Badge>
            <span>{result.pricingProfileName ? t.profileUsed(result.pricingProfileName, result.pricingProfileVersion ?? 1) : t.noProfile}</span>
            {result.strategy ? <span>· {enums.strategy[result.strategy]}</span> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.errors.length > 0 ? (
            <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
              <p className="mb-1 flex items-center gap-2 font-bold"><XCircle aria-hidden className="size-4" />{t.errors}</p>
              <ul className="list-disc pl-5">{result.errors.map((error) => <li key={error}>{error}</li>)}</ul>
            </div>
          ) : null}
          {result.warnings.length > 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="mb-1 flex items-center gap-2 font-bold"><AlertTriangle aria-hidden className="size-4" />{t.warnings}</p>
              <ul className="list-disc pl-5">{result.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul>
            </div>
          ) : null}
          <dl className="grid gap-x-8 gap-y-1 text-sm md:grid-cols-2">
            {summaryRows.map(([label, value, strong]) => (
              <div key={label} className={`flex justify-between gap-3 border-b border-stone-100 py-1.5 ${strong ? "font-bold text-stone-950" : "text-stone-700"}`}>
                <dt>{label}</dt><dd className="tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
          {result.taxNote ? <p className="rounded-lg bg-stone-50 p-3 text-xs text-stone-600">{result.taxNote}</p> : null}
        </CardContent>
      </Card>

      {result.costLines.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>{t.costs}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500"><th className="py-2 pr-3">{t.columns.item}</th><th className="py-2 pr-3 text-right">{t.columns.quantity}</th><th className="py-2 pr-3 text-right">{t.columns.unitCost}</th><th className="py-2 pr-3 text-right">{t.columns.total}</th><th className="py-2">{t.columns.explanation}</th></tr></thead>
              <tbody>
                {result.costLines.map((line, index) => (
                  <tr key={index} className="border-b last:border-b-0 align-top">
                    <td className="py-2 pr-3"><span className="block text-xs text-stone-400">{line.group}</span>{line.label}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{line.quantity} {line.unit}</td>
                    <td className="py-2 pr-3 text-right tabular-nums">{line.unitCost.toFixed(4)}</td>
                    <td className="py-2 pr-3 text-right font-semibold tabular-nums">{formatCurrency(line.total)}</td>
                    <td className="py-2 text-xs text-stone-500">{line.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}

      {result.priceLines.length > 0 ? (
        <Card>
          <CardHeader><CardTitle>{t.price}</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500"><th className="py-2 pr-3">{t.columns.item}</th><th className="py-2 pr-3 text-right">{t.columns.amount}</th><th className="py-2">{t.columns.explanation}</th></tr></thead>
              <tbody>
                {result.priceLines.map((line, index) => (
                  <tr key={index} className="border-b last:border-b-0 align-top">
                    <td className="py-2 pr-3">{line.label}</td>
                    <td className="py-2 pr-3 text-right font-semibold tabular-nums">{formatCurrency(line.amount)}</td>
                    <td className="py-2 text-xs text-stone-500">{line.explanation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
