import { Link } from "react-router-dom";

type InlineCTAVariant = "soft" | "direct" | "urgency";

interface InlineCTAProps {
  variant?: InlineCTAVariant;
  text: string;
  subtext?: string;
  href?: string;
}

const variants: Record<InlineCTAVariant, { container: string; text: string }> =
  {
    soft: {
      container:
        "border border-teal-500/20 bg-[#0A0F1A]/60 hover:border-teal-500/40",
      text: "text-teal-400",
    },
    direct: {
      container:
        "border border-teal-400/50 bg-teal-500/5 hover:border-teal-400",
      text: "text-teal-400",
    },
    urgency: {
      container:
        "border border-teal-400 bg-teal-500/10 hover:bg-teal-500/20 shadow-[0_0_15px_rgba(0,229,255,0.1)]",
      text: "text-teal-300",
    },
  };

export function InlineCTA({
  variant = "soft",
  text,
  subtext,
  href = "/audit",
}: InlineCTAProps) {
  const v = variants[variant];
  return (
    <div
      className={`my-10 rounded-xl p-6 text-center transition-all not-prose ${v.container}`}
    >
      <p className={`font-heading font-bold text-lg ${v.text} mb-1`}>{text}</p>
      {subtext && (
        <p className="text-slate-400 font-mono text-xs mb-4">{subtext}</p>
      )}
      <Link
        to={href}
        className={`inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400 ${v.text} uppercase tracking-widest text-xs px-6 py-3 rounded hover:bg-teal-400 hover:text-[#050A14] transition-all duration-300`}
      >
        Get Free Discovery Audit →
      </Link>
    </div>
  );
}
