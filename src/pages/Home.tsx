import { Helmet } from 'react-helmet-async'
import { Hero } from '@/components/sections/Hero'
import { SocialProofLogos } from '@/components/sections/SocialProofLogos'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { TestimonialCarousel } from '@/components/sections/TestimonialCarousel'
import { PricingTable } from '@/components/sections/PricingTable'
import { CTAStrip } from '@/components/sections/CTAStrip'
import { FAQAccordion } from '@/components/sections/FAQAccordion'
import { Container } from '@/components/layout/Container'
import { SEO_DEFAULTS, SITE_URL } from '@/lib/constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'RizFlow',
  description: SEO_DEFAULTS.description,
  url: SITE_URL,
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'SG',
    addressLocality: 'Singapore',
  },
  areaServed: ['Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand'],
  sameAs: [
    'https://linkedin.com/company/rizflow',
    'https://twitter.com/rizflow',
  ],
}

export function Home() {
  return (
    <>
      <Helmet>
        <title>{SEO_DEFAULTS.title}</title>
        <meta name="description" content={SEO_DEFAULTS.description} />
        <meta property="og:title" content={SEO_DEFAULTS.title} />
        <meta property="og:description" content={SEO_DEFAULTS.description} />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_DEFAULTS.title} />
        <meta name="twitter:description" content={SEO_DEFAULTS.description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Hero />
      <SocialProofLogos />
      <HowItWorks />
      <FeaturesGrid />
      <TestimonialCarousel />
      <PricingTable />

      {/* FAQ snippet */}
      <section className="section-padding bg-slate-50">
        <Container tight>
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
              FAQ
            </span>
            <h2 className="mt-3 text-4xl font-bold font-heading text-navy">Common Questions</h2>
          </div>
          <FAQAccordion limit={4} />
          <div className="text-center mt-8">
            <a href="/faq" className="text-teal font-medium hover:underline text-sm">
              View all questions →
            </a>
          </div>
        </Container>
      </section>

      <CTAStrip />
    </>
  )
}
