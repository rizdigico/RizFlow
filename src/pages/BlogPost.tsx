import { Helmet } from "react-helmet-async";
import { useParams, Link } from "react-router-dom";
import { useRef } from "react";
import { motion } from "framer-motion";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";
import { getBlogPost } from "@/data/blog-posts";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { useParallaxScroll } from "@/hooks/useFlowingAnimation";

export function BlogPost() {
  const meshRef = useRef<HTMLDivElement>(null);
  const parallaxProps = useParallaxScroll(0.5);
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : undefined;

  if (!post) {
    return (
      <>
        <Helmet>
          <title>Post Not Found | RizFlow Blog</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="min-h-screen pt-32 pb-24 bg-[#050A14] flex items-center justify-center">
          <div className="text-center">
            <p className="text-teal-400 font-mono text-sm mb-4">
              {">"} 404: Post not found
            </p>
            <Link
              to="/blog"
              className="text-white hover:text-teal-400 transition-colors font-mono"
            >
              ← Back to Blog
            </Link>
          </div>
        </section>
      </>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: `${SITE_URL}/blog/${slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Person", name: post.author, url: `${SITE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: "RizFlow",
      url: SITE_URL,
      logo: `${SITE_URL}/business-logo-square.png`,
    },
    image: SEO_DEFAULTS.ogImage,
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | RizFlow</title>
        <meta name="description" content={post.description} />
        <meta name="keywords" content={post.keywords} />
        <link rel="canonical" href={`${SITE_URL}/blog/${slug}`} />
        <link
          rel="alternate"
          hrefLang="en-SG"
          href={`${SITE_URL}/blog/${slug}`}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${SITE_URL}/blog/${slug}`} />
        <meta property="og:title" content={`${post.title} | RizFlow`} />
        <meta property="og:description" content={post.description} />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post.title} | RizFlow`} />
        <meta name="twitter:description" content={post.description} />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(breadcrumb)}</script>
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      </Helmet>

      <div className="relative min-h-screen pt-32 pb-24 bg-[#050A14] w-full overflow-hidden">
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

        <div className="container-width relative z-10 max-w-3xl mx-auto px-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-teal-400 font-mono text-xs uppercase tracking-widest mb-8 hover:text-teal-300 transition-colors"
          >
            ← Back to Blog
          </Link>

          {/* Post header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <p className="text-xs font-mono text-teal-500 uppercase tracking-widest">
                {post.date}
              </p>
              <span className="text-slate-600">·</span>
              <p className="text-xs font-mono text-slate-500">
                {post.readingTime}
              </p>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-white mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <p className="text-sm text-slate-400 font-mono">
                By {post.author}
              </p>
            </div>
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
          </div>

          {/* Post content */}
          {post.content ? (
            <article
              className="prose prose-invert prose-teal max-w-none
                bg-[#0A0F1A]/60 border border-white/[0.06] rounded-2xl p-6 sm:p-10
                prose-headings:font-heading prose-headings:text-white prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-20 prose-h2:mb-8
                prose-h3:text-2xl prose-h3:mt-16 prose-h3:mb-6
                prose-p:text-slate-200 prose-p:leading-[2] prose-p:mb-8 prose-p:text-lg prose-p:font-sans
                prose-strong:text-white prose-strong:font-semibold
                prose-em:text-slate-200
                prose-ul:text-slate-200 prose-ul:text-lg prose-ul:font-sans prose-ul:leading-[2] prose-ul:space-y-4 prose-ul:mb-10
                prose-ol:text-slate-200 prose-ol:text-lg prose-ol:font-sans prose-ol:leading-[2] prose-ol:space-y-4 prose-ol:mb-10
                prose-li:text-slate-200
                prose-a:text-teal-400 prose-a:no-underline hover:prose-a:text-teal-300
              "
            >
              {post.content}
            </article>
          ) : (
            <div className="bg-[#0A0F1A]/80 border border-teal-500/20 rounded-xl p-8 text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                Coming Soon
              </div>
              <p className="text-slate-400 font-mono text-sm mb-6">
                {">"} Full article coming soon. In the meantime, book your free
                audit.
              </p>
              <Link
                to="/audit"
                className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400 text-teal-400 uppercase tracking-widest text-xs px-6 py-3 rounded hover:bg-teal-400 hover:text-[#050A14] transition-all duration-300"
              >
                Get Free Discovery Audit
              </Link>
            </div>
          )}

          {/* Bottom CTA */}
          {post.content && (
            <div className="mt-16 pt-8 border-t border-teal-500/20">
              <div className="bg-[#0A0F1A]/80 border border-teal-500/20 rounded-xl p-8 text-center">
                <p className="text-white font-heading font-bold text-xl mb-2">
                  Ready to automate your business operations?
                </p>
                <p className="text-slate-400 font-mono text-sm mb-6">
                  {">"} See exactly how much time you can save with a free
                  operational audit.
                </p>
                <Link
                  to="/audit"
                  className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400 text-teal-400 uppercase tracking-widest text-xs px-6 py-3 rounded hover:bg-teal-400 hover:text-[#050A14] transition-all duration-300"
                >
                  Get Free Discovery Audit
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
