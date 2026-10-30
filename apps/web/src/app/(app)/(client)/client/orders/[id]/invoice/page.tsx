"use client";

import { useParams } from "next/navigation";
import { EmptyState, ErrorState, LoadingState } from "@/components/layout/states";
import { InvoiceDocument } from "@/features/client/components/invoice-document";
import { useClientOrder } from "@/features/client/hooks";
import { useAppContent } from "@/i18n/locale-provider";

export default function OrderInvoicePage() {
  const id = Number(useParams<{ id: string }>().id);
  const order = useClientOrder(id);
  const content = useAppContent();

  if (order.isLoading) return <LoadingState />;
  if (order.isError || !order.data) return <ErrorState message={order.error?.message || content.common.requestFailed} />;
  if (!order.data.invoiceId) return <EmptyState title={content.client.invoices.emptyTitle} description={content.client.invoices.emptyDescription} />;

  return <InvoiceDocument invoiceId={order.data.invoiceId} />;
}
