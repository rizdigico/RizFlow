import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Essential",
    price: "1,800",
    tagline: "Core automation for small businesses",
    description:
      "Essential agent stack to automate your daily operations and reclaim hours every week.",
    features: [
      "Customer Intake Agent",
      "Workflow & Tracking Agent",
      "Scheduling & Allocation Agent",
      "Billing & Finance Agent",
      "Weekly performance report",
      "Email support",
      "Up to 3 integrations",
    ],
    cta: "GET STARTED",
    highlighted: false,
    status: "ONLINE",
  },
  {
    name: "Professional",
    price: "3,000",
    tagline: "Full automation for growing businesses",
    description:
      "Complete agent suite with custom agents, predictive analytics, and autonomous communications.",
    features: [
      "Everything in Essential",
      "Communication Agent",
      "Quality Assurance Agent",
      "1 Custom Agent of your choice",
      "Revenue forecasting",
      "Analytics dashboard",
      "Priority support",
      "Up to 8 integrations",
      "Monthly strategy sync",
    ],
    cta: "DEPLOY PRO STACK",
    highlighted: true,
    status: "RECOMMENDED",
  },
  {
    name: "Enterprise",
    price: "4,500",
    tagline: "Full-scale AI for complex operations",
    description:
      "Full-scale automation with unlimited custom agents, white-label portals, and API access.",
    features: [
      "Everything in Professional",
      "Unlimited custom agents",
      "Customer Success Agent",
      "Financial forecasting",
      "White-label portal",
      "Direct API access",
      "Unlimited integrations",
      "Dedicated deployment manager",
      "Quarterly system review",
    ],
    cta: "CONTACT SALES",
    highlighted: false,
    status: "CUSTOM",
  },
];

export function PricingTable() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative section-padding bg-transparent overflow-visible">
      {/* Premium ambient glow background - subtle since it's shared now */}
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
              Implementation Tiers
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            Custom AI, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto font-mono text-sm">
            Choose your agent stack. Every plan is tailored to your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative rounded-xl p-5 sm:p-8 flex flex-col transition-all duration-500",
                plan.highlighted
                  ? "bg-[#0A0F1A]/95 backdrop-blur-3xl text-white shadow-[0_0_30px_rgba(0,229,255,0.3)] sm:scale-[1.02] border-2 border-teal-400/50 z-10"
                  : "bg-[#0A0F1A]/80 backdrop-blur-xl border border-teal-500/20 hover:border-teal-500/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]",
              )}
            >
              {/* Internal overflow container for animations */}
              <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
                {plan.highlighted && (
                  <div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-50"
                    style={{ animation: "slideRight 3s ease-in-out infinite" }}
                  />
                )}
              </div>

              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-[#050A14] border border-teal-400/50 rounded-full shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-teal-300 uppercase tracking-widest font-bold">
                      {plan.status}
                    </span>
                  </div>
                </div>
              )}

              <div className="mb-8 mt-2">
                <h3
                  className={cn(
                    "text-2xl font-bold font-mono tracking-tight mb-2",
                    plan.highlighted
                      ? "text-white drop-shadow-[0_0_10px_rgba(0,229,255,0.5)]"
                      : "text-slate-200",
                  )}
                >
                  {plan.name}
                </h3>
                <p className="text-xs font-mono text-slate-400 tracking-widest uppercase mb-6 h-8">
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl sm:text-5xl font-black font-heading text-white tracking-tighter">
                    Custom
                  </span>
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
                  variant={plan.highlighted ? "cta" : "outline"}
                  className={cn(
                    "w-full font-mono uppercase tracking-widest text-sm",
                    !plan.highlighted &&
                      "border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:border-teal-400/50",
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
