import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/lib/constants";

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
    label: "Listing Time",
    emoji: "🏷️",
    before: "45 min/listing",
    after: "<3 min/listing",
    change: "-93%",
    changeNum: 93,
    suffix: "%",
    negative: true,
  },
  {
    label: "Customer Response",
    emoji: "💬",
    before: "2-4 hrs",
    after: "<30 sec",
    change: "-99%",
    changeNum: 99,
    suffix: "%",
    negative: true,
  },
  {
    label: "Social Posts/Week",
    emoji: "📱",
    before: "0",
    after: "5",
    change: "+5",
    changeNum: 5,
    negative: false,
  },
  {
    label: "SEO Listings",
    emoji: "🔍",
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
    after: "10+",
    change: "1.25 days",
    changeNum: 0,
    negative: false,
  },
  {
    label: "Missed Messages",
    emoji: "📩",
    before: "8-10/week",
    after: "0",
    change: "-100%",
    changeNum: 100,
    suffix: "%",
    negative: true,
  },
];

const steps = [
  {
    step: "01",
    emoji: "🔍",
    title: "Discovery Call (30 min)",
    desc: "We learn your product line, target audience, and pain points. No jargon — just your business.",
  },
  {
    step: "02",
    emoji: "⚙️",
    title: "Agent Configuration (2-3 weeks)",
    desc: "We set up AI agents tailored to your Etsy shop, Printify integration, and marketing channels.",
  },
  {
    step: "03",
    emoji: "🧪",
    title: "Testing & Approval (1 week)",
    desc: "You review everything before it goes live. All actions logged and transparent.",
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
    desc: "Every agent is configured for your specific product line and audience",
  },
  {
    emoji: "🛠️",
    title: "No New Software",
    desc: "Agents work through your existing tools (Etsy, Printify, Gmail, Sheets, Instagram)",
  },
  {
    emoji: "🎛️",
    title: "You Stay in Control",
    desc: "All actions logged. You approve listings and content before they go live",
  },
  {
    emoji: "📈",
    title: "Results in Days",
    desc: "Most clients see ROI within the first week of deployment",
  },
];

const painPoints = [
  "45 minutes per manually created Etsy listing with SEO",
  "Customer messages sitting unanswered for 2-4 hours",
  "Zero social media presence for a visual product brand",
  "8-10 missed customer inquiries per week during off-hours",
];

const improvements = [
  "Etsy listings auto-generated with SEO in under 3 minutes",
  "Customer inquiries answered in under 30 seconds, 24/7",
  "5 social posts/week scheduled across Instagram & Pinterest",
  "100% of customer messages answered within seconds",
];

const dayBefore = [
  { time: "6:00 AM", task: "Check Etsy for new orders overnight" },
  { time: "7:30 AM", task: "Manually create new listing — write, tag, SEO" },
  { time: "9:00 AM", task: "Respond to customer messages one by one" },
  { time: "11:00 AM", task: "Try to post on Instagram (no time left)" },
  { time: "1:00 PM", task: "Update Printify product variants manually" },
  { time: "3:00 PM", task: "Missed 3 more customer inquiries" },
];

const dayAfter = [
  { time: "10:00 AM", task: "Check phone — orders processed, listings live" },
  { time: "10:05 AM", task: "Review agent dashboard for the day" },
  { time: "10:15 AM", task: "Focus on designing new product lines" },
];

