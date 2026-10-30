"use client";

import { useState, type FormEvent } from "react";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useBookingAvailability, useSaveBookingAvailability } from "@/features/booking-availability/hooks";
import { useAppContent } from "@/i18n/locale-provider";
import type { BookingAvailability, BookingWindow, SaveBookingAvailabilityRequest } from "@/types/api";

function AvailabilityEditor({ initial }: { initial: BookingAvailability }) {
  const content = useAppContent();
  const t = content.bookingAvailability;
  const save = useSaveBookingAvailability();
  const [settings, setSettings] = useState<SaveBookingAvailabilityRequest>({
    scheduleEnabled: initial.scheduleEnabled,
    isBusy: initial.isBusy,
    windows: initial.windows,
  });
  const updateWindow = (index: number, changes: Partial<BookingWindow>) => {
    setSettings((current) => ({
      ...current,
      windows: current.windows.map((window, row) => row === index ? { ...window, ...changes } : window),
    }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    save.mutate(settings);
  };
  return (
    <Card><CardContent className="pt-6">
      <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={save.isPending} className="space-y-6">
          <label className="flex items-center gap-3 font-bold">
            <input type="checkbox" checked={settings.isBusy} onChange={(event) => setSettings({ ...settings, isBusy: event.target.checked })} />
            {t.busy}
          </label>
          <label className="flex items-center gap-3 font-bold">
            <input type="checkbox" checked={settings.scheduleEnabled} onChange={(event) => setSettings({ ...settings, scheduleEnabled: event.target.checked })} />
            {t.scheduleEnabled}
          </label>
          <p className="text-sm text-stone-600" id="hours-hint">{t.hoursHint}</p>
          <div className="space-y-4" aria-describedby="hours-hint">
            {settings.windows.map((window, index) => (
              <div key={index} className="grid items-end gap-3 rounded-xl border p-4 sm:grid-cols-4">
                <label className="space-y-2 text-sm font-bold">{t.day}
                  <Select value={window.dayOfWeek} onChange={(event) => updateWindow(index, { dayOfWeek: Number(event.target.value) })}>
                    {t.days.map((day, value) => <option key={day} value={value}>{day}</option>)}
                  </Select>
                </label>
                <label className="space-y-2 text-sm font-bold">{t.start}
                  <Input type="time" required step={60} value={window.startTime} onChange={(event) => updateWindow(index, { startTime: event.target.value })} />
                </label>
                <label className="space-y-2 text-sm font-bold">{t.end}
                  <Input required pattern="([01][0-9]|2[0-3]):[0-5][0-9]|24:00" placeholder="18:00" value={window.endTime} onChange={(event) => updateWindow(index, { endTime: event.target.value })} />
                </label>
                <Button type="button" variant="outline" onClick={() => setSettings({ ...settings, windows: settings.windows.filter((_, row) => row !== index) })}>{t.remove}</Button>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" disabled={settings.windows.length >= 28} onClick={() => setSettings({ ...settings, windows: [...settings.windows, { dayOfWeek: 1, startTime: "09:00", endTime: "18:00" }] })}>{t.add}</Button>
        </fieldset>
        {save.isError ? <p role="alert" className="text-sm text-rose-600">{save.error.message || content.common.requestFailed}</p> : null}
        <Button type="submit" disabled={save.isPending}>{save.isPending ? content.common.loading : t.save}</Button>
      </form>
    </CardContent></Card>
  );
}

export default function AdminAvailabilityPage() {
  const availability = useBookingAvailability();
  const content = useAppContent();
  const t = content.bookingAvailability;
  return (
    <div className="space-y-8">
      <PageHeader title={t.title} description={t.description} />
      {availability.isLoading ? <LoadingState /> : null}
      {availability.isError ? <div role="alert" className="space-y-3">
        <p className="text-rose-600">{availability.error.message || content.common.requestFailed}</p>
        <Button variant="outline" onClick={() => availability.refetch()}>{content.common.tryAgain}</Button>
      </div> : null}
      {availability.data ? <AvailabilityEditor initial={availability.data} /> : null}
    </div>
  );
}
