import { Helmet } from 'react-helmet-async'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { CTAStrip } from '@/components/sections/CTAStrip'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { SITE_URL } from '@/lib/constants'

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Do I need to change my existing tools?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. Our agents connect to your current PM, CRM, email, and accounting systems via API or secure connectors — no rip-and-replace required.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is my data protected?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All data is encrypted in transit and at rest, isolated per client, and we are GDPR/PDPA compliant. No data is used to train public models.',
      },
    },
    {
      '@type': 'Question',
      name: 'How much time will I need to spend?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'After setup, you will spend less than 30 minutes per week reviewing outputs and approving optimisations.',
      },
    },
  ],
}

export function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ — Common Questions About RizFlow | RizFlow</title>
        <meta
          name="description"
          content="Answers to common questions about RizFlow's AI operations platform — pricing, data security, setup time, tool integrations, and more."
        />
        <meta property="og:url" content={`${SITE_URL}/faq`} />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="pt-32 pb-24 min-h-screen bg-white">
        <Container tight>
          <div className="text-center mb-14">
            <Badge variant="teal" className="mb-4">FAQ</Badge>
            <h1 className="text-5xl font-bold font-heading text-navy mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Everything you need to know before starting. Still have questions?{' '}
              <a href="/contact" className="text-teal hover:underline">
                Get in touch.
              </a>
            </p>
          </div>
          <FAQAccordion />
        </Container>
      </section>

      <CTAStrip />
    </>
  )
}
