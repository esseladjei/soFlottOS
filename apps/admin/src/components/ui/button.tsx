import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl text-sm font-bold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        default:
          "bg-orange-500 text-white shadow-lg shadow-orange-500/20 hover:bg-orange-600",
        secondary:
          "bg-orange-100 text-orange-950 hover:bg-orange-200",
        outline:
          "border border-stone-300 bg-white text-stone-800 hover:border-stone-400 hover:bg-stone-50",
        ghost: "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-950",
        danger:
          "bg-rose-500/90 text-white shadow-lg shadow-rose-900/20 hover:bg-rose-400",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button({
  className,
  variant,
  size,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      type={type}
      {...props}
    />
  );
}
