"use client";

import { Badge } from "@/components/ui/badge";
import { useAppContent } from "@/i18n/locale-provider";
import type { InvoiceStatus } from "@/types/api";

const variants = {
  Draft: "neutral",
  Sent: "info",
  Paid: "success",
  Overdue: "danger",
} as const;

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const content = useAppContent();
  return <Badge variant={variants[status]}>{content.enums.invoiceStatus[status]}</Badge>;
}
