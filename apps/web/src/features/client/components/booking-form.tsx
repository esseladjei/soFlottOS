"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  composeAddress,
  createOrderFormSchema,
  createQuoteFormSchema,
  type OrderFormValues,
  type QuoteFormValues,
} from "@/features/client/schemas";
import { useCreateOrder, useQuoteOrder } from "@/features/client/hooks";
import { useAppContent, useFormatters } from "@/i18n/locale-provider";
import { cargoCategories, paymentMethods } from "@/types/api";
import { useBookingAvailability } from "@/features/booking-availability/hooks";
import { getBookingAvailability } from "@/features/booking-availability/api";

/** Leaflet reads `window` at import time, so the map never runs on the server. */
const RouteMap = dynamic(() => import("@/features/client/components/route-map"), { ssr: false });

const quoteFields = [
  "pickupStreet", "pickupHouseNumber", "pickupPostalCode", "pickupCity", "pickupState",
  "dropoffStreet", "dropoffHouseNumber", "dropoffPostalCode", "dropoffCity", "dropoffState",
] as const;

function addresses(values: QuoteFormValues) {
  return {
    pickupAddress: composeAddress({
      street: values.pickupStreet, houseNumber: values.pickupHouseNumber,
      postalCode: values.pickupPostalCode, city: values.pickupCity, state: values.pickupState,
    }),
    dropoffAddress: composeAddress({
      street: values.dropoffStreet, houseNumber: values.dropoffHouseNumber,
      postalCode: values.dropoffPostalCode, city: values.dropoffCity, state: values.dropoffState,
    }),
  };
}

