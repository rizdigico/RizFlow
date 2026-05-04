import { useState, useEffect } from "react";
import {
  MagnifyingGlassIcon,
  CpuChipIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

function AnimatedPercentage({ targetPct }: { targetPct: number }) {
  const [currentPct, setCurrentPct] = useState(0);

  useEffect(() => {
    // Phase 1: Rapidly count up to target percentage
    const duration = 1500; // 1.5 seconds
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
        // Phase 2: Start fluctuating slightly to look "live"
        const fluctuateInterval = setInterval(
          () => {
            // Fluctuate between -2% and +2% of target
            const fluctuation = Math.floor(Math.random() * 5) - 2;
            setCurrentPct(Math.max(0, Math.min(100, targetPct + fluctuation)));
          },
          1000 + Math.random() * 1500,
        ); // Random interval between 1-2.5s

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
    description:
      "We map your business workflows, identify bottlenecks, and show you exactly how many hours are lost to manual operations each week — and which agents can automate them.",
    cta: "Start Your Audit",
    ctaHref: "/audit",
    visual: <AuditCard />,
  },
  {
    number: "02",
    Icon: CpuChipIcon,
    title: "Build & Deploy",
    description:
      "We design and build custom AI agents tailored to your business, then integrate them into your existing tools — no rip-and-replace. Run everything from Telegram, WhatsApp, or Slack. Live in 2-4 weeks.",
    cta: "See Integrations",
    ctaHref: "#integrations",
    visual: <DeployCard />,
  },
  {
    number: "03",
    Icon: RocketLaunchIcon,
    title: "Scale",
    description:
      "Your custom AI agents handle admin, communications, reporting, and project tracking around the clock — saving 10–20+ hours per week and cutting operational costs by up to 60%. Review outputs in under 30 minutes per week — from your phone — and invest reclaimed hours into growing your business.",
    cta: "View Case Studies",
    ctaHref: "/case-study/rainfresh-sg",
    visual: <GrowCard />,
  },
];

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="how-it-works" className="relative section-padding">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.05),transparent_40%)]" />

      <div className="container-width relative z-10">
        <div
          ref={ref}
          className={cn(
            "text-center mb-16 transition-all duration-700",
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

        <div className="flex flex-col gap-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className={cn(
                "group flex flex-col transition-all duration-700 relative",
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8",
              )}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {/* Connector line (hidden on mobile, visible on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 right-[-4%] w-[8%] border-t border-dashed border-white/10" />
              )}

              <div className="relative bg-navy-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-6 sm:p-8 h-full flex flex-col md:flex-row md:items-start gap-6 md:gap-8 hover:border-teal/30 transition-colors duration-300">
                <div className="flex items-center gap-4 md:min-w-[220px] relative z-10 md:flex-col md:items-start md:gap-3">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center border border-teal/20 group-hover:bg-teal/20 transition-colors duration-300 shadow-[0_0_15px_rgba(45,212,191,0.2)] flex-shrink-0">
                    <step.Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-teal-400 block mb-1">
                      STEP {step.number}
                    </span>
                    <h3 className="text-2xl font-bold font-heading text-white">
                      {step.title}
                    </h3>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="w-full relative">
                    {/* Subtle highlight effect behind visual */}
                    <div className="absolute inset-0 bg-teal/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10 transform group-hover:scale-[1.02] transition-transform duration-300">
                      {step.visual}
                    </div>
                  </div>
                </div>

                {step.ctaHref.startsWith("#") ? (
                  <a
                    href={step.ctaHref}
                    className="mt-auto text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-2 group-hover:gap-3"
                  >
                    {step.cta}
                    <span className="transition-all duration-200">→</span>
                  </a>
                ) : (
                  <Link
                    to={step.ctaHref}
                    className="mt-auto text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-2 group-hover:gap-3"
                  >
                    {step.cta}
                    <span className="transition-all duration-200">→</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AuditCard() {
  const rows = [
    { label: "Admin & Reporting", pct: 70 },
    { label: "Client Deliverables", pct: 55 },
    { label: "Communications", pct: 65 },
    { label: "Social Media", pct: 45 },
  ];
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/20 blur-2xl rounded-full group-hover:bg-teal-500/30 transition-colors duration-500 animate-pulse" />

      {/* Scanning Line Animation */}
      <div
        className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-50 animate-[slideRight_2s_ease-in-out_infinite]"
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
      name: "Telegram",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#26A5E4]">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12.056 0h-.112zm4.962 7.224c.1-.02.21-.02.32.01.1.03.19.09.26.17.07.08.12.18.14.29.02.11.01.22-.02.31l-2.97 13.51c-.05.2-.18.36-.36.46-.18.1-.39.12-.58.06l-3.86-1.56-2.12 2.29c-.14.15-.34.24-.55.24h-.01c-.1 0-.2-.02-.3-.07-.1-.04-.18-.1-.26-.18-.07-.08-.13-.18-.16-.29-.04-.1-.05-.22-.03-.33l.6-3.16 5.93-5.59c.12-.11.12-.22.02-.3-.1-.09-.22-.07-.35.02L6.93 14.37l-3.6-1.2c-.21-.07-.38-.22-.48-.42-.1-.2-.12-.43-.05-.64.07-.21.22-.38.42-.48L16.62 7.28c.09-.04.19-.06.28-.06z" />
        </svg>
      ),
      connected: true,
    },
    {
      name: "WhatsApp",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.491 0 1.472 1.035 2.91 1.177 3.108.142.198 2.098 3.2 5.078 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.881 11.881 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
        </svg>
      ),
      connected: true,
    },
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
      connected: true,
    },
    {
      name: "Gmail",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path
            fill="#EA4335"
            d="M5.266 9.764A7.077 7.077 0 0 1 12 4.908c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.054 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.114z"
          />
          <path
            fill="#34A853"
            d="M16.04 18.013C14.85 18.72 13.462 19.092 12 19.092c-2.7 0-4.996-1.562-6.116-3.826l-4.04 3.062C3.755 22.25 7.562 24 12 24c2.934 0 5.738-1.014 7.91-2.918l-3.87-3.07z"
          />
          <path
            fill="#4A90D9"
            d="M19.91 21.082C22.16 19.092 24 15.894 24 12c0-.714-.074-1.43-.218-2.118H12v4.636h6.734c-.332 1.662-1.184 2.938-2.356 3.795l3.532 2.77z"
          />
          <path
            fill="#FBBC05"
            d="M5.884 14.268A7.123 7.123 0 0 1 4.908 12c0-.778.13-1.528.358-2.236L1.24 6.65A11.95 11.95 0 0 0 0 12c0 1.94.466 3.774 1.24 5.428l4.644-3.16z"
          />
        </svg>
      ),
      connected: true,
    },
    {
      name: "Notion",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
          <path d="M4.459 4.208c.746.606 1.026.56 2.928.46l15.342-.592c.39 0 .064-.39-.057-.446L20.12 2.28c-.736-.562-1.644-1.212-3.406-1.112L1.69 2.58c-.612.056-.735.378-.735.78v13.6c0 .504.25.673.78.617l2.724-.335V4.208zm4.977 6.44v8.58c0 .505.116.617.56.673l3.356.168V11.676l-3.916-.028zm-3.91-.058v9.477l3.91-.168V11.05l-3.91-.058zm14.672-5.66l-15.338.899v1.743l15.338-.9V5.03zM15.628 9.4l-3.916.028v9.028l3.916-.168V9.4zm4.488-.338l-3.916.058v8.9l3.916.168V9.062zm2.244-1.685l-1.68.056V9.4l1.68-.028V7.377zm0 3.19l-1.68.028v8.976l1.68-.168V10.567zm0 0" />
        </svg>
      ),
      connected: true,
    },
    {
      name: "QuickBooks",
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#2CA01C]">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.848 12.87h-1.065V8.382h1.065v4.487zm-5.193 0h-1.065V8.382h1.065v4.487zm-4.676 0H6.914V8.382h1.065v4.487zm-2.876 0H4.038V8.382h1.065v4.487zm2.876 4.678h-2.81v-1.066h2.81v1.066zm5.193 0h-2.81v-1.066h2.81v1.066zm5.193 0h-2.81v-1.066h2.81v1.066z" />
        </svg>
      ),
      connected: true,
    },
  ];
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-cyan-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors duration-500" />

      {/* Scanning Line Animation */}
      <div
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-[slideUp_3s_linear_infinite]"
        style={{
          animationName: "scanline",
          animationDuration: "3s",
          animationIterationCount: "infinite",
        }}
      />

      <div className="relative z-10">
        <p className="text-[10px] text-cyan-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-pulse" />
          Connects to Your Tools
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {tools.map((tool, i) => (
            <div
              key={tool.name}
              className="flex items-center justify-between"
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.15}s both` }}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded bg-white/5 border border-cyan-500/20 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,229,255,0.1)]">
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
        <div className="mt-3 text-center">
          <span className="text-[10px] text-slate-500 font-mono tracking-wider">
            + 100 more tools & apps
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
          <span className="text-slate-400 text-[10px] font-mono tracking-widest uppercase flex items-center gap-1.5">
            <CpuChipIcon className="w-3 h-3" /> Run from:
          </span>
          <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-mono bg-cyan-500/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.2)]">
            Phone via Telegram, WhatsApp, Slack
          </span>
        </div>
      </div>
    </div>
  );
}

function GrowCard() {
  const metrics = [
    { label: "Hours Saved", value: "120+", change: "+15%", good: true },
    { label: "Cost Reduced", value: "$4.5k", change: "", good: true },
    { label: "Output Vol", value: "+35%", change: "", good: true },
  ];
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/10 blur-2xl rounded-full group-hover:bg-teal-500/20 transition-colors duration-500 animate-pulse-glow" />

      {/* Processing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-30">
        {[...Array(5)].map((_, i) => (
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
        <div className="grid grid-cols-3 gap-3 mb-4">
          {metrics.map((m, i) => (
            <div
              key={m.label}
              className="text-center bg-white/5 rounded-lg py-2 border border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:border-teal-500/30 transition-colors duration-300"
              style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}
            >
              <p className="text-white font-bold text-lg font-mono tracking-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">
                {m.value}
              </p>
              <p className="text-teal-400/80 text-[9px] leading-tight mt-0.5 uppercase tracking-wider font-mono">
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg px-3 py-2 text-center group-hover:bg-gradient-to-r group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <span className="text-teal-400 text-[10px] font-bold font-mono tracking-widest uppercase flex justify-center items-center gap-2">
            <RocketLaunchIcon
              className="w-3.5 h-3.5 animate-bounce"
              style={{ animationDuration: "2s" }}
            />{" "}
            Capacity Expanded
          </span>
        </div>
      </div>
    </div>
  );
}
