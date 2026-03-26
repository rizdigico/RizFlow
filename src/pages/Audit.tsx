import { Helmet } from 'react-helmet-async'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { AuditForm } from '@/components/forms/AuditForm'
import { Container } from '@/components/layout/Container'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'

const auditBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Free Operational Audit', item: `${SITE_URL}/audit` },
  ],
}

const benefits = [
  'Full workflow mapping for your agency',
  'Exact hours lost to manual operations weekly',
  'Top 3 automation opportunities for your setup',
  'ROI projection for your specific agency size',
  'Zero pressure — insights are yours regardless',
]

export function Audit() {
  return (
    <>
      <Helmet>
        <title>Free Operational Audit — Discover Your Agency's AI Automation Potential | RizFlow</title>
        <meta name="description" content="Book a free 30-minute Operational Audit with RizFlow. We map your agency workflows, identify where AI automation can save 10-20 hrs/week, and project your ROI. No commitment. Singapore-based." />
        <meta name="keywords" content="free operational audit, agency AI automation audit, automate agency manual work with AI, AI workflow audit Singapore, agentic AI agency assessment" />
        <link rel="canonical" href={`${SITE_URL}/audit`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/audit`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/audit`} />
        <meta property="og:title" content="Free Operational Audit — Discover Your Agency's AI Automation Potential" />
        <meta property="og:description" content="30-minute free audit: we map your workflows, find where AI can save 10-20 hrs/week, and project your ROI. No commitment." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free AI Operations Audit for Your Agency | RizFlow" />
        <meta name="twitter:description" content="Find out exactly how many hours AI can save your agency. Free 30-min audit. No commitment." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(auditBreadcrumb)}</script>
      </Helmet>

      <section className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-[#050A14] bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
        {/* Ambient glows */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px]" />
        </div>

        <Container className="relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left — Info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                System Ping: 100% Free · No Commitment
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white mb-6 leading-tight flex items-center gap-3">
                Get Your Free
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(0,229,255,0.3)]">Operational Audit</span>
                <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse inline-block mt-auto mb-2"></span>
              </h1>
              <p className="text-lg text-slate-300 font-mono text-sm leading-relaxed mb-8">
                {'>'} In 30 minutes, we'll analyse your agency's current workflows, identify exactly
                where time is leaking, and show you what a fully automated operations layer would
                look like for your specific setup.
              </p>

              <div className="space-y-4 mb-10 bg-[#0A0F1A]/80 backdrop-blur-md border border-white/5 p-6 rounded-xl">
                <h2 className="text-xs font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                  Output Protocol: What You'll Get
                </h2>
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-sm bg-[#050A14] flex items-center justify-center flex-shrink-0 border border-teal-500/30 shadow-[0_0_10px_rgba(0,229,255,0.1)]">
                      <CheckCircleIcon className="w-4 h-4 text-teal-400" />
                    </div>
                    <span className="text-slate-300 font-mono text-xs">{b}</span>
                  </div>
                ))}
              </div>

              <div className="bg-[#050A14] rounded-sm p-6 text-white border border-teal-500/20 shadow-[inset_0_0_20px_rgba(0,229,255,0.02)]">
                <p className="text-emerald-400 text-xs font-mono uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                  Security & Privacy Override
                </p>
                <p className="text-slate-400 font-mono text-xs leading-relaxed">
                  {'>'} Your information is encrypted in transit and at rest. We are GDPR and PDPA
                  compliant. Your data is never shared or sold. We use it only to prepare your audit.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 rounded-2xl p-5 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] relative">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
              <h2 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
                <span className="text-teal-400 font-mono">{'>'}</span> Request Your Audit
              </h2>
              <AuditForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
