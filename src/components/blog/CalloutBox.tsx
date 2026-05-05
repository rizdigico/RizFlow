import type { ReactNode } from "react";

type CalloutType = "insight" | "warning" | "tip";

interface CalloutBoxProps {
  type: CalloutType;
  children: ReactNode;
}

const styles: Record<
  CalloutType,
  { border: string; bg: string; icon: string; label: string }
> = {
  insight: {
    border: "border-l-teal-400",
    bg: "bg-[#0A0F1A]/60",
    icon: "◈",
    label: "INSIGHT",
  },
  warning: {
    border: "border-l-amber-400",
    bg: "bg-[#0A0F1A]/60",
    icon: "⚠",
    label: "NOTE",
  },
  tip: {
    border: "border-l-emerald-400",
    bg: "bg-[#0A0F1A]/60",
    icon: "→",
    label: "TIP",
  },
};

export function CalloutBox({ type, children }: CalloutBoxProps) {
  const s = styles[type];
  return (
    <div
      className={`my-8 ${s.bg} border-l-2 ${s.border} rounded-r-xl p-5 not-prose`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm">{s.icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {s.label}
        </span>
      </div>
      <div className="text-slate-300 text-sm font-sans leading-relaxed">
        {children}
      </div>
    </div>
  );
}
