"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { EmptyState, LoadingState, PageHeader } from "@/components/layout/states";
import { useClientInvoices } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function ClientInvoicesPage() {
  const invoices = useClientInvoices();
  const content = useAppContent();
  const t = content.client.invoices;
  const { formatCurrency, formatDate } = useFormatters();
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />{invoices.isLoading ? <LoadingState /> : null}{invoices.data?.length === 0 ? <EmptyState title={t.emptyTitle} description={t.emptyDescription} /> : <Card><CardHeader><CardTitle>{t.listTitle}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{invoices.data?.map((invoice) => <tr key={invoice.id} className="border-t"><td className="py-3"><Link className="font-bold text-orange-600" href={`/client/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link></td><td><InvoiceStatusBadge status={invoice.status} /></td><td>{formatCurrency(invoice.grossTotal)}</td><td>{t.due(formatDate(invoice.dueDate))}</td></tr>)}</tbody></table></CardContent></Card>}</div>;
}
