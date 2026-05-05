import { Helmet } from "react-helmet-async";
import { PricingTable } from "@/components/sections/PricingTable";
import { CTAStrip } from "@/components/sections/CTAStrip";
import { Container } from "@/components/layout/Container";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";
import { FlowingMesh } from "@/components/animations/FlowingMesh";

const process = [
  {
    step: "01",
    title: "DISCOVERY PROTOCOL",
    desc: "Free 30-min audit to map your business workflows and identify automation opportunities.",
    status: "INITIATING",
  },
  {
    step: "02",
    title: "PROPOSAL COMPILATION",
    desc: "Custom implementation plan with clear scope, timeline, and expected ROI — tailored to your specific business needs.",
    status: "AWAITING AUTH",
  },
  {
    step: "03",
    title: "AGENT CONFIGURATION",
    desc: "We design and build your custom AI agents, connect your tools, and test all workflows end-to-end.",
    status: "DEPLOYING",
  },
  {
    step: "04",
    title: "TEAM SYNCHRONIZATION",
    desc: "Live walkthrough with your team. We ensure everyone knows how to work alongside the agents — from any device.",
    status: "SYNCING",
  },
  {
    step: "05",
    title: "GO LIVE & MONITOR",
    desc: "Agents go live. We monitor closely for the first 2 weeks and fine-tune based on real performance.",
    status: "ACTIVE",
  },
  {
    step: "06",
    title: "RECURSIVE OPTIMIZATION",
    desc: "Monthly reviews to add new automations, adjust to workflow changes, and push more hours back to you.",
    status: "OPTIMIZING",
  },
];

const servicesBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
    {
      "@type": "ListItem",
      position: 2,
      name: "Services & Pricing",
      item: `${SITE_URL}/services`,
    },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Custom Agentic-AI Implementation",
  name: "Custom Agentic-AI Systems for Businesses & SMEs",
  provider: { "@type": "Organization", name: "RizFlow", url: SITE_URL },
  areaServed: ["Singapore", "Malaysia", "Indonesia", "Philippines", "Thailand"],
  description:
    "RizFlow builds custom agentic-AI systems tailored to your business — automating workflows, communications, invoicing, reporting, and more. Run your business from your phone.",
  offers: [
    {
      "@type": "Offer",
      name: "Starter",
      description:
        "Core automation for solo operators — 1-2 custom AI agents, single channel integration, basic admin automation",
    },
    {
      "@type": "Offer",
      name: "Growth",
      description:
        "Full operations coverage for growing businesses — 3-5 custom AI agents, multi-channel integration, 90-day guarantee",
    },
    {
      "@type": "Offer",
      name: "Scale",
      description:
        "Comprehensive automation for established businesses — 5+ agents, unlimited scope, dedicated account manager",
    },
  ],
};

export function Services() {
  return (
    <>
      <Helmet>
        <title>Custom Agentic-AI Services & Pricing | RizFlow</title>
        <meta
          name="description"
          content="Choose your custom agent stack. RizFlow builds tailored agentic-AI systems for businesses and SMEs — from essential automation to full-scale enterprise AI. No lock-in contracts."
        />
        <meta
          name="keywords"
          content="custom AI agents for business, SME AI automation, agentic AI packages, business automation services, AI workflow automation"
        />
        <link rel="canonical" href={`${SITE_URL}/services`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/services`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        <meta
          property="og:title"
          content="Custom Agentic-AI Services & Pricing | RizFlow"
        />
        <meta
          property="og:description"
          content="Choose your custom agent stack. RizFlow builds tailored agentic-AI systems for businesses and SMEs — from essential automation to full-scale enterprise AI."
        />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Custom Agentic-AI Services & Pricing | RizFlow"
        />
        <meta
          name="twitter:description"
          content="Choose your custom agent stack. Tailored agentic-AI systems for businesses and SMEs. No lock-in contracts."
        />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">
          {JSON.stringify(servicesBreadcrumb)}
        </script>
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <style>{`
          @keyframes slideRight {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </Helmet>

      <div className="relative bg-[#050A14] w-full overflow-hidden">
        {/* Shared Animated flowing mesh background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} />
        </div>

        {/* Shared Cyberpunk Grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Hero */}
        <section className="pt-28 md:pt-36 lg:pt-44 pb-16 md:pb-24 relative flex items-center">
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-[#0A0F1A]/80 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-mono text-teal-400 tracking-widest uppercase">
                Pricing
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Starting from <span className="text-teal-400">$1,800/mo</span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-mono text-sm tracking-wide leading-relaxed">
              &gt; Transparent provisioning. No hidden runtime fees. Custom
              pricing based on your agent count and workflow complexity. Free
              audit, exact quote, no surprises.
            </p>
          </Container>
        </section>

        <div className="relative z-10">
          <PricingTable />
        </div>

        {/* Deployment Pipeline */}
        <section className="py-24 relative">
          <Container className="relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-cyan-400 uppercase tracking-widest font-mono">
                  Deployment Pipeline
                </span>
              </div>
              <h2 className="mt-3 text-4xl md:text-5xl font-bold font-heading text-white drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                Initialization Sequence
              </h2>
              <p className="mt-6 text-slate-400 max-w-xl mx-auto font-mono text-sm tracking-wide">
                &gt; Standardized 6-phase deployment protocol. From initial
                handshake to autonomous runtime.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {process.map((p) => (
                <div
                  key={p.step}
                  className="group relative bg-[#0A0F1A]/80 backdrop-blur-3xl rounded-xl p-6 md:p-10 border border-white/5 hover:border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_30px_rgba(0,229,255,0.2)] transition-all duration-500 overflow-hidden"
                >
                  {/* Scanning line animation */}
                  <div
                    className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100"
                    style={{ animation: "slideRight 2s ease-in-out infinite" }}
                  />

                  <div className="flex justify-between items-start mb-8">
                    <span className="text-4xl font-black text-teal-500/20 font-mono tracking-tighter">
                      {p.step}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#050A14] border border-teal-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-teal-400 tracking-widest uppercase font-bold">
                        {p.status}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 font-mono tracking-tight group-hover:text-teal-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed font-mono opacity-80 border-l border-teal-500/20 pl-4">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>

      <CTAStrip />
    </>
  );
}
