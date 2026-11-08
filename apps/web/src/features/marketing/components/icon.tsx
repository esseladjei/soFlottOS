// Maps the icon NAMES used in the content files to real Lucide icon components.
// Keeping this mapping here means the copy files stay free of React imports.
import {
  Building2,
  CalendarClock,
  Check,
  ClipboardList,
  Clock,
  Code2,
  FileText,
  Handshake,
  Layers,
  LifeBuoy,
  Lock,
  Mail,
  Map,
  Package,
  PenLine,
  Phone,
  Plug,
  Receipt,
  RefreshCw,
  Route,
  Scale,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/content/marketing/types";

export const marketingIcons: Record<IconName, LucideIcon> = {
  building: Building2,
  calendar: CalendarClock,
  check: Check,
  clipboard: ClipboardList,
  clock: Clock,
  code: Code2,
  file: FileText,
  handshake: Handshake,
  layers: Layers,
  lifebuoy: LifeBuoy,
  lock: Lock,
  mail: Mail,
  map: Map,
  package: Package,
  phone: Phone,
  plug: Plug,
  receipt: Receipt,
  refresh: RefreshCw,
  route: Route,
  scale: Scale,
  search: Search,
  shield: ShieldCheck,
  signature: PenLine,
  truck: Truck,
  users: Users,
  wrench: Wrench,
};

/** `<MarketingIcon name="truck" className="size-5" />` */
export function MarketingIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = marketingIcons[name];
  return <Icon aria-hidden className={className} />;
}
