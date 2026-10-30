// Shared layout bits for the marketing pages, so every section gets the same
// width, padding and heading style.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** A full-width band with a centred, max-width container inside. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section className={cn("border-b border-stone-200 py-16 md:py-20", className)} id={id}>
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}

/** Eyebrow + headline + intro, centred. Used at the top of most sections. */
export function SectionIntro({
  eyebrow,
  title,
  intro,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  intro: string;
  align?: "center" | "left";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-orange-600">{eyebrow}</p>
      <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-extrabold tracking-tight text-stone-950 md:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-7 text-stone-600">{intro}</p>
    </div>
  );
}
