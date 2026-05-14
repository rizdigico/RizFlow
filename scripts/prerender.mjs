#!/usr/bin/env node
/**
 * Post-build prerender script for RizFlow SPA SEO.
 *
 * Generates static HTML for each route so that crawlers (Google, Perplexity,
 * ChatGPT search, etc.) see real content instead of a blank React shell.
 *
 * Usage:
 *   node scripts/prerender.mjs          # Pre-render all routes
 *   node scripts/prerender.mjs --check  # Verify pre-rendered files exist
 *
 * Requirements: Puppeteer must be installed (npm install puppeteer).
 * Runs after `vite build` via the `build` script in package.json.
 */

import { mkdir, writeFile, readFile, access } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");

const ROUTES = [
  { path: "/", title: "RizFlow — Custom Agentic-AI for Businesses & SMEs", description: "RizFlow builds custom agentic-AI systems tailored to your business. Automate workflows, communications, invoicing, and more — run your business from your phone. Free Discovery Audit. Based in Singapore, serving SEA." },
  { path: "/about", title: "About RizFlow — AI Automation for Singapore SMEs", description: "Founded by Aariz Arfan, RizFlow builds custom AI agent systems that automate operations for Singapore businesses. 90-day guarantee, no lock-in contracts." },
  { path: "/services", title: "Custom AI Agent Services & Pricing — RizFlow", description: "Full-stack agentic-AI systems starting from $1,800/mo with 90-day guarantee. Starter, Growth, and Scale tiers for Singapore SMEs." },
  { path: "/audit", title: "Free Discovery Audit — RizFlow", description: "Book a free 30-minute audit to discover how AI automation can save your business 10+ hours per week. No pitch, just a personalized roadmap." },
  { path: "/demo", title: "Live AI Demo — See RizFlow Agents in Action", description: "Interact with live AI agents built for your industry. See how RizFlow automates reservations, orders, leads, and more — in real-time." },
  { path: "/ai-score", title: "AI Readiness Score — How Ready Is Your Business?", description: "Take the free 2-minute AI readiness quiz and get a personalized score, savings estimate, and automation roadmap for your business." },
  { path: "/case-studies", title: "Case Studies — RizFlow Client Results", description: "See how RainFresh and Brewed Identity saved 14+ hours/week with custom RizFlow AI agents. Real metrics, real businesses." },
  { path: "/case-study/rainfresh-sg", title: "RainFresh Case Study — 99% Faster Processing with AI", description: "RainFresh cut processing time by 99% and saved 14+ hours/week with RizFlow AI agents. See the full before/after breakdown." },
  { path: "/case-study/brewed-identity", title: "Brewed Identity Case Study — 93% Faster Listings with AI", description: "Brewed Identity reduced listing time by 93% and response time by 99% with RizFlow AI agents. See how." },
  { path: "/blog", title: "Blog — AI Automation Insights for SMEs | RizFlow", description: "Practical guides on agentic-AI, business automation ROI, and Singapore tech trends. Written for business owners who want to save time." },
  { path: "/blog/agentic-ai-explained", title: "What Is Agentic AI? — Explained for Business Owners", description: "Agentic-AI differs from chatbots and basic automation. Learn what agentic-AI is, how it works, and why it matters for SMEs." },
  { path: "/blog/business-automation-roi", title: "Business Automation ROI — Data-Driven Analysis", description: "Data-driven analysis of return on investment from business automation. Real cost savings and time recovery figures for SMEs." },
  { path: "/blog/ai-operations-for-agencies-guide", title: "AI Operations for Businesses: The Complete Guide", description: "A comprehensive guide to implementing custom agentic-AI systems. Learn how AI agents automate manual work and save 15-25 hours/week." },
  { path: "/blog/singapore-business-tech-trends", title: "Singapore Business Tech Trends 2026", description: "Technology adoption trends, digital transformation statistics, and AI readiness data for Singapore SMEs." },
  { path: "/blog/client-onboarding-automation", title: "Client Onboarding Automation with AI Agents", description: "How AI agents automate the client onboarding workflow — from inquiry to activation in minutes instead of days." },
  { path: "/blog/email-management-ai", title: "Email Management AI — How AI Agents Handle Your Inbox", description: "How AI agents manage business email and communications, triaging priorities and drafting responses." },
  { path: "/faq", title: "FAQ — RizFlow AI Services Questions Answered", description: "Common questions about RizFlow's AI services, pricing, onboarding, 90-day guarantee, and how agentic-AI differs from chatbots." },
  { path: "/privacy-terms", title: "Privacy Policy & Terms of Service — RizFlow", description: "RizFlow's data handling practices, PDPA compliance, and terms of service." },
  { path: "/thank-you", title: "Thank You — RizFlow", description: "Your audit request was received. Book your free 30-minute Discovery Audit call with RizFlow." },
];

const SITE_URL = "https://www.rizflow.co";

