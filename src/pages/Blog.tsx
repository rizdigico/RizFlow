import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'

const blogBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
  ],
}

export const blogPostsMeta: Record<string, { title: string; description: string; keywords: string; published: string }> = {
  'ai-operations-for-agencies-guide': {
    title: 'AI Operations for Agencies: The Complete Guide | RizFlow',
    description: 'A comprehensive guide to implementing AI operations in your service-based agency. Learn how agentic AI can automate manual work and save founders 10-20 hours per week.',
    keywords: 'AI operations agencies guide, automated agency operations, agentic AI guide, agency AI automation, AI workflow automation for agencies',
    published: '2026-03-25',
  },
  'agentic-ai-explained': {
    title: 'Agentic AI Explained: How AI Agents Work for Agencies | RizFlow',
    description: 'Understand what agentic AI is and how AI agent teams can transform your agency operations. A plain-language breakdown for agency founders in Singapore and SEA.',
    keywords: 'agentic AI explained, AI agents for agencies, what is agentic AI, AI automation explained, AI agent teams for businesses',
    published: '2026-03-25',
  },
  'agency-automation-roi': {
    title: 'Agency Automation ROI: Calculate Your AI Operations Return | RizFlow',
    description: 'Learn how to calculate the ROI of automating your agency operations with agentic AI. Real numbers, real results from Singapore agencies saving 10-20 hrs/week.',
    keywords: 'agency automation ROI, AI operations return on investment, automate agency manual work with AI, AI automation cost benefit, agency efficiency AI',
    published: '2026-03-25',
  },
  'singapore-agency-tech-trends': {
    title: 'Singapore Agency Tech Trends 2026: AI Operations Takes Over | RizFlow',
    description: 'How Singapore service-based agencies are adopting AI operations in 2026. Key trends in agentic AI, workflow automation, and hands-free operations for SEA agencies.',
    keywords: 'Singapore agency tech trends, AI operations Singapore, agentic AI for service-based agencies Singapore, SEA agency automation, Singapore AI adoption',
    published: '2026-03-25',
  },
  'client-onboarding-automation': {
    title: 'Client Onboarding Automation with AI: A Guide for Agencies | RizFlow',
    description: 'Automate your agency client onboarding with agentic AI. Cut onboarding time from days to hours with AI-powered workflows for contracts, kickoff, and CRM setup.',
    keywords: 'client onboarding automation, AI client onboarding, automated agency onboarding, AI workflow for client setup, agency automation Singapore',
    published: '2026-03-25',
  },
  'email-management-ai': {
    title: 'AI Email Management for Agency Founders: Triage & Automate | RizFlow',
    description: 'Stop drowning in emails. Discover how agentic AI can triage, draft, and route your agency inbox automatically — saving 2-5 hours per week for agency founders.',
    keywords: 'AI email management, email triage AI, automated email for agencies, AI inbox automation, hands-free email operations',
    published: '2026-03-25',
  },
}

export function Blog() {
  return (
    <>
      <Helmet>
        <title>AI Operations Insights for Agencies | RizFlow Blog</title>
        <meta name="description" content="Expert insights on agentic AI, agency automation, and running your service business on autopilot. From the RizFlow team." />
        <meta name="keywords" content="AI operations blog, agency automation tips, agentic AI insights" />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:title" content="AI Operations Insights for Agencies | RizFlow Blog" />
        <meta property="og:description" content="Expert insights on agentic AI, agency automation, and running your service business on autopilot. From the RizFlow team." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI Operations Insights for Agencies | RizFlow Blog" />
        <meta name="twitter:description" content="Expert insights on agentic AI, agency automation, and running your service business on autopilot." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(blogBreadcrumb)}</script>
      </Helmet>

      <section className="relative min-h-screen pt-32 pb-24 bg-[#050A14] bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="container-width relative z-10 max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Knowledge Base
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4 leading-tight">
              AI Operations Blog
            </h1>
            <p className="text-slate-400 font-mono text-sm max-w-xl mx-auto">
              {'>'} Guides on agentic AI, agency automation, and ops efficiency for service businesses.
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(blogPostsMeta).map(([slug, post]) => (
              <Link
                key={slug}
                to={`/blog/${slug}`}
                className="block bg-[#0A0F1A]/80 border border-teal-500/20 rounded-xl p-6 hover:border-teal-400/50 transition-colors group"
              >
                <p className="text-xs font-mono text-teal-500 uppercase tracking-widest mb-2">{post.published}</p>
                <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors mb-2">{post.title.replace(' | RizFlow', '')}</h2>
                <p className="text-sm text-slate-400 font-mono line-clamp-2">{post.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
