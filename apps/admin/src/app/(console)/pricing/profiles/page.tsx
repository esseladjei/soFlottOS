"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useClients } from "@/features/admin/hooks";
import { ActiveBadge, ConfigPage, EditorCard } from "@/features/pricing/components/config-page";
import { CustomerPrice } from "@/features/pricing/components/customer-price";
import { Field, FieldLabel, HintBox } from "@/features/pricing/components/field";
import { CheckboxField, EnumOptions, IdSelect, NumberInput, fromDateInput, toDateInput } from "@/features/pricing/components/inputs";
import { useCostProfiles, usePricingProfiles, usePricingReference, useSavePricingProfile } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { businessUnits, pricingStrategies, pricingUnits, serviceTypes, type PricingProfile, type SavePricingProfileRequest, type SavePricingRateRequest } from "@/types/api";

const empty: SavePricingProfileRequest = {
  name: "", description: "", businessUnit: "Express", serviceType: null, clientId: null, costProfileId: null, strategy: "CostPlus", markupPercent: 25, targetMarginPercent: null,
  fixedPrice: null, minimumPrice: null, minimumMarginPercent: 10, isDefault: false, effectiveFrom: null, effectiveTo: null, rates: [], isActive: true, currency: "EUR",
};

export default function PricingProfilesPage() {
  const content = useAppContent();
  const t = content.pricing.profiles;
  const common = content.pricing.common;
  const enums = content.pricing.enums;
  const { formatCurrency, formatDate } = useFormatters();
  const profiles = usePricingProfiles();
  const costProfiles = useCostProfiles();
  const clients = useClients();
  const reference = usePricingReference();
  const save = useSavePricingProfile();
  const [editing, setEditing] = useState<PricingProfile | null | undefined>(undefined);
  const [form, setForm] = useState<SavePricingProfileRequest>(empty);

  const open = (item: PricingProfile | null) => {
    setEditing(item);
    setForm(item ? { ...item, rates: item.rates.map(({ label, unit, rate, includedQuantity, sortOrder }) => ({ label, unit, rate, includedQuantity, sortOrder })) } : empty);
  };
  const set = <K extends keyof SavePricingProfileRequest>(key: K, value: SavePricingProfileRequest[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const setRate = (index: number, patch: Partial<SavePricingRateRequest>) => set("rates", form.rates.map((rate, i) => (i === index ? { ...rate, ...patch } : rate)));
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: editing?.id, payload: form }, { onSuccess: () => setEditing(undefined) }); };

  const servicesForUnit = serviceTypes.filter((service) => reference.data?.serviceTypes.find((info) => info.serviceType === service)?.businessUnit === form.businessUnit);
  const showMarkup = form.strategy === "CostPlus";
  const showMargin = form.strategy === "TargetMargin";
  const showFixed = form.strategy === "FixedPrice";
  const showRates = form.strategy === "RateCard";

  return (
    <ConfigPage<PricingProfile>
      title={t.title}
      description={t.description}
      intro={<HintBox>{t.marginVsMarkup}</HintBox>}
      listTitle={t.title}
      items={profiles.data}
      isLoading={profiles.isLoading}
      editing={editing}
      onCreate={() => open(null)}
      onEdit={open}
      columns={[t.fields.name.label, t.fields.serviceType.label, t.fields.client.label, t.customerPrice.title, t.fields.strategy.label, t.fields.costProfile.label, t.fields.effectiveFrom.label, common.status]}
      renderRow={(item) => [
        <span key="n" className="font-semibold">
          {item.name}
          <span className="mt-1 flex flex-wrap gap-1">
            {item.isDefault ? <Badge variant="info">{t.defaultBadge}</Badge> : null}
            {item.clientId ? <Badge variant="warning">{t.clientBadge}</Badge> : null}
            <span className="text-xs font-normal text-stone-500">{common.version} {item.version}</span>
          </span>
        </span>,
        item.serviceType ? <span key="s">{item.serviceCode ? <span className="mr-1 font-mono text-xs font-bold">{item.serviceCode}</span> : null}{enums.serviceType[item.serviceType]}</span> : <span className="text-stone-500">{t.allServices} · {enums.businessUnit[item.businessUnit]}</span>,
        item.clientName ?? <span className="text-stone-400">{t.allClients}</span>,
        <CustomerPrice key="price" profile={item} savedId={item.isActive ? item.id : undefined} compact />,
        <span key="st">{enums.strategy[item.strategy]}<span className="block text-xs text-stone-500">{item.markupPercent != null ? `+${item.markupPercent} %` : ""}{item.targetMarginPercent != null ? `${item.targetMarginPercent} % ${t.fields.targetMarginPercent.label}` : ""}{item.fixedPrice != null ? formatCurrency(item.fixedPrice) : ""}{item.rates.length > 0 ? `${item.rates.length} ${t.ratesTitle}` : ""}</span></span>,
        item.costProfileName ?? <span className="text-stone-400">{t.noCostProfile}</span>,
        <span key="d" className="text-stone-600">{item.effectiveFrom ? formatDate(item.effectiveFrom) : "—"}{item.effectiveTo ? ` → ${formatDate(item.effectiveTo)}` : ""}</span>,
        <ActiveBadge key="a" active={item.isActive} />,
      ]}
      editor={
        <form onSubmit={submit}>
          <EditorCard title={editing ? common.edit : common.create} onCancel={() => setEditing(undefined)} pending={save.isPending} submitLabel={common.save}>
            <Field copy={t.fields.name} htmlFor="name"><Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field copy={t.fields.businessUnit} htmlFor="bu">
                <Select id="bu" value={form.businessUnit} onChange={(e) => { set("businessUnit", e.target.value as SavePricingProfileRequest["businessUnit"]); set("serviceType", null); set("costProfileId", null); }}>
                  <EnumOptions values={businessUnits} labels={enums.businessUnit} />
                </Select>
              </Field>
              <Field copy={t.fields.serviceType} htmlFor="service" optional>
                <Select id="service" value={form.serviceType ?? ""} onChange={(e) => set("serviceType", e.target.value === "" ? null : (e.target.value as SavePricingProfileRequest["serviceType"]))}>
                  <EnumOptions values={servicesForUnit} labels={enums.serviceType} emptyLabel={t.allServices} />
                </Select>
              </Field>
              <Field copy={t.fields.client} htmlFor="client" optional>
                <IdSelect id="client" value={form.clientId} onChange={(v) => set("clientId", v)} options={(clients.data ?? []).map((c) => ({ id: c.id, name: c.companyName }))} emptyLabel={t.allClients} />
              </Field>
              <Field copy={t.fields.costProfile} htmlFor="cost" optional>
                <IdSelect id="cost" value={form.costProfileId} onChange={(v) => set("costProfileId", v)} options={(costProfiles.data ?? []).filter((c) => c.isActive && c.businessUnit === form.businessUnit)} emptyLabel={t.noCostProfile} />
              </Field>
            </div>

            <fieldset className="space-y-4 rounded-xl border border-stone-200 p-4">
              <Field copy={t.fields.strategy} htmlFor="strategy">
                <Select id="strategy" value={form.strategy} onChange={(e) => set("strategy", e.target.value as SavePricingProfileRequest["strategy"])}><EnumOptions values={pricingStrategies} labels={enums.strategy} /></Select>
              </Field>
              <HintBox>{t.strategyHelp[form.strategy]}</HintBox>
              <div className="space-y-1">
                <p className="text-sm font-bold text-stone-800">{t.profitTitle}</p>
                <HintBox>{t.profitHelp[form.strategy]}</HintBox>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {showMarkup ? <Field copy={t.fields.markupPercent} htmlFor="markup"><NumberInput id="markup" min={0} nullable value={form.markupPercent} onChange={(v) => set("markupPercent", v)} /></Field> : null}
                {showMargin ? <Field copy={t.fields.targetMarginPercent} htmlFor="margin"><NumberInput id="margin" min={0} nullable value={form.targetMarginPercent} onChange={(v) => set("targetMarginPercent", v)} /></Field> : null}
                {showFixed ? <Field copy={t.fields.fixedPrice} htmlFor="fixed"><NumberInput id="fixed" min={0} nullable value={form.fixedPrice} onChange={(v) => set("fixedPrice", v)} /></Field> : null}
                <Field copy={t.fields.minimumPrice} htmlFor="minPrice" optional><NumberInput id="minPrice" min={0} nullable value={form.minimumPrice} onChange={(v) => set("minimumPrice", v)} /></Field>
                <Field copy={t.fields.minimumMarginPercent} htmlFor="minMargin" optional><NumberInput id="minMargin" min={0} nullable value={form.minimumMarginPercent} onChange={(v) => set("minimumMarginPercent", v)} /></Field>
              </div>
            </fieldset>

            {showRates ? (
              <fieldset className="space-y-3 rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-bold text-orange-700">{t.ratesTitle}</legend>
                <p className="text-xs text-stone-500">{t.ratesHint}</p>
                {form.rates.map((rate, index) => (
                  <div key={index} className="grid gap-2 rounded-lg bg-stone-50 p-3 sm:grid-cols-[2fr_1.5fr_1fr_1fr_auto] sm:items-end">
                    <div className="space-y-1"><FieldLabel copy={t.rate.label} htmlFor={`rl-${index}`} /><Input id={`rl-${index}`} required value={rate.label} onChange={(e) => setRate(index, { label: e.target.value })} placeholder={t.rate.label.example} /></div>
                    <div className="space-y-1"><FieldLabel copy={t.rate.unit} htmlFor={`ru-${index}`} /><Select id={`ru-${index}`} value={rate.unit} onChange={(e) => setRate(index, { unit: e.target.value as SavePricingRateRequest["unit"] })}><EnumOptions values={pricingUnits} labels={enums.pricingUnit} /></Select></div>
                    <div className="space-y-1"><FieldLabel copy={t.rate.rate} htmlFor={`rr-${index}`} /><NumberInput id={`rr-${index}`} min={0} value={rate.rate} onChange={(v) => setRate(index, { rate: v ?? 0 })} /></div>
                    <div className="space-y-1"><FieldLabel copy={t.rate.includedQuantity} htmlFor={`ri-${index}`} /><NumberInput id={`ri-${index}`} min={0} value={rate.includedQuantity} onChange={(v) => setRate(index, { includedQuantity: v ?? 0 })} /></div>
                    <Button type="button" variant="ghost" size="sm" aria-label={t.removeRate} onClick={() => set("rates", form.rates.filter((_, i) => i !== index))}><Trash2 aria-hidden className="size-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => set("rates", [...form.rates, { label: "", unit: "Kilometre", rate: 0, includedQuantity: 0, sortOrder: form.rates.length }])}>{t.addRate}</Button>
              </fieldset>
            ) : null}

            <CustomerPrice profile={form} />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field copy={t.fields.effectiveFrom} htmlFor="from" optional><Input id="from" type="date" value={toDateInput(form.effectiveFrom)} onChange={(e) => set("effectiveFrom", fromDateInput(e.target.value))} /></Field>
              <Field copy={t.fields.effectiveTo} htmlFor="to" optional><Input id="to" type="date" value={toDateInput(form.effectiveTo)} onChange={(e) => set("effectiveTo", fromDateInput(e.target.value))} /></Field>
            </div>
            <Field copy={t.fields.description} htmlFor="desc" optional><Textarea id="desc" rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            <Field copy={t.fields.isDefault}><CheckboxField id="default" checked={form.isDefault} onChange={(checked) => set("isDefault", checked)} label={t.fields.isDefault.label} /></Field>
            <CheckboxField id="active" checked={form.isActive} onChange={(checked) => set("isActive", checked)} label={common.active} />
          </EditorCard>
        </form>
      }
    />
  );
}
