"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { RegisterClientRequest, RegisterDriverRequest, Session } from "@/types/api";
import {
  createRegisterClientSchema,
  createRegisterDriverSchema,
  type RegisterClientValues,
  type RegisterDriverValues,
} from "@/features/auth/schemas";

function home(role: Session["role"]) {
  return role === "Client" ? "/client" : "/driver";
}

export function RegisterForm() {
  const [tab, setTab] = useState<"Client" | "Driver">("Client");
  const router = useRouter();
  const queryClient = useQueryClient();
  const content = useAppContent();
  const locale = useLocale();
  const t = content.auth.register;
  const clientSchema = useMemo(() => createRegisterClientSchema(content.validation), [content.validation]);
  const driverSchema = useMemo(() => createRegisterDriverSchema(content.validation), [content.validation]);
  const clientForm = useForm<RegisterClientValues>({ resolver: zodResolver(clientSchema), defaultValues: { country: "Deutschland" } });
  const driverForm = useForm<RegisterDriverValues>({ resolver: zodResolver(driverSchema) });

  const clientFields = [
    ["companyName", t.fields.companyName],
    ["contactPerson", t.fields.contactPerson],
    ["email", t.fields.email],
    ["password", t.fields.password],
    ["phone", t.fields.phone],
    ["street", t.fields.street],
    ["city", t.fields.city],
    ["postalCode", t.fields.postalCode],
    ["country", t.fields.country],
    ["taxIdNumber", t.fields.taxIdNumber],
  ] as const;

  const mutation = useMutation({
    mutationFn: (body: { role: "Client"; payload: RegisterClientRequest } | { role: "Driver"; payload: RegisterDriverRequest }) =>
      apiFetch<Session>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (session) => {
      queryClient.setQueryData(["session"], session);
      toast.success(t.created);
      router.replace(home(session.role));
      router.refresh();
    },
    onError: (error) => {
      const message = error instanceof ApiError && error.status === 409 ? t.emailInUse
        : error instanceof ApiError && error.problem?.errors?.Password ? content.validation.passwordPolicy
        : t.failed;
      toast.error(message);
    },
  });

  return (
    <Card className="mx-auto max-w-4xl">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </div>
          <LanguageSwitcher label={content.common.languageLabel} locale={locale} mode="cookie" />
        </div>
        <div className="flex gap-2 pt-4">
          <Button variant={tab === "Client" ? "default" : "outline"} onClick={() => setTab("Client")}>{t.clientTab}</Button>
          <Button variant={tab === "Driver" ? "default" : "outline"} onClick={() => setTab("Driver")}>{t.driverTab}</Button>
        </div>
      </CardHeader>
      <CardContent>
        {tab === "Client" ? (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={clientForm.handleSubmit((values) => mutation.mutate({ role: "Client", payload: { ...values, taxIdNumber: values.taxIdNumber || null } }))}>
            {clientFields.map(([name, label]) => (
              <div className="space-y-2" key={name}><label className="text-sm font-bold" htmlFor={`client-${name}`}>{label}</label><Input id={`client-${name}`} type={name === "password" ? "password" : "text"} autoComplete={name === "password" ? "new-password" : undefined} aria-describedby={name === "password" ? "client-password-policy" : undefined} {...clientForm.register(name)} />{name === "password" ? <p id="client-password-policy" className="text-sm text-stone-500">{content.validation.passwordPolicy}</p> : null}{clientForm.formState.errors[name]?.message ? <p className="text-sm text-rose-600">{clientForm.formState.errors[name]?.message}</p> : null}</div>
            ))}
            <div className="md:col-span-2"><Button disabled={mutation.isPending} type="submit">{t.submitClient}</Button></div>
          </form>
        ) : (
          <form className="grid gap-4 md:grid-cols-2" onSubmit={driverForm.handleSubmit((values) => mutation.mutate({ role: "Driver", payload: { ...values, vehicleDescription: values.vehicleDescription || null } }))}>
            <div className="space-y-2"><label className="text-sm font-bold" htmlFor="driver-fullName">{t.fields.fullName}</label><Input id="driver-fullName" {...driverForm.register("fullName")} />{driverForm.formState.errors.fullName ? <p className="text-sm text-rose-600">{driverForm.formState.errors.fullName.message}</p> : null}</div>
            <div className="space-y-2"><label className="text-sm font-bold" htmlFor="driver-email">{t.fields.email}</label><Input id="driver-email" {...driverForm.register("email")} />{driverForm.formState.errors.email ? <p className="text-sm text-rose-600">{driverForm.formState.errors.email.message}</p> : null}</div>
            <div className="space-y-2"><label className="text-sm font-bold" htmlFor="driver-password">{t.fields.password}</label><Input id="driver-password" type="password" autoComplete="new-password" aria-describedby="driver-password-policy" {...driverForm.register("password")} /><p id="driver-password-policy" className="text-sm text-stone-500">{content.validation.passwordPolicy}</p>{driverForm.formState.errors.password ? <p className="text-sm text-rose-600">{driverForm.formState.errors.password.message}</p> : null}</div>
            <div className="space-y-2"><label className="text-sm font-bold" htmlFor="driver-phone">{t.fields.phone}</label><Input id="driver-phone" {...driverForm.register("phone")} />{driverForm.formState.errors.phone ? <p className="text-sm text-rose-600">{driverForm.formState.errors.phone.message}</p> : null}</div>
            <div className="space-y-2 md:col-span-2"><label className="text-sm font-bold" htmlFor="driver-vehicle">{t.fields.vehicleDescription}</label><Textarea id="driver-vehicle" {...driverForm.register("vehicleDescription")} /></div>
            <div className="md:col-span-2"><Button disabled={mutation.isPending} type="submit">{t.submitDriver}</Button></div>
          </form>
        )}
        <p className="mt-6 text-sm text-stone-500">{t.alreadyRegistered} <Link className="font-bold text-orange-600" href="/login">{t.signIn}</Link>.</p>
      </CardContent>
    </Card>
  );
}
