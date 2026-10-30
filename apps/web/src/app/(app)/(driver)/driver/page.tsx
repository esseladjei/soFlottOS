"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState, LoadingState, PageHeader } from "@/components/layout/states";
import { useDriverJobs, useDriverProfile, useUpdateAvailability } from "@/features/driver/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";

export default function DriverHomePage() {
  const profile = useDriverProfile();
  const jobs = useDriverJobs();
  const updateAvailability = useUpdateAvailability();
  const content = useAppContent();
  const t = content.driver.home;
  const { formatDate } = useFormatters();

  return <div className="space-y-8"><PageHeader title={t.title} description={t.description} />{profile.isLoading || jobs.isLoading ? <LoadingState /> : null}{profile.data ? <Card><CardHeader><CardTitle>{t.availabilityTitle}</CardTitle></CardHeader><CardContent className="flex flex-wrap items-center gap-3"><span className="rounded-full bg-stone-100 px-4 py-2 font-bold">{content.enums.availability[profile.data.availability]}</span>{profile.data.availability === "Busy" ? <p className="text-sm text-stone-600">{t.busyNote}</p> : <><Button disabled={profile.data.availability === "Online" || updateAvailability.isPending} onClick={() => updateAvailability.mutate({ availability: "Online" })}>{t.goOnline}</Button><Button variant="outline" disabled={profile.data.availability === "Offline" || updateAvailability.isPending} onClick={() => updateAvailability.mutate({ availability: "Offline" })}>{t.goOffline}</Button></>}</CardContent></Card> : null}{jobs.data?.length === 0 ? <EmptyState title={t.emptyTitle} description={t.emptyDescription} /> : <div className="grid gap-4">{jobs.data?.map((job) => <Card key={job.id}><CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-bold">{t.orderLabel(job.id)} · {content.enums.orderStatus[job.status]}</p><p className="text-sm text-stone-600">{job.pickupAddress} → {job.dropoffAddress}</p><p className="text-xs text-stone-500">{t.created(formatDate(job.createdAt))}</p></div><Link href={`/driver/jobs/${job.id}`}><Button>{t.openRun}</Button></Link></CardContent></Card>)}</div>}</div>;
}
