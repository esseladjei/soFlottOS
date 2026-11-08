"use client";

import { useState } from "react";
import { PageHeader } from "@/components/layout/states";
import { Select } from "@/components/ui/select";
import { BookingForm } from "@/features/client/components/booking-form";
import { useClients } from "@/features/admin/hooks";
import { useAppContent } from "@/i18n/locale-provider";

export default function AdminNewOrderPage() {
  const clients = useClients();
  const [clientId, setClientId] = useState<number>();
  const content = useAppContent();
  const t = content.admin.newOrder;
  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      <div className="max-w-xl space-y-2">
        <label htmlFor="clientId" className="text-sm font-bold">{t.selectClient}</label>
        <Select id="clientId" value={clientId ?? ""} onChange={(event) => setClientId(Number(event.target.value) || undefined)}>
          <option value="">{clients.isLoading ? content.common.loading : t.selectClient}</option>
          {clients.data?.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
        </Select>
        {clients.isError ? <p role="alert" className="text-sm text-rose-600">{clients.error.message || content.common.requestFailed}</p> : null}
      </div>
      {clientId ? <BookingForm clientId={clientId} /> : null}
    </div>
  );
}
