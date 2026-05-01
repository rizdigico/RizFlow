import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxScroll } from "@/hooks/useFlowingAnimation";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { cn } from "@/lib/utils";

// ── Animated Counter ────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const { ref: scrollRef, isVisible } = useScrollAnimation();

  useEffect(() => {
    if (!isVisible) return;
    const duration = 1800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isVisible, target]);

  return (
    <span ref={scrollRef}>
      <span ref={ref}>
        {value}
        {suffix}
      </span>
    </span>
  );
}

// ── Metric Card ─────────────────────────────────────────────────────
function MetricCard({
  label,
  emoji,
  before,
  after,
  change,
  changeNum,
  suffix,
  negative,
}: {
  label: string;
  emoji: string;
  before: string;
  after: string;
  change: string;
  changeNum: number;
  suffix?: string;
  negative?: boolean;
}) {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative bg-[#0A0F1A] rounded-xl p-5 text-center border shadow-[0_0_30px_rgba(0,229,255,0.08)] overflow-hidden transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        negative
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-teal-500/20 hover:border-teal-500/40",
      )}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />

      {/* Glow blob */}
      <div
        className={cn(
          "absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-500",
          negative ? "bg-red-500/15" : "bg-teal-500/15",
        )}
      />

      {/* Scan line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent opacity-60" />

      <div className="relative z-10">
        <span className="text-2xl block mb-2">{emoji}</span>
        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-1">
          {label}
        </p>
        <p
          className={cn(
            "text-2xl font-bold font-mono drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]",
            negative ? "text-red-400" : "text-teal-400",
          )}
        >
          {isVisible ? (
            <>
              {change.startsWith("-") ? "-" : ""}
              {change.startsWith("-") || change.startsWith("+") ? (
                <AnimatedCounter target={changeNum} suffix={suffix} />
              ) : (
                change
              )}
            </>
          ) : (
            "—"
          )}
        </p>
        <p className="text-[10px] text-slate-600 mt-1 font-mono">
          {before} → {after}
        </p>
      </div>
    </motion.div>
  );
}

// ── Data ────────────────────────────────────────────────────────────
const metrics = [
  {
    label: "Processing Time",
    emoji: "⚡",
    before: "2-3 hrs/day",
    after: "<3 sec/order",
    change: "-99%",
    changeNum: 99,
    suffix: "%",
    negative: true,
  },
  {
    label: "Stockout Incidents",
    emoji: "📦",
    before: "3-4/month",
    after: "0",
    change: "-100%",
    changeNum: 100,
    suffix: "%",
    negative: true,
  },
  {
    label: "Social Posts/Week",
    emoji: "📱",
    before: "0",
    after: "7",
    change: "+7",
    changeNum: 7,
    negative: false,
  },
  {
    label: "Confirmation Emails",
    emoji: "✉️",
    before: "0%",
    after: "100%",
    change: "+100%",
    changeNum: 100,
    suffix: "%",
    negative: false,
  },
  {
    label: "Hours Saved/Week",
    emoji: "🕐",
    before: "—",
    after: "14+",
    change: "1.75 days",
    changeNum: 0,
    negative: false,
  },
  {
    label: "Order Errors",
    emoji: "🐛",
    before: "2-3/week",
    after: "<1/month",
    change: "-94%",
    changeNum: 94,
    suffix: "%",
    negative: true,
  },
];

const steps = [
  {
    step: "01",
    emoji: "🔍",
    title: "Discovery Call (30 min)",
    desc: "We learn your workflows, pain points, and goals. No technical jargon — just your business needs.",
  },
  {
    step: "02",
    emoji: "⚙️",
    title: "Agent Configuration (1-2 days)",
    desc: "We set up AI agents tailored to YOUR specific workflows. No templates, no one-size-fits-all.",
  },
  {
    step: "03",
    emoji: "🧪",
    title: "Testing & Approval (1 day)",
    desc: "You review everything before it goes live. All actions are logged and transparent.",
  },
  {
    step: "04",
    emoji: "🚀",
    title: "Go Live",
    desc: "Your agents start working immediately. Most clients see ROI within the first week.",
  },
];

const differentiators = [
  {
    emoji: "🎯",
    title: "No Templates",
    desc: "Every agent is configured for your specific workflows",
  },
  {
    emoji: "🛠️",
    title: "No New Software",
    desc: "Agents work through your existing tools (email, sheets, social)",
  },
  {
    emoji: "🎛️",
    title: "You Stay in Control",
    desc: "All actions logged. You approve content before it goes out",
  },
  {
    emoji: "📈",
    title: "Results in Days",
    desc: "Most clients see ROI within the first week",
  },
];

const painPoints = [
  "2-3 hours/day manually processing orders",
  "Stockouts discovered only after customer complaints",
  "Zero social media presence despite selling on TikTok",
  "No order confirmation or shipping emails",
];

const improvements = [
  "Orders auto-confirmed in under 3 seconds",
  "48-hour advance stock alerts — zero stockouts",
  "7 posts/week scheduled automatically",
  "100% automated confirmation & shipping emails",
];

// ── Component ────────────────────────────────────────────────────────
export function CaseStudy() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: challengeRef, isVisible: challengeVisible } =
    useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();
  const { ref: diffRef, isVisible: diffVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <>
      <Helmet>
        <title>RainFreshSG Case Study — RizFlow AI Automation</title>
        <meta
          name="description"
          content="See how RainFreshSG went from 2-3 hours/day on manual operations to automated order processing, inventory alerts, and social scheduling with RizFlow."
        />
      </Helmet>

      <section className="relative bg-navy-dark w-full overflow-hidden">
        {/* Flowing mesh background */}
        <motion.div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} parallax={false} />
        </motion.div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-[length:32px_32px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0)_80%)] opacity-10 pointer-events-none" />

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 lg:py-28">
          {/* ── Hero ─────────────────────────────────── */}
          <motion.div
            ref={heroRef}
            className={cn(
              "text-center mb-16 transition-all duration-700",
              heroVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/5 border border-teal/20 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.15)] mb-6">
              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              <span className="text-sm text-teal-300 font-mono font-medium tracking-wide uppercase">
                Case Study 1
              </span>
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-white mb-4 text-shadow-glow">
              RainFreshSG
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From manual operations to automated growth — how a Singapore
              e-commerce brand cut order processing time by{" "}
              <span className="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                99%
              </span>{" "}
              and went from zero to{" "}
              <span className="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                7 social posts
              </span>{" "}
              per week.
            </p>
          </motion.div>

          {/* ── Challenge ───────────────────────────── */}
          <motion.div
            ref={challengeRef}
            className={cn(
              "bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden transition-all duration-700",
              challengeVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">🔄</span> The Challenge
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                    Before RizFlow
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    {painPoints.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 shadow-[0_0_5px_rgba(248,113,113,0.5)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    After RizFlow
                  </h3>
                  <ul className="space-y-3 text-slate-300">
                    {improvements.map((point) => (
                      <li
                        key={point}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Metrics ─────────────────────────────── */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {metrics.map((m, i) => (
              <div key={m.label} style={{ transitionDelay: `${i * 100}ms` }}>
                <MetricCard {...m} />
              </div>
            ))}
          </div>

          {/* ── How It Works ────────────────────────── */}
          <motion.div
            ref={stepsRef}
            className={cn(
              "bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden transition-all duration-700",
              stepsVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">⚙️</span> How It Works
              </h2>
              <div className="space-y-6">
                {steps.map((item) => (
                  <div key={item.step} className="flex items-start gap-4 group">
                    <span className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-lg shrink-0 border border-teal/20 shadow-[0_0_15px_rgba(45,212,191,0.2)] group-hover:bg-teal/20 transition-colors duration-300">
                      {item.emoji}
                    </span>
                    <div>
                      <h3 className="font-semibold text-white text-base">
                        <span className="text-teal-400 font-mono text-xs mr-2">
                          STEP {item.step}
                        </span>
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── What Makes This Different ───────────── */}
          <motion.div
            ref={diffRef}
            className={cn(
              "bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden transition-all duration-700",
              diffVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">💎</span> What Makes This Different
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {differentiators.map((item) => (
                  <div
                    key={item.title}
                    className="group p-4 bg-white/5 rounded-lg border border-white/5 hover:border-teal-500/30 transition-colors duration-300"
                  >
                    <h3 className="font-semibold text-teal-400 mb-1 flex items-center gap-2">
                      <span className="text-lg">{item.emoji}</span>
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-400">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── CTA ─────────────────────────────────── */}
          <motion.div
            ref={ctaRef}
            className={cn(
              "bg-[#0A0F1A] border border-teal-500/30 rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-700",
              ctaVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8",
            )}
          >
            {/* Radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_0%,transparent_70%)]" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />

            {/* Scan line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

            <div className="relative z-10">
              <span className="text-4xl block mb-4">🤖</span>
              <h2 className="text-2xl font-bold font-heading text-white mb-2">
                See this running for your business
              </h2>
              <p className="text-slate-400 mb-6">
                We set up AI agents specifically for your workflows. No
                templates, no one-size-fits-all.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/demo"
                  className="group relative px-6 py-3 rounded-lg text-white font-medium transition-all overflow-hidden shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x" />
                  <span className="relative flex items-center gap-2 font-bold">
                    Try the Live Demo →
                  </span>
                </Link>
                <Link
                  to="/audit"
                  className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-lg text-slate-300 font-medium transition-all border border-white/10 hover:bg-white/10 hover:border-white/20"
                >
                  Book a Call
                </Link>
              </div>
            </div>
          </motion.div>

          <p className="text-center text-[10px] text-slate-600 mt-8 font-mono tracking-widest uppercase">
            📋 Case study verified by RainFreshSG. Results based on actual
            deployment data.
          </p>
        </div>
      </section>
    </>
  );
}
