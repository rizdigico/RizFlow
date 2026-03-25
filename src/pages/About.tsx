import { Helmet } from 'react-helmet-async'
import { FounderProfile } from '@/components/sections/FounderProfile'
import { Container } from '@/components/layout/Container'
import { FlowingMesh } from '@/components/animations/FlowingMesh'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'

const aboutBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
  ],
}

const founderSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aariz Arfan',
  jobTitle: 'Founder & CEO',
  worksFor: { '@type': 'Organization', name: 'RizFlow', url: SITE_URL },
  url: `${SITE_URL}/about`,
  sameAs: ['https://www.linkedin.com/in/aariz-arfan/'],
}

const timeline = [
  { year: '2024', event: 'Discovered & learnt about the full potential of AI while using it to study in Senior high. Scored multiple distinctions & got into my dream course.' },
  { year: 'Early 2025', event: 'Started automating workflows with Zapier, N8N and custom scripts. Saved 12-20 hours personally.' },
  { year: 'Late 2025', event: 'Discovered LLMs could handle nuanced ops tasks. Started utilising & building AI agents.' },
  { year: 'Early 2026', event: 'Ran first paid pilot with an agency. Validated the core product. RizFlow was born.' },
  { year: 'Now', event: 'Aiming to serve agencies across SEA. Building while studying — proving it can be done.' },
]

export function About() {
  return (
    <>
      <Helmet>
        <title>About Aariz Arfan & RizFlow — Founder Story | AI Operations Agency Singapore</title>
        <meta name="description" content="Meet Aariz Arfan, the Singapore-based founder of RizFlow. Learn how he built an agentic AI operations platform for service-based agencies while still studying." />
        <meta name="keywords" content="RizFlow founder, Aariz Arfan, AI operations agency Singapore, about RizFlow, agentic AI agency story" />
        <link rel="canonical" href={`${SITE_URL}/about`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/about`} />
        <meta property="og:type" content="profile" />
        <meta property="og:url" content={`${SITE_URL}/about`} />
        <meta property="og:title" content="About Aariz Arfan & RizFlow — Founder Story | AI Operations Agency Singapore" />
        <meta property="og:description" content="Meet Aariz Arfan, the Singapore-based founder of RizFlow. Learn how he built an agentic AI operations platform for service-based agencies." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Aariz Arfan & RizFlow — Founder Story" />
        <meta name="twitter:description" content="How a Singapore student built an agentic AI operations platform for agencies. The RizFlow origin story." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(aboutBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(founderSchema)}</script>
      </Helmet>

      <div className="relative bg-[#050A14] w-full overflow-hidden">
        {/* Shared Animated flowing mesh background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} />
        </div>

        {/* Shared Cyberpunk Grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(circle_at_center,white,transparent_90%)] pointer-events-none" />

        {/* Hero */}
        <section className="pt-40 pb-24 relative flex items-center">
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#0A0F1A]/80 border border-teal-500/30 rounded-md mb-6 shadow-[0_0_15px_rgba(0,229,255,0.1)] backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono text-xs font-semibold text-cyan-400 uppercase tracking-widest">
                Origin Story
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              Built by an Agency Operator,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">For Agency Operators</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto font-mono text-sm tracking-wide leading-relaxed">
              &gt; RizFlow started with a simple frustration: too much time on operations, not enough on the work that actually moves the needle.
            </p>
          </Container>
        </section>

        {/* Founder */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,229,255,0.05)_0%,transparent_70%)] pointer-events-none" />
          <Container className="relative z-10">
            <FounderProfile />
          </Container>
        </section>

        {/* Core Directives */}
        <section className="py-24 relative">
          <Container className="relative z-10">
            <div className="text-center mb-20">
              <div className="inline-flex items-center justify-center gap-2 mb-4">
                <div className="w-2 h-2 bg-teal-500 animate-pulse" />
                <h2 className="font-mono text-teal-400 uppercase tracking-widest text-sm font-semibold">
                  System Protocols
                </h2>
              </div>
              <h3 className="text-4xl font-bold font-heading text-white drop-shadow-md">
                Core Directives
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Mission */}
              <div className="bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-10 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-mono text-teal-500/50 text-xs mb-4 uppercase tracking-widest">
                  [ Directive 01 ]
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-4 flex items-center gap-3">
                  <span className="text-teal-400">/</span> Mission
                  <span className="text-2xl opacity-80 ml-1">🎯</span>
                </h3>
                <p className="text-slate-400 leading-relaxed font-mono text-sm">
                  To free agency founders from the tyranny of operational overhead — so they can
                  reinvest their time in strategy, creativity, and the work that only humans can do.
                </p>
              </div>

              {/* Vision */}
              <div className="bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-10 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="font-mono text-teal-500/50 text-xs mb-4 uppercase tracking-widest">
                  [ Directive 02 ]
                </div>
                <h3 className="text-2xl font-bold font-heading text-white mb-4 flex items-center gap-3">
                  <span className="text-teal-400">/</span> Vision
                  <span className="text-2xl opacity-80 ml-1">🔭</span>
                </h3>
                <p className="text-slate-400 leading-relaxed font-mono text-sm">
                  A Southeast Asia where every service business — regardless of team size — has
                  access to enterprise-grade AI operations. The playing field, levelled.
                </p>
              </div>

              {/* Transparency */}
              <div className="md:col-span-2 bg-[#0A0F1A]/90 backdrop-blur-3xl rounded-xl p-10 lg:p-12 border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.05)] hover:shadow-[0_0_40px_rgba(0,229,255,0.1)] hover:border-teal-400/50 transition-all duration-300 group relative overflow-hidden">
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
                      &gt; RizFlow is founder-led and bootstrapped. I'm building this while completing my studies — practicing exactly what I preach: doing more with less, and using AI to bridge the gap.
                    </p>
                    <p className="leading-relaxed text-slate-400 border-l border-teal-500/20 pl-6">
                      &gt; Every system built for clients is first tested internally. The Communication Agent handles my email. The Project Tracking Agent manages client deliverables. I know these tools work because I depend on them daily.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* System Event Log */}
        <section className="py-24 relative">
          <Container>
            <div className="text-center mb-20">
              <h2 className="font-mono text-teal-400 uppercase tracking-widest text-lg font-semibold mb-2">
                System Event Log
              </h2>
              <div className="h-[1px] w-24 bg-teal-500/30 mx-auto" />
            </div>

            <div className="font-mono max-w-4xl mx-auto space-y-6">
              {timeline.map((item, index) => (
                <div 
                  key={item.year} 
                  className="flex flex-col sm:flex-row items-start gap-8 p-8 bg-[#0A0F1A]/40 backdrop-blur-sm border border-white/5 hover:border-teal-500/30 rounded-xl transition-all duration-300 group relative"
                >
                  <div className="flex items-center gap-4 sm:w-48 flex-shrink-0 pt-1">
                    <span className="text-teal-500/40 group-hover:text-teal-400 transition-colors text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="h-[1px] flex-1 bg-teal-500/20 group-hover:bg-teal-500/50 transition-colors hidden sm:block" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="inline-flex items-center gap-2 mb-3">
                      <span className="text-cyan-400 font-bold tracking-wider text-sm uppercase">
                        [{item.year}]
                      </span>
                      {index === timeline.length - 1 && (
                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      )}
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      <span className="text-teal-500/50 mr-2">&gt;</span>
                      {item.event}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}
