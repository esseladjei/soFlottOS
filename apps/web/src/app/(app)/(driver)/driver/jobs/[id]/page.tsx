"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingState, PageHeader } from "@/components/layout/states";
import { SignaturePad } from "@/features/driver/components/signature-pad";
import { createPodSchema, type PodFormValues } from "@/features/driver/schemas";
import { useDriverJob, useStartJob, useSubmitPod } from "@/features/driver/hooks";
import { useAppContent } from "@/i18n/locale-provider";

type GpsPoint = { latitude: number; longitude: number };

export default function DriverJobPage() {
  const id = Number(useParams<{ id: string }>().id);
  const job = useDriverJob(id);
  const startJob = useStartJob(id);
  const pod = useSubmitPod(id);
  const content = useAppContent();
  const t = content.driver.job;
  const schema = useMemo(() => createPodSchema(content.validation), [content.validation]);
  const form = useForm<PodFormValues>({ resolver: zodResolver(schema) });
  const [signature, setSignature] = useState<string | null>(null);
  const [gps, setGps] = useState<GpsPoint | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const captureGps = () => {
    setGpsError(null);
    if (!navigator.geolocation) {
      setGpsError(t.noGeolocation);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => setGps({ latitude: position.coords.latitude, longitude: position.coords.longitude }),
      () => setGpsError(t.permissionDenied),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const submit = form.handleSubmit((values) => {
    if (!signature) { setGpsError(t.signatureRequired); return; }
    if (!gps) { setGpsError(t.gpsRequired); return; }
    pod.mutate({ recipientName: values.recipientName, signatureDataUrl: signature, gpsLatitude: gps.latitude, gpsLongitude: gps.longitude });
  });

  if (job.isLoading || !job.data) return <LoadingState />;
  const origin = job.data.pickupLat != null && job.data.pickupLng != null
    ? `${job.data.pickupLat},${job.data.pickupLng}`
    : job.data.pickupAddress;
  const destination = job.data.dropoffLat != null && job.data.dropoffLng != null
    ? `${job.data.dropoffLat},${job.data.dropoffLng}`
    : job.data.dropoffAddress;
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;

  return <div className="space-y-8"><PageHeader title={t.title(job.data.id)} description={`${job.data.pickupAddress} → ${job.data.dropoffAddress}`} action={<a href={mapsUrl} target="_blank" rel="noreferrer"><Button variant="outline">{t.openMaps}</Button></a>} /><div className="grid gap-4 md:grid-cols-2"><Card><CardHeader><CardTitle>{t.addressesTitle}</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p><strong>{t.pickup}:</strong> {job.data.pickupAddress}<br />{job.data.pickupContactName ?? ""} {job.data.pickupPhone ?? ""}</p><p><strong>{t.dropoff}:</strong> {job.data.dropoffAddress}<br />{job.data.dropoffContactName ?? ""} {job.data.dropoffPhone ?? ""}</p><p>{t.instructions}: {job.data.specialInstructions ?? content.common.none}</p><Button disabled={job.data.status !== "Assigned" || startJob.isPending} onClick={() => startJob.mutate()}>{t.startTransit}</Button></CardContent></Card><Card><CardHeader><CardTitle>{t.podTitle}</CardTitle></CardHeader><CardContent><form className="space-y-4" onSubmit={submit}><div className="space-y-2"><label htmlFor="recipientName" className="text-sm font-bold">{t.recipientName}</label><Input id="recipientName" {...form.register("recipientName")} />{form.formState.errors.recipientName ? <p className="text-sm text-rose-600">{form.formState.errors.recipientName.message}</p> : null}</div><SignaturePad onChange={setSignature} /><div className="flex flex-wrap items-center gap-3"><Button type="button" variant="outline" onClick={captureGps}>{t.captureGps}</Button>{gps ? <span className="text-sm text-green-700">{t.gpsCaptured(gps.latitude.toFixed(5), gps.longitude.toFixed(5))}</span> : null}</div>{gpsError ? <p className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700">{gpsError}</p> : null}<Button type="submit" disabled={pod.isPending}>{t.submitPod}</Button></form></CardContent></Card></div></div>;
}
