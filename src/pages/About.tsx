import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FounderProfile } from "@/components/sections/FounderProfile";
import { Container } from "@/components/layout/Container";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";

const aboutBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "About",
      item: `${SITE_URL}/about`,
    },
  ],
};

const founderSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aariz Arfan",
  jobTitle: "Founder & CEO",
  worksFor: { "@type": "Organization", name: "RizFlow", url: SITE_URL },
  url: `${SITE_URL}/about`,
  sameAs: ["https://www.linkedin.com/in/aariz-arfan/"],
};

const timeline = [
  {
    year: "2024",
    emoji: "🧠",
    title: "The Spark",
    event:
      "Discovered & learnt about the full potential of AI while using it to study in Senior high. Scored multiple distinctions & got into my dream course.",
    status: "COMPLETED",
  },
  {
    year: "Early 2025",
    emoji: "⚡",
    title: "First Automations",
    event:
      "Started automating workflows with Zapier, N8N and custom scripts. Saved 12-20 hours personally.",
    status: "COMPLETED",
  },
  {
    year: "Late 2025",
    emoji: "🤖",
    title: "Agent Awakening",
    event:
      "Discovered LLMs could handle nuanced ops tasks. Started utilising & building AI agents.",
    status: "COMPLETED",
  },
  {
    year: "Early 2026",
    emoji: "🚀",
    title: "RizFlow Launched",
    event:
      "Ran first paid pilot with a business. Validated the core product. RizFlow was born.",
    status: "DEPLOYED",
  },
  {
    year: "Now",
    emoji: "🌏",
    title: "Scaling Across SEA",
    event:
      "Aiming to serve businesses & SMEs across SEA. Building while studying — proving it can be done.",
    status: "ACTIVE",
  },
];

const statusColors: Record<string, string> = {
  COMPLETED: "text-teal-400 border-teal-500/40 bg-teal-500/10",
  DEPLOYED: "text-cyan-400 border-cyan-500/40 bg-cyan-500/10",
  ACTIVE: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10",
};

const statusDots: Record<string, string> = {
  COMPLETED: "bg-teal-400",
  DEPLOYED: "bg-cyan-400",
  ACTIVE: "bg-emerald-400 animate-pulse",
};

