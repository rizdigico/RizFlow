import { Helmet } from 'react-helmet-async'
import { PricingTable } from '@/components/sections/PricingTable'
import { CTAStrip } from '@/components/sections/CTAStrip'
import { Container } from '@/components/layout/Container'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'
import { FlowingMesh } from '@/components/animations/FlowingMesh'

const process = [
  { step: '01', title: 'DISCOVERY PROTOCOL', desc: 'Free 30-min audit to map your current workflows and identify automation opportunities.', status: 'INITIATING' },
  { step: '02', title: 'PROPOSAL COMPILATION', desc: 'Custom implementation plan with clear scope, timeline, and expected ROI — delivered within 48 hours.', status: 'AWAITING AUTH' },
  { step: '03', title: 'AGENT CONFIGURATION', desc: 'Our team builds and configures your agent stack, connects your tools, and tests all workflows.', status: 'DEPLOYING' },
  { step: '04', title: 'TEAM SYNCHRONIZATION', desc: 'Live walkthrough with your team. We ensure everyone knows how to work alongside the agents.', status: 'SYNCING' },
  { step: '05', title: 'GO LIVE & MONITOR', desc: 'Agents go live. We monitor closely for the first 2 weeks and fine-tune based on real performance.', status: 'ACTIVE' },
  { step: '06', title: 'RECURSIVE OPTIMIZATION', desc: 'Monthly reviews to add new automations, adjust to workflow changes, and push more hours back to you.', status: 'OPTIMIZING' },
]

const servicesBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Services & Pricing', item: `${SITE_URL}/services` },
  ],
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI Operations Automation',
  name: 'Agentic AI Operations for Agencies',
  provider: { '@type': 'Organization', name: 'RizFlow', url: SITE_URL },
  areaServed: ['Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand'],
  description: 'RizFlow builds and manages agentic AI systems that automate agency operations — email triage, client onboarding, invoicing, reporting, and CRM updates.',
  offers: [
    { '@type': 'Offer', name: 'Starter Node', description: 'AI operations starter plan for small agencies with 5-10 team members' },
    { '@type': 'Offer', name: 'Pro Agent Stack', description: 'Full AI agent stack for agencies with 10-20 team members' },
    { '@type': 'Offer', name: 'Enterprise Grid', description: 'Enterprise-grade AI operations for agencies with 20-25+ team members' },  ],
}

export function Services() {
  return (
    <>
      <Helmet>
        <title>AI Operations Services | RizFlow</title>
        <meta name="description" content="Explore RizFlow's AI operations packages for service agencies. From core automation to full autonomous ops — agentic AI that handles email, CRM, invoicing, and reporting." />
        <meta name="keywords" content="AI operations services, agentic AI packages, AI automation for agencies, automated CRM, AI invoicing, agency operations" />
        <link rel="canonical" href={`${SITE_URL}/services`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/services`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        <meta property="og:title" content="AI Operations Services | RizFlow" />
        <meta property="og:description" content="Explore RizFlow's AI operations packages for service agencies. From core automation to full autonomous ops — agentic AI that handles email, CRM, invoicing, and reporting." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Operations Services | RizFlow" />
        <meta name="twitter:description" content="Explore RizFlow's AI operations packages for service agencies. From core automation to full autonomous ops." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(servicesBreadcrumb)}</script>
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
              <span className="text-xs font-mono text-teal-400 tracking-widest uppercase">Pricing Architecture</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Select Your <span className="text-teal-400">Agent Stack</span>
            </h1>
            <p className="text-xl text-slate-400 max-w-xl mx-auto font-mono text-sm tracking-wide">
              &gt; Transparent provisioning. No hidden runtime fees. 
              Commit when you're confident in the system ROI.
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
                &gt; Standardized 6-phase deployment protocol. From initial handshake to autonomous runtime.
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
                    style={{ animation: 'slideRight 2s ease-in-out infinite' }}
                  />
                  
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-4xl font-black text-teal-500/20 font-mono tracking-tighter">
                      {p.step}
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#050A14] border border-teal-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-teal-400 tracking-widest uppercase font-bold">{p.status}</span>
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
  )
}
