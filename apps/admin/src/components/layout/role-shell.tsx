"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/ui/logo-mark";
import { BrandTagline } from "@/components/ui/brand-tagline";
import { useAppContent, useLocale } from "@/i18n/locale-provider";
import { apiFetch } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { Session } from "@/types/api";

interface NavItem {
  href: string;
  label: string;
}

export function RoleShell({ session, title, nav, children }: { session: Session; title: string; nav: NavItem[]; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const t = useAppContent();
  const locale = useLocale();

  const signOut = async () => {
    await apiFetch<null>("/api/auth/logout", { method: "POST" });
    toast.success(t.common.signedOut);
    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <div>
              <p className="font-[family-name:var(--font-display)] font-extrabold text-stone-950">{title}</p>
              <p className="text-xs text-stone-500">{session.fullName}</p>
              <BrandTagline locale={locale} className="hidden text-xs sm:block" />
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {/* The console has no language in its URL, so the switcher stores
                the choice in a cookie and re-renders the page. */}
            <LanguageSwitcher label={t.common.languageLabel} locale={locale} />
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
              {t.common.signOut}
            </Button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold transition",
                pathname === item.href || pathname.startsWith(`${item.href}/`)
                  ? "bg-orange-500 text-white"
                  : "bg-stone-100 text-stone-700 hover:bg-stone-200",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
