"use client";

import { EmptyState, ErrorState, LoadingState, PageHeader } from "@/components/layout/states";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { usePricingAudit } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import type { PricingAuditAction } from "@/types/api";

const tone: Record<PricingAuditAction, "success" | "info" | "danger" | "neutral"> = { Created: "success", Updated: "info", Deactivated: "danger", NewVersion: "info", ManualOverride: "neutral" };

export default function PricingAuditPage() {
  const content = useAppContent();
  const t = content.pricing.audit;
  const enums = content.pricing.enums;
  const { formatDate } = useFormatters();
  const audit = usePricingAudit();

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      {audit.isLoading ? <LoadingState /> : null}
      {audit.isError ? <ErrorState message={content.common.requestFailed} /> : null}
      {audit.data && audit.data.length === 0 ? <EmptyState title={content.pricing.common.noData} description="" /> : null}
      {audit.data && audit.data.length > 0 ? (
        <Card>
          <CardContent className="overflow-x-auto pt-6">
            <table className="w-full text-sm">
              <thead><tr className="border-b text-left text-xs uppercase tracking-wide text-stone-500"><th className="py-2 pr-3">{t.columns.when}</th><th className="py-2 pr-3">{t.columns.entity}</th><th className="py-2 pr-3">{t.columns.action}</th><th className="py-2 pr-3">{t.columns.summary}</th><th className="py-2">{t.columns.user}</th></tr></thead>
              <tbody>
                {audit.data.map((entry) => (
                  <tr key={entry.id} className="border-b last:border-b-0 align-top">
                    <td className="whitespace-nowrap py-2 pr-3 text-stone-600">{formatDate(entry.createdAt)}</td>
                    <td className="py-2 pr-3">{entry.entityType} <span className="text-stone-400">#{entry.entityId}</span></td>
                    <td className="py-2 pr-3"><Badge variant={tone[entry.action] ?? "neutral"}>{enums.auditAction[entry.action]}</Badge></td>
                    <td className="py-2 pr-3">{entry.summary}</td>
                    <td className="py-2 text-stone-500">{entry.userId ?? "—"}</td>
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