export function About() {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>About RizFlow — Custom Agentic-AI for Businesses & SMEs</title>
        <meta
          name="description"
          content="RizFlow builds custom agentic-AI systems for businesses and SMEs. Founded by Aariz Arfan in Singapore — we tailor AI agents to your specific workflows so you can run your business from your phone."
        />
        <meta
          name="keywords"
          content="RizFlow about, custom AI agents Singapore, agentic AI for businesses, SME automation, Aariz Arfan"
        />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/about`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta
          property="og:title"
          content="About RizFlow — Custom Agentic-AI for Businesses & SMEs"
        />
        <meta
          property="og:description"
          content="RizFlow builds custom agentic-AI systems for businesses and SMEs. Founded by Aariz Arfan in Singapore — we tailor AI agents to your specific workflows so you can run your business from your phone."
        />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="About RizFlow — Custom Agentic-AI for Businesses & SMEs"
        />
        <meta
          name="twitter:description"
          content="RizFlow builds custom agentic-AI systems for businesses and SMEs. Founded by Aariz Arfan in Singapore."
        />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">
          {JSON.stringify(aboutBreadcrumb)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(founderSchema)}
        </script>
      </Helmet>

      <div className="relative bg-[#050A14] w-full overflow-hidden">
        {/* Shared Animated flowing mesh background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} />
        </div>

        {/* Shared Cyberpunk Grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,white,transparent_90%)] pointer-events-none" />

        {/* Hero */}
        <section className="pt-28 md:pt-36 lg:pt-40 pb-16 md:pb-24 relative flex items-center">
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0F1A]/80 border border-teal-500/30 rounded-md mb-6 shadow-[0_0_15px_rgba(0,229,255,0.1)] backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Origin Story
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Built for Business Owners,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                By a Business Owner
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-mono text-sm tracking-wide leading-relaxed">
              &gt; RizFlow started with a simple frustration: too much time on
              operations, not enough on growing the business. So I built AI
              agents that handle the work — and let you run everything from your
              phone.
            </p>
          </Container>
        </section>

        {/* Founder */}
        <section className="py-12 sm:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none" />
          <Container className="relative z-10">
            <FounderProfile />
          </Container>
        </section>

        {/* Core Directives */}
        <section className="py-12 sm:py-24 relative">
          <Container className="relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-teal-500 animate-pulse" />
                <h2 className="font-mono text-teal-400 uppercase tracking-widest text-sm font-semibold">
                  System Protocols
                </h2>
              </div>
              <h3 className="text-2xl sm:text-4xl font-bold font-heading text-white drop-shadow-md">
                Core Directives
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission */}
              <div className="bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-6 md:p-10 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-mono text-teal-500/50 text-xs mb-4 uppercase tracking-widest">
                  [ Directive 01 ]
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-4 flex items-center gap-3">
                  <span className="text-teal-400">/</span> Mission
                  <span className="text-2xl opacity-80 ml-1">🎯</span>
                </h3>
                <p className="text-slate-400 leading-relaxed font-mono text-sm">
                  To free business owners from operational overhead — so they
                  can reinvest their time in strategy, growth, and the work that
                  only humans can do.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-6 md:p-10 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-mono text-teal-500/50 text-xs mb-4 uppercase tracking-widest">
                  [ Directive 02 ]
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-4 flex items-center gap-3">
                  <span className="text-teal-400">/</span> Vision
                  <span className="text-2xl opacity-80 ml-1">🔭</span>
                </h3>
                <p className="text-slate-400 leading-relaxed font-mono text-sm">
                  A Southeast Asia where every business — regardless of size or
                  industry — has access to custom agentic-AI systems. The
                  playing field, levelled.
                </p>
              </div>

              {/* Transparency */}
              <div className="md:col-span-2 bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-6 md:p-10 lg:p-12 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 blur-[100px] rounded-full group-hover:bg-teal-500/10 transition-colors pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
                    <div>
                      <div className="font-mono text-teal-500/50 text-xs mb-2 uppercase tracking-widest">
                        [ Directive 03 ]
                      </div>
                      <h3 className="text-2xl font-bold font-heading text-white flex items-center gap-3">
                        <span className="text-teal-400">/</span> Transparency
                        <span className="text-2xl opacity-80 ml-1">⚖️</span>
                      </h3>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050A14] border border-teal-500/30 rounded-md">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
                        Building in Public
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8 lg:gap-12 font-mono text-sm text-slate-300">
                    <p className="leading-relaxed border-l border-teal-500/20 pl-6">
                      &gt; RizFlow is founder-led and bootstrapped. I'm building
                      this while completing my studies — practicing exactly what
                      I preach: doing more with less, and using AI to bridge the
                      gap.
                    </p>
                    <p className="leading-relaxed text-slate-400 border-l border-teal-500/20 pl-6">
                      &gt; Every system built for clients is first tested
                      internally. The Communication Agent handles my email. The
                      Workflow & Tracking Agent manages deliverables. I know
                      these agents work because I depend on them daily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Our Promise */}
        <section className="py-12 sm:py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.04)_0%,transparent_70%)] pointer-events-none" />
          <Container className="relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-gold animate-pulse rounded-full" />
                <h2 className="font-mono text-gold uppercase tracking-widest text-sm font-semibold">
                  Our Promise
                </h2>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-2xl p-6 sm:p-10 md:p-14 lg:p-16 border border-gold/20 shadow-[0_0_40px_rgba(245,158,11,0.06)] relative overflow-hidden group hover:border-gold/40 hover:shadow-[0_0_60px_rgba(245,158,11,0.1)] transition-all duration-500">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="space-y-8 font-mono text-lg text-slate-300 leading-relaxed relative z-10">
                  <p className="border-l-2 border-gold/40 pl-8 text-slate-200">
                    &gt; Everything runs on{" "}
                    <span className="text-gold-light font-bold">
                      our infrastructure
                    </span>
                    . Servers, agents, orchestration, monitoring — we handle the
                    entire technical stack so you never have to think about it.
                  </p>
                  <p className="border-l-2 border-gold/40 pl-8 text-slate-200">
                    &gt; You'll only see{" "}
                    <span className="text-gold-light font-bold">
                      guaranteed results
                    </span>{" "}
                    — orders processed, customers responded to, invoices sent,
                    reports delivered. The work gets done, and you see the
                    outcomes in your business.
                  </p>
                  <p className="border-l-2 border-gold/40 pl-8 text-slate-200">
                    &gt; No dashboards to configure. No agents to debug. No
                    servers to manage. Your agent systems run silently in the
                    background, and your business moves forward.
                  </p>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-center gap-6">
                  <div className="flex items-center gap-2 text-sm font-mono text-gold/60 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Zero technical overhead
                  </div>
                  <div className="hidden sm:block w-[1px] h-4 bg-white/10" />
                  <div className="flex items-center gap-2 text-sm font-mono text-gold/60 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Results-only visibility
                  </div>
                  <div className="hidden sm:block w-[1px] h-4 bg-white/10" />
                  <div className="flex items-center gap-2 text-sm font-mono text-gold/60 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Fully managed
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA after Our Promise */}
        <section className="py-8 relative">
          <Container className="relative z-10 text-center">
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-bold transition-all overflow-hidden shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x" />
              <span className="relative flex items-center gap-2">
                Book Your Free Discovery Audit →
              </span>
            </Link>
            <p className="text-xs font-mono text-slate-500 mt-3 uppercase tracking-widest">
              No commitment. Results in 24 hours.
            </p>
          </Container>
        </section>

        {/* System Event Log */}
        <section className="py-12 sm:py-24 relative">
          <Container className="relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-teal-500 animate-pulse" />
                <h2 className="font-mono text-teal-400 uppercase tracking-widest text-lg font-semibold">
                  System Event Log
                </h2>
              </div>
              <p className="text-slate-500 font-mono text-xs sm:text-sm mt-2">
                Click any event to expand the details
              </p>
              <div className="h-[1px] w-24 bg-teal-500/30 mx-auto mt-4" />
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Vertical connector line */}
                <div className="absolute left-6 md:left-8 top-0 bottom-0 w-px bg-gradient-to-b from-teal-500/40 via-teal-500/20 to-transparent" />

                <div className="space-y-4">
                  {timeline.map((item, index) => {
                    const isExpanded = expandedIdx === index;
                    const isLast = index === timeline.length - 1;

                    return (
                      <motion.div
                        key={item.year}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <button
                          onClick={() =>
                            setExpandedIdx(isExpanded ? null : index)
                          }
                          className="w-full text-left group"
                        >
                          <div
                            className={`relative flex items-start gap-4 md:gap-6 p-5 md:p-6 rounded-xl border transition-all duration-300 ${
                              isExpanded
                                ? "bg-[#0A0F1A]/80 border-teal-500/40 shadow-[0_0_30px_rgba(0,229,255,0.08)]"
                                : "bg-[#0A0F1A]/40 border-white/5 hover:border-teal-500/30 hover:bg-[#0A0F1A]/60"
                            }`}
                          >
                            {/* Timeline node */}
                            <div className="relative flex-shrink-0">
                              <div
                                className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center text-2xl border transition-all duration-300 ${
                                  isExpanded
                                    ? "bg-teal-500/10 border-teal-500/40 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                                    : "bg-[#0A0F1A] border-white/10 group-hover:border-teal-500/30"
                                }`}
                              >
                                {item.emoji}
                              </div>
                              {/* Connector dot on the vertical line */}
                              <div
                                className={`absolute left-1/2 -translate-x-1/2 -bottom-7 w-2 h-2 rounded-full ${statusDots[item.status] || "bg-slate-500"} hidden md:block`}
                              />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                                <span className="font-mono text-cyan-400 font-bold tracking-wider text-sm uppercase">
                                  [{item.year}]
                                </span>
                                <span
                                  className={`font-mono text-xs px-2 py-0.5 rounded-md border ${statusColors[item.status] || "text-slate-400 border-slate-500/40 bg-slate-500/10"}`}
                                >
                                  {item.status}
                                </span>
                                {isLast && (
                                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                                )}
                              </div>
                              <h4 className="text-white font-bold text-base md:text-lg font-heading flex items-center gap-2">
                                {item.title}
                                <motion.span
                                  animate={{ rotate: isExpanded ? 90 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-teal-500/60 text-sm"
                                >
                                  ▶
                                </motion.span>
                              </h4>
                            </div>
                          </div>
                        </button>

                        {/* Expandable detail */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                              className="overflow-hidden"
                            >
                              <div className="ml-12 sm:ml-16 md:ml-20 mt-2 mb-2 p-4 sm:p-5 md:p-6 bg-[#0A0F1A]/60 border border-teal-500/20 rounded-xl font-mono text-xs sm:text-sm text-slate-300 leading-relaxed backdrop-blur-sm">
                                <div className="flex items-start gap-3">
                                  <span className="text-teal-500/60 mt-0.5 flex-shrink-0">
                                    &gt;
                                  </span>
                                  <p>{item.event}</p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
