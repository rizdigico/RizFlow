import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const engagements = [
  {
    name: "Starter",
    setup: "1,500",
    price: "1,800",
    tagline: "1-2 agents, single channel",
    description:
      "Core automation for solo operators — handle admin, scheduling, or billing through one platform.",
    features: [
      "1-2 custom AI agents",
      "Single channel integration (Telegram or WhatsApp)",
      "Basic admin automation",
      "Monthly performance report",
      "Email & chat support",
    ],
    highlight: false,
  },
  {
    name: "Growth",
    setup: "3,000",
    price: "3,000",
    tagline: "3-5 agents, multi-channel",
    description:
      "Full operations coverage for growing businesses — admin, billing, scheduling, and communications running on autopilot.",
    features: [
      "3-5 custom AI agents",
      "Multi-channel (Telegram, WhatsApp, Slack, Email)",
      "Admin, scheduling & billing automation",
      "Weekly performance reports",
      "Priority support & onboarding calls",
      "90-day time-savings (money-back guaranteed)",
    ],
    highlight: true,
  },
  {
    name: "Scale",
    setup: "5,000",
    price: "4,500",
    tagline: "5+ agents, full stack",
    description:
      "Comprehensive automation for established businesses — unlimited agents, custom integrations, and a dedicated point of contact.",
    features: [
      "5+ custom agents, unlimited scope",
      "All channels + custom integrations",
      "Full operations automation",
      "Real-time dashboards & analytics",
      "Dedicated account manager",
      "SLA-backed uptime guarantee",
    ],
    highlight: false,
  },
];

export function PricingTable() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative section-padding bg-transparent overflow-visible">
      {/* Premium ambient glow background */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-teal-900/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container-width relative z-10">
        <div
          ref={ref}
          className={cn(
            "text-center mb-16 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest font-mono">
              Pricing
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            Starting from $1,800/mo
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            Every business is different. Your price depends on how many agents
            you need and how complex your workflows are. After your free audit,
            you'll get an exact quote — no surprises.
          </p>
          <p className="text-sm text-teal-400/80 font-mono mt-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            90-day time-savings on all engagements, if not money-back guaranteed
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {engagements.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl p-5 sm:p-8 flex flex-col transition-all duration-500",
                plan.highlight
                  ? "bg-[#0A0F1A]/95 backdrop-blur-3xl text-white shadow-[0_0_30px_rgba(0,229,255,0.3)] sm:scale-[1.02] border-2 border-teal-400/50 z-10"
                  : "bg-[#0A0F1A]/80 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]",
              )}
            >
              {/* Internal overflow container for animations */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                {plan.highlight && (
                  <div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50"
                    style={{ animation: "slideRight 3s ease-in-out infinite" }}
                  />
                )}
              </div>

              {plan.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#050A14] border border-teal-400/50 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-teal-300 uppercase tracking-widest font-bold">
                      Most Common
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-8 mt-2">
                <h3
                  className={cn(
                    "text-2xl font-bold font-mono tracking-tight mb-2",
                    plan.highlight
                      ? "text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                      : "text-slate-200",
                  )}
                >
                  {plan.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-6 h-8">
                  {plan.tagline}
                </p>
                <div className="mb-2">
                  <p className="text-xs font-mono text-slate-500 mb-1">
                    One-time setup:{" "}
                    <span className="text-slate-300">${plan.setup}</span>
                  </p>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tighter">
                    ${plan.price}
                  </span>
                  <span className="text-slate-400 font-mono text-sm">/mo</span>
                </div>
                <p className="text-sm font-mono leading-relaxed text-slate-400">
                  {plan.description}
                </p>
              </div>

              <div className="h-[1px] w-full bg-teal-500/10 mb-8" />

              <ul className="space-y-4 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="text-emerald-400 font-mono text-sm mt-0.5 font-bold">
                      [x]
                    </span>
                    <span className="text-sm font-mono text-slate-300 opacity-90">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/audit" className="w-full block mt-auto">
                <Button
                  variant={plan.highlight ? "cta" : "outline"}
                  className={cn(
                    "w-full font-mono uppercase tracking-widest text-sm",
                    !plan.highlight &&
                      "border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50",
                  )}
                >
                  Get Free Audit
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-6 space-y-2">
          <p className="text-xs text-slate-500 font-mono tracking-wide">
            All prices are in SGD. Custom scope quoted after your free audit. No
            lock-in contracts.
          </p>
          <p className="text-xs text-teal-400/70 font-mono tracking-wide">
            Setup fee waived with annual commitment →
          </p>
        </div>
      </div>
    </section>
  );
}
