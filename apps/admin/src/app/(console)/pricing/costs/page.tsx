"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ActiveBadge, ConfigPage, EditorCard } from "@/features/pricing/components/config-page";
import { Field, HintBox } from "@/features/pricing/components/field";
import { CheckboxField, EnumOptions, NumberInput, fromDateInput, toDateInput } from "@/features/pricing/components/inputs";
import { useCostCategories, useCostItems, useSaveCostCategory, useSaveCostItem } from "@/features/pricing/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { allocationMethods, businessUnits, costFrequencies, costTypes, type CostCategory, type CostItem, type SaveCostCategoryRequest, type SaveCostItemRequest } from "@/types/api";

const emptyItem = (categoryId: number): SaveCostItemRequest => ({
  name: "", description: "", costCategoryId: categoryId, businessUnit: null, costType: "Fixed", amount: 0, frequency: "Monthly",
  allocationMethod: "PerKilometre", allocationDenominator: null, effectiveFrom: null, effectiveTo: null, isActive: true, currency: "EUR",
});

export default function CostItemsPage() {
  const content = useAppContent();
  const t = content.pricing.costs;
  const enums = content.pricing.enums;
  const common = content.pricing.common;
  const { formatCurrency } = useFormatters();

  const categories = useCostCategories();
  const items = useCostItems();
  const saveCategory = useSaveCostCategory();
  const saveItem = useSaveCostItem();

  const [editing, setEditing] = useState<CostItem | null | undefined>(undefined);
  const [form, setForm] = useState<SaveCostItemRequest>(emptyItem(0));
  const [categoryForm, setCategoryForm] = useState<SaveCostCategoryRequest | null>(null);
  const [editingCategoryId, setEditingCategoryId] = useState<number | undefined>(undefined);

  const open = (item: CostItem | null) => {
    setEditing(item);
    setForm(item ? { ...item } : emptyItem(categories.data?.[0]?.id ?? 0));
  };
  const set = <K extends keyof SaveCostItemRequest>(key: K, value: SaveCostItemRequest[K]) => setForm((prev) => ({ ...prev, [key]: value }));
  const needsDenominator = form.allocationMethod !== "WholeAmount";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    saveItem.mutate({ id: editing?.id, payload: form }, { onSuccess: () => setEditing(undefined) });
  };

  const submitCategory = (event: React.FormEvent) => {
    event.preventDefault();
    if (!categoryForm) return;
    saveCategory.mutate({ id: editingCategoryId, payload: categoryForm }, { onSuccess: () => { setCategoryForm(null); setEditingCategoryId(undefined); } });
  };

  const openCategory = (category: CostCategory | null) => {
    setEditingCategoryId(category?.id);
    setCategoryForm(category ? { name: category.name, description: category.description, businessUnit: category.businessUnit, isActive: category.isActive } : { name: "", description: "", businessUnit: null, isActive: true });
  };

  const categoriesCard = (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{t.categoriesTitle}</CardTitle>
          <p className="mt-1 text-sm text-stone-600">{t.categoriesHint}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => openCategory(null)}><Plus aria-hidden className="mr-1 size-3.5" />{common.newEntry}</Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {categories.data?.map((category) => (
            <button key={category.id} type="button" onClick={() => openCategory(category)} className="rounded-full border border-stone-300 bg-white px-3 py-1 text-sm hover:border-orange-400">
              {category.name} <span className="text-stone-400">· {category.itemCount} {t.columns.items}</span>
              {!category.isActive ? <span className="ml-1 text-stone-400">({common.inactive})</span> : null}
            </button>
          ))}
        </div>
        {categoryForm ? (
          <form onSubmit={submitCategory} className="grid gap-4 rounded-xl border border-stone-200 p-4 sm:grid-cols-2">
            <Field copy={t.fields.name} htmlFor="cat-name"><Input id="cat-name" required value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} /></Field>
            <Field copy={t.fields.businessUnit} htmlFor="cat-bu" optional>
              <Select id="cat-bu" value={categoryForm.businessUnit ?? ""} onChange={(e) => setCategoryForm({ ...categoryForm, businessUnit: e.target.value === "" ? null : (e.target.value as SaveCostCategoryRequest["businessUnit"]) })}>
                <EnumOptions values={businessUnits} labels={enums.businessUnit} emptyLabel={t.allUnits} />
              </Select>
            </Field>
            <Field copy={t.fields.description} htmlFor="cat-desc" optional className="sm:col-span-2"><Textarea id="cat-desc" rows={2} value={categoryForm.description ?? ""} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} /></Field>
            <CheckboxField id="cat-active" checked={categoryForm.isActive} onChange={(checked) => setCategoryForm({ ...categoryForm, isActive: checked })} label={t.fields.isActive.label} />
            <div className="flex gap-2 sm:justify-end">
              <Button type="submit" size="sm" disabled={saveCategory.isPending}>{common.save}</Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setCategoryForm(null)}>{common.cancel}</Button>
            </div>
          </form>
        ) : null}
      </CardContent>
    </Card>
  );

  return (
    <ConfigPage<CostItem>
      title={t.title}
      description={t.description}
      intro={<HintBox>{t.itemsHint}</HintBox>}
      extra={categoriesCard}
      listTitle={t.itemsTitle}
      items={items.data}
      isLoading={items.isLoading}
      editing={editing}
      onCreate={() => open(null)}
      onEdit={open}
      columns={[t.fields.name.label, t.fields.category.label, t.fields.costType.label, t.fields.amount.label, t.columns.annual, t.fields.allocationMethod.label, t.columns.unitCost, common.status]}
      renderRow={(item) => [
        <span key="n" className="font-semibold">{item.name}{item.businessUnit ? <span className="block text-xs font-normal text-stone-500">{enums.businessUnit[item.businessUnit]}</span> : null}</span>,
        item.costCategoryName,
        <Badge key="t" variant={item.costType === "Variable" ? "info" : "neutral"}>{enums.costType[item.costType]}</Badge>,
        <span key="a" className="tabular-nums">{formatCurrency(item.amount)} <span className="text-stone-500">/ {enums.costFrequency[item.frequency]}</span></span>,
        <span key="y" className="tabular-nums">{item.annualAmount != null ? formatCurrency(item.annualAmount) : "—"}</span>,
        enums.allocationMethod[item.allocationMethod],
        <span key="u" className="tabular-nums">{item.unitCost != null ? formatCurrency(item.unitCost) : "—"}</span>,
        <ActiveBadge key="s" active={item.isActive} />,
      ]}
      editor={
        <form onSubmit={submit}>
          <EditorCard title={editing ? common.edit : common.create} onCancel={() => setEditing(undefined)} pending={saveItem.isPending} submitLabel={common.save}>
            <Field copy={t.fields.name} htmlFor="name"><Input id="name" required value={form.name} onChange={(e) => set("name", e.target.value)} /></Field>
            <Field copy={t.fields.category} htmlFor="category">
              <Select id="category" required value={form.costCategoryId || ""} onChange={(e) => set("costCategoryId", Number(e.target.value))}>
                <option value="">—</option>
                {categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field copy={t.fields.businessUnit} htmlFor="bu" optional>
                <Select id="bu" value={form.businessUnit ?? ""} onChange={(e) => set("businessUnit", e.target.value === "" ? null : (e.target.value as SaveCostItemRequest["businessUnit"]))}>
                  <EnumOptions values={businessUnits} labels={enums.businessUnit} emptyLabel={t.allUnits} />
                </Select>
              </Field>
              <Field copy={t.fields.costType} htmlFor="type">
                <Select id="type" value={form.costType} onChange={(e) => set("costType", e.target.value as SaveCostItemRequest["costType"])}><EnumOptions values={costTypes} labels={enums.costType} /></Select>
              </Field>
              <Field copy={t.fields.amount} htmlFor="amount"><NumberInput id="amount" min={0} value={form.amount} onChange={(v) => set("amount", v ?? 0)} /></Field>
              <Field copy={t.fields.frequency} htmlFor="freq">
                <Select id="freq" value={form.frequency} onChange={(e) => set("frequency", e.target.value as SaveCostItemRequest["frequency"])}><EnumOptions values={costFrequencies} labels={enums.costFrequency} /></Select>
              </Field>
              <Field copy={t.fields.allocationMethod} htmlFor="alloc">
                <Select id="alloc" value={form.allocationMethod} onChange={(e) => set("allocationMethod", e.target.value as SaveCostItemRequest["allocationMethod"])}><EnumOptions values={allocationMethods} labels={enums.allocationMethod} /></Select>
              </Field>
              {needsDenominator ? (
                <Field copy={t.fields.allocationDenominator} htmlFor="denom"><NumberInput id="denom" min={0} step="1" nullable value={form.allocationDenominator} onChange={(v) => set("allocationDenominator", v)} /></Field>
              ) : null}
              <Field copy={t.fields.effectiveFrom} htmlFor="from" optional><Input id="from" type="date" value={toDateInput(form.effectiveFrom)} onChange={(e) => set("effectiveFrom", fromDateInput(e.target.value))} /></Field>
              <Field copy={t.fields.effectiveTo} htmlFor="to" optional><Input id="to" type="date" value={toDateInput(form.effectiveTo)} onChange={(e) => set("effectiveTo", fromDateInput(e.target.value))} /></Field>
            </div>
            <Field copy={t.fields.description} htmlFor="desc" optional><Textarea id="desc" rows={2} value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} /></Field>
            <CheckboxField id="active" checked={form.isActive} onChange={(checked) => set("isActive", checked)} label={t.fields.isActive.label} />
          </EditorCard>
        </form>
      }
    />
  );
}
