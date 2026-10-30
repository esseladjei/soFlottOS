"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { Select } from "@/components/ui/select";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { useInvoices, useUpdateInvoiceStatus } from "@/features/admin/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { invoiceStatuses, type InvoiceStatus } from "@/types/api";

export default function AdminInvoicesPage() {
  const invoices = useInvoices();
  const update = useUpdateInvoiceStatus();
  const content = useAppContent();
  const t = content.admin.invoices;
  const { formatCurrency, formatDate } = useFormatters();
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />{invoices.isLoading ? <LoadingState /> : null}<Card><CardHeader><CardTitle>{t.listTitle}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{invoices.data?.map((invoice) => <tr key={invoice.id} className="border-t"><td className="py-3 font-bold"><Link className="text-orange-600" href={`/admin/invoices/${invoice.id}`}>{invoice.invoiceNumber}</Link></td><td>{invoice.clientCompanyName}</td><td>{formatCurrency(invoice.grossTotal)}</td><td>{t.due(formatDate(invoice.dueDate))}</td><td><InvoiceStatusBadge status={invoice.status} /></td><td><Select aria-label={t.statusFor(invoice.invoiceNumber)} value={invoice.status} onChange={(event) => update.mutate({ id: invoice.id, nextStatus: event.target.value as InvoiceStatus })}>{invoiceStatuses.map((status) => <option key={status} value={status}>{content.enums.invoiceStatus[status]}</option>)}</Select></td></tr>)}</tbody></table></CardContent></Card></div>;
}
