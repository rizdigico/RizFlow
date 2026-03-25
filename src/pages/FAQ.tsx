import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { PlusIcon, MinusIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { FlowingMesh } from '@/components/animations/FlowingMesh'

const faqs = [
  {
    question: 'How do RizFlow AI agents integrate with our existing tools?',
    answer:
      'Our AI agents are designed for seamless integration with popular CRMs, project management, and communication platforms, requiring minimal setup. We connect to Asana, HubSpot, Slack, Xero, Notion, and 50+ other tools via secure API connectors — no rip-and-replace required.',
  },
  {
    question: 'What is the typical onboarding timeline?',
    answer:
      'Most agencies are fully live within 48 hours of kickoff. The process includes a 30-minute strategy call, workflow mapping session, and agent configuration. Your team is up and running with full support.',
  },
  {
    question: 'Is my data secure and compliant?',
    answer:
      'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Each client has fully isolated data environments. We are GDPR and PDPA compliant. Your data is never used to train public AI models.',
  },
  {
    question: 'Can RizFlow be customized for my specific industry?',
    answer:
      'Yes. While our core agents cover universal agency operations, we offer custom agent development tailored to your industry — whether you are in marketing, legal, accounting, creative, or consulting. Contact us to discuss your specific needs.',
  },
  {
    question: 'How much time will I need to invest?',
    answer:
      'After setup, you will spend less than 30 minutes per week reviewing outputs and approving optimisations. Human-in-the-loop approvals are built in for high-stakes actions — you maintain final control.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. There are no lock-in contracts. You can cancel with 30 days notice. We are confident in the results, so we do not rely on lock-in to retain clients.',
  },
]

const faqBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'FAQ', item: `${SITE_URL}/faq` },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.question,
    acceptedAnswer: { '@type': 'Answer', text: f.answer },
  })),
}

export function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ — AI Operations Questions Answered | RizFlow Singapore</title>
        <meta name="description" content="Answers to common questions about RizFlow's agentic AI operations platform — pricing, data security, onboarding timeline, tool integrations, and cancellation policy." />
        <meta name="keywords" content="RizFlow FAQ, AI operations questions, agentic AI agency FAQ, AI automation pricing FAQ, agency automation Singapore questions" />
        <link rel="canonical" href={`${SITE_URL}/faq`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/faq`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/faq`} />
        <meta property="og:title" content="FAQ — AI Operations Questions Answered | RizFlow" />
        <meta property="og:description" content="Common questions about RizFlow's agentic AI operations: pricing, security, setup time, integrations, and more." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — AI Operations Questions | RizFlow" />
        <meta name="twitter:description" content="Everything you need to know about RizFlow's agentic AI operations platform for agencies." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(faqBreadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <section className="relative min-h-screen flex flex-col overflow-hidden bg-[#050A14]">
        {/* Animated flowing mesh background */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} parallax={false} />
        </div>
        
        {/* Cyberpunk Grid */}
        <div 
          className="absolute inset-0 pointer-events-none z-0" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`, 
            backgroundSize: '30px 30px' 
          }} 
        />
        {/* Ambient blurs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="container-width relative z-10 pt-32 pb-16 flex-1">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="font-mono text-teal-400 uppercase tracking-widest text-sm mb-4 block">
                [ SYS_QUERY_INTERFACE ]
              </span>
              <h1 className="text-5xl md:text-6xl font-bold font-heading text-white leading-tight drop-shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                Knowledge Base
              </h1>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <FAQItem key={i} question={faq.question} answer={faq.answer} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function FAQItem({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className={cn(
        'rounded-lg border transition-all duration-300 overflow-hidden font-mono',
        open
          ? 'bg-[#0A0F1A]/95 backdrop-blur-3xl border-teal-500/50 shadow-[0_0_30px_rgba(0,229,255,0.1)]'
          : 'bg-[#0A0F1A]/60 border-white/5 hover:border-teal-500/30 backdrop-blur-xl'
      )}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left gap-4"
        aria-expanded={open}
      >
        <div className="flex items-start gap-3">
          <span className="text-teal-400 mt-1 shrink-0 flex items-center gap-2">
            <span className="animate-pulse opacity-70">_</span>
            <span className="uppercase text-xs tracking-wider opacity-70">query:</span>
          </span>
          <span className={cn('text-base leading-snug', open ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]' : 'text-slate-300')}>
            {question}
          </span>
        </div>
        <span className={cn('flex-shrink-0 text-sm transition-all duration-300', open ? 'text-teal-400' : 'text-slate-500')}>
          {open ? '[ - ]' : '[ + ]'}
        </span>
      </button>
      {open && (
        <div className="px-6 pb-6 pt-2">
          <div className="pl-4 border-l-2 border-teal-500/30">
            <span className="text-cyan-400 uppercase text-xs tracking-wider opacity-70 block mb-2">
              &gt; response:
            </span>
            <p className="text-slate-400 text-sm leading-relaxed tracking-wide font-sans">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}