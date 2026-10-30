"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingState, PageHeader } from "@/components/layout/states";
import { useClientOrders } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function ClientOrdersPage() {
  const orders = useClientOrders();
  const content = useAppContent();
  const t = content.client.orders;
  const { formatCurrency, formatDate } = useFormatters();
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />{orders.isLoading ? <LoadingState /> : null}{orders.data?.length === 0 ? <EmptyState title={t.emptyTitle} description={t.emptyDescription} /> : <Card><CardHeader><CardTitle>{t.listTitle}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{orders.data?.map((order) => <tr key={order.id} className="border-t"><td className="py-3"><Link className="font-bold text-orange-600" href={`/client/orders/${order.id}`}>#{order.id}</Link></td><td>{content.enums.orderStatus[order.status]}</td><td>{order.pickupAddress} → {order.dropoffAddress}</td><td>{formatCurrency(order.grossPrice)}</td><td>{formatDate(order.createdAt)}</td></tr>)}</tbody></table></CardContent></Card>}</div>;
}
