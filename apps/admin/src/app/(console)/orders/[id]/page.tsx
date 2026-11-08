"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { useAdminOrder } from "@/features/admin/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function AdminOrderDetailPage() {
  const id = Number(useParams<{ id: string }>().id);
  const order = useAdminOrder(id);
  const content = useAppContent();
  const t = content.client.orders;
  const fields = content.client.newOrder.fields;
  const { formatCurrency, formatDate, formatDuration } = useFormatters();
  if (order.isLoading) return <LoadingState />;
  if (order.isError || !order.data) return <p role="alert">{order.error?.message || content.common.requestFailed}</p>;
  const data = order.data;
  return <div className="space-y-8">
    <PageHeader title={t.detailTitle(data.id)} description={`${data.clientCompanyName} · ${content.enums.orderStatus[data.status]}`} />
    <div className="grid gap-4 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>{t.deliveryTitle}</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">
        <p><strong>{fields.pickupAddress}:</strong> {data.pickupAddress}</p>
        <p>{data.pickupContactName} · {data.pickupPhone}</p>
        <p><strong>{fields.dropoffAddress}:</strong> {data.dropoffAddress}</p>
        <p>{data.dropoffContactName} · {data.dropoffPhone}</p>
        <p>{content.common.status}: <strong>{content.enums.orderStatus[data.status]}</strong></p>
        <p>{t.driver}: {data.assignedDriverName ?? t.notAssigned}</p>
        <p>{t.price}: {formatCurrency(data.grossPrice)}</p>
        <p>{fields.weightKg}: {data.weightKg} kg · {data.estimatedDurationMinutes ? formatDuration(data.estimatedDurationMinutes) : content.common.none}</p>
        <p>{t.created}: {formatDate(data.createdAt)}</p>
        <p>{t.instructions}: {data.specialInstructions ?? content.common.none}</p>
        {data.invoiceId ? <p><Link className="font-bold text-orange-600" href={`/invoices/${data.invoiceId}`}>{data.invoiceNumber}</Link></p> : null}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>{t.podTitle}</CardTitle></CardHeader><CardContent>{data.proofOfDelivery ? <div className="space-y-3 text-sm"><p>{t.recipient}: {data.proofOfDelivery.recipientName}</p><p>{t.delivered}: {formatDate(data.proofOfDelivery.deliveredAt)}</p><img src={data.proofOfDelivery.signatureDataUrl} alt={t.signatureAlt} className="max-h-40 rounded-xl border bg-white" /></div> : <p className="text-sm text-stone-600">{t.noPod}</p>}</CardContent></Card>
    </div>
  </div>;
}
