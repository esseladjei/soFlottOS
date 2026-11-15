"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { RegisterClientRequest, Session } from "@/types/api";
import {
  createRegisterClientSchema,
  type RegisterClientValues,
} from "@/features/auth/schemas";

export function RegisterForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const content = useAppContent();
  const locale = useLocale();
  const t = content.auth.register;
  const clientSchema = useMemo(() => createRegisterClientSchema(content.validation), [content.validation]);
  const clientForm = useForm<RegisterClientValues>({ resolver: zodResolver(clientSchema), defaultValues: { country: "Deutschland" } });

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
    mutationFn: (body: { role: "Client"; payload: RegisterClientRequest }) =>
      apiFetch<Session>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: (session) => {
      queryClient.setQueryData(["session"], session);
      toast.success(t.created);
      router.replace("/client");
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
      </CardHeader>
      <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={clientForm.handleSubmit((values) => mutation.mutate({ role: "Client", payload: { ...values, taxIdNumber: values.taxIdNumber || null } }))}>
            {clientFields.map(([name, label]) => (
              <div className="space-y-2" key={name}><label className="text-sm font-bold" htmlFor={`client-${name}`}>{label}</label><Input id={`client-${name}`} type={name === "password" ? "password" : "text"} autoComplete={name === "password" ? "new-password" : undefined} aria-describedby={name === "password" ? "client-password-policy" : undefined} {...clientForm.register(name)} />{name === "password" ? <p id="client-password-policy" className="text-sm text-stone-500">{content.validation.passwordPolicy}</p> : null}{clientForm.formState.errors[name]?.message ? <p className="text-sm text-rose-600">{clientForm.formState.errors[name]?.message}</p> : null}</div>
            ))}
            <div className="md:col-span-2"><Button disabled={mutation.isPending} type="submit">{t.submitClient}</Button></div>
          </form>
        <p className="mt-6 text-sm text-stone-500">{t.alreadyRegistered} <Link className="font-bold text-orange-600" href="/login">{t.signIn}</Link>.</p>
      </CardContent>
    </Card>
  );
}
