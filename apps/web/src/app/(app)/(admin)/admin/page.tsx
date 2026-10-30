"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { useAdminDashboard, useAdminOrders, useAssignOrder, useDrivers } from "@/features/admin/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function AdminDashboardPage() {
  const dashboard = useAdminDashboard();
  const orders = useAdminOrders();
  const drivers = useDrivers();
  const assign = useAssignOrder();
  const content = useAppContent();
  const t = content.admin.dashboard;
  const { formatCurrency } = useFormatters();
  const assignable = drivers.data?.filter((driver) => driver.availability === "Online" || driver.availability === "Busy") ?? [];
  const cards = dashboard.data ? [
    [t.kpis.pendingOrders, dashboard.data.pendingOrders], [t.kpis.activeOrders, dashboard.data.activeOrders], [t.kpis.deliveredToday, dashboard.data.deliveredToday], [t.kpis.onlineDrivers, dashboard.data.onlineDrivers], [t.kpis.busyDrivers, dashboard.data.busyDrivers], [t.kpis.totalClients, dashboard.data.totalClients], [t.kpis.revenueNet, formatCurrency(dashboard.data.revenueNetThisMonth)], [t.kpis.outstanding, formatCurrency(dashboard.data.outstandingInvoiceTotal)],
  ] : [];
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} action={<Link className={buttonVariants()} href="/admin/orders/new">{content.admin.newOrder.title}</Link>} />{dashboard.isLoading || orders.isLoading || drivers.isLoading ? <LoadingState /> : null}<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{cards.map(([label, value]) => <Card key={label}><CardHeader><CardTitle>{label}</CardTitle></CardHeader><CardContent className="text-2xl font-extrabold">{value}</CardContent></Card>)}</div><Card><CardHeader><CardTitle>{t.activeOrdersTitle}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{orders.data?.filter((order) => order.status !== "Delivered" && order.status !== "Cancelled").map((order) => <tr key={order.id} className="border-t"><td className="py-3 font-bold"><Link className="text-orange-600" href={`/admin/orders/${order.id}`}>#{order.id}</Link></td><td>{order.clientCompanyName}</td><td>{content.enums.orderStatus[order.status]}</td><td>{order.pickupAddress} → {order.dropoffAddress}</td><td><Select aria-label={t.assignDriverFor(order.id)} defaultValue="" onChange={(event) => { const driverUserId = Number(event.target.value); if (driverUserId) assign.mutate({ orderId: order.id, driverUserId }); }}><option value="">{t.assignDriver}</option>{assignable.map((driver) => <option key={driver.userId} value={driver.userId}>{driver.fullName} ({content.enums.availability[driver.availability]})</option>)}</Select></td></tr>)}</tbody></table></CardContent></Card></div>;
}
