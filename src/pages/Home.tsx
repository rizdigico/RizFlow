import { Helmet } from 'react-helmet-async'
import { useRef } from 'react'
import { motion } from 'framer-motion'
import { Hero } from '@/components/sections/Hero'
import { SocialProofLogos } from '@/components/sections/SocialProofLogos'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { FeaturesGrid } from '@/components/sections/FeaturesGrid'
import { FlowingMesh } from '@/components/animations/FlowingMesh'
import { useParallaxScroll } from '@/hooks/useFlowingAnimation'
import { Container } from '@/components/layout/Container'
import { SEO_DEFAULTS, SITE_URL } from '@/lib/constants'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'RizFlow',
      url: SITE_URL,
      logo: `${SITE_URL}/og-banner.png`,
      foundingDate: '2026',
      founder: { '@type': 'Person', name: 'Aariz Arfan' },
      description: 'RizFlow builds and manages agentic AI systems for service-based agencies, saving founders 10-20 hours per week on manual operations.',
      address: { '@type': 'PostalAddress', addressCountry: 'SG', addressLocality: 'Singapore' },
      contactPoint: { '@type': 'ContactPoint', email: 'rizdigi.co@gmail.com', contactType: 'customer service' },
      sameAs: [
        'https://www.linkedin.com/in/aariz-arfan/',
        'https://www.instagram.com/rizflow.ai/',
        'https://www.tiktok.com/@rizflow.ai',
      ],
    },
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE_URL}/#business`,
      name: 'RizFlow',
      url: SITE_URL,
      priceRange: '$$$$',
      description: 'Agentic AI operations agency based in Singapore. We automate email triage, client onboarding, invoicing, reporting, and CRM updates for service-based agencies.',
      address: { '@type': 'PostalAddress', addressCountry: 'SG', addressLocality: 'Singapore' },
      areaServed: ['Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Thailand'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'AI Operations Plans',
        itemListElement: [
          { '@type': 'Offer', name: 'Starter Node', description: 'AI operations starter plan for small agencies' },
          { '@type': 'Offer', name: 'Pro Agent Stack', description: 'Full AI agent stack for growing agencies' },
          { '@type': 'Offer', name: 'Enterprise Grid', description: 'Enterprise-grade AI operations for large agencies' },
        ],
      },
    },
  ],
}

export function Home() {
  const meshRef = useRef<HTMLDivElement>(null)
  const parallaxProps = useParallaxScroll(0.5)

  return (
    <>
      <Helmet>
        <title>RizFlow | Agentic-AI operations for Agencies</title>
        <meta name="description" content="RizFlow builds and manages agentic AI systems that save service agency founders 15-25 hours/week. Hands-free AI operations for 5-25 person agencies in Singapore." />
        <meta name="keywords" content="AI operations agency, agentic AI for agencies, AI automation Singapore, automated agency operations, hands-free AI operations" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-SG" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="RizFlow | Agentic-AI operations for Agencies" />
        <meta property="og:description" content="RizFlow builds and manages agentic AI systems that save service agency founders 15-25 hours/week. Hands-free AI operations for 5-25 person agencies in Singapore." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="RizFlow | Agentic-AI operations for Agencies" />
        <meta name="twitter:description" content="RizFlow builds and manages agentic AI systems that save service agency founders 15-25 hours/week. Hands-free AI operations for 5-25 person agencies in Singapore." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <div className="relative bg-navy-dark w-full overflow-hidden">
        {/* Shared Animated flowing mesh background */}
        <motion.div
          ref={meshRef}
          className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none"
          style={parallaxProps.y ? { y: parallaxProps.y } : {}}
        >
          <FlowingMesh opacity={0.6} parallax={true} />
        </motion.div>

        {/* Shared Grid pattern overlay */}
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-[length:32px_32px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0)_80%)] opacity-10 pointer-events-none" />

        <div className="relative z-10 w-full">
          <Hero />
          <HowItWorks />
          <FeaturesGrid />
        </div>
      </div>

      <SocialProofLogos />
    </>
  )
}
