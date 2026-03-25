import { Helmet } from 'react-helmet-async'
import { useParams, Link } from 'react-router-dom'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'
import { blogPostsMeta } from './Blog'

export function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? blogPostsMeta[slug] : null

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | RizFlow Blog</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="min-h-screen pt-32 pb-24 bg-[#050A14] flex items-center justify-center">
          <div className="text-center">
            <p className="text-teal-400 font-mono text-sm mb-4">{'>'} 404: Post not found</p>
            <Link to="/blog" className="text-white hover:text-teal-400 transition-colors font-mono">
              ← Back to Blog
            </Link>
          </div>
        </section>
      </>
    )
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title.replace(' | RizFlow', ''),
    description: post.description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: post.published,
    dateModified: post.published,
    author: { '@type': 'Person', name: 'Aariz Arfan', url: `${SITE_URL}/about` },
    publisher: { '@type': 'Organization', name: 'RizFlow', url: SITE_URL, logo: `${SITE_URL}/agency-logo-square.png` },
    image: SEO_DEFAULTS.ogImage,
  }

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title.replace(' | RizFlow', ''), item: `${SITE_URL}/blog/${slug}` },
    ],
  }

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords} />
        <link rel="canonical" href={`${SITE_URL}/blog/${slug}`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/blog/${slug}`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/${slug}`} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      <section className="relative min-h-screen pt-32 pb-24 bg-[#050A14] bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
        <div className="container-width relative z-10 max-w-3xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-widest mb-8 hover:text-teal-300 transition-colors">
            ← Back to Blog
          </Link>
          <p className="text-xs font-mono text-teal-500 uppercase tracking-widest mb-4">{post.published}</p>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-6 leading-tight">
            {post.title.replace(' | RizFlow', '')}
          </h1>
          <p className="text-slate-400 font-mono text-sm leading-relaxed mb-12">{post.description}</p>

          <div className="bg-[#0A0F1A]/80 border border-teal-500/20 rounded-xl p-8 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              Coming Soon
            </div>
            <p className="text-slate-400 font-mono text-sm mb-6">{'>'} Full article coming soon. In the meantime, book your free audit.</p>
            <Link
              to="/audit"
              className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400 text-teal-400 uppercase tracking-widest text-xs px-6 py-3 rounded hover:bg-teal-400 hover:text-[#050A14] transition-all duration-300"
            >
              Get Free Operational Audit
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
