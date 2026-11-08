"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { ClientForm } from "@/features/admin/components/client-form";
import { useClient, useUpdateClient } from "@/features/admin/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function AdminClientDetailPage() {
  const id = Number(useParams<{ id: string }>().id);
  const client = useClient(id);
  const update = useUpdateClient(id);
  const t = useAppContent().admin.clients;
  const { formatDate } = useFormatters();
  if (client.isLoading || !client.data) return <LoadingState />;
  return <div className="space-y-8"><PageHeader title={client.data.companyName} description={t.detailDescription(formatDate(client.data.createdAt), client.data.totalOrders)} /><Card><CardHeader><CardTitle>{t.editTitle}</CardTitle></CardHeader><CardContent><ClientForm client={client.data} onSubmit={(payload) => update.mutate(payload)} pending={update.isPending} /></CardContent></Card></div>;
}
