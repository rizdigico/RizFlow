import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { FounderProfile } from '@/components/sections/FounderProfile'
import { CTAStrip } from '@/components/sections/CTAStrip'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'

const timeline = [
  { year: '2021', event: 'Worked in ops at a 20-person digital marketing agency in Singapore. Spent 40% of time on manual coordination.' },
  { year: '2022', event: 'Started automating workflows with Zapier and custom scripts. Saved 12 hours a week personally.' },
  { year: '2023', event: 'Discovered large language models could handle nuanced ops tasks. Started building agent prototypes.' },
  { year: '2024', event: 'Ran first paid pilot with 3 agencies. Validated the core product. RizFlow was born.' },
  { year: '2025', event: 'Serving 20+ agencies across SEA. Building while studying — proving it can be done.' },
]

export function About() {
  return (
    <>
      <Helmet>
        <title>About Aariz & RizFlow — The Founder Story | RizFlow</title>
        <meta
          name="description"
          content="Meet Aariz, the founder of RizFlow. Learn why he built an AI operations platform for agencies while studying — and what drives RizFlow's mission."
        />
      </Helmet>

      {/* Hero */}
      <section className="pt-32 pb-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <Container className="relative z-10 text-center">
          <Badge variant="teal" className="mb-4">Our Story</Badge>
          <h1 className="text-5xl md:text-6xl font-bold font-heading text-white mb-4 leading-tight">
            Built by an Agency Operator,
            <br />
            <span className="text-gradient">For Agency Operators</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            RizFlow started with a simple frustration: too much time on operations, not enough on
            the work that actually moves the needle.
          </p>
        </Container>
      </section>

      {/* Founder */}
      <section className="section-padding bg-white">
        <Container tight>
          <FounderProfile />
        </Container>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-slate-50">
        <Container tight>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-soft">
              <div className="w-10 h-10 bg-teal/10 rounded-xl flex items-center justify-center mb-4 text-xl">
                🎯
              </div>
              <h3 className="text-xl font-bold font-heading text-navy mb-3">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To free agency founders from the tyranny of operational overhead — so they can
                reinvest their time in strategy, creativity, and the work that only humans can do.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-soft">
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center mb-4 text-xl">
                🔭
              </div>
              <h3 className="text-xl font-bold font-heading text-navy mb-3">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                A Southeast Asia where every service business — regardless of team size — has
                access to enterprise-grade AI operations. The playing field, levelled.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Study–Founder Balance */}
      <section className="section-padding bg-white">
        <Container tight>
          <div className="bg-navy rounded-3xl p-10 md:p-14 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative z-10">
              <Badge variant="teal" className="mb-4">Transparency</Badge>
              <h2 className="text-3xl font-bold font-heading text-white mb-4">
                Building While Studying
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mb-4">
                RizFlow is founder-led and bootstrapped. I'm building this while completing my
                studies — which means I practise exactly what I preach: doing more with less, and
                using AI to bridge the gap.
              </p>
              <p className="text-slate-400 leading-relaxed max-w-2xl">
                Every system I build for clients, I've first tested on RizFlow itself. The
                Communication Agent handles my email. The Project Tracking Agent manages client
                deliverables. I know these tools work because I depend on them personally every day.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-slate-50">
        <Container tight>
          <h2 className="text-3xl font-bold font-heading text-navy text-center mb-12">
            The RizFlow Journey
          </h2>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-px bg-teal/20 hidden md:block" />
            <div className="space-y-6">
              {timeline.map((item) => (
                <div key={item.year} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-teal/10 border-2 border-teal/30 flex items-center justify-center z-10">
                    <span className="text-teal text-xs font-bold font-heading">{item.year}</span>
                  </div>
                  <div className="bg-white rounded-xl p-5 border border-slate-100 flex-1 shadow-soft">
                    <p className="text-slate-700 leading-relaxed">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <CTAStrip variant="navy" />
    </>
  )
}
