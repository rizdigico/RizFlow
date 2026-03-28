import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'
import { blogPosts } from '@/data/blog-posts'

const blogBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
  ],
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
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="block bg-[#0A0F1A]/80 border border-teal-500/20 rounded-xl p-6 hover:border-teal-400/50 transition-colors group"
              >
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <p className="text-xs font-mono text-teal-500 uppercase tracking-widest">{post.date}</p>
                  <span className="text-slate-600">·</span>
                  <p className="text-xs font-mono text-slate-500">{post.readingTime}</p>
                  <span className="text-slate-600">·</span>
                  <p className="text-xs font-mono text-slate-500">{post.author}</p>
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors mb-2">{post.title}</h2>
                <p className="text-sm text-slate-400 font-mono line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded border border-teal-500/20 text-teal-500/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
