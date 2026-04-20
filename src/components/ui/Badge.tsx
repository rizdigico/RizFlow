import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "teal" | "navy" | "gold" | "slate" | "success" | "error";
}

export function Badge({
  className,
  variant = "teal",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    teal: "bg-teal/10 text-teal-dark border border-teal/20",
    navy: "bg-navy/10 text-navy border border-navy/20",
    gold: "bg-gold/10 text-yellow-700 border border-gold/30",
    slate: "bg-slate-100 text-slate-600 border border-slate-200",
    success: "bg-green-50 text-green-700 border border-green-200",
    error: "bg-red-50 text-red-700 border border-red-200",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
