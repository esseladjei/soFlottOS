// Maps the icon NAMES used in the content files to real Lucide icon components.
// Keeping this mapping here means the copy files stay free of React imports.
import {
  Award,
  Banknote,
  Building2,
  CalendarClock,
  Check,
  Clock,
  Euro,
  FileText,
  Gavel,
  Lock,
  Mail,
  Map,
  Package,
  Phone,
  Printer,
  Receipt,
  Route,
  ShieldCheck,
  Siren,
  Smartphone,
  Sparkles,
  Stethoscope,
  PenLine,
  Truck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/marketing/types";

export const marketingIcons: Record<IconName, LucideIcon> = {
  alert: Siren,
  award: Award,
  banknote: Banknote,
  building: Building2,
  calendar: CalendarClock,
  check: Check,
  clock: Clock,
  euro: Euro,
  file: FileText,
  gavel: Gavel,
  hospital: Stethoscope,
  lock: Lock,
  mail: Mail,
  map: Map,
  package: Package,
  phone: Phone,
  printer: Printer,
  receipt: Receipt,
  route: Route,
  shield: ShieldCheck,
  signature: PenLine,
  smartphone: Smartphone,
  sparkles: Sparkles,
  truck: Truck,
  wrench: Wrench,
};

/** `<MarketingIcon name="truck" className="size-5" />` */
export function MarketingIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = marketingIcons[name];
  return <Icon aria-hidden className={className} />;
}
