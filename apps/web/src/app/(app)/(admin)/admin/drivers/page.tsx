"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FormEvent } from "react";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { useCreateDriver, useDrivers } from "@/features/admin/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function AdminDriversPage() {
  const drivers = useDrivers();
  const createDriver = useCreateDriver();
  const content = useAppContent();
  const t = content.admin.drivers;
  const { formatCurrency } = useFormatters();
  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    createDriver.mutate({
      fullName: String(form.get("fullName")),
      email: String(form.get("email")),
      password: String(form.get("password")),
      phone: String(form.get("phone")),
      vehicleDescription: String(form.get("vehicleDescription")) || null,
    }, { onSuccess: () => formElement.reset() });
  };
  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />
    <Card><CardHeader><CardTitle>{t.createTitle}</CardTitle></CardHeader><CardContent>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={create}>
        <div className="space-y-2"><label className="text-sm font-bold" htmlFor="fullName">{t.fields.fullName}</label><Input id="fullName" name="fullName" required maxLength={150} /></div>
        <div className="space-y-2"><label className="text-sm font-bold" htmlFor="email">{t.fields.email}</label><Input id="email" name="email" type="email" required maxLength={255} /></div>
        <div className="space-y-2"><label className="text-sm font-bold" htmlFor="password">{t.fields.password}</label><Input id="password" name="password" type="password" required minLength={12} maxLength={128} autoComplete="new-password" /></div>
        <div className="space-y-2"><label className="text-sm font-bold" htmlFor="phone">{t.fields.phone}</label><Input id="phone" name="phone" type="tel" required maxLength={50} /></div>
        <div className="space-y-2 md:col-span-2"><label className="text-sm font-bold" htmlFor="vehicleDescription">{t.fields.vehicleDescription}</label><Input id="vehicleDescription" name="vehicleDescription" maxLength={150} /></div>
        {createDriver.isError ? <p role="alert" className="text-sm text-rose-600 md:col-span-2">{createDriver.error.message || content.common.requestFailed}</p> : null}
        <div className="md:col-span-2"><Button type="submit" disabled={createDriver.isPending}>{createDriver.isPending ? content.common.loading : t.create}</Button></div>
      </form>
    </CardContent></Card>
    {drivers.isLoading ? <LoadingState /> : null}<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{drivers.data?.map((driver) => <Card key={driver.userId}><CardHeader><CardTitle>{driver.fullName}</CardTitle></CardHeader><CardContent className="space-y-2 text-sm"><p className="font-bold">{content.enums.availability[driver.availability]}</p><p>{driver.email}</p><p>{driver.phone ?? t.noPhone}</p><p>{driver.vehicleDescription ?? t.noVehicle}</p><p>{t.workload(driver.activeJobs, driver.completedJobs)}</p><p>{t.revenue}: <strong>{formatCurrency(driver.revenueGenerated)}</strong></p></CardContent></Card>)}</div></div>;
}
