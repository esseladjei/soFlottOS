import { brandTaglines } from "@/content/brand";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function BrandTagline({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <p lang={locale} className={cn("font-semibold tracking-wide text-orange-600", className)}>
      {brandTaglines[locale]}
    </p>
  );
}
