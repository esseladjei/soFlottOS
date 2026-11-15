"use client";

import type { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

/** Generic helper to build `<option>`s from an enum label map. */
export function EnumOptions<T extends string>({ values, labels, emptyLabel }: { values: readonly T[]; labels: Record<T, string>; emptyLabel?: string }) {
  return (
    <>
      {emptyLabel !== undefined ? <option value="">{emptyLabel}</option> : null}
      {values.map((value) => <option key={value} value={value}>{labels[value]}</option>)}
    </>
  );
}

/** Number input that keeps `""` while typing and converts to a number (or null) on change. */
export function NumberInput({ id, value, onChange, step = "0.01", min, nullable, placeholder }: {
  id?: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  step?: string;
  min?: number;
  nullable?: boolean;
  placeholder?: string;
}) {
  const handle = (event: ChangeEvent<HTMLInputElement>) => {
    const raw = event.target.value;
    if (raw === "") {
      onChange(nullable ? null : 0);
      return;
    }
    const parsed = Number(raw);
    if (!Number.isNaN(parsed)) onChange(parsed);
  };
  return <Input id={id} type="number" inputMode="decimal" step={step} min={min} value={value ?? ""} onChange={handle} placeholder={placeholder} />;
}

export function CheckboxField({ id, checked, onChange, label }: { id: string; checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-stone-800">
      <input id={id} type="checkbox" className="size-4 accent-orange-500" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      {label}
    </label>
  );
}

export function IdSelect({ id, value, onChange, options, emptyLabel }: {
  id?: string;
  value: number | null | undefined;
  onChange: (value: number | null) => void;
  options: { id: number; name: string }[];
  emptyLabel: string;
}) {
  return (
    <Select id={id} value={value ?? ""} onChange={(event) => onChange(event.target.value === "" ? null : Number(event.target.value))}>
      <option value="">{emptyLabel}</option>
      {options.map((option) => <option key={option.id} value={option.id}>{option.name}</option>)}
    </Select>
  );
}

export function percent(value: number, digits = 1): string {
  return `${value.toFixed(digits)} %`;
}

/** Trims an ISO datetime to the `yyyy-MM-dd` format needed by `<input type="date">`. */
export function toDateInput(value: string | null | undefined): string {
  return value ? value.slice(0, 10) : "";
}

export function fromDateInput(value: string): string | null {
  return value === "" ? null : value;
}
