"use client";

import { Play, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useClients } from "@/features/admin/hooks";
import { Field, HintBox } from "@/features/pricing/components/field";
import { EnumOptions, IdSelect, NumberInput, percent } from "@/features/pricing/components/inputs";
import { PricingResultView } from "@/features/pricing/components/pricing-result";
import { usePricingCalculation, usePricingCalculations, usePricingProfiles, useCostProfiles, useSimulatePrice } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { serviceTypes, type CalculatePriceRequest, type PricingAdjustment, type PricingExtraCost, type PricingQuantities, type PricingResult, type ServiceType } from "@/types/api";

const quantityKeys = ["kilometres", "hours", "days", "deliveries", "stops", "parcels", "routes", "projects", "months"] as const;

export default function SimulatorPage() {
  return <Suspense fallback={<LoadingState />}><Simulator /></Suspense>;
}

function Simulator() {
  const searchParams = useSearchParams();
  const initialService = serviceTypes.find((service) => service === searchParams.get("serviceType")) ?? "OnDemandDelivery";
  const initialId = (key: string) => {
    const value = Number(searchParams.get(key));
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  };
  const content = useAppContent();
  const t = content.pricing.simulator;
  const enums = content.pricing.enums;
  const { formatCurrency, formatDate } = useFormatters();
  const clients = useClients();
  const profiles = usePricingProfiles();
  const costProfiles = useCostProfiles();
  const history = usePricingCalculations(true);
  const simulate = useSimulatePrice();

  const [serviceType, setServiceType] = useState<ServiceType>(initialService);
  const [clientId, setClientId] = useState<number | null>(() => initialId("clientId"));
  const [profileId, setProfileId] = useState<number | null>(() => initialId("profileId"));
  const [quantities, setQuantities] = useState<PricingQuantities>({ kilometres: 25, hours: 1, deliveries: 1 });
  const [extraCosts, setExtraCosts] = useState<PricingExtraCost[]>([]);
  const [surcharges, setSurcharges] = useState<PricingAdjustment[]>([]);
  const [discounts, setDiscounts] = useState<PricingAdjustment[]>([]);
  const [overridePrice, setOverridePrice] = useState<number | null>(null);
  const [overrideReason, setOverrideReason] = useState("");
  const [scenarioName, setScenarioName] = useState("");
  const [result, setResult] = useState<PricingResult | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = usePricingCalculation(selectedId);

  const matchingProfiles = (profiles.data ?? []).filter((p) => p.isActive && (p.serviceType == null || p.serviceType === serviceType));
  const effectiveProfile = profileId != null
    ? matchingProfiles.find((p) => p.id === profileId)
    : matchingProfiles.find((p) => p.clientId != null && p.clientId === clientId && p.serviceType === serviceType)
      ?? matchingProfiles.find((p) => p.clientId == null && p.serviceType === serviceType && p.isDefault)
      ?? matchingProfiles.find((p) => p.clientId == null && p.serviceType === serviceType);
  const effectiveCostProfile = effectiveProfile?.costProfileId != null ? (costProfiles.data ?? []).find((c) => c.id === effectiveProfile.costProfileId) : undefined;
  const needs: string[] = effectiveProfile
    ? effectiveCostProfile
      ? [
          effectiveCostProfile.vehicleProfileName ? t.needs.vehicle.replace("{name}", effectiveCostProfile.vehicleProfileName) : null,
          effectiveCostProfile.labourProfileName ? t.needs.labour.replace("{name}", effectiveCostProfile.labourProfileName) : null,
          effectiveCostProfile.costItemIds.length > 0 ? t.needs.items.replace("{count}", String(effectiveCostProfile.costItemIds.length)) : null,
        ].filter((x): x is string => x != null)
      : [t.needs.none]
    : [t.needs.noCostProfile];

  const run = (event: React.FormEvent) => {
    event.preventDefault();
    const payload: CalculatePriceRequest = {
      serviceType, clientId, pricingProfileId: profileId, quantities, extraCosts, surcharges, discounts,
      manualOverridePrice: overridePrice, manualOverrideReason: overrideReason || null, saveAsScenarioName: scenarioName || null,
    };
    simulate.mutate(payload, { onSuccess: (calc) => { setResult(calc.result); setSelectedId(null); } });
  };

  const adjustmentEditor = (title: string, list: PricingAdjustment[], setList: (list: PricingAdjustment[]) => void) => (
    <fieldset className="space-y-2 rounded-xl border border-stone-200 p-4">
      <legend className="px-1 text-sm font-bold text-orange-700">{title}</legend>
      <p className="text-xs text-stone-500">{t.adjustmentsHint}</p>
      {list.map((item, index) => (
        <div key={index} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto_auto] sm:items-center">
          <Input aria-label={t.label} placeholder={t.label} value={item.label} onChange={(e) => setList(list.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))} />
          <NumberInput value={item.value} onChange={(v) => setList(list.map((x, i) => (i === index ? { ...x, value: v ?? 0 } : x)))} />
          <label className="flex items-center gap-1 text-sm"><input type="checkbox" className="accent-orange-500" checked={item.isPercent} onChange={(e) => setList(list.map((x, i) => (i === index ? { ...x, isPercent: e.target.checked } : x)))} />{t.percent}</label>
          <Button type="button" variant="ghost" size="sm" aria-label={t.remove} onClick={() => setList(list.filter((_, i) => i !== index))}><Trash2 aria-hidden className="size-4" /></Button>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" onClick={() => setList([...list, { label: "", value: 0, isPercent: true }])}>{t.add}</Button>
    </fieldset>
  );

  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <form onSubmit={run} className="space-y-5">
          <Card>
            <CardContent className="space-y-5 pt-6">
              <Field copy={t.serviceType} htmlFor="service">
                <Select id="service" value={serviceType} onChange={(e) => { setServiceType(e.target.value as ServiceType); setProfileId(null); }}><EnumOptions values={serviceTypes} labels={enums.serviceType} /></Select>
              </Field>
              <Field copy={t.client} htmlFor="client" optional>
                <IdSelect id="client" value={clientId} onChange={setClientId} options={(clients.data ?? []).map((c) => ({ id: c.id, name: c.companyName }))} emptyLabel="—" />
              </Field>
              <Field copy={t.profile} htmlFor="profile" optional>
                <IdSelect id="profile" value={profileId} onChange={setProfileId} options={matchingProfiles.map((p) => ({ id: p.id, name: `${p.name}${p.isDefault ? " ★" : ""}${p.clientName ? ` · ${p.clientName}` : ""}` }))} emptyLabel={t.autoProfile} />
              </Field>

              <fieldset className="space-y-3 rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-bold text-orange-700">{t.quantitiesTitle}</legend>
                <p className="text-xs text-stone-500">{t.quantitiesHint}</p>
                <HintBox>
                  <span className="font-bold">{effectiveProfile ? `${t.needs.title} ` : ""}</span>
                  {needs.length === 1 ? needs[0] : <ul className="mt-1 list-disc pl-5">{needs.map((n) => <li key={n}>{n}</li>)}</ul>}
                </HintBox>
                <div className="grid gap-3 sm:grid-cols-3">
                  {quantityKeys.map((key) => (
                    <div key={key} className="space-y-1">
                      <label htmlFor={`q-${key}`} className="text-xs font-bold text-stone-700">{t.quantities[key]}</label>
                      <NumberInput id={`q-${key}`} min={0} nullable value={quantities[key]} onChange={(v) => setQuantities({ ...quantities, [key]: v })} />
                    </div>
                  ))}
                </div>
              </fieldset>

              <fieldset className="space-y-2 rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-bold text-orange-700">{t.extraCostsTitle}</legend>
                <p className="text-xs text-stone-500">{t.extraCostsHint}</p>
                {extraCosts.map((item, index) => (
                  <div key={index} className="grid gap-2 sm:grid-cols-[2fr_1fr_auto] sm:items-center">
                    <Input aria-label={t.label} placeholder={t.label} value={item.label} onChange={(e) => setExtraCosts(extraCosts.map((x, i) => (i === index ? { ...x, label: e.target.value } : x)))} />
                    <NumberInput value={item.amount} min={0} onChange={(v) => setExtraCosts(extraCosts.map((x, i) => (i === index ? { ...x, amount: v ?? 0 } : x)))} />
                    <Button type="button" variant="ghost" size="sm" aria-label={t.remove} onClick={() => setExtraCosts(extraCosts.filter((_, i) => i !== index))}><Trash2 aria-hidden className="size-4" /></Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => setExtraCosts([...extraCosts, { label: "", amount: 0 }])}>{t.add}</Button>
              </fieldset>

              {adjustmentEditor(t.surchargesTitle, surcharges, setSurcharges)}
              {adjustmentEditor(t.discountsTitle, discounts, setDiscounts)}

              <fieldset className="space-y-3 rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-bold text-orange-700">{t.overrideTitle}</legend>
                <Field copy={t.overridePrice} htmlFor="override" optional><NumberInput id="override" min={0} nullable value={overridePrice} onChange={setOverridePrice} /></Field>
                {overridePrice != null ? <Field copy={t.overrideReason} htmlFor="reason"><Input id="reason" required value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} /></Field> : null}
              </fieldset>

              <Field copy={t.scenarioName} htmlFor="scenario" optional><Input id="scenario" value={scenarioName} onChange={(e) => setScenarioName(e.target.value)} placeholder={t.scenarioName.example} /></Field>
              <Button type="submit" size="lg" className="w-full" disabled={simulate.isPending}><Play aria-hidden className="mr-2 size-4" />{simulate.isPending ? t.running : t.run}</Button>
            </CardContent>
          </Card>
        </form>

        <div className="space-y-6">
          {result ? <PricingResultView result={result} /> : selected.data ? <PricingResultView result={selected.data.result} /> : <HintBox>{t.description}</HintBox>}
          {selected.isLoading ? <LoadingState /> : null}

          <Card>
            <CardHeader><CardTitle>{t.history}</CardTitle></CardHeader>
            <CardContent>
              {history.data && history.data.length === 0 ? <p className="text-sm text-stone-600">{content.pricing.overview.recentEmpty}</p> : null}
              <ul className="divide-y">
                {history.data?.map((calc) => (
                  <li key={calc.id}>
                    <button type="button" onClick={() => { setSelectedId(calc.id); setResult(null); }} className="flex w-full flex-wrap items-center justify-between gap-2 py-3 text-left text-sm hover:bg-stone-50">
                      <span>
                        <span className="block font-semibold text-stone-900">{calc.name ?? calc.calculationId}</span>
                        <span className="text-xs text-stone-500">{enums.serviceType[calc.serviceType]} · {formatDate(calc.createdAt)}</span>
                      </span>
                      <span className="text-right tabular-nums"><span className="block font-bold">{formatCurrency(calc.finalNetSellingPrice)}</span><span className="text-xs text-stone-500">{percent(calc.expectedMarginPercent)}</span></span>
                    </button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
