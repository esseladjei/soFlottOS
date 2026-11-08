"use client";

// ---------------------------------------------------------------------------
// Enquiry forms of the public website (Phase 1).
//
//   express-quote     direct delivery quote OR logistics-subcontracting proposal
//   digital-proposal  IT consulting / software proposal
//   contact           general contact with a topic selector
//
// There is deliberately no backend yet (OWNER DECISION, brief section 14):
// on submit the form validates, then opens the visitor's email program with a
// prepared message to the right division inbox. Nothing is stored. Replacing
// `submitEnquiry` with an API call is the only change needed later.
// ---------------------------------------------------------------------------

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { FormKind, FormsContent } from "@/content/marketing/types";
import { buttonBase, type DivisionTheme } from "@/features/marketing/lib/theme";
import { cn } from "@/lib/utils";

type FieldKey = keyof FormsContent["fields"];
type Values = Partial<Record<FieldKey, string>>;
type ExpressType = "direct" | "routes" | "subcontracting";
const expressTypes: readonly ExpressType[] = ["direct", "routes", "subcontracting"];
type Topic = "express" | "digital" | "general";

interface FieldSpec {
  key: FieldKey;
  required?: boolean;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  autoComplete?: string;
  wide?: boolean;
}

const noSubscribe = () => () => {};
/** Links such as ".../request-a-quote?type=subcontracting" or "?type=routes" preselect the type. */
const typeFromUrl = (): ExpressType => {
  const type = new URLSearchParams(window.location.search).get("type");
  return expressTypes.find((option) => option === type) ?? "direct";
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function fieldsFor(kind: FormKind, forms: FormsContent, expressType: ExpressType): FieldSpec[] {
  const contactFields: FieldSpec[] = [
    { key: "company", required: kind !== "contact", autoComplete: "organization" },
    { key: "name", required: true, autoComplete: "name" },
    { key: "email", required: true, type: "email", autoComplete: "email" },
    { key: "phone", type: "tel", autoComplete: "tel" },
  ];

  if (kind === "express-quote") {
    const details: FieldSpec[] =
      expressType === "direct"
        ? [
            { key: "pickup", required: true },
            { key: "delivery", required: true },
            { key: "date" },
            { key: "shipment", required: true, type: "textarea", wide: true },
          ]
        : expressType === "routes"
          ? [
              { key: "stops", required: true, type: "textarea", wide: true },
              { key: "schedule", required: true },
              { key: "startDate" },
              { key: "shipment", required: true, type: "textarea", wide: true },
            ]
          : [
            { key: "engagement", type: "select", options: forms.expressQuote.engagementOptions },
            { key: "startDate" },
            { key: "area", required: true, type: "textarea", wide: true },
            { key: "volume", required: true, wide: true },
          ];
    return [...contactFields, ...details, { key: "message", type: "textarea", wide: true }];
  }

  if (kind === "digital-proposal") {
    return [
      ...contactFields,
      { key: "country", autoComplete: "country-name" },
      { key: "engagement", type: "select", options: forms.digitalProposal.engagementOptions },
      { key: "timeline" },
      { key: "budget" },
      { key: "message", required: true, type: "textarea", wide: true },
    ];
  }

  return [...contactFields, { key: "message", required: true, type: "textarea", wide: true }];
}

/** Phase 1 delivery: open a prepared email. Swap for an API call later. */
function submitEnquiry(to: string, subject: string, body: string) {
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function EnquiryForm({
  kind,
  forms,
  emails,
  privacyHref,
  theme,
  title,
  intro,
  defaultTopic = "general",
}: {
  kind: FormKind;
  forms: FormsContent;
  /** Receiving inboxes. `general` is the company address. */
  emails: Record<Topic, string>;
  privacyHref: string;
  theme: DivisionTheme;
  title: string;
  intro?: ReactNode;
  /** Contact form on a division page starts with that division selected. */
  defaultTopic?: Topic;
}) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  // Read on the client so the page itself can stay statically generated.
  const urlType = useSyncExternalStore(noSubscribe, typeFromUrl, () => "direct" as const);
  const [chosenType, setExpressType] = useState<ExpressType | null>(null);
  const expressType = kind === "express-quote" ? (chosenType ?? urlType) : "direct";
  const [topic, setTopic] = useState<Topic>(defaultTopic);
  const [values, setValues] = useState<Values>({});
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<FieldKey | "consent", string>>>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sentTo) successRef.current?.focus();
  }, [sentTo]);

  const fields = fieldsFor(kind, forms, expressType);
  const recipient =
    kind === "express-quote" ? emails.express : kind === "digital-proposal" ? emails.digital : emails[topic];

  function validate() {
    const next: typeof errors = {};
    for (const field of fields) {
      const value = values[field.key]?.trim() ?? "";
      if (field.required && !value) next[field.key] = forms.errors.required;
      else if (field.type === "email" && value && !emailPattern.test(value)) next[field.key] = forms.errors.email;
    }
    if (!consent) next.consent = forms.errors.consent;
    return next;
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    const subject =
      kind === "express-quote"
        ? forms.expressQuote.subject[expressType]
        : kind === "digital-proposal"
          ? forms.digitalProposal.subject
          : `${forms.contact.subject} – ${forms.contact.topicOptions[topic]}`;

    const lines: string[] = [];
    if (kind === "express-quote") lines.push(`${forms.expressQuote.typeLegend} ${forms.expressQuote.types[expressType]}`);
    if (kind === "contact") lines.push(`${forms.fields.topic.label}: ${forms.contact.topicOptions[topic]}`);
    for (const field of fields) {
      const value = values[field.key]?.trim();
      if (value) lines.push(field.type === "textarea" ? `\n${forms.fields[field.key].label}:\n${value}` : `${forms.fields[field.key].label}: ${value}`);
    }

    submitEnquiry(recipient, subject, lines.join("\n"));
    setSentTo(recipient);
  }

  const update = (key: FieldKey, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const errorList = Object.entries(errors).filter(([, message]) => Boolean(message)) as [string, string][];
  const headingId = id("title");

  return (
    <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm md:p-8">
      <h2
        className="font-[family-name:var(--font-display)] text-2xl font-extrabold tracking-tight text-stone-950"
        id={headingId}
      >
        {title}
      </h2>
      {intro ? <p className="mt-2 text-sm leading-6 text-stone-600">{intro}</p> : null}

      {sentTo ? (
        <div
          className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-900 focus:outline-none"
          ref={successRef}
          role="status"
          tabIndex={-1}
        >
          <p className="flex items-center gap-2 font-bold">
            <CheckCircle2 aria-hidden className="size-5" />
            {forms.successTitle}
          </p>
          <p className="mt-2 text-sm leading-6">
            {forms.successText.split("{email}")[0]}
            <a className="font-semibold underline" href={`mailto:${sentTo}`}>
              {sentTo}
            </a>
            {forms.successText.split("{email}")[1] ?? ""}
          </p>
        </div>
      ) : null}

      <form aria-labelledby={headingId} className="mt-6" noValidate onSubmit={onSubmit}>
        {errorList.length > 0 ? (
          <div
            className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900 focus:outline-none"
            ref={summaryRef}
            role="alert"
            tabIndex={-1}
          >
            <p className="flex items-center gap-2 font-bold">
              <AlertTriangle aria-hidden className="size-4" />
              {forms.errors.summary}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6">
              {errorList.map(([key, message]) => (
                <li key={key}>
                  <a className="underline" href={`#${id(key)}`}>
                    {key === "consent" ? forms.privacyLink : forms.fields[key as FieldKey].label}: {message}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {kind === "express-quote" ? (
          <fieldset className="mb-6">
            <legend className="text-sm font-bold text-stone-900">{forms.expressQuote.typeLegend}</legend>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              {expressTypes.map((type) => (
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm font-semibold text-stone-800 transition",
                    expressType === type ? "border-orange-600 bg-orange-50" : "border-stone-300 hover:bg-stone-50",
                  )}
                  key={type}
                >
                  <input
                    checked={expressType === type}
                    className="mt-0.5 size-4 accent-orange-700"
                    name={id("type")}
                    onChange={() => {
                      setExpressType(type);
                      setErrors({});
                    }}
                    type="radio"
                    value={type}
                  />
                  {forms.expressQuote.types[type]}
                </label>
              ))}
            </div>
          </fieldset>
        ) : null}

        <div className="grid gap-5 sm:grid-cols-2">
          {kind === "contact" ? (
            <Field forms={forms} id={id("topic")} label={forms.fields.topic.label} required wide>
              <Select id={id("topic")} onChange={(event) => setTopic(event.target.value as Topic)} value={topic}>
                {(Object.keys(forms.contact.topicOptions) as Topic[]).map((option) => (
                  <option key={option} value={option}>
                    {forms.contact.topicOptions[option]}
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          {fields.map((field) => {
            const fieldId = id(field.key);
            const text = forms.fields[field.key];
            const error = errors[field.key];
            const describedBy = [text.hint ? `${fieldId}-hint` : "", error ? `${fieldId}-error` : ""]
              .filter(Boolean)
              .join(" ") || undefined;
            const common = {
              "aria-describedby": describedBy,
              "aria-invalid": error ? true : undefined,
              "aria-required": field.required || undefined,
              id: fieldId,
              name: field.key,
              value: values[field.key] ?? "",
              className: cn(error && "border-red-500"),
            };

            return (
              <Field
                error={error}
                forms={forms}
                hint={text.hint}
                id={fieldId}
                key={field.key}
                label={text.label}
                required={field.required}
                wide={field.wide}
              >
                {field.type === "textarea" ? (
                  <Textarea {...common} onChange={(event) => update(field.key, event.target.value)} rows={4} />
                ) : field.type === "select" ? (
                  <Select {...common} onChange={(event) => update(field.key, event.target.value)}>
                    <option value="">–</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    {...common}
                    autoComplete={field.autoComplete}
                    onChange={(event) => update(field.key, event.target.value)}
                    type={field.type ?? "text"}
                  />
                )}
              </Field>
            );
          })}
        </div>

        <div className="mt-6">
          <label className="flex items-start gap-3 text-sm text-stone-700" htmlFor={id("consent")}>
            <input
              aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
              aria-invalid={errors.consent ? true : undefined}
              checked={consent}
              className="mt-0.5 size-4 shrink-0 accent-stone-900"
              id={id("consent")}
              onChange={(event) => {
                setConsent(event.target.checked);
                if (errors.consent) setErrors((current) => ({ ...current, consent: undefined }));
              }}
              type="checkbox"
            />
            <span>
              {forms.privacyConsent}{" "}
              <Link className="font-semibold underline" href={privacyHref}>
                {forms.privacyLink}
              </Link>
            </span>
          </label>
          {errors.consent ? (
            <p className="mt-1 pl-7 text-sm font-semibold text-red-700" id={`${id("consent")}-error`}>
              {errors.consent}
            </p>
          ) : null}
        </div>

        <button className={cn(buttonBase, theme.button, theme.ring, "mt-6 w-full sm:w-auto")} type="submit">
          {forms.submit}
        </button>
      </form>
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
  forms,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  wide?: boolean;
  forms: FormsContent;
  children: ReactNode;
}) {
  return (
    <div className={cn(wide && "sm:col-span-2")}>
      <label className="text-sm font-bold text-stone-900" htmlFor={id}>
        {label}{" "}
        <span className="font-normal text-stone-500">({required ? forms.required : forms.optional})</span>
      </label>
      {hint ? (
        <p className="mt-0.5 text-xs text-stone-500" id={`${id}-hint`}>
          {hint}
        </p>
      ) : null}
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1 text-sm font-semibold text-red-700" id={`${id}-error`}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
