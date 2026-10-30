import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-600">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold text-stone-900 md:text-3xl">
          {title}
        </h2>
        <p className="max-w-3xl text-sm text-stone-600 md:text-base">{description}</p>
      </div>
      {action}
    </div>
  );
}
