export const SITE_URL = 'https://rizflow.ai'
export const SITE_NAME = 'RizFlow'
export const CALENDLY_LINK = import.meta.env.VITE_CALENDLY_LINK || 'https://calendly.com/rizflow/audit'
export const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT || ''

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
]

export const SOCIAL_LINKS = {
  linkedin: 'https://linkedin.com/company/rizflow',
  twitter: 'https://twitter.com/rizflow',
}

export const SEO_DEFAULTS = {
  title: 'RizFlow – AI Operations for Service-Based Agencies | Save 10-20 hrs/week',
  description:
    "Discover how RizFlow's agentic AI saves agency founders 10-20 hrs/week on manual work. Free Operational Audit. Based in Singapore, serving SEA.",
  ogImage: `${SITE_URL}/og-image.png`,
}
