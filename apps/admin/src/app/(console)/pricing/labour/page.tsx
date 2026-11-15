"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActiveBadge, ConfigPage, DerivedList, EditorCard } from "@/features/pricing/components/config-page";
import { Field, HintBox } from "@/features/pricing/components/field";
import { CheckboxField, EnumOptions, NumberInput } from "@/features/pricing/components/inputs";
import { useLabourProfiles, useSaveLabourProfile } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { businessUnits, type LabourCostSummary, type LabourProfile, type SaveLabourProfileRequest } from "@/types/api";

type NumericKey = "annualGrossSalary" | "employerContributionPercent" | "annualAdditionalCosts" | "paidHoursPerWeek" | "annualLeaveDays" | "publicHolidayDays" | "trainingAndSickDays" | "billableUtilisationPercent";
const numericFields: NumericKey[] = ["annualGrossSalary", "employerContributionPercent", "annualAdditionalCosts", "paidHoursPerWeek", "annualLeaveDays", "publicHolidayDays", "trainingAndSickDays", "billableUtilisationPercent"];

const empty: SaveLabourProfileRequest = {
  name: "", description: "", businessUnit: "Express", resourceType: "Driver", annualGrossSalary: 36000, employerContributionPercent: 21, annualAdditionalCosts: 0,
  paidHoursPerWeek: 40, annualLeaveDays: 28, publicHolidayDays: 11, trainingAndSickDays: 10, billableUtilisationPercent: 80, isActive: true,
};

export default function LabourPage() {
  const content = useAppContent();
  const t = content.pricing.labour;
  const common = content.pricing.common;
  const enums = content.pricing.enums;
  const { formatCurrency } = useFormatters();
  const profiles = useLabourProfiles();
  const save = useSaveLabourProfile();
  const [editing, setEditing] = useState<LabourProfile | null | undefined>(undefined);
  const [form, setForm] = useState<SaveLabourProfileRequest>(empty);

  const open = (item: LabourProfile | null) => { setEditing(item); setForm(item ? { ...item } : empty); };
  const set = <K extends keyof SaveLabourProfileRequest>(key: K, value: SaveLabourProfileRequest[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: editing?.id, payload: form }, { onSuccess: () => setEditing(undefined) }); };

  const derivedRows = (derived: LabourCostSummary): [string, string][] =>
    (Object.keys(t.derived) as (keyof LabourCostSummary)[]).map((key) => [t.derived[key], key.endsWith("HoursPerYear") ? `${Math.round(derived[key]).toLocaleString()} h` : formatCurrency(derived[key])]);

  return (
    <ConfigPage<LabourProfile>
      title={t.title}
      description={t.description}
      intro={<HintBox>{t.derivedHint}</HintBox>}
      listTitle={t.title}
      items={profiles.data}
      isLoading={profiles.isLoading}
      editing={editing}
      onCreate={() => open(null)}
      onEdit={open}
      columns={[t.fields.name.label, t.fields.businessUnit.label, t.derived.annualEmploymentCost, t.derived.productiveHoursPerYear, t.derived.costPerProductiveHour, common.status]}
      renderRow={(item) => [
        <span key="n" className="font-semibold">{item.name}<span className="block text-xs font-normal text-stone-500">{item.resourceType}</span></span>,
        enums.businessUnit[item.businessUnit],
        <span key="a" className="tabular-nums">{formatCurrency(item.derived.annualEmploymentCost)}</span>,
        <span key="h" className="tabular-nums">{Math.round(item.derived.productiveHoursPerYear).toLocaleString()} h</span>,
        <span key="c" className="font-bold tabular-nums">{formatCurrency(item.derived.costPerProductiveHour)} / h</span>,
        <ActiveBadge key="s" active={item.isActive} />,
      ]}
      editor={
        <form onSubmit={submit}>
          <EditorCard title={editing ? common.edit : common.create} onCancel={() => setEditing(undefined)} pending={save.isPending} submitLabel={common.save}>
            <Field copy={t.fields.name} htmlFor="name"><Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field copy={t.fields.businessUnit} htmlFor="bu">
                <Select id="bu" value={form.businessUnit} onChange={(e) => set("businessUnit", e.target.value as SaveLabourProfileRequest["businessUnit"])}><EnumOptions values={businessUnits} labels={enums.businessUnit} /></Select>
              </Field>
              <Field copy={t.fields.resourceType} htmlFor="rt"><Input id="rt" required value={form.resourceType} onChange={(e) => set("resourceType", e.target.value)} /></Field>
              {numericFields.map((key) => (
                <Field key={key} copy={t.fields[key]} htmlFor={key}>
                  <NumberInput id={key} min={0} step={key.includes("Percent") || key === "annualGrossSalary" || key === "annualAdditionalCosts" ? "0.01" : "0.5"} value={form[key]} onChange={(v) => set(key, v ?? 0)} />
                </Field>
              ))}
            </div>
            <Field copy={t.fields.description} htmlFor="desc" optional><Textarea id="desc" rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            <CheckboxField id="active" checked={form.isActive} onChange={(checked) => set("isActive", checked)} label={common.active} />
            {editing ? <DerivedList title={common.derived} hint={t.derivedHint} rows={derivedRows(editing.derived)} /> : null}
          </EditorCard>
        </form>
      }
    />
  );
}
