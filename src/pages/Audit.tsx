import { Helmet } from 'react-helmet-async'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { AuditForm } from '@/components/forms/AuditForm'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { SITE_URL } from '@/lib/constants'

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
        <title>Get Your Free Operational Audit — RizFlow</title>
        <meta
          name="description"
          content="Book a free 30-minute Operational Audit with RizFlow. We'll map your agency workflows, identify automation opportunities, and project your time savings. No commitment."
        />
        <meta property="og:url" content={`${SITE_URL}/audit`} />
      </Helmet>

      <section className="pt-32 pb-24 bg-slate-50 min-h-screen">
        <Container>
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left — Info */}
            <div>
              <Badge variant="teal" className="mb-5">
                100% Free · No Commitment
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold font-heading text-navy mb-4 leading-tight">
                Get Your Free
                <br />
                <span className="text-teal">Operational Audit</span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                In 30 minutes, we'll analyse your agency's current workflows, identify exactly
                where time is leaking, and show you what a fully automated operations layer would
                look like for your specific setup.
              </p>

              <div className="space-y-3 mb-10">
                <h3 className="text-sm font-semibold text-navy uppercase tracking-widest font-heading">
                  What You'll Get
                </h3>
                {benefits.map((b) => (
                  <div key={b} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-teal/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircleIcon className="w-4 h-4 text-teal" />
                    </div>
                    <span className="text-slate-700 text-sm">{b}</span>
                  </div>
                ))}
              </div>

              <div className="bg-navy rounded-2xl p-6 text-white">
                <p className="text-teal text-xs font-semibold uppercase tracking-widest font-heading mb-3">
                  Data & Privacy
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  Your information is encrypted in transit and at rest. We are GDPR and PDPA
                  compliant. Your data is never shared or sold. We use it only to prepare your audit.
                </p>
              </div>
            </div>

            {/* Right — Form */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
              <h2 className="text-xl font-bold font-heading text-navy mb-6">
                Request Your Audit
              </h2>
              <AuditForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
