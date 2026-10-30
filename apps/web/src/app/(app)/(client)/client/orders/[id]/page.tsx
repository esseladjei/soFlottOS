/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { useCancelOrder, useClientOrder } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function ClientOrderDetailPage() {
  const id = Number(useParams<{ id: string }>().id);
  const order = useClientOrder(id);
  const cancel = useCancelOrder();
  const content = useAppContent();
  const t = content.client.orders;
  const { formatCurrency, formatDate, formatDuration } = useFormatters();
  const fields = content.client.newOrder.fields;
  if (order.isLoading || !order.data) return <LoadingState />;
  const data = order.data;
  return <div className="space-y-8"><PageHeader title={t.detailTitle(data.id)} description={`${data.pickupAddress} → ${data.dropoffAddress}`} action={data.status === "Pending" ? <Button variant="danger" onClick={() => cancel.mutate(data.id)}>{t.cancel}</Button> : null} /><div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>{t.deliveryTitle}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p>{content.common.status}: <strong>{content.enums.orderStatus[data.status]}</strong></p><div><strong>{fields.pickupAddress}:</strong> {data.pickupAddress}<br />{data.pickupContactName ?? content.common.none} · {data.pickupPhone ?? content.common.none}</div><div><strong>{fields.dropoffAddress}:</strong> {data.dropoffAddress}<br />{data.dropoffContactName ?? content.common.none} · {data.dropoffPhone ?? content.common.none}</div><p>{t.driver}: {data.assignedDriverName ?? t.notAssigned}</p><p>{fields.weightKg}: {data.weightKg} kg · {data.estimatedDurationMinutes ? formatDuration(data.estimatedDurationMinutes) : content.common.none}</p><p>{t.price}: {formatCurrency(data.grossPrice)}</p><p>{t.created}: {formatDate(data.createdAt)}</p><p>{t.instructions}: {data.specialInstructions ?? content.common.none}</p>{data.invoiceId ? <p><Link className="font-bold text-orange-600" href={`/client/invoices/${data.invoiceId}`}>{data.invoiceNumber}</Link></p> : null}</CardContent></Card><Card><CardHeader><CardTitle>{t.podTitle}</CardTitle></CardHeader><CardContent>{data.proofOfDelivery ? <div className="space-y-3 text-sm"><p>{t.recipient}: {data.proofOfDelivery.recipientName}</p><p>{t.delivered}: {formatDate(data.proofOfDelivery.deliveredAt)}</p><img src={data.proofOfDelivery.signatureDataUrl} alt={t.signatureAlt} className="max-h-40 rounded-xl border bg-white" /></div> : <p className="text-sm text-stone-600">{t.noPod}</p>}</CardContent></Card></div></div>;
}