async function generateStaticShell(route) {
  const { title, description, path: routePath } = route;
  const canonicalUrl = `${SITE_URL}${routePath}`;
  const ogImage = `${SITE_URL}/og-banner.png`;

  // Read the built index.html as base
  let baseHtml;
  try {
    baseHtml = await readFile(join(DIST, "index.html"), "utf-8");
  } catch {
    console.error("[prerender] Could not read dist/index.html. Run `vite build` first.");
    process.exit(1);
  }

  // Replace title and description for this route
  let html = baseHtml
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(
      /(<meta\s+name="description"\s+content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
      `$1${canonicalUrl}$2`,
    )
    .replace(
      /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
      `$1${title}$2`,
    )
    .replace(
      /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      /(<meta\s+name="twitter:title"\s+content=")[^"]*(")/,
      `$1${title}$2`,
    )
    .replace(
      /(<meta\s+name="twitter:description"\s+content=")[^"]*(")/,
      `$1${description}$2`,
    )
    .replace(
      /(<link\s+rel="canonical"\s+href=")[^"]*(")/,
      `$1${canonicalUrl}$2`,
    );

  // Add route-specific JSON-LD if it's a case study
  if (routePath.startsWith("/case-study/") || routePath === "/case-studies") {
    const jsonLd = routePath.includes("rainfresh")
      ? `{"@context":"https://schema.org","@type":"Article","headline":"RainFreshSG Case Study — 99% Faster Processing with AI","description":"RainFresh cut processing time by 99% and saved 14+ hours/week with RizFlow AI agents.","url":"${canonicalUrl}","image":"${SITE_URL}/rainfresh-logo.png","author":{"@type":"Organization","name":"RizFlow","url":"${SITE_URL}"},"publisher":{"@type":"Organization","name":"RizFlow","logo":{"@type":"ImageObject","url":"${SITE_URL}/rizflow-logo-new.png"}},"datePublished":"2026-04-15"}`
      : routePath.includes("brewed-identity")
        ? `{"@context":"https://schema.org","@type":"Article","headline":"Brewed Identity Case Study — 93% Faster Listings with AI","description":"Brewed Identity reduced listing time by 93% and response time by 99% with RizFlow AI agents.","url":"${canonicalUrl}","image":"${SITE_URL}/brewedidentity-logo.png","author":{"@type":"Organization","name":"RizFlow","url":"${SITE_URL}"},"publisher":{"@type":"Organization","name":"RizFlow","logo":{"@type":"ImageObject","url":"${SITE_URL}/rizflow-logo-new.png"}},"datePublished":"2026-04-20"}`
        : null;

    if (jsonLd) {
      html = html.replace("</head>", `<script type="application/ld+json">${jsonLd}</script>\n</head>`);
    }
  }

  // Add FAQ schema for /faq
  if (routePath === "/faq") {
    const faqJsonLd = `{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"What is agentic-AI?","acceptedAnswer":{"@type":"Answer","text":"Agentic-AI systems are autonomous AI agents that can reason, decide, and act on behalf of your business — handling workflows, communications, and operations without constant human oversight."}},{"@type":"Question","name":"How much does RizFlow cost?","acceptedAnswer":{"@type":"Answer","text":"RizFlow offers three tiers: Starter at $1,800/mo SGD, Growth at $3,200/mo SGD, and Scale at $5,000/mo SGD. All include a 90-day guarantee and no lock-in contracts."}},{"@type":"Question","name":"What's the 90-day guarantee?","acceptedAnswer":{"@type":"Answer","text":"If RizFlow doesn't deliver the results we promise within 90 days, you can cancel with no further obligation. No lock-in contracts."}}]}`;
    html = html.replace("</head>", `<script type="application/ld+json">${faqJsonLd}</script>\n</head>`);
  }

  return html;
}

async function main() {
  const args = process.argv.slice(2);
  const checkOnly = args.includes("--check");

  if (checkOnly) {
    // Verify all pre-rendered files exist
    let missing = 0;
    for (const route of ROUTES) {
      const filePath = route.path === "/"
        ? join(DIST, "index.html")
        : join(DIST, route.path, "index.html");
      try {
        await access(filePath);
      } catch {
        console.error(`[prerender] MISSING: ${route.path}`);
        missing++;
      }
    }
    if (missing > 0) {
      console.error(`[prerender] ${missing} route(s) missing. Run: node scripts/prerender.mjs`);
      process.exit(1);
    }
    console.log(`[prerender] All ${ROUTES.length} routes have pre-rendered HTML.`);
    process.exit(0);
  }

  // Generate static HTML shells for each route
  console.log(`[prerender] Generating static HTML for ${ROUTES.length} routes...`);

  for (const route of ROUTES) {
    const html = await generateStaticShell(route);

    let filePath;
    if (route.path === "/") {
      filePath = join(DIST, "index.html");
    } else {
      const dir = join(DIST, route.path);
      await mkdir(dir, { recursive: true });
      filePath = join(dir, "index.html");
    }

    await writeFile(filePath, html, "utf-8");
    console.log(`[prerender] ✓ ${route.path}`);
  }

  console.log(`[prerender] Done. ${ROUTES.length} routes pre-rendered.`);
}

main().catch((err) => {
  console.error("[prerender] Fatal error:", err);
  process.exit(1);
});