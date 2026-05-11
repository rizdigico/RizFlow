import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useParallaxScroll } from "@/hooks/useFlowingAnimation";
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
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 1800;
    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [isInView, target]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
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
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative bg-[#0A0F1A] rounded-xl p-5 text-center border shadow-[0_0_30px_rgba(0,229,255,0.08)] overflow-hidden",
        negative
          ? "border-red-500/20 hover:border-red-500/40"
          : "border-teal-500/20 hover:border-teal-500/40",
      )}
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px] opacity-50" />
      <div
        className={cn(
          "absolute -top-6 left-1/2 -translate-x-1/2 w-20 h-20 blur-2xl rounded-full group-hover:scale-125 transition-transform duration-500",
          negative ? "bg-red-500/15" : "bg-teal-500/15",
        )}
      />
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
          {isInView ? (
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

// ── Case Study Data ──────────────────────────────────────────────────
interface CaseStudyData {
  id: string;
  badge: string;
  name: string;
  icon: string;
  iconLink: string;
  iconLinkLabel: string;
  subtitle: string;
  quote: string;
  logoSrc: string;
  logoAlt: string;
  logoDesc: string;
  metrics: {
    label: string;
    emoji: string;
    before: string;
    after: string;
    change: string;
    changeNum: number;
    suffix?: string;
    negative?: boolean;
  }[];
  painPoints: string[];
  improvements: string[];
  dayBefore: { time: string; task: string }[];
  dayAfter: { time: string; task: string }[];
  differentiators: { emoji: string; title: string; desc: string }[];
  demoLink: string;
  demoLabel: string;
  verification: string;
}

const rainfreshData: CaseStudyData = {
  id: "rainfresh",
  badge: "Case Study 1",
  name: "RainFreshSG",
  icon: "🏠",
  iconLink: "https://www.instagram.com/rainfreshsg/",
  iconLinkLabel: "RainFreshSG Instagram",
  subtitle:
    "From manual operations to automated growth — how a Singapore home fragrance brand cut order processing time by 99% and went from zero to 7 social posts per week.",
  quote:
    "Before RizFlow, I was spending 3-4 hours a day just on TikTok Shop orders and inventory. Now my agents handle all of it automatically — orders, restocking, social posts, customer messages. I just check my phone in the morning and everything's done.",
  logoSrc: "/rainfresh-logo-sm.png",
  logoAlt: "RainFreshSG",
  logoDesc: "Singapore Home Fragrance Brand",
  metrics: [
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
      label: "Buyer Emails",
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
  ],
  painPoints: [
    "2-3 hours/day manually processing TikTok Shop orders",
    "Stockouts discovered only after customer complaints",
    "Zero social media presence despite selling on TikTok",
    "No order confirmation or shipping emails sent to buyers",
  ],
  improvements: [
    "TikTok Shop orders auto-confirmed in under 3 seconds",
    "48-hour advance stock alerts — zero stockouts",
    "7 posts/week scheduled automatically across Instagram & TikTok",
    "100% automated confirmation & shipping emails",
  ],
  dayBefore: [
    { time: "6:00 AM", task: "Check Alibaba for restock updates" },
    { time: "7:00 AM", task: "Manually process TikTok Shop orders" },
    { time: "9:00 AM", task: "Reply to Instagram DMs one by one" },
    { time: "11:00 AM", task: "Manually count inventory — again" },
    { time: "2:00 PM", task: "Chase unpaid invoices and follow up" },
    { time: "4:00 PM", task: "Try to post on social media (if time left)" },
  ],
  dayAfter: [
    { time: "10:00 AM", task: "Check phone — everything's handled" },
    { time: "10:05 AM", task: "Review agent dashboard for the day" },
    { time: "10:15 AM", task: "Focus on growing the business" },
  ],
  differentiators: [
    {
      emoji: "🎯",
      title: "No Templates",
      desc: "Every agent is configured for your specific workflows",
    },
    {
      emoji: "🛠️",
      title: "No New Software",
      desc: "Agents work through your existing tools (TikTok Shop, Gmail, Sheets, Instagram)",
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
  ],
  demoLink: "/demo/rainfresh",
  demoLabel: "Try Their Agent System",
  verification:
    "Case study verified by RainFreshSG. Results based on actual deployment data.",
};

const brewedidentityData: CaseStudyData = {
  id: "brewedidentity",
  badge: "Case Study 2",
  name: "Brewed Identity",
  icon: "☕",
  iconLink: "https://www.etsy.com/shop/BrewedIdentity",
  iconLinkLabel: "Brewed Identity Etsy",
  subtitle:
    "From 45-minute listings to 3-minute automation — how a Singapore print-on-demand Etsy shop cut listing time by 93% and went from zero to 5 social posts per week.",
  quote:
    "Before RizFlow, I was spending 45 minutes on each Etsy listing and constantly missing customer messages. Now my agents handle listings, messages, and social posts automatically — I just review and approve, and focus on designing new products.",
  logoSrc: "/brewedidentity-logo-sm.png",
  logoAlt: "Brewed Identity",
  logoDesc: "SG Print-on-Demand Etsy Shop",
  metrics: [
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
  ],
  painPoints: [
    "45 minutes per manually created Etsy listing with SEO",
    "Customer messages sitting unanswered for 2-4 hours",
    "Zero social media presence for a visual product brand",
    "8-10 missed customer inquiries per week during off-hours",
  ],
  improvements: [
    "Etsy listings auto-generated with SEO in under 3 minutes",
    "Customer inquiries answered in under 30 seconds, 24/7",
    "5 social posts/week scheduled across Instagram & Pinterest",
    "100% of customer messages answered within seconds",
  ],
  dayBefore: [
    { time: "6:00 AM", task: "Check Etsy for new orders overnight" },
    { time: "7:30 AM", task: "Manually create new listing — write, tag, SEO" },
    { time: "9:00 AM", task: "Respond to customer messages one by one" },
    { time: "11:00 AM", task: "Try to post on Instagram (no time left)" },
    { time: "1:00 PM", task: "Update Printify product variants manually" },
    { time: "3:00 PM", task: "Missed 3 more customer inquiries" },
  ],
  dayAfter: [
    { time: "10:00 AM", task: "Check phone — orders processed, listings live" },
    { time: "10:05 AM", task: "Review agent dashboard for the day" },
    { time: "10:15 AM", task: "Focus on designing new product lines" },
  ],
  differentiators: [
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
  ],
  demoLink: "/demo/brewed-identity",
  demoLabel: "Try Their Agent System",
  verification:
    "Case study based on Brewed Identity deployment. Results based on actual automation data.",
};

const caseStudies = [rainfreshData, brewedidentityData];

// ── Etsy icon SVG for external link ──
function ExternalIcon({ data }: { data: CaseStudyData }) {
  if (data.id === "rainfresh") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="w-4.5 h-4.5 text-slate-400 group-hover:text-pink-300 transition-colors"
        fill="currentColor"
      >
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-4.5 h-4.5 text-slate-400 group-hover:text-orange-300 transition-colors"
      fill="currentColor"
    >
      <path d="M9.523 3.038C7.878 2.862 6.039 3.2 4.65 4.199c-1.97 1.418-2.422 3.88-1.55 5.804.815 1.793 2.623 3.217 4.516 4.064-.632 1.67-1.222 3.349-1.058 5.184.127 1.419.957 2.834 2.428 3.268.826.24 1.76.153 2.514-.28.753-.431 1.277-1.168 1.55-1.966.423-1.232.434-2.558.27-3.836a13.293 13.293 0 00-.847-3.22c1.475-.395 2.932-.893 4.2-1.732 1.055-.699 2.009-1.69 2.295-2.94.277-1.21-.178-2.489-1.012-3.397-1.688-1.82-4.322-2.444-6.854-2.717l-.056.006.054-.004.042.003.008-.001v.004zM7.012 5.735c.98-.672 2.272-.874 3.436-.736 1.94.232 3.812.857 5.098 2.177.638.655.985 1.578.808 2.39-.177.813-.842 1.455-1.616 1.938-1.11.69-2.41 1.084-3.72 1.347a15.263 15.263 0 01-1.877-3.56c-.378-1.285-.382-2.652.143-3.76l-.272.204z" />
    </svg>
  );
}

// ── Scroll animation variants (for whileInView) ──
const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" as const },
  transition: { duration: 0.7 },
};

// ── Component ────────────────────────────────────────────────────────
export function CaseStudies() {
  const [current, setCurrent] = useState(0);
  const data = caseStudies[current];

  const switchTo = (idx: number) => {
    if (idx === current) return;
    setCurrent(idx);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const next = () => switchTo((current + 1) % caseStudies.length);
  const prev = () =>
    switchTo((current - 1 + caseStudies.length) % caseStudies.length);

  return (
    <>
      <Helmet>
        <title>Case Studies — RizFlow AI Automation</title>
        <meta
          name="description"
          content="See how real businesses automated their operations with RizFlow — from TikTok Shop order processing to Etsy listing creation, inventory alerts, and social scheduling."
        />
        <link rel="canonical" href={`${SITE_URL}/case-studies`} />
        <meta
          property="og:title"
          content="Case Studies — RizFlow AI Automation"
        />
        <meta
          property="og:description"
          content="Real businesses, real results. See how RainFreshSG and Brewed Identity cut manual work by 90%+ with custom AI agents."
        />
        <meta property="og:url" content={`${SITE_URL}/case-studies`} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={`${SITE_URL}/og-banner.png`} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Case Studies — RizFlow AI Automation"
        />
        <meta
          name="twitter:description"
          content="Real businesses, real results. See how RizFlow custom AI agents save 15-25 hours/week."
        />
        <meta name="twitter:image" content={`${SITE_URL}/og-banner.png`} />
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
                item: `${SITE_URL}/case-studies`,
              },
            ],
          })}
        </script>
      </Helmet>

      <section className="relative bg-navy-dark w-full">
        <motion.div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} parallax={false} />
        </motion.div>
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-[length:32px_32px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0)_80%)] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[400px] h-[400px] bg-cyan/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 py-20 lg:py-28">
          {/* ── Case Study Navigation ── */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {caseStudies.map((cs, idx) => (
              <button
                key={cs.id}
                onClick={() => switchTo(idx)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                  idx === current
                    ? "bg-teal-500/20 border border-teal-500/40 text-teal-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                    : "bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-white",
                )}
              >
                {cs.icon} {cs.name}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={data.id}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
            >
              {/* ── Hero ─────────────────────────────────── */}
              <motion.div {...fadeUp} className="text-center mb-16">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal/5 border border-teal/20 backdrop-blur-md shadow-[0_0_15px_rgba(45,212,191,0.15)] mb-6">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                  <span className="text-sm text-teal-300 font-mono font-medium tracking-wide uppercase">
                    {data.badge}
                  </span>
                </span>
                <h1 className="text-4xl lg:text-5xl font-bold font-heading text-white mb-4 text-shadow-glow flex items-center justify-center gap-3">
                  {data.name}
                  <a
                    href={data.iconLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group"
                    aria-label={data.iconLinkLabel}
                  >
                    <ExternalIcon data={data} />
                  </a>
                </h1>
                <p
                  className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: data.subtitle
                      .replace(
                        /(\d+%|\d+ sec|\d+ posts|\d+ hours)/g,
                        '<span class="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">$1</span>',
                      )
                      .replace(
                        /(\d+ minutes)/g,
                        '<span class="text-teal-400 font-bold drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">$1</span>',
                      ),
                  }}
                />
              </motion.div>

              {/* ── Challenge ───────────────────────────── */}
              <motion.div
                {...fadeUp}
                className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
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
                        {data.painPoints.map((point) => (
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
                        {data.improvements.map((point) => (
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
                {data.metrics.map((m, i) => (
                  <div
                    key={m.label}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <MetricCard {...m} />
                  </div>
                ))}
              </div>

              {/* ── Day in the Life ────────────────────────── */}
              <motion.div
                {...fadeUp}
                className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden"
              >
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
                        {data.dayBefore.map((item) => (
                          <div
                            key={item.time}
                            className="flex items-start gap-3"
                          >
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
                        {data.dayAfter.map((item) => (
                          <div
                            key={item.time}
                            className="flex items-start gap-3"
                          >
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
              <div className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
                <div className="relative z-10 text-center">
                  <p className="text-xl md:text-2xl font-heading text-white leading-relaxed mb-6">
                    &ldquo;{data.quote}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <img
                      src={data.logoSrc}
                      alt={data.logoAlt}
                      className="w-10 h-10 rounded-full object-cover shadow-[0_0_15px_rgba(45,212,191,0.4)] border border-teal-500/30"
                    />
                    <div className="text-left">
                      <p className="text-white font-semibold font-heading text-sm">
                        {data.logoAlt}
                      </p>
                      <p className="text-slate-400 text-xs font-mono">
                        {data.logoDesc}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── How It Works ────────────────────────── */}
              <motion.div
                {...fadeUp}
                className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">⚙️</span> How It Works
                  </h2>
                  <div className="space-y-6">
                    {data.differentiators.slice(0, 4).map((item, i) => (
                      <div
                        key={item.title}
                        className="flex items-start gap-4 group"
                      >
                        <span className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-lg shrink-0 border border-teal/20 shadow-[0_0_15px_rgba(45,212,191,0.2)] group-hover:bg-teal/20 transition-colors duration-300">
                          {["🔍", "⚙️", "🧪", "🚀"][i]}
                        </span>
                        <div>
                          <h3 className="font-semibold text-white text-base">
                            <span className="text-teal-400 font-mono text-xs mr-2">
                              STEP {String(i + 1).padStart(2, "0")}
                            </span>
                            {i === 0
                              ? "Discovery Call (30 min)"
                              : i === 1
                                ? "Agent Configuration (2-3 weeks)"
                                : i === 2
                                  ? "Testing & Approval (1 week)"
                                  : "Go Live"}
                          </h3>
                          <p className="text-slate-400 text-sm mt-1">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ── What Makes This Different ───────────── */}
              <motion.div
                {...fadeUp}
                className="bg-[#0A0F1A] border border-teal-500/20 rounded-2xl p-8 mb-8 shadow-[0_0_40px_rgba(0,229,255,0.08)] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold font-heading text-white mb-6 flex items-center gap-3">
                    <span className="text-3xl">💎</span> What Makes This
                    Different
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {data.differentiators.map((item) => (
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
                {...fadeUp}
                className="bg-[#0A0F1A] border border-teal-500/30 rounded-2xl p-8 text-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_0%,transparent_70%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />
                <div className="relative z-10">
                  <span className="text-4xl block mb-4">🤖</span>
                  <h2 className="text-2xl font-bold font-heading text-white mb-2">
                    See Their Agent System in Action
                  </h2>
                  <p className="text-slate-400 mb-6">
                    Watch how {data.name}'s AI agents automate their operations
                    — live.
                  </p>
                  <div className="flex gap-4 justify-center flex-wrap">
                    <Link
                      to={data.demoLink}
                      className="group relative px-6 py-3 rounded-lg text-white font-medium transition-all overflow-hidden shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x" />
                      <span className="relative flex items-center gap-2 font-bold">
                        {data.demoLabel} →
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
                📋 {data.verification}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* ── Carousel Navigation ── */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border border-slate-700 bg-[#0A0F1A] hover:border-teal-500/40 hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 flex items-center justify-center transition-all duration-300"
              aria-label="Previous case study"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {caseStudies.map((cs, idx) => (
                <button
                  key={cs.id}
                  onClick={() => switchTo(idx)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    idx === current
                      ? "bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.6)]"
                      : "bg-slate-600 hover:bg-slate-500",
                  )}
                  aria-label={`View ${cs.name} case study`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-12 h-12 rounded-full border border-slate-700 bg-[#0A0F1A] hover:border-teal-500/40 hover:bg-teal-500/10 text-slate-400 hover:text-teal-300 flex items-center justify-center transition-all duration-300"
              aria-label="Next case study"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
