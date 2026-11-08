"use client";

import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getPrivacyContent } from "@/content/privacy";
import type { PrivacyRequestStatusKey, PrivacyRequestTypeKey } from "@/content/privacy/types";
import { privacyRequestSchema, privacyReferenceSchema } from "@/features/privacy/lib/schemas";
import { useLocale } from "@/i18n/locale-provider";
import { cn } from "@/lib/utils";

const requestTypes: readonly PrivacyRequestTypeKey[] = ["Access", "Deletion", "Correction", "Export", "Restriction", "Objection"];
const solid = "bg-stone-900 text-white shadow-none hover:bg-stone-800";

interface Created {
  id: string;
  dueAt: string;
}

interface StatusResult {
  status: PrivacyRequestStatusKey;
  createdAt: string;
  dueAt: string;
  completedAt: string | null;
}

type Errors = Partial<Record<"email" | "type" | "message" | "form", string>>;

/**
 * Lets people exercise their GDPR rights (access, deletion, ...) and check how
 * their request is going. The reference number is the only thing the status
 * lookup needs, and it returns no personal data.
 */
export function PrivacyRequestForm() {
  const locale = useLocale();
  const { request } = getPrivacyContent(locale);
  const id = useId();
  const [type, setType] = useState<PrivacyRequestTypeKey | "">("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<Created | null>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const format = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(iso));

  useEffect(() => {
    if (created) successRef.current?.focus();
  }, [created]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const parsed = privacyRequestSchema.safeParse({ type: type || undefined, email, fullName, message, locale });
    const next: Errors = {};
    if (!parsed.success) {
      const issues = parsed.error.flatten().fieldErrors;
      if (issues.type) next.type = request.errors.type;
      if (issues.email) next.email = request.errors.email;
      if (issues.message) next.message = request.errors.message;
    }
    setErrors(next);
    setConsentError(!agreed);

    if (!parsed.success || !agreed) {
      requestAnimationFrame(() => errorRef.current?.focus());
      return;
    }

    setBusy(true);
    try {
      const response = await fetch("/api/privacy/data-request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (response.ok) {
        const body = (await response.json()) as Created;
        setCreated({ id: body.id, dueAt: body.dueAt });
        setType("");
        setEmail("");
        setFullName("");
        setMessage("");
        setAgreed(false);
        return;
      }

      const form =
        response.status === 429 ? request.errors.rateLimited : response.status >= 500 ? request.errors.unavailable : request.errors.server;
      setErrors({ form });
    } catch {
      setErrors({ form: request.errors.unavailable });
    } finally {
      setBusy(false);
    }

    requestAnimationFrame(() => errorRef.current?.focus());
  }

  if (created) {
    return (
      <div className="space-y-8">
        <div
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 focus:outline-none"
          ref={successRef}
          role="status"
          tabIndex={-1}
        >
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 aria-hidden className="size-5" />
            {request.successTitle}
          </p>
          <p className="mt-2 text-sm leading-6">
            {request.successText.replace("{id}", created.id).replace("{date}", format(created.dueAt))}
          </p>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-bold">{request.referenceLabel}</dt>
              <dd className="mt-0.5 break-all font-mono">{created.id}</dd>
            </div>
            <div>
              <dt className="font-bold">{request.dueLabel}</dt>
              <dd className="mt-0.5">{format(created.dueAt)}</dd>
            </div>
          </dl>
          <Button className="mt-5" onClick={() => setCreated(null)} variant="outline">
            {request.again}
          </Button>
        </div>
        <StatusLookup initialReference={created.id} />
      </div>
    );
  }

  const hasErrors = Object.values(errors).some(Boolean) || consentError;

  return (
    <div className="space-y-10">
      <form aria-labelledby={`${id}-title`} noValidate onSubmit={onSubmit}>
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950" id={`${id}-title`}>
          {request.title}
        </h2>
        <p className="mt-2 text-base leading-7 text-stone-700">{request.intro}</p>

        {hasErrors ? (
          <div
            className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 focus:outline-none"
            ref={errorRef}
            role="alert"
            tabIndex={-1}
          >
            {errors.form ? (
              <p className="flex items-center gap-2 font-bold">
                <AlertTriangle aria-hidden className="size-4 shrink-0" />
                {errors.form}
              </p>
            ) : (
              <ul className="space-y-1">
                {[errors.type, errors.email, errors.message, consentError ? request.consent : undefined]
                  .filter(Boolean)
                  .map((text) => (
                    <li className="flex gap-2" key={text}>
                      <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
                      {text}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ) : null}

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field error={errors.type} id={`${id}-type`} label={request.fields.type} required wide>
            <Select
              aria-describedby={errors.type ? `${id}-type-error` : undefined}
              aria-invalid={errors.type ? true : undefined}
              aria-required
              id={`${id}-type`}
              onChange={(event) => setType(event.target.value as PrivacyRequestTypeKey | "")}
              value={type}
            >
              <option value="" />
              {requestTypes.map((option) => (
                <option key={option} value={option}>
                  {request.types[option]}
                </option>
              ))}
            </Select>
          </Field>

          <Field error={errors.email} hint={request.hints.email} id={`${id}-email`} label={request.fields.email} required>
            <Input
              aria-describedby={cn(`${id}-email-hint`, errors.email && `${id}-email-error`)}
              aria-invalid={errors.email ? true : undefined}
              aria-required
              autoComplete="email"
              id={`${id}-email`}
              maxLength={254}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              value={email}
            />
          </Field>

          <Field hint={request.hints.name} id={`${id}-name`} label={request.fields.name}>
            <Input
              aria-describedby={`${id}-name-hint`}
              autoComplete="name"
              id={`${id}-name`}
              maxLength={120}
              onChange={(event) => setFullName(event.target.value)}
              value={fullName}
            />
          </Field>

          <Field error={errors.message} hint={request.hints.message} id={`${id}-message`} label={request.fields.message} wide>
            <Textarea
              aria-describedby={cn(`${id}-message-hint`, errors.message && `${id}-message-error`)}
              aria-invalid={errors.message ? true : undefined}
              id={`${id}-message`}
              maxLength={2000}
              onChange={(event) => setMessage(event.target.value)}
              value={message}
            />
          </Field>
        </div>

        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-stone-700" htmlFor={`${id}-agree`}>
            <input
              aria-describedby={consentError ? `${id}-agree-error` : undefined}
              aria-invalid={consentError ? true : undefined}
              aria-required
              checked={agreed}
              className="mt-1 size-4 shrink-0 accent-stone-900"
              id={`${id}-agree`}
              onChange={(event) => setAgreed(event.target.checked)}
              type="checkbox"
            />
            <span>{request.consent}</span>
          </label>
          {consentError ? (
            <p className="mt-1 text-sm font-semibold text-red-700" id={`${id}-agree-error`}>
              {request.consent}
            </p>
          ) : null}
        </div>

        <Button className={cn(solid, "mt-6")} disabled={busy} type="submit">
          {busy ? request.submitting : request.submit}
        </Button>
      </form>

      <StatusLookup />
    </div>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  required,
  wide,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <label className="text-sm font-bold text-stone-900" htmlFor={id}>
        {label}
        {required ? <span aria-hidden> *</span> : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint ? (
        <p className="mt-1 text-xs leading-5 text-stone-500" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className="mt-1 text-sm font-semibold text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

function StatusLookup({ initialReference = "" }: { initialReference?: string }) {
  const locale = useLocale();
  const { lookup } = getPrivacyContent(locale).request;
  const id = useId();
  const [reference, setReference] = useState(initialReference);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [problem, setProblem] = useState<string | null>(null);

  const format = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(iso));

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;

    const value = reference.trim();
    setResult(null);
    if (!privacyReferenceSchema.safeParse(value).success) {
      setProblem(lookup.invalid);
      return;
    }

    setProblem(null);
    setBusy(true);
    try {
      const response = await fetch(`/api/privacy/data-request/${value}`, { headers: { accept: "application/json" } });
      if (response.ok) {
        setResult((await response.json()) as StatusResult);
      } else {
        setProblem(response.status === 404 ? lookup.notFound : lookup.error);
      }
    } catch {
      setProblem(lookup.error);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form aria-labelledby={`${id}-title`} className="rounded-2xl border border-stone-200 bg-stone-50 p-5 sm:p-6" noValidate onSubmit={onSubmit}>
      <h3 className="text-lg font-bold text-stone-950" id={`${id}-title`}>
        {lookup.title}
      </h3>
      <p className="mt-1 text-sm leading-6 text-stone-600">{lookup.intro}</p>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="text-sm font-bold text-stone-900" htmlFor={`${id}-ref`}>
            {lookup.field}
          </label>
          <Input
            aria-describedby={problem ? `${id}-problem` : undefined}
            aria-invalid={problem && !result ? true : undefined}
            autoComplete="off"
            className="mt-1.5 font-mono"
            id={`${id}-ref`}
            inputMode="text"
            maxLength={36}
            onChange={(event) => setReference(event.target.value)}
            spellCheck={false}
            value={reference}
          />
        </div>
        <Button className={solid} disabled={busy} type="submit">
          <Search aria-hidden className="size-4" />
          {busy ? lookup.submitting : lookup.submit}
        </Button>
      </div>

      <div aria-live="polite">
        {problem ? (
          <p className="mt-3 text-sm font-semibold text-red-700" id={`${id}-problem`}>
            {problem}
          </p>
        ) : null}
        {result ? (
          <dl className="mt-4 grid gap-3 rounded-xl bg-white p-4 text-sm ring-1 ring-stone-200 sm:grid-cols-3">
            <div>
              <dt className="font-bold text-stone-900">{lookup.status}</dt>
              <dd className="mt-0.5 font-semibold text-stone-800">{lookup.statuses[result.status] ?? result.status}</dd>
            </div>
            <div>
              <dt className="font-bold text-stone-900">{lookup.received}</dt>
              <dd className="mt-0.5 text-stone-700">{format(result.createdAt)}</dd>
            </div>
            <div>
              <dt className="font-bold text-stone-900">{result.completedAt ? lookup.completed : lookup.due}</dt>
              <dd className="mt-0.5 text-stone-700">{format(result.completedAt ?? result.dueAt)}</dd>
            </div>
          </dl>
        ) : null}
      </div>
    </form>
  );
}
