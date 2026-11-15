"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, BriefcaseBusiness, Calculator, ChevronDown, LogOut, Menu, ReceiptText, Users } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { activeGroup, activeItem, type NavGroup } from "@/components/layout/navigation";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { BrandTagline } from "@/components/ui/brand-tagline";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { apiFetch } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/api";

const groupIcons = {
  operations: BriefcaseBusiness,
  people: Users,
  billing: ReceiptText,
  pricing: Calculator,
  help: BookOpen,
};

function Navigation({ nav, pathname, label, onNavigate }: {
  nav: NavGroup[];
  pathname: string;
  label: string;
  onNavigate?: () => void;
}) {
  const currentGroup = activeGroup(nav, pathname);
  const [expanded, setExpanded] = useState<string[]>(currentGroup ? [currentGroup] : []);

  return (
    <nav aria-label={label} className="space-y-1">
      {nav.map((group) => {
        const Icon = groupIcons[group.id];
        const isOpen = expanded.includes(group.id);
        const isCurrent = currentGroup === group.id;

        return (
          <div key={group.id}>
            <button
              aria-expanded={isOpen}
              className={cn(
                "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm font-bold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                isCurrent ? "text-stone-950" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
              )}
              onClick={() => setExpanded((open) => isOpen ? open.filter((id) => id !== group.id) : [...open, group.id])}
              type="button"
            >
              <Icon aria-hidden className={cn("size-[18px] shrink-0", isCurrent ? "text-orange-600" : "text-stone-500")} />
              <span className="flex-1">{group.label}</span>
              <ChevronDown aria-hidden className={cn("size-4 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen ? (
              <div className="ml-[21px] space-y-1 border-l border-stone-200 py-1 pl-4">
                {group.items.map((item) => {
                  const isActive = activeItem(group.items, pathname) === item.href;
                  return (
                    <Link
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "block rounded-lg px-3 py-2.5 text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500",
                        isActive ? "bg-orange-50 text-orange-800" : "text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                      )}
                      href={item.href}
                      key={item.href}
                      onClick={onNavigate}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}

export function RoleShell({ session, title, nav, children }: { session: Session; title: string; nav: NavGroup[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useAppContent();
  const locale = useLocale();
  const mobileMenu = useRef<HTMLDetailsElement>(null);

  const signOut = async () => {
    await apiFetch<null>("/api/auth/logout", { method: "POST" });
    toast.success(t.common.signedOut);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white">
        <div className="flex min-h-20 items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <Link className="flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500" href="/">
            <LogoMark />
            <div className="min-w-0">
              <p className="truncate font-[family-name:var(--font-display)] font-extrabold text-stone-950">{title}</p>
              <BrandTagline locale={locale} className="hidden text-xs text-stone-500 sm:block" />
            </div>
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-3">
            <span className="hidden max-w-48 truncate text-sm font-semibold text-stone-600 lg:block">{session.fullName}</span>
            <LanguageSwitcher label={t.common.languageLabel} locale={locale} />
            <Button aria-label={t.common.signOut} className="px-2 sm:px-4" variant="ghost" size="sm" onClick={signOut}>
              <LogOut aria-hidden className="size-4" />
              <span className="hidden sm:inline">{t.common.signOut}</span>
            </Button>
          </div>
        </div>
        <details
          className="border-t border-stone-100 lg:hidden"
          onKeyDown={(event) => {
            if (event.key === "Escape" && mobileMenu.current?.open) {
              mobileMenu.current.open = false;
              mobileMenu.current.querySelector("summary")?.focus();
            }
          }}
          ref={mobileMenu}
        >
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-4 text-sm font-bold text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-500 sm:px-6 [&::-webkit-details-marker]:hidden">
            <Menu aria-hidden className="size-4" />
            {t.shell.admin.nav.menu}
            <ChevronDown aria-hidden className="ml-auto size-4" />
          </summary>
          <div className="max-h-[calc(100dvh-8rem)] overflow-y-auto border-t border-stone-100 px-4 py-3 sm:px-6">
            <Navigation key={pathname} nav={nav} pathname={pathname} label={t.shell.admin.nav.label} onNavigate={() => { if (mobileMenu.current) mobileMenu.current.open = false; }} />
          </div>
        </details>
      </header>
      <div className="lg:grid lg:grid-cols-[17rem_minmax(0,1fr)]">
        <aside className="hidden border-r border-stone-200 bg-white print:hidden lg:block">
          <div className="sticky top-20 max-h-[calc(100dvh-5rem)] overflow-y-auto px-4 py-6">
            <Navigation key={pathname} nav={nav} pathname={pathname} label={t.shell.admin.nav.label} />
          </div>
        </aside>
        <main className="min-w-0 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
