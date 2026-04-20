import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold" | "cta";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const base =
      "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary:
        "bg-teal text-white hover:bg-teal-dark shadow-soft hover:shadow-glow active:scale-[0.98]",
      secondary:
        "bg-navy text-white hover:bg-navy-light shadow-soft active:scale-[0.98]",
      outline:
        "border-2 border-teal text-teal hover:bg-teal hover:text-white active:scale-[0.98]",
      ghost: "text-navy hover:bg-slate-100 active:scale-[0.98]",
      gold: "bg-gold text-navy font-bold hover:bg-gold-dark shadow-soft active:scale-[0.98]",
      cta: "bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-[length:200%_auto] animate-gradient-x text-white font-bold shadow-[0_0_20px_rgba(0,229,255,0.3)] hover:shadow-[0_0_30px_rgba(0,229,255,0.5)] active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-8 px-4 text-sm gap-1.5",
      md: "h-11 px-6 text-base gap-2",
      lg: "h-13 px-8 text-lg gap-2.5",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";
export { Button };