export function BookingForm({ clientId }: { clientId?: number }) {
  const router = useRouter();
  const quote = useQuoteOrder();
  const createOrder = useCreateOrder();
  const content = useAppContent();
  const t = content.client.newOrder;
  const availability = useBookingAvailability(!clientId);
  const canBook = Boolean(clientId) || (!availability.isError && availability.data?.canBook === true);
  const availabilityText = content.bookingAvailability;
  const { formatCurrency, formatDistance, formatDuration } = useFormatters();
  const schema = useMemo(() => createOrderFormSchema(content.validation), [content.validation]);
  const quoteSchema = useMemo(() => createQuoteFormSchema(content.validation), [content.validation]);
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(schema) as Resolver<OrderFormValues>,
    defaultValues: { cargoCategory: "Document", paymentMethod: "BankTransfer", weightKg: 1 },
  });
  const watched = useWatch({ control: form.control, name: quoteFields });
  const route = quoteSchema.safeParse(Object.fromEntries(quoteFields.map((name, index) => [name, watched[index]])));
  const current = route.success ? addresses(route.data) : null;
  const hasCurrentQuote = quote.isSuccess && current !== null &&
    quote.variables?.clientId === clientId &&
    current.pickupAddress === quote.variables?.pickupAddress &&
    current.dropoffAddress === quote.variables?.dropoffAddress;
  const result = hasCurrentQuote ? quote.data : undefined;
  const routed = result ? result.routingSource !== "AddressOnly" : false;

  const getQuote = () => {
    if (!canBook) return;
    form.clearErrors([...quoteFields]);
    form.clearErrors("root.quote");
    const parsed = quoteSchema.safeParse(form.getValues());
    if (!parsed.success) {
      const errors = parsed.error.flatten().fieldErrors;
      for (const name of quoteFields) {
        const message = errors[name]?.[0];
        if (message) form.setError(name, { message });
      }
      return;
    }
    quote.mutate({ ...addresses(parsed.data), ...(clientId ? { clientId } : {}) });
  };

  const submit = form.handleSubmit(async (values) => {
    if (!canBook) return;
    if (!clientId) {
      try {
        const now = await getBookingAvailability();
        if (!now.canBook) {
          await availability.refetch();
          form.setError("root.availability", { message: now.unavailableReason === "Busy" ? availabilityText.busyNotice : availabilityText.unavailable });
          return;
        }
      } catch {
        form.setError("root.availability", { message: availabilityText.checkFailed });
        return;
      }
    }
    if (!hasCurrentQuote || !current) {
      form.setError("root.quote", { message: t.quoteRequired });
      return;
    }
    createOrder.mutate({
      ...(clientId ? { clientId } : {}),
      ...current,
      cargoCategory: values.cargoCategory,
      weightKg: values.weightKg,
      paymentMethod: values.paymentMethod,
      pickupContactName: values.pickupContactName.trim(),
      pickupPhone: values.pickupPhone.trim(),
      dropoffContactName: values.dropoffContactName.trim(),
      dropoffPhone: values.dropoffPhone.trim(),
      specialInstructions: values.specialInstructions || null,
      externalReference: values.externalReference || null,
    }, { onSuccess: (order) => router.push(`${clientId ? "/admin" : "/client"}/orders/${order.id}`) });
  });

  const field = (name: keyof OrderFormValues, label: string, span = "", props: Record<string, unknown> = {}) => (
    <div className={`space-y-1.5 ${span}`}>
      <label htmlFor={name} className="text-xs font-bold uppercase tracking-wide text-stone-500">{label}</label>
      <Input id={name} {...props} {...form.register(name)} />
      {form.formState.errors[name]?.message ? <p className="text-sm text-rose-600">{form.formState.errors[name]?.message}</p> : null}
    </div>
  );

  const addressFields = (
    prefix: "pickup" | "dropoff",
    labels: { street: string; houseNumber: string; postalCode: string; city: string; state: string },
  ) => (
    <>
      <div className="grid gap-3 sm:grid-cols-6 lg:grid-cols-12">
        {field(`${prefix}Street`, labels.street, "sm:col-span-3 lg:col-span-4", { maxLength: 250, autoComplete: "address-line1" })}
        {field(`${prefix}HouseNumber`, labels.houseNumber, "sm:col-span-1 lg:col-span-2", { maxLength: 20 })}
        {field(`${prefix}PostalCode`, labels.postalCode, "sm:col-span-2 lg:col-span-2", { maxLength: 20, autoComplete: "postal-code" })}
        {field(`${prefix}City`, labels.city, "sm:col-span-3 lg:col-span-2", { maxLength: 100, autoComplete: "address-level2" })}
        {field(`${prefix}State`, labels.state, "sm:col-span-3 lg:col-span-2", { maxLength: 50 })}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {field(`${prefix}ContactName`, t.fields[`${prefix}ContactName`], "", { maxLength: 150 })}
        {field(`${prefix}Phone`, t.fields[`${prefix}Phone`], "", { type: "tel", maxLength: 50 })}
      </div>
    </>
  );

  const figure = (label: string, value: string, accent = false) => (
    <div className={`rounded-xl border p-3 ${accent ? "border-stone-900 bg-stone-900 text-white" : "border-stone-200 bg-white"}`}>
      <p className={`text-xs font-bold uppercase tracking-wide ${accent ? "text-stone-300" : "text-stone-500"}`}>{label}</p>
      <p className="mt-1 text-lg font-extrabold tabular-nums">{value}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {!clientId && !canBook ? (
        <Card><CardContent className="space-y-3 pt-6">
          <p role="status">{availability.isLoading ? content.common.loading : availability.isError
            ? availabilityText.checkFailed : availability.data?.unavailableReason === "Busy"
              ? availabilityText.busyNotice : availabilityText.unavailable}</p>
          {availability.isError ? <Button type="button" variant="outline" onClick={() => availability.refetch()}>{content.common.tryAgain}</Button> : null}
          {!availability.isError && availability.data?.scheduleEnabled ? <div className="space-y-1 text-sm">
            <p className="font-bold">{availabilityText.bookingHours}</p>
            {availability.data.windows.length ? availability.data.windows.map((window, index) => (
              <p key={index}>{availabilityText.days[window.dayOfWeek]}: {window.startTime} - {window.endTime}</p>
            )) : <p>{availabilityText.closed}</p>}
          </div> : null}
        </CardContent></Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>{t.quoteTitle}</CardTitle>
          <CardDescription>{result ? t.quoteDescription : t.quoteEmptyDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result ? (
            <>
              {!routed ? <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-800">{t.addressOnlyQuote}</p> : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-700">A &middot; {t.resolvedPickup}</p>
                  <p className="mt-1 text-sm font-semibold">{result.pickup.label}</p>
                </div>
                <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-sky-700">B &middot; {t.resolvedDropoff}</p>
                  <p className="mt-1 text-sm font-semibold">{result.dropoff.label}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {figure(t.quote.distance, routed ? formatDistance(result.distanceKm) : content.common.none)}
                {figure(t.quote.eta, routed ? formatDuration(result.estimatedDurationMinutes) : content.common.none)}
                {figure(t.quote.baseFee, formatCurrency(result.baseFee))}
                {figure(t.quote.ratePerKm, `${formatCurrency(result.ratePerKilometer)} / km`)}
                {figure(t.quote.distanceCost, formatCurrency(result.distanceCost))}
                {figure(t.quote.net, formatCurrency(result.netPrice))}
                {figure(t.quote.vat, formatCurrency(result.vatAmount))}
                {figure(t.quote.gross, formatCurrency(result.grossPrice), true)}
              </div>
              {result.minimumChargeApplied ? <p className="text-sm text-stone-600">{t.minimumChargeApplied}</p> : null}
              <div className="space-y-2">
                <p className="text-sm font-bold">{t.mapTitle}</p>
                <RouteMap
                  pickup={result.pickup}
                  dropoff={result.dropoff}
                  geometry={result.geometry}
                  pickupLabel={t.resolvedPickup}
                  dropoffLabel={t.resolvedDropoff}
                />
                <p className="text-xs text-stone-500">{t.routedBy(result.routingSource)}</p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-stone-300 p-8 text-center">
              <p className="font-bold">{t.quoteEmptyTitle}</p>
              <p className="mt-1 text-sm text-stone-600">{t.mapPending}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>{t.cardTitle}</CardTitle><CardDescription>{t.cardDescription}</CardDescription></CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={submit} noValidate>
            <fieldset disabled={!canBook || form.formState.isSubmitting || createOrder.isPending} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="cargoCategory" className="text-xs font-bold uppercase tracking-wide text-stone-500">{t.fields.cargoCategory}</label>
                  <Select id="cargoCategory" {...form.register("cargoCategory")}>{cargoCategories.map((item) => <option key={item} value={item}>{content.enums.cargoCategory[item]}</option>)}</Select>
                </div>
                {field("weightKg", t.fields.weightKg, "", { type: "number", step: "any" })}
              </div>
              <fieldset className="space-y-4 rounded-2xl border border-orange-200 bg-orange-50/50 p-4">
                <legend className="px-2 text-lg font-extrabold">{t.pickupSection}</legend>
                {addressFields("pickup", {
                  street: t.fields.pickupStreet, houseNumber: t.fields.pickupHouseNumber,
                  postalCode: t.fields.pickupPostalCode, city: t.fields.pickupCity, state: t.fields.pickupState,
                })}
              </fieldset>
              <fieldset className="space-y-4 rounded-2xl border border-sky-200 bg-sky-50/50 p-4">
                <legend className="px-2 text-lg font-extrabold">{t.dropoffSection}</legend>
                {addressFields("dropoff", {
                  street: t.fields.dropoffStreet, houseNumber: t.fields.dropoffHouseNumber,
                  postalCode: t.fields.dropoffPostalCode, city: t.fields.dropoffCity, state: t.fields.dropoffState,
                })}
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5"><label htmlFor="specialInstructions" className="text-xs font-bold uppercase tracking-wide text-stone-500">{t.fields.specialInstructions}</label><Textarea id="specialInstructions" {...form.register("specialInstructions")} /></div>
                <div className="space-y-1.5"><label htmlFor="externalReference" className="text-xs font-bold uppercase tracking-wide text-stone-500">{t.fields.externalReference}</label><Input id="externalReference" {...form.register("externalReference")} /></div>
              </div>
              <fieldset className="space-y-2"><legend className="text-sm font-bold">{t.fields.paymentMethod}</legend><div className="flex gap-4">{paymentMethods.map((method) => <label key={method} className="flex items-center gap-2 text-sm"><input type="radio" value={method} {...form.register("paymentMethod")} />{content.enums.paymentMethod[method]}</label>)}</div></fieldset>
              {form.formState.errors.root?.quote ? <p role="alert" className="text-sm text-rose-600">{form.formState.errors.root.quote.message}</p> : null}
              {form.formState.errors.root?.availability ? <p role="alert" className="text-sm text-rose-600">{form.formState.errors.root.availability.message}</p> : null}
              {quote.isError ? <p role="alert" className="text-sm text-rose-600">{quote.error.message || content.common.requestFailed}</p> : null}
              {createOrder.isError ? <p role="alert" className="text-sm text-rose-600">{createOrder.error.message || content.common.requestFailed}</p> : null}
              <div className="flex flex-wrap gap-3">
                <Button type="button" variant="outline" onClick={getQuote} disabled={quote.isPending || createOrder.isPending}>{quote.isPending ? content.common.loading : t.getQuote}</Button>
                <Button type="submit" disabled={!hasCurrentQuote || createOrder.isPending}>{createOrder.isPending ? content.common.loading : t.confirm}</Button>
              </div>
            </fieldset>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
