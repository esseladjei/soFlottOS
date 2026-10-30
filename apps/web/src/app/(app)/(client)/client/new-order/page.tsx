"use client";

import { PageHeader } from "@/components/layout/states";
import { BookingForm } from "@/features/client/components/booking-form";
import { useAppContent } from "@/i18n/locale-provider";

export default function NewOrderPage() {
  const t = useAppContent().client.newOrder;
  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      <BookingForm />
    </div>
  );
}
