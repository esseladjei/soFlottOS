"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { ClientForm } from "@/features/admin/components/client-form";
import { useClients, useCreateClient } from "@/features/admin/hooks";
import { useAppContent } from "@/i18n/locale-provider";

export default function AdminClientsPage() {
  const clients = useClients();
  const create = useCreateClient();
  const t = useAppContent().admin.clients;
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />{clients.isLoading ? <LoadingState /> : null}<div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]"><Card><CardHeader><CardTitle>{t.createTitle}</CardTitle></CardHeader><CardContent><ClientForm onSubmit={(payload) => create.mutate(payload)} pending={create.isPending} /></CardContent></Card><Card><CardHeader><CardTitle>{t.listTitle}</CardTitle></CardHeader><CardContent className="overflow-x-auto"><table className="w-full text-sm"><tbody>{clients.data?.map((client) => <tr key={client.id} className="border-t"><td className="py-3"><Link className="font-bold text-orange-600" href={`/clients/${client.id}`}>{client.companyName}</Link></td><td>{client.contactPerson}</td><td>{client.email}</td><td>{t.activeOrders(client.activeOrders)}</td></tr>)}</tbody></table></CardContent></Card></div></div>;
}
