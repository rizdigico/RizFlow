import { Helmet } from 'react-helmet-async'
import { PricingTable } from '@/components/sections/PricingTable'
import { CTAStrip } from '@/components/sections/CTAStrip'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { SITE_URL } from '@/lib/constants'

const process = [
  { step: '01', title: 'Discovery Call', desc: 'Free 30-min audit to map your current workflows and identify automation opportunities.' },
  { step: '02', title: 'Proposal & Sign-off', desc: 'Custom implementation plan with clear scope, timeline, and expected ROI — delivered within 48 hours.' },
  { step: '03', title: 'Agent Configuration', desc: 'Our team builds and configures your agent stack, connects your tools, and tests all workflows.' },
  { step: '04', title: 'Team Onboarding', desc: 'Live walkthrough with your team. We ensure everyone knows how to work alongside the agents.' },
  { step: '05', title: 'Go Live & Monitor', desc: 'Agents go live. We monitor closely for the first 2 weeks and fine-tune based on real performance.' },
  { step: '06', title: 'Ongoing Optimisation', desc: 'Monthly reviews to add new automations, adjust to workflow changes, and push more hours back to you.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI Operations Automation',
  provider: { '@type': 'Organization', name: 'RizFlow' },
  areaServed: 'Southeast Asia',
  offers: [
    { '@type': 'Offer', name: 'Starter', price: '1800', priceCurrency: 'SGD' },
    { '@type': 'Offer', name: 'Professional', price: '3000', priceCurrency: 'SGD' },
    { '@type': 'Offer', name: 'Enterprise', price: '4500', priceCurrency: 'SGD' },
  ],
}

export function Services() {
  return (
    <>
      <Helmet>
        <title>Services & Pricing — AI Operations Plans | RizFlow</title>
        <meta
          name="description"
          content="RizFlow's Starter ($1,800), Professional ($3,000), and Enterprise ($4,500) plans. AI-powered operations for agencies of every size in Singapore and SEA."
        />
        <meta property="og:url" content={`${SITE_URL}/services`} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <section className="pt-32 pb-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <Container className="relative z-10 text-center">
          <Badge variant="teal" className="mb-4">Plans & Pricing</Badge>
          <h1 className="text-5xl md:text-6xl font-bold font-heading text-white mb-4 leading-tight">
            Choose Your{' '}
            <span className="text-gradient">Automation Level</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-xl mx-auto">
            Transparent pricing. No hidden fees. Start with a free audit — commit only when
            you're confident in the ROI.
          </p>
        </Container>
      </section>

      <PricingTable />

      {/* Implementation Process */}
      <section className="section-padding bg-slate-50">
        <Container>
          <div className="text-center mb-14">
            <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
              Implementation
            </span>
            <h2 className="mt-3 text-4xl font-bold font-heading text-navy">
              How We Get You Running
            </h2>
            <p className="mt-4 text-xl text-slate-500 max-w-xl mx-auto">
              A structured 6-step process from first call to full deployment.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {process.map((p) => (
              <div
                key={p.step}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft hover:shadow-md transition-shadow"
              >
                <span className="text-5xl font-black text-slate-100 font-heading block mb-3 leading-none">
                  {p.step}
                </span>
                <h3 className="text-lg font-semibold font-heading text-navy mb-2">{p.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CTAStrip />
    </>
  )
}
