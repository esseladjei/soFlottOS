"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, LoaderCircle, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/ui/logo-mark";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { apiFetch, ApiError } from "@/lib/api/client";
import { siteConfig } from "@/lib/site";
import type { LoginRequest, Session } from "@/types/api";
import { createLoginSchema, type LoginFormValues } from "@/features/auth/schemas";

interface LoginFormProps {
  redirectTo?: string;
  showDemoAccounts?: boolean;
}

const demoAccounts = [{ role: "Admin", email: "admin@soflott.local" }] as const;

const highlightIcons = [ShieldCheck, Truck];

/** Only same-origin console paths are allowed, never "//evil.example". */
function safeRedirect(redirectTo: string | undefined) {
  if (redirectTo?.startsWith("/") && !redirectTo.startsWith("//") && !redirectTo.startsWith("/login")) {
    return redirectTo;
  }
  return "/";
}

export function LoginForm({ redirectTo, showDemoAccounts = false }: LoginFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const content = useAppContent();
  const locale = useLocale();
  const t = content.auth.login;
  const schema = useMemo(() => createLoginSchema(content.validation), [content.validation]);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "admin@soflott.local",
    },
  });

  const loginMutation = useMutation({
    mutationFn: (values: LoginRequest) => apiFetch<Session>("/api/auth/login", { method: "POST", body: JSON.stringify(values) }),
    onSuccess: async (session) => {
      queryClient.setQueryData(["session"], session);
      toast.success(t.welcomeBack(session.fullName));
      router.replace(safeRedirect(redirectTo));
      router.refresh();
    },
    onError: (error) => {
      const message = error instanceof ApiError ? (error.status === 403 ? t.adminOnly : error.message) : t.failed;
      toast.error(message);
    },
  });

  const fillDemoAccount = (email: string) => {
    form.setValue("email", email, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="space-y-8 lg:pr-12">
        <div className="flex items-center justify-between gap-4">
          <Link className="flex w-fit items-center gap-3" href="/">
            <LogoMark />
            <span className="font-[family-name:var(--font-display)] text-xl font-extrabold text-stone-950">{siteConfig.name}</span>
          </Link>
          <LanguageSwitcher label={content.common.languageLabel} locale={locale} />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">{t.eyebrow}</p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl font-extrabold tracking-tight text-stone-950">{t.heading}</h1>
          <p className="mt-4 max-w-md text-lg leading-8 text-stone-600">{t.intro}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {t.highlights.map((highlight, index) => {
            const Icon = highlightIcons[index] ?? ShieldCheck;
            return (
              <Card className={index === 0 ? "border-orange-100 bg-orange-50" : undefined} key={highlight.title}>
                <CardContent className="flex items-start gap-3 p-6">
                  <Icon className="mt-1 size-5 text-orange-600" />
                  <div><p className="font-bold text-stone-900">{highlight.title}</p><p className="mt-1 text-sm text-stone-600">{highlight.description}</p></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showDemoAccounts ? (
          <Card>
            <CardHeader><CardTitle>{t.demoTitle}</CardTitle><CardDescription>{t.demoDescription}</CardDescription></CardHeader>
            <CardContent className="grid gap-3">
              {demoAccounts.map((account) => (
                <button className="rounded-xl border border-stone-200 bg-stone-50 p-4 text-left transition hover:border-orange-300 hover:bg-orange-50" key={account.role} onClick={() => fillDemoAccount(account.email)} type="button">
                  <p className="text-sm font-bold text-stone-900">{account.role}</p><p className="mt-1 text-sm text-stone-500">{account.email}</p>
                </button>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card className="p-1 shadow-xl shadow-stone-900/[0.06]">
        <CardHeader><CardTitle>{t.formTitle}</CardTitle><CardDescription>{t.formDescription}</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}>
            <div className="space-y-2"><label className="text-sm font-bold text-stone-700" htmlFor="email">{t.emailLabel}</label><Input autoComplete="email" id="email" placeholder="admin@soflott.local" {...form.register("email")} />{form.formState.errors.email ? <p className="text-sm text-rose-600">{form.formState.errors.email.message}</p> : null}</div>
            <div className="space-y-2"><label className="text-sm font-bold text-stone-700" htmlFor="password">{t.passwordLabel}</label><Input autoComplete="current-password" id="password" type="password" {...form.register("password")} />{form.formState.errors.password ? <p className="text-sm text-rose-600">{form.formState.errors.password.message}</p> : null}</div>
            <Link className="block text-sm font-bold text-orange-600" href="/forgot-password">{t.forgotPassword}</Link>
            <Button className="w-full" disabled={loginMutation.isPending} size="lg" type="submit">{loginMutation.isPending ? <><LoaderCircle className="size-4 animate-spin" />{t.submitting}</> : <>{t.submit}<ArrowRight className="size-4" /></>}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
