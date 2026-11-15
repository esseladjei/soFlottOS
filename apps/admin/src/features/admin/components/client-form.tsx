"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createClientSchema, type ClientFormValues } from "@/features/admin/schemas";
import { Field } from "@/features/pricing/components/field";
import { EnumOptions } from "@/features/pricing/components/inputs";
import { useAppContent } from "@/i18n/locale-provider";
import { taxTreatments, type ClientDetail, type SaveClientRequest } from "@/types/api";

function toRequest(values: ClientFormValues): SaveClientRequest {
  return {
    ...values,
    taxIdNumber: values.taxIdNumber || null,
    specialDeliveryInstructions: values.specialDeliveryInstructions || null,
    defaultBaseFee: values.defaultBaseFee ?? null,
    defaultRatePerKilometer: values.defaultRatePerKilometer ?? null,
    taxTreatmentOverride: values.taxTreatmentOverride || null,
  };
}

export function ClientForm({ client, onSubmit, pending }: { client?: ClientDetail; onSubmit: (payload: SaveClientRequest) => void; pending?: boolean }) {
  const content = useAppContent();
  const t = content.admin.clientForm;
  const tax = content.pricing.client;
  const schema = useMemo(() => createClientSchema(content.validation), [content.validation]);
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(schema) as Resolver<ClientFormValues>,
    defaultValues: client ? {
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      street: client.street,
      city: client.city,
      postalCode: client.postalCode,
      country: client.country,
      taxIdNumber: client.taxIdNumber ?? "",
      specialDeliveryInstructions: client.specialDeliveryInstructions ?? "",
      defaultBaseFee: client.defaultBaseFee ?? undefined,
      defaultRatePerKilometer: client.defaultRatePerKilometer ?? undefined,
      taxTreatmentOverride: client.taxTreatmentOverride ?? "",
    } : { country: "Deutschland", taxTreatmentOverride: "" },
  });

  const fields = [
    ["companyName", t.fields.companyName],
    ["contactPerson", t.fields.contactPerson],
    ["email", t.fields.email],
    ["phone", t.fields.phone],
    ["street", t.fields.street],
    ["city", t.fields.city],
    ["postalCode", t.fields.postalCode],
    ["country", t.fields.country],
    ["taxIdNumber", t.fields.taxIdNumber],
    ["defaultBaseFee", t.fields.defaultBaseFee],
    ["defaultRatePerKilometer", t.fields.defaultRatePerKilometer],
  ] as const;

  return <form className="grid gap-4 md:grid-cols-2" onSubmit={form.handleSubmit((values) => onSubmit(toRequest(values)))}>{fields.map(([name, label]) => <div className="space-y-2" key={name}><label className="text-sm font-bold" htmlFor={name}>{label}</label><Input id={name} type={name.startsWith("default") ? "number" : "text"} step="0.01" {...form.register(name)} />{form.formState.errors[name]?.message ? <p className="text-sm text-rose-600">{form.formState.errors[name]?.message}</p> : null}</div>)}<Field copy={tax.taxTreatment} htmlFor="taxTreatmentOverride">
      <Select id="taxTreatmentOverride" {...form.register("taxTreatmentOverride")}>
        <EnumOptions values={taxTreatments} labels={content.pricing.enums.taxTreatment} emptyLabel={tax.automatic} />
      </Select>
      {client?.effectiveTaxTreatment ? <p className="text-xs text-stone-600">{tax.effective}: <Badge variant="info">{content.pricing.enums.taxTreatment[client.effectiveTaxTreatment]}</Badge></p> : null}
    </Field>
    <div className="space-y-2 md:col-span-2"><label className="text-sm font-bold" htmlFor="specialDeliveryInstructions">{t.fields.specialDeliveryInstructions}</label><Textarea id="specialDeliveryInstructions" {...form.register("specialDeliveryInstructions")} /></div><div className="md:col-span-2"><Button type="submit" disabled={pending}>{client ? t.save : t.create}</Button></div></form>;
}
