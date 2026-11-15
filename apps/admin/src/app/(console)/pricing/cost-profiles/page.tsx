"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActiveBadge, ConfigPage, EditorCard } from "@/features/pricing/components/config-page";
import { Field, HintBox } from "@/features/pricing/components/field";
import { CheckboxField, EnumOptions, IdSelect, NumberInput } from "@/features/pricing/components/inputs";
import { useCostItems, useCostProfiles, useLabourProfiles, useSaveCostProfile, useVehicleProfiles } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { businessUnits, riskAllowanceMethods, type CostProfile, type SaveCostProfileRequest } from "@/types/api";

const empty: SaveCostProfileRequest = { name: "", description: "", businessUnit: "Express", vehicleProfileId: null, labourProfileId: null, riskAllowanceMethod: "PercentageOfTotalCosts", riskAllowanceValue: 5, costItemIds: [], isActive: true };

export default function CostProfilesPage() {
  const content = useAppContent();
  const t = content.pricing.costProfiles;
  const common = content.pricing.common;
  const enums = content.pricing.enums;
  const { formatCurrency } = useFormatters();
  const profiles = useCostProfiles();
  const vehicles = useVehicleProfiles();
  const labour = useLabourProfiles();
  const items = useCostItems();
  const save = useSaveCostProfile();
  const [editing, setEditing] = useState<CostProfile | null | undefined>(undefined);
  const [form, setForm] = useState<SaveCostProfileRequest>(empty);

  const open = (item: CostProfile | null) => { setEditing(item); setForm(item ? { ...item } : empty); };
  const set = <K extends keyof SaveCostProfileRequest>(key: K, value: SaveCostProfileRequest[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleItem = (id: number) => set("costItemIds", form.costItemIds.includes(id) ? form.costItemIds.filter((x) => x !== id) : [...form.costItemIds, id]);
  const submit = (event: React.FormEvent) => { event.preventDefault(); save.mutate({ id: editing?.id, payload: form }, { onSuccess: () => setEditing(undefined) }); };

  const selectableItems = (items.data ?? []).filter((item) => item.isActive && (item.businessUnit == null || item.businessUnit === form.businessUnit));

  return (
    <ConfigPage<CostProfile>
      title={t.title}
      description={t.description}
      intro={<HintBox>{t.fields.costItems.hint}</HintBox>}
      listTitle={t.title}
      items={profiles.data}
      isLoading={profiles.isLoading}
      editing={editing}
      onCreate={() => open(null)}
      onEdit={open}
      columns={[t.fields.name.label, t.fields.businessUnit.label, t.fields.vehicleProfile.label, t.fields.labourProfile.label, t.fields.riskAllowanceMethod.label, t.fields.costItems.label, common.status]}
      renderRow={(item) => [
        <span key="n" className="font-semibold">{item.name}<span className="block text-xs font-normal text-stone-500">{common.version} {item.version}</span></span>,
        enums.businessUnit[item.businessUnit],
        item.vehicleProfileName ?? <span className="text-stone-400">{t.none}</span>,
        item.labourProfileName ?? <span className="text-stone-400">{t.none}</span>,
        <span key="r">{enums.riskMethod[item.riskAllowanceMethod]} <span className="text-stone-500">({item.riskAllowanceMethod === "FixedAmount" ? formatCurrency(item.riskAllowanceValue) : item.riskAllowanceMethod === "None" ? "—" : `${item.riskAllowanceValue} %`})</span></span>,
        <Badge key="i" variant="neutral">{t.itemsSelected(item.costItemIds.length)}</Badge>,
        <ActiveBadge key="s" active={item.isActive} />,
      ]}
      editor={
        <form onSubmit={submit}>
          <EditorCard title={editing ? common.edit : common.create} onCancel={() => setEditing(undefined)} pending={save.isPending} submitLabel={common.save}>
            <Field copy={t.fields.name} htmlFor="name"><Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field copy={t.fields.businessUnit} htmlFor="bu">
                <Select id="bu" value={form.businessUnit} onChange={(e) => set("businessUnit", e.target.value as SaveCostProfileRequest["businessUnit"])}><EnumOptions values={businessUnits} labels={enums.businessUnit} /></Select>
              </Field>
              <Field copy={t.fields.riskAllowanceMethod} htmlFor="risk">
                <Select id="risk" value={form.riskAllowanceMethod} onChange={(e) => set("riskAllowanceMethod", e.target.value as SaveCostProfileRequest["riskAllowanceMethod"])}><EnumOptions values={riskAllowanceMethods} labels={enums.riskMethod} /></Select>
              </Field>
              <Field copy={t.fields.riskAllowanceValue} htmlFor="riskValue"><NumberInput id="riskValue" min={0} value={form.riskAllowanceValue} onChange={(v) => set("riskAllowanceValue", v ?? 0)} /></Field>
              <Field copy={t.fields.vehicleProfile} htmlFor="vehicle" optional>
                <IdSelect id="vehicle" value={form.vehicleProfileId} onChange={(v) => set("vehicleProfileId", v)} options={(vehicles.data ?? []).filter((v) => v.isActive)} emptyLabel={t.none} />
              </Field>
              <Field copy={t.fields.labourProfile} htmlFor="labour" optional>
                <IdSelect id="labour" value={form.labourProfileId} onChange={(v) => set("labourProfileId", v)} options={(labour.data ?? []).filter((l) => l.isActive)} emptyLabel={t.none} />
              </Field>
            </div>
            <Field copy={t.fields.costItems}>
              <div className="max-h-72 space-y-1 overflow-y-auto rounded-xl border border-stone-200 p-3">
                {selectableItems.length === 0 ? <p className="text-sm text-stone-500">{common.noData}</p> : null}
                {selectableItems.map((item) => (
                  <label key={item.id} className="flex cursor-pointer items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm hover:bg-stone-50">
                    <span className="flex items-center gap-2">
                      <input type="checkbox" className="size-4 accent-orange-500" checked={form.costItemIds.includes(item.id)} onChange={() => toggleItem(item.id)} />
                      <span>{item.name} <span className="text-stone-400">· {item.costCategoryName}</span></span>
                    </span>
                    <span className="tabular-nums text-stone-600">{item.unitCost != null ? `${formatCurrency(item.unitCost)} / ${enums.allocationMethod[item.allocationMethod]}` : formatCurrency(item.amount)}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-stone-500">{t.itemsSelected(form.costItemIds.length)}</p>
            </Field>
            <Field copy={t.fields.description} htmlFor="desc" optional><Textarea id="desc" rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            <CheckboxField id="active" checked={form.isActive} onChange={(checked) => set("isActive", checked)} label={common.active} />
          </EditorCard>
        </form>
      }
    />
  );
}
