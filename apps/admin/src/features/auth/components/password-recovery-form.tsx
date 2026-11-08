"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { AppContent } from "@/content/app/types";
import {
  createForgotPasswordSchema,
  createResetPasswordSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
} from "@/features/auth/schemas";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { ApiError, apiFetch } from "@/lib/api/client";
import type { ResetPasswordRequest } from "@/types/api";

function recoveryError(error: unknown, t: AppContent["auth"]["recovery"], reset = false) {
  if (error instanceof ApiError) {
    if (error.status === 400) return reset ? t.invalidLink : t.failed;
    if (error.status === 429) return t.rateLimited;
    if (error.status === 502 || error.status === 503) return t.unavailable;
  }
  return t.failed;
}

function RecoveryCard({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const content = useAppContent();
  const locale = useLocale();
  return (
    <Card className="mx-auto max-w-lg">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div>
          <LanguageSwitcher label={content.common.languageLabel} locale={locale} />
        </div>
      </CardHeader>
      <CardContent>
        {children}
        <Link className="mt-6 block text-sm font-bold text-orange-600" href="/login">{content.auth.recovery.signIn}</Link>
      </CardContent>
    </Card>
  );
}

export function ForgotPasswordForm() {
  const content = useAppContent();
  const locale = useLocale();
  const t = content.auth.recovery;
  const schema = useMemo(() => createForgotPasswordSchema(content.validation), [content.validation]);
  const form = useForm<ForgotPasswordValues>({ resolver: zodResolver(schema), defaultValues: { email: "" } });
  const mutation = useMutation({
    mutationFn: (values: ForgotPasswordValues) => apiFetch<void>("/api/auth/forgot-password", {
      method: "POST", body: JSON.stringify({ ...values, locale }),
    }),
  });

  return (
    <RecoveryCard title={t.forgotTitle} description={t.forgotDescription}>
      {mutation.isSuccess ? <p role="status" className="text-sm text-stone-700">{t.sent}</p> : (
        <form className="space-y-5" onSubmit={form.handleSubmit(values => mutation.mutate(values))}>
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="recovery-email">{t.emailLabel}</label>
            <Input id="recovery-email" type="email" autoComplete="email" maxLength={255} {...form.register("email")} />
            {form.formState.errors.email ? <p role="alert" className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}
          </div>
          {mutation.isError ? <p role="alert" className="text-sm text-rose-600">{recoveryError(mutation.error, t)}</p> : null}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>{mutation.isPending ? t.sending : t.send}</Button>
        </form>
      )}
    </RecoveryCard>
  );
}

export function ResetPasswordForm() {
  const content = useAppContent();
  const t = content.auth.recovery;
  const queryClient = useQueryClient();
  const [invalidLink, setInvalidLink] = useState(false);
  const schema = useMemo(() => createResetPasswordSchema(content.validation), [content.validation]);
  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(schema), defaultValues: { password: "", confirmPassword: "" },
  });
  const mutation = useMutation({
    mutationFn: ({ token, password }: ResetPasswordRequest) => apiFetch<void>("/api/auth/reset-password", {
      method: "POST", body: JSON.stringify({ token, password }),
    }),
    onSuccess: () => {
      form.reset();
      queryClient.clear();
      window.history.replaceState(null, "", window.location.pathname);
    },
  });
  const submit = (values: ResetPasswordValues) => {
    // Fragments are not sent in HTTP requests or Referer headers.
    const token = new URLSearchParams(window.location.hash.slice(1)).get("token");
    if (!token || token.length !== 64 || !/^[A-F0-9]{64}$/.test(token)) {
      setInvalidLink(true);
      return;
    }
    setInvalidLink(false);
    mutation.mutate({ token, password: values.password });
  };

  return (
    <RecoveryCard title={t.resetTitle} description={t.resetDescription}>
      {mutation.isSuccess ? <p role="status" className="text-sm text-stone-700">{t.success}</p> : (
        <form className="space-y-5" onSubmit={form.handleSubmit(submit)}>
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="reset-password">{t.passwordLabel}</label>
            <Input id="reset-password" type="password" autoComplete="new-password" aria-describedby="reset-password-policy" {...form.register("password")} />
            <p id="reset-password-policy" className="text-sm text-stone-500">{content.validation.passwordPolicy}</p>
            {form.formState.errors.password ? <p role="alert" className="text-sm text-rose-600">{form.formState.errors.password.message}</p> : null}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold" htmlFor="reset-password-confirm">{t.confirmPasswordLabel}</label>
            <Input id="reset-password-confirm" type="password" autoComplete="new-password" {...form.register("confirmPassword")} />
            {form.formState.errors.confirmPassword ? <p role="alert" className="text-sm text-rose-600">{form.formState.errors.confirmPassword.message}</p> : null}
          </div>
          {invalidLink || mutation.isError ? <p role="alert" className="text-sm text-rose-600">{invalidLink ? t.invalidLink : recoveryError(mutation.error, t, true)}</p> : null}
          <Button className="w-full" type="submit" disabled={mutation.isPending}>{mutation.isPending ? t.resetting : t.reset}</Button>
        </form>
      )}
      <Link className="mt-4 block text-sm font-bold text-orange-600" href="/forgot-password">{t.requestAnother}</Link>
    </RecoveryCard>
  );
}
