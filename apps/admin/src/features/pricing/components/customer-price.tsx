"use client";

import { Calculator, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import type { SavePricingProfileRequest } from "@/types/api";

export function CustomerPrice({ profile, savedId, compact = false }: {
  profile: SavePricingProfileRequest;
  savedId?: number;
  compact?: boolean;
}) {
  const content = useAppContent();
  const t = content.pricing.profiles.customerPrice;
  const units = content.pricing.enums.pricingUnit;
  const locale = useLocale();
  const fixed = profile.strategy === "FixedPrice";
  const rates = profile.strategy === "RateCard";
  const formatter = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-GB", { style: "currency", currency: profile.currency });
  const amount = (value: number) => formatter.format(value);
  const query = new URLSearchParams();
  if (savedId != null) query.set("profileId", String(savedId));
  if (profile.serviceType) query.set("serviceType", profile.serviceType);
  if (profile.clientId != null) query.set("clientId", String(profile.clientId));
  const simulatorHref = `/pricing/simulator?${query}`;

  return (
    <section
      aria-label={t.title}
      className={compact ? "min-w-48 space-y-2" : "space-y-3 rounded-xl border border-emerald-200 bg-emerald-50/60 p-5"}
    >
      {!compact ? (
        <h3 className="flex items-center gap-2 font-semibold text-emerald-950">
          <ReceiptText aria-hidden className="size-5 shrink-0" />{t.title}
        </h3>
      ) : null}
      <div className={compact ? "space-y-1 font-semibold text-stone-950" : "space-y-2 text-xl font-semibold text-emerald-950"}>
        {fixed ? (
          profile.fixedPrice != null ? <p className="tabular-nums">{amount(Math.max(profile.fixedPrice, profile.minimumPrice ?? 0))}</p> : <p>{t.missing}</p>
        ) : rates ? (
          profile.rates.length > 0 ? profile.rates.map((rate, index) => (
            <div key={index}>
              <p className="tabular-nums">
                {amount(rate.rate)}{rate.unit !== "Fixed" ? ` / ${units[rate.unit]}` : ""}
                <span className="ml-2 text-xs font-normal text-stone-600">{rate.label}</span>
              </p>
              {rate.unit !== "Fixed" && rate.includedQuantity > 0 ? <p className="text-xs font-normal text-stone-600">{t.included(rate.includedQuantity)}</p> : null}
            </div>
          )) : <p>{t.missing}</p>
        ) : (
          <p>{profile.strategy === "CostPlus" ? t.costPlus(profile.markupPercent ?? 0) : t.targetMargin(profile.targetMarginPercent ?? 0)}</p>
        )}
      </div>
      <p className="text-xs font-medium text-stone-600">{t.net}</p>
      {profile.minimumPrice != null ? <p className="text-xs text-stone-600">{t.minimum(amount(profile.minimumPrice))}</p> : null}
      {!compact ? (
        <div className="space-y-2 border-t border-emerald-200 pt-3 text-sm text-stone-700">
          {!fixed ? <p>{rates ? t.rateHint : t.variableHint}</p> : null}
          <p className="text-xs">{t.taxHint}</p>
          {savedId == null ? <p className="text-xs">{t.saveFirst}</p> : null}
        </div>
      ) : null}
      {savedId != null ? (
        <Link href={simulatorHref} className="inline-flex items-center gap-1.5 rounded text-sm font-semibold text-emerald-800 underline underline-offset-4 hover:text-emerald-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-700">
          <Calculator aria-hidden className="size-4 shrink-0" />{t.calculate}
        </Link>
      ) : null}
    </section>
  );
}