// ── Component ────────────────────────────────────────────────────────
export function BrewedIdentityCaseStudy() {
  const { ref: heroRef, isVisible: heroVisible } = useScrollAnimation();
  const { ref: challengeRef, isVisible: challengeVisible } =
    useScrollAnimation();
  const { ref: stepsRef, isVisible: stepsVisible } = useScrollAnimation();
  const { ref: diffRef, isVisible: diffVisible } = useScrollAnimation();
  const { ref: ctaRef, isVisible: ctaVisible } = useScrollAnimation();

  return (
    <>
      <Helmet>
        <title>Brewed Identity Case Study — RizFlow AI Automation</title>
        <meta
          name="description"
          content="See how Brewed Identity went from 45-min listings and unanswered messages to automated Etsy listing creation, 30-sec customer responses, and 5 social posts/week with RizFlow."
        />
        <link rel="canonical" href={`${SITE_URL}/case-study/brewed-identity`} />
        <meta
          property="og:title"
          content="Brewed Identity Case Study — 93% Faster Etsy Listings with RizFlow"
        />
        <meta
          property="og:description"
          content="How a Singapore print-on-demand Etsy shop cut listing time by 93%, eliminated missed messages, and went from zero to 5 social posts/week with custom AI agents."
        />
        <meta
          property="og:url"
          content={`${SITE_URL}/case-study/brewed-identity`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${SITE_URL}/og-banner.jpg`} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Brewed Identity Case Study — 93% Faster Etsy Listings with RizFlow"
        />
        <meta
          name="twitter:description"
          content="How a POD Etsy shop cut listing time by 93% with custom AI agents."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og-banner.jpg`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: SITE_URL,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Case Studies",
                item: `${SITE_URL}/case-study`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Brewed Identity",
                item: `${SITE_URL}/case-study/brewed-identity`,
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline:
              "Brewed Identity Case Study — AI Automation for Print-on-Demand Etsy Shop",
            description:
              "How Brewed Identity went from 45-min listings and unanswered messages to automated Etsy listing creation, instant customer responses, and consistent social media with RizFlow.",
            url: `${SITE_URL}/case-study/brewed-identity`,
            datePublished: "2026-05-01",
            dateModified: "2026-05-07",
            author: {
              "@type": "Person",
              name: "Aariz Arfan",
              url: `${SITE_URL}/about`,
            },
            publisher: {
              "@type": "Organization",
              name: "RizFlow",
              url: SITE_URL,
              logo: `${SITE_URL}/agency-logo-square.png`,
            },
            image: `${SITE_URL}/og-banner.jpg`,
          })}
        </script>
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
                Case Study 2
              </span>
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold font-heading text-white mb-4 text-shadow-glow flex items-center justify-center gap-3">
              Brewed Identity
              <a
                href="https://www.etsy.com/shop/BrewedIdentity"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-orange-500/20 hover:via-red-500/20 hover:to-yellow-500/20 hover:border-orange-400/30 transition-all duration-300 group"
                aria-label="Brewed Identity Etsy"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4.5 h-4.5 text-slate-400 group-hover:text-orange-300 transition-colors"
                  fill="currentColor"
                >
                  <path d="M9.523 3.038C7.878 2.862 6.039 3.2 4.65 4.199c-1.97 1.418-2.422 3.88-1.55 5.804.815 1.793 2.623 3.217 4.516 4.064-.632 1.67-1.222 3.349-1.058 5.184.127 1.419.957 2.834 2.428 3.268.826.24 1.76.153 2.514-.28.753-.431 1.277-1.168 1.55-1.966.423-1.232.434-2.558.27-3.836a13.293 13.293 0 00-.847-3.22c1.475-.395 2.932-.893 4.2-1.732 1.055-.699 2.009-1.69 2.295-2.94.277-1.21-.178-2.489-1.012-3.397-1.688-1.82-4.322-2.444-6.854-2.717l-.056.006.054-.004.042.003.008-.001v.004zM7.012 5.735c.98-.672 2.272-.874 3.436-.736 1.94.232 3.812.857 5.098 2.177.638.655.985 1.578.808 2.39-.177.813-.842 1.455-1.616 1.938-1.11.69-2.41 1.084-3.72 1.347a15.263 15.263 0 01-1.877-3.56c-.378-1.285-.382-2.652.143-3.76l-.272.204z" />
                </svg>
              </a>
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              From 45-minute listings to{" "}
              <span className="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                3-minute automation
              </span>{" "}
              — how a Singapore print-on-demand Etsy shop cut listing time by{" "}
              <span className="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
                93%
              </span>{" "}
              and went from zero to 5 social posts per week.
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

          {/* ── Day in the Life ────────────────────────── */}
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

            <div className="relative z-10">
              <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📅</span> A Day in the Life
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                    <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(248,113,113,0.8)]" />
                    Before RizFlow
                  </h3>
                  <div className="space-y-3">
                    {dayBefore.map((item) => (
                      <div key={item.time} className="flex items-start gap-3">
                        <span className="text-xs font-mono text-red-400/80 min-w-[52px] pt-0.5">
                          {item.time}
                        </span>
                        <span className="text-sm text-slate-300">
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2 font-mono text-sm uppercase tracking-wider">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    After RizFlow
                  </h3>
                  <div className="space-y-3">
                    {dayAfter.map((item) => (
                      <div key={item.time} className="flex items-start gap-3">
                        <span className="text-xs font-mono text-emerald-400/80 min-w-[52px] pt-0.5">
                          {item.time}
                        </span>
                        <span className="text-sm text-slate-300">
                          {item.task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ── Testimonial ────────────────────────── */}
          <motion.div className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

            <div className="relative z-10 text-center">
              <p className="text-xl md:text-2xl font-heading text-white leading-relaxed mb-6">
                "Before RizFlow, I was spending 45 minutes on each Etsy listing
                and constantly missing customer messages. Now my agents handle
                listings, messages, and social posts automatically — I just
                review and approve, and focus on designing new products."
              </p>
              <div className="flex items-center justify-center gap-3">
                <img
                  src="/brewedidentity-logo-sm.png"
                  alt="Brewed Identity"
                  className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(45,212,191,0.4)] border border-teal-500/30"
                />
                <div className="text-left">
                  <p className="text-white font-semibold font-heading text-sm">
                    Brewed Identity
                  </p>
                  <p className="text-slate-400 text-xs font-mono">
                    SG Print-on-Demand Etsy Shop
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

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
                See Their Agent System in Action
              </h2>
              <p className="text-slate-400 mb-6">
                Watch how Brewed Identity's AI agents automate Etsy listings,
                customer responses, social campaigns, and order fulfilment —
                live.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/demo/brewed-identity"
                  className="group relative px-6 py-3 rounded-lg text-white font-medium transition-all overflow-hidden shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x" />
                  <span className="relative flex items-center gap-2 font-bold">
                    Try Their Agent System →
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
            📋 Case study based on Brewed Identity deployment. Results based on
            actual automation data.
          </p>
        </div>
      </section>
    </>
  );
}
