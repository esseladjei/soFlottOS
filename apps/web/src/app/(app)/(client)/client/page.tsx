"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingState, PageHeader } from "@/components/layout/states";
import { useClientInvoices, useClientOrders } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function ClientDashboardPage() {
  const orders = useClientOrders();
  const invoices = useClientInvoices();
  const content = useAppContent();
  const t = content.client.dashboard;
  const { formatCurrency, formatDate } = useFormatters();
  const recentOrders = orders.data?.slice(0, 5) ?? [];
  const openInvoices = invoices.data?.filter((invoice) => invoice.status !== "Paid") ?? [];

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} action={<Link href="/client/new-order"><Button>{t.bookDelivery}</Button></Link>} />
      {orders.isLoading || invoices.isLoading ? <LoadingState /> : null}
      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><CardTitle>{t.recentOrders}</CardTitle></CardHeader><CardContent className="text-3xl font-extrabold">{orders.data?.length ?? 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>{t.openInvoices}</CardTitle></CardHeader><CardContent className="text-3xl font-extrabold">{openInvoices.length}</CardContent></Card>
        <Card><CardHeader><CardTitle>{t.outstanding}</CardTitle></CardHeader><CardContent className="text-3xl font-extrabold">{formatCurrency(openInvoices.reduce((sum, invoice) => sum + invoice.grossTotal, 0))}</CardContent></Card>
      </div>
      {recentOrders.length === 0 ? <EmptyState title={t.emptyTitle} description={t.emptyDescription} /> : (
        <Card><CardHeader><CardTitle>{t.latestOrders}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-stone-500"><th className="py-2">{t.columns.order}</th><th>{t.columns.status}</th><th>{t.columns.route}</th><th>{t.columns.created}</th></tr></thead><tbody>{recentOrders.map((order) => <tr key={order.id} className="border-t"><td className="py-3"><Link className="font-bold text-orange-600" href={`/client/orders/${order.id}`}>#{order.id}</Link></td><td>{content.enums.orderStatus[order.status]}</td><td>{order.pickupAddress} → {order.dropoffAddress}</td><td>{formatDate(order.createdAt)}</td></tr>)}</tbody></table></CardContent></Card>
      )}
    </div>
  );
}
