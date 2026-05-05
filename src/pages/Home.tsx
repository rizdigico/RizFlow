import { Helmet } from "react-helmet-async";
import { useRef } from "react";
import { motion } from "framer-motion";
import { Hero } from "@/components/sections/Hero";
import { Testimonial } from "@/components/sections/Testimonial";
import { SocialProofLogos } from "@/components/sections/SocialProofLogos";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { FeaturesGrid } from "@/components/sections/FeaturesGrid";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { useParallaxScroll } from "@/hooks/useFlowingAnimation";
import { Container } from "@/components/layout/Container";
import { SEO_DEFAULTS, SITE_URL } from "@/lib/constants";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "RizFlow",
      url: SITE_URL,
      logo: `${SITE_URL}/og-banner.png`,
      foundingDate: "2026",
      founder: { "@type": "Person", name: "Aariz Arfan" },
      description:
        "RizFlow builds custom agentic-AI systems for businesses and SMEs, saving owners 10-20 hours per week on manual operations — run your business from your phone.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "SG",
        addressLocality: "Singapore",
      },
      contactPoint: {
        "@type": "ContactPoint",
        email: "main@rizflow.co",
        contactType: "customer service",
      },
      sameAs: [
        "https://www.linkedin.com/in/aariz-arfan/",
        "https://www.instagram.com/rizflow.ai/",
        "https://www.tiktok.com/@rizflow.ai",
      ],
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_URL}/#business`,
      name: "RizFlow",
      url: SITE_URL,
      priceRange: "$$$$",
      description:
        "Custom agentic-AI systems for businesses and SMEs based in Singapore. We automate customer intake, workflow tracking, scheduling, billing, communications, and more — tailored to your specific business.",
      address: {
        "@type": "PostalAddress",
        addressCountry: "SG",
        addressLocality: "Singapore",
      },
      areaServed: [
        "Singapore",
        "Malaysia",
        "Indonesia",
        "Philippines",
        "Thailand",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Custom Agentic-AI Implementation Plans",
        itemListElement: [
          {
            "@type": "Offer",
            name: "Starter",
            description:
              "1-2 custom AI agents, single channel integration, basic admin automation for solo operators",
          },
          {
            "@type": "Offer",
            name: "Growth",
            description:
              "3-5 custom AI agents, multi-channel integration, full operations coverage with 90-day guarantee",
          },
          {
            "@type": "Offer",
            name: "Scale",
            description:
              "5+ custom agents, unlimited scope, all channels, dedicated account manager for established businesses",
          },
        ],
      },
    },
  ],
};

export function Home() {
  const meshRef = useRef<HTMLDivElement>(null);
  const parallaxProps = useParallaxScroll(0.5);

  return (
    <>
      <Helmet>
        <title>Custom Agentic-AI Systems for Businesses & SMEs | RizFlow</title>
        <meta
          name="description"
          content="RizFlow builds custom agentic-AI systems tailored to your business. Automate workflows, communications, invoicing, and more — run your business from your phone."
        />
        <meta
          name="keywords"
          content="custom AI agents for business, SME AI automation, agentic AI systems, business automation, run business from phone"
        />
        <link rel="canonical" href={SITE_URL} />
        <link rel="alternate" hrefLang="en-SG" href={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta
          property="og:title"
          content="Custom Agentic-AI Systems for Businesses & SMEs | RizFlow"
        />
        <meta
          property="og:description"
          content="RizFlow builds custom agentic-AI systems tailored to your business. Automate workflows, communications, invoicing, and more — run your business from your phone."
        />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Custom Agentic-AI Systems for Businesses & SMEs | RizFlow"
        />
        <meta
          name="twitter:description"
          content="RizFlow builds custom agentic-AI systems tailored to your business. Automate workflows and run your business from your phone."
        />
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
          <Testimonial />
          <HowItWorks />
          <FeaturesGrid />
        </div>
      </div>

      <SocialProofLogos />
    </>
  );
}
