export const SITE_URL = "https://www.rizflow.co";
export const SITE_NAME = "RizFlow";
export const CALENDLY_LINK =
  import.meta.env.VITE_CALENDLY_LINK || "https://cal.com/aariz-a/ai-audit";
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || "";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "AI Score", href: "/ai-score" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
] as const;

export const SOCIAL_LINKS = {
  linkedin: "https://www.linkedin.com/in/aariz-arfan/",
  instagram: "https://www.instagram.com/rizflow.ai/",
  tiktok: "https://www.tiktok.com/@rizflow.ai?lang=en",
};

export const SEO_DEFAULTS = {
  title:
    "RizFlow – Custom Agentic-AI Systems for Businesses & SMEs | Run Your Business From Your Phone",
  description:
    "RizFlow builds custom agentic-AI systems tailored to your business. Choose the agents you need, automate your operations, and run your business from your phone. Free Discovery Audit. Based in Singapore, serving SEA.",
  ogImage: `${SITE_URL}/og-banner.jpg`,
};
