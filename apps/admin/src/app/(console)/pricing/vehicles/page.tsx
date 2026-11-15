"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActiveBadge, ConfigPage, DerivedList, EditorCard } from "@/features/pricing/components/config-page";
import { Field, HintBox } from "@/features/pricing/components/field";
import { CheckboxField, NumberInput, fromDateInput, toDateInput } from "@/features/pricing/components/inputs";
import { useSaveVehicleProfile, useVehicleProfiles } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import type { SaveVehicleProfileRequest, VehicleCostSummary, VehicleProfile } from "@/types/api";

type NumericKey = Exclude<keyof SaveVehicleProfileRequest, "name" | "description" | "purchaseDate" | "isActive">;

const sections: { key: "purchase" | "running" | "time"; fields: NumericKey[] }[] = [
  { key: "purchase", fields: ["purchasePrice", "expectedResidualValue", "expectedUsefulKilometres"] },
  { key: "running", fields: ["fuelConsumptionPer100Km", "fuelPricePerLitre", "tyreReplacementCost", "tyreLifespanKm", "brakeReplacementCost", "brakeLifespanKm", "serviceCost", "serviceIntervalKm"] },
  { key: "time", fields: ["annualInsurance", "annualVehicleTax", "monthlyFinancingCost", "annualOtherCosts", "operatingDaysPerYear", "expectedAnnualKilometres"] },
];

const integerFields: NumericKey[] = ["expectedUsefulKilometres", "tyreLifespanKm", "brakeLifespanKm", "serviceIntervalKm", "operatingDaysPerYear", "expectedAnnualKilometres"];

const empty: SaveVehicleProfileRequest = {
  name: "", description: "", purchasePrice: 0, purchaseDate: null, expectedResidualValue: 0, expectedUsefulKilometres: 300000, fuelConsumptionPer100Km: 8, fuelPricePerLitre: 1.7,
  tyreReplacementCost: 600, tyreLifespanKm: 40000, brakeReplacementCost: 500, brakeLifespanKm: 60000, serviceCost: 400, serviceIntervalKm: 30000, annualInsurance: 0, annualVehicleTax: 0,
  monthlyFinancingCost: 0, annualOtherCosts: 0, operatingDaysPerYear: 250, expectedAnnualKilometres: 60000, isActive: true,
};

export default function VehiclesPage() {
  const content = useAppContent();
  const t = content.pricing.vehicles;
  const common = content.pricing.common;
  const { formatCurrency } = useFormatters();
  const vehicles = useVehicleProfiles();
  const save = useSaveVehicleProfile();
  const [editing, setEditing] = useState<VehicleProfile | null | undefined>(undefined);
  const [form, setForm] = useState<SaveVehicleProfileRequest>(empty);

  const open = (item: VehicleProfile | null) => { setEditing(item); setForm(item ? { ...item } : empty); };
  const set = <K extends keyof SaveVehicleProfileRequest>(key: K, value: SaveVehicleProfileRequest[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: editing?.id, payload: form }, { onSuccess: () => setEditing(undefined) }); };

  const derivedRows = (derived: VehicleCostSummary): [string, string][] =>
    (Object.keys(t.derived) as (keyof VehicleCostSummary)[]).map((key) => [t.derived[key], key === "annualTimeCost" || key === "timeCostPerDay" ? formatCurrency(derived[key]) : `${derived[key].toFixed(3)} €`]);

  return (
    <ConfigPage<VehicleProfile>
      title={t.title}
      description={t.description}
      intro={<HintBox>{t.derivedHint}</HintBox>}
      listTitle={t.title}
      items={vehicles.data}
      isLoading={vehicles.isLoading}
      editing={editing}
      onCreate={() => open(null)}
      onEdit={open}
      columns={[t.fields.name.label, t.derived.distanceCostPerKm, t.derived.timeCostPerDay, t.derived.totalCostPerKm, common.status]}
      renderRow={(item) => [
        <span key="n" className="font-semibold">{item.name}<span className="block text-xs font-normal text-stone-500">{item.expectedAnnualKilometres.toLocaleString()} km / {common.perYear}</span></span>,
        <span key="d" className="tabular-nums">{item.derived.distanceCostPerKm.toFixed(3)} €</span>,
        <span key="t" className="tabular-nums">{formatCurrency(item.derived.timeCostPerDay)}</span>,
        <span key="k" className="font-bold tabular-nums">{item.derived.totalCostPerKm.toFixed(3)} €</span>,
        <ActiveBadge key="s" active={item.isActive} />,
      ]}
      editor={
        <form onSubmit={submit}>
          <EditorCard title={editing ? common.edit : common.create} onCancel={() => setEditing(undefined)} pending={save.isPending} submitLabel={common.save}>
            <Field copy={t.fields.name} htmlFor="name"><Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field copy={t.fields.description} htmlFor="desc" optional><Textarea id="desc" rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            {sections.map((section) => (
              <fieldset key={section.key} className="space-y-4 rounded-xl border border-stone-200 p-4">
                <legend className="px-1 text-sm font-bold text-orange-700">{t.sections[section.key]}</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {section.key === "purchase" ? (
                    <Field copy={t.fields.purchaseDate} htmlFor="purchaseDate" optional><Input id="purchaseDate" type="date" value={toDateInput(form.purchaseDate)} onChange={(e) => set("purchaseDate", fromDateInput(e.target.value))} /></Field>
                  ) : null}
                  {section.fields.map((key) => (
                    <Field key={key} copy={t.fields[key]} htmlFor={key}>
                      <NumberInput id={key} min={0} step={integerFields.includes(key) ? "1" : "0.01"} value={form[key]} onChange={(v) => set(key, v ?? 0)} />
                    </Field>
                  ))}
                </div>
              </fieldset>
            ))}
            <CheckboxField id="active" checked={form.isActive} onChange={(checked) => set("isActive", checked)} label={common.active} />
            {editing ? <DerivedList title={common.derived} hint={t.derivedHint} rows={derivedRows(editing.derived)} /> : null}
          </EditorCard>
        </form>
      }
    />
  );
}
