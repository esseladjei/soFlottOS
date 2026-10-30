"use client";

import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ErrorState, LoadingState } from "@/components/layout/states";
import { InvoiceStatusBadge } from "@/components/invoice-status-badge";
import { useInvoice } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export function InvoiceDocument({ invoiceId }: { invoiceId?: number }) {
  const params = useParams<{ id: string }>();
  const id = invoiceId ?? Number(params.id);
  const invoice = useInvoice(id);
  const content = useAppContent();
  const t = content.client.invoiceDetail;
  const { formatCurrency, formatDate } = useFormatters();
  if (invoice.isLoading) return <LoadingState />;
  if (invoice.isError || !invoice.data) return <ErrorState message={invoice.error?.message || content.common.requestFailed} />;
  const data = invoice.data;
  const route = `${data.order.pickupAddress} → ${data.order.dropoffAddress}`;
  return <div className="invoice-page mx-auto max-w-4xl space-y-8 bg-white p-8 shadow-sm">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-3xl font-extrabold">{t.heading}</h1><p className="text-stone-600">{data.invoiceNumber}</p></div>
      <div className="flex items-center gap-3"><InvoiceStatusBadge status={data.status} /><Button className="print:hidden" onClick={() => window.print()}>{t.print}</Button></div>
    </div>
    <section className="grid gap-8 sm:grid-cols-2">
      <div><h2 className="font-bold">{t.issuer}</h2><p>{data.issuer.companyName}<br />{data.issuer.street}<br />{data.issuer.postalCode} {data.issuer.city}<br />{data.issuer.country}<br />{t.taxId}: {data.issuer.taxIdNumber}<br />{data.issuer.email}<br />{data.issuer.phone}</p></div>
      <div><h2 className="font-bold">{t.customer}</h2><p>{data.client.companyName}<br />{data.client.contactPerson}<br />{data.client.street}<br />{data.client.postalCode} {data.client.city}<br />{data.client.country}</p></div>
    </section>
    <section className="grid gap-2 text-sm sm:grid-cols-2"><p>{t.issuedAt}: {formatDate(data.issuedAt)}</p><p>{t.dueDate}: {formatDate(data.dueDate)}</p><p>{content.common.status}: <InvoiceStatusBadge status={data.status} /></p><p>{t.paymentMethod}: {content.enums.paymentMethod[data.paymentMethod]}</p></section>
    <table className="w-full border-collapse text-sm"><thead><tr className="border-b text-left"><th className="py-3">{t.columns.position}</th><th>{t.columns.net}</th><th>{t.columns.vat}</th><th>{t.columns.gross}</th></tr></thead><tbody><tr className="border-b"><td className="py-3">{t.lineItem(data.orderId, route)}</td><td>{formatCurrency(data.netTotal)}</td><td>{formatCurrency(data.vatTotal)} ({Math.round(data.vatRate * 100)}%)</td><td>{formatCurrency(data.grossTotal)}</td></tr></tbody></table>
    <section className="ml-auto max-w-sm space-y-2 text-sm"><p className="flex justify-between"><span>{t.netTotal}</span><strong>{formatCurrency(data.netTotal)}</strong></p><p className="flex justify-between"><span>{t.vatTotal(Math.round(data.vatRate * 100))}</span><strong>{formatCurrency(data.vatTotal)}</strong></p><p className="flex justify-between text-lg"><span>{t.grandTotal}</span><strong>{formatCurrency(data.grossTotal)}</strong></p></section>
    <section className="rounded-xl bg-stone-50 p-4 text-sm"><h2 className="font-bold">{t.paymentNotes}</h2>{data.paymentMethod === "BankTransfer" ? <p>{t.bankTransfer(data.paymentTermsDays, data.issuer.bankName ?? t.fallbackBank, data.issuer.iban ?? t.fallbackIban, data.issuer.bic ?? content.common.none)}</p> : <p>{t.paypal(data.issuer.paypalHandle ?? data.issuer.email)}</p>}</section>
  </div>;
}
