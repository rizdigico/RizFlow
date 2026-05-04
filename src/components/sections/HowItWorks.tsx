import { useState, useEffect, useCallback } from "react";
import {
  MagnifyingGlassIcon,
  CpuChipIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

function AnimatedPercentage({ targetPct }: { targetPct: number }) {
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    const duration = 1500;
    const start = performance.now();
    let animationFrame: number;

    const animateCountUp = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      if (progress < 1) {
        setCurrentPct(Math.floor(targetPct * easeOutQuart));
        animationFrame = requestAnimationFrame(animateCountUp);
      } else {
        setCurrentPct(targetPct);
        const fluctuateInterval = setInterval(
          () => {
            const fluctuation = Math.floor(Math.random() * 5) - 2;
            setCurrentPct(Math.max(0, Math.min(100, targetPct + fluctuation)));
          },
          1000 + Math.random() * 1500,
        );
        return () => clearInterval(fluctuateInterval);
      }
    };

    animationFrame = requestAnimationFrame(animateCountUp);
    return () => cancelAnimationFrame(animationFrame);
  }, [targetPct]);

  return <>{currentPct}</>;
}

const steps = [
  {
    number: "01",
    Icon: MagnifyingGlassIcon,
    title: "Discover",
    subtitle: "Audit & Analysis",
    description:
      "We map your business workflows, identify bottlenecks, and show you exactly how many hours & cost are lost to manual operations each week — and which agents can fix them.",
    cta: "Start Your Audit",
    ctaHref: "/audit",
    visual: "audit" as const,
  },
  {
    number: "02",
    Icon: CpuChipIcon,
    title: "Build & Deploy",
    subtitle: "Integration & Setup",
    description:
      "We design and build custom AI agents tailored to your business, then integrate them into your existing tools — no rip-and-replace. Run everything from Telegram, WhatsApp, or Slack. Live in 2-4 weeks.",
    cta: "See Integrations",
    ctaHref: "#integrations",
    visual: "deploy" as const,
  },
  {
    number: "03",
    Icon: RocketLaunchIcon,
    title: "Scale",
    subtitle: "Growth & Autonomy",
    description:
      "Your AI agents run admin, comms, and reporting 24/7 — saving 10–20+ hrs/week and cutting costs up to 60%. Check outputs from your phone in under 30 min/week. Reclaim your time. Scale your business.",
    cta: "View Case Studies",
    ctaHref: "/case-study/rainfresh-sg",
    visual: "grow" as const,
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();
  const [activeStep, setActiveStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToStep = useCallback(
    (index: number) => {
      if (index === activeStep || isAnimating) return;
      setIsAnimating(true);
      setActiveStep(index);
      setTimeout(() => setIsAnimating(false), 400);
    },
    [activeStep, isAnimating],
  );

  const nextStep = useCallback(() => {
    if (activeStep < steps.length - 1) goToStep(activeStep + 1);
  }, [activeStep, goToStep]);

  const prevStep = useCallback(() => {
    if (activeStep > 0) goToStep(activeStep - 1);
  }, [activeStep, goToStep]);

  const step = steps[activeStep];

  return (
    <section id="how-it-works" className="relative section-padding">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.05),transparent_40%)]" />

      <div className="container-width relative z-10">
        {/* Header */}
        <div
          ref={ref}
          className={cn(
            "text-center mb-12 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            How{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
              RizFlow
            </span>{" "}
            Works
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Three steps from discovery to a fully autonomous operations layer
            for your business.
          </p>
        </div>

        {/* Step Indicator Bar */}
        <div
          className={cn(
            "flex items-center justify-center gap-2 sm:gap-4 mb-10 md:mb-14 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
          )}
        >
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              className="flex items-center gap-2 sm:gap-3 group"
            >
              <div
                className={cn(
                  "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full transition-all duration-300",
                  i === activeStep
                    ? "bg-teal-500/20 border border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.15)]"
                    : i < activeStep
                      ? "bg-teal-500/10 border border-teal-500/20"
                      : "bg-white/5 border border-white/10 hover:border-white/20",
                )}
              >
                <s.Icon
                  className={cn(
                    "w-4 h-4 transition-colors duration-300",
                    i === activeStep
                      ? "text-teal-400"
                      : i < activeStep
                        ? "text-teal-400/60"
                        : "text-slate-500 group-hover:text-slate-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xs sm:text-sm font-medium transition-colors duration-300 hidden sm:inline",
                    i === activeStep
                      ? "text-teal-300"
                      : i < activeStep
                        ? "text-teal-400/60"
                        : "text-slate-500 group-hover:text-slate-400",
                  )}
                >
                  {s.title}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 sm:w-10 h-px transition-colors duration-300",
                    i < activeStep ? "bg-teal-500/40" : "bg-white/10",
                  )}
                />
              )}
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="max-w-4xl mx-auto">
          <div
            key={activeStep}
            className="animate-[flow-in_0.4s_cubic-bezier(0.16,1,0.3,1)_forwards]"
          >
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
              {/* Left: Text Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center border border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                    <step.Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-teal-400 block">
                      STEP {step.number}
                    </span>
                    <h3 className="text-2xl md:text-3xl font-bold font-heading text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <p className="text-sm font-mono uppercase tracking-wider text-cyan-400/70 mb-3">
                  {step.subtitle}
                </p>

                <p className="text-slate-300 text-base md:text-lg leading-relaxed mb-6">
                  {step.description}
                </p>

                {step.ctaHref.startsWith("#") ? (
                  <a
                    href={step.ctaHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors group/cta"
                  >
                    {step.cta}
                    <span className="transition-all duration-200 group-hover/cta:translate-x-1">
                      →
                    </span>
                  </a>
                ) : (
                  <Link
                    to={step.ctaHref}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors group/cta"
                  >
                    {step.cta}
                    <span className="transition-all duration-200 group-hover/cta:translate-x-1">
                      →
                    </span>
                  </Link>
                )}
              </div>

              {/* Right: Visual Card */}
              <div className="w-full lg:w-[380px] flex-shrink-0">
                {step.visual === "audit" && <AuditCard />}
                {step.visual === "deploy" && <DeployCard />}
                {step.visual === "grow" && <GrowCard />}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center justify-between max-w-4xl mx-auto mt-8 md:mt-10">
          <button
            onClick={prevStep}
            disabled={activeStep === 0}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
              activeStep === 0
                ? "text-slate-600 cursor-not-allowed"
                : "text-slate-400 hover:text-white hover:bg-white/5 border border-white/10 hover:border-white/20",
            )}
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => goToStep(i)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  i === activeStep
                    ? "w-6 bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.5)]"
                    : "bg-white/20 hover:bg-white/30",
                )}
                aria-label={`Go to step ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextStep}
            disabled={activeStep === steps.length - 1}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300",
              activeStep === steps.length - 1
                ? "text-slate-600 cursor-not-allowed"
                : "text-teal-400 hover:text-teal-300 bg-teal-500/10 border border-teal-500/30 hover:border-teal-500/50 hover:bg-teal-500/20",
            )}
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

function AuditCard() {
  const rows = [
    { label: "Customer Intake", pct: 60 },
    { label: "Workflow Tracking", pct: 40 },
    { label: "Invoicing", pct: 75 },
    { label: "Communications", pct: 30 },
    { label: "Social Media", pct: 55 },
  ];
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/20 blur-2xl rounded-full group-hover:bg-teal-500/30 transition-colors duration-500" />

      <div
        className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-50"
        style={{
          animationName: "scanline-vertical",
          animationDuration: "2s",
          animationIterationCount: "infinite",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-teal-400 rounded-sm animate-pulse" />
          Audit Report
        </p>
        {rows.map((r, i) => (
          <div
            key={r.label}
            className="flex items-center justify-between mb-2.5 gap-2"
            style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}
          >
            <span className="text-slate-200 text-[11px] sm:text-xs font-mono whitespace-nowrap">
              {r.label}
            </span>
            <div className="flex items-center gap-2 flex-grow justify-end min-w-0">
              <div className="h-1.5 rounded-full bg-white/5 w-16 overflow-hidden border border-white/5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 relative overflow-hidden"
                  style={{
                    width: `${r.pct}%`,
                    transitionDelay: `${i * 100}ms`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[slideRight_1s_linear_infinite] w-1/2" />
                </div>
              </div>
              <span className="text-teal-400 font-bold text-[10px] w-8 text-right font-mono drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]">
                <AnimatedPercentage targetPct={r.pct} />%
              </span>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-3 border-t border-teal-500/20 flex justify-between items-center bg-teal-950/20 -mx-5 -mb-5 p-5">
          <span className="text-slate-400 text-[10px] flex items-center gap-1.5 font-mono uppercase tracking-widest">
            <MagnifyingGlassIcon className="w-3 h-3 text-teal-400 animate-pulse" />{" "}
            Analysis
          </span>
          <span className="text-teal-400 font-bold text-[10px] bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.1)] font-mono flex items-center gap-1">
            <span className="w-1 h-1 bg-teal-400 rounded-full animate-ping" />
            14 hrs/wk saved
          </span>
        </div>
      </div>
    </div>
  );
}

function DeployCard() {
  const tools = [
    {
      name: "Slack",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path
            fill="#E01E5A"
            d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z"
          />
          <path
            fill="#36C5F0"
            d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z"
          />
          <path
            fill="#2EB67D"
            d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z"
          />
          <path
            fill="#ECB22E"
            d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z"
          />
          <path
            fill="#36C5F0"
            d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z"
          />
          <path
            fill="#2EB67D"
            d="M17.686 8.834a2.527 2.527 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.522-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.522 2.522v6.312z"
          />
          <path
            fill="#ECB22E"
            d="M15.164 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.164 24a2.527 2.527 0 0 1-2.522-2.522v-2.522h2.522z"
          />
          <path
            fill="#E01E5A"
            d="M15.164 17.686a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.314A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.314z"
          />
        </svg>
      ),
    },
    {
      name: "HubSpot",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path
            fill="#FF7A59"
            d="M12.026 21.393c-4.494 0-8.158-3.64-8.158-8.134 0-.825.123-1.637.362-2.42l-2.433-2.18c-.144.608-.225 1.23-.225 1.868 0 5.4 4.378 9.778 9.778 9.778 2.052 0 3.966-.64 5.545-1.722l-2.02-2.585c-.815.545-1.782.868-2.85.868zm10.37-6.064c-.386-3.774-2.73-6.953-6.196-8.23l-.936 3.125c2.083.84 3.593 2.802 3.86 5.17l3.272-.065zm-11.75-9.35c.783 0 1.54.145 2.247.412l2.365-2.22C14.07 3.52 12.87 3.2 11.588 3.2 8.358 3.2 5.518 5.13 4.148 7.89l2.76 1.76c.86-2.17 2.94-3.67 5.34-3.67zm1.196 9.61c-1.258 0-2.28-1.01-2.28-2.257s1.022-2.257 2.28-2.257 2.28 1.01 2.28 2.257-1.022 2.257-2.28 2.257z"
          />
        </svg>
      ),
    },
    {
      name: "Asana",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <circle cx="12" cy="5.955" r="4.705" fill="#F06A6A" />
          <circle cx="5.15" cy="16.835" r="4.705" fill="#F06A6A" />
          <circle cx="18.85" cy="16.835" r="4.705" fill="#F06A6A" />
        </svg>
      ),
    },
    {
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="12" fill="#26A5E4" />
          <path
            d="M5.432 11.873l11.385-4.429c.527-.19.987.13.816.926l.001-.001-1.94 9.137c-.144.649-.525.805-.887.501l-2.448-1.804-1.181 1.137c-.13.13-.24.24-.465.24l.167-2.393 4.55-4.109c.198-.177-.043-.276-.308-.099l-5.627 3.586-2.42-.753c-.648-.206-.663-.648.136-.957z"
            fill="#fff"
          />
        </svg>
      ),
    },
    {
      name: "Notion",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
          <rect x="2" y="2" width="20" height="20" rx="4" fill="#fff" />
          <rect x="3" y="3" width="18" height="18" rx="3" fill="#191919" />
          <path
            d="M7.5 7.5l5.5 8.5h2V7.5h-2v5.5L9 7.5H7.5z"
            fill="#fff"
            stroke="#fff"
            strokeWidth="0.5"
          />
          <line
            x1="7"
            y1="16.5"
            x2="17"
            y2="16.5"
            stroke="#fff"
            strokeWidth="1.5"
          />
        </svg>
      ),
    },
    {
      name: "Gmail",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path
            d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"
            fill="#EA4335"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-cyan-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors duration-500" />

      <div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
        style={{
          animationName: "scanline",
          animationDuration: "3s",
          animationIterationCount: "infinite",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] text-cyan-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-pulse" />
          Neural Integrations
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {tools.map((tool, i) => (
            <div
              key={tool.name}
              className="flex items-center justify-between"
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-white/5 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                  {tool.icon}
                </span>
                <span className="text-slate-200 text-xs font-medium font-mono">
                  {tool.name}
                </span>
              </div>
              <div className="flex items-center gap-1 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  Live
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] font-mono tracking-widest uppercase">
            Agent Status:
          </span>
          <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-mono bg-cyan-500/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            <CpuChipIcon className="w-3.5 h-3.5" /> Core Online
          </span>
        </div>
      </div>
    </div>
  );
}

function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const start = performance.now();
    let animationFrame: number;

    const animate = (time: number) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(target * eased));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCurrent(target);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target]);

  return (
    <>
      {current}
      {suffix}
    </>
  );
}

function GrowCard() {
  const metrics = [
    {
      label: "Operating Costs",
      sublabel: "Reduced",
      target: 60,
      suffix: "%",
      barColor: "from-teal-500 to-cyan-400",
    },
    {
      label: "Weekly Hours",
      sublabel: "Reclaimed",
      target: 20,
      suffix: "+",
      barColor: "from-cyan-500 to-blue-400",
    },
    {
      label: "Revenue",
      sublabel: "Growth Rate",
      target: 40,
      suffix: "%",
      barColor: "from-emerald-500 to-teal-400",
    },
  ];

  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-teal-500/10 blur-2xl rounded-full group-hover:bg-teal-500/20 transition-colors duration-500 animate-pulse-glow" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-30">
        {[...Array(6)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-teal-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-sm animate-pulse" />
            Impact Metrics
          </p>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono">
              Live
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="bg-white/[0.03] rounded-lg px-3.5 py-3 border border-white/5 group-hover:border-teal-500/30 transition-all duration-300"
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.15}s both` }}
            >
              <div className="flex items-end justify-between mb-2">
                <div>
                  <p className="text-white font-bold text-xl font-mono tracking-tight leading-none">
                    <AnimatedCounter target={m.target} suffix={m.suffix} />
                  </p>
                  <p className="text-teal-400/80 text-[10px] uppercase tracking-wider font-mono mt-1">
                    {m.label} {m.sublabel}
                  </p>
                </div>
              </div>
              <div className="h-2 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${m.barColor} relative overflow-hidden`}
                  style={{
                    width: `${m.target}%`,
                    transition: "width 2.5s cubic-bezier(0.16, 1, 0.3, 1)",
                    animation: `fadeIn 0.8s ease-out ${0.5 + i * 0.3}s both`,
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[slideRight_1.5s_linear_infinite] w-1/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg px-3 py-2.5 text-center group-hover:bg-gradient-to-r group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <span className="text-teal-400 text-[11px] font-bold font-mono tracking-widest uppercase flex justify-center items-center gap-2">
            <RocketLaunchIcon
              className="w-4 h-4 animate-bounce"
              style={{ animationDuration: "2s" }}
            />{" "}
            Your Business, On Autopilot
          </span>
        </div>
      </div>
    </div>
  );
}
