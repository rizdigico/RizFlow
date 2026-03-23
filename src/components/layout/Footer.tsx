import { Link } from 'react-router-dom'
import { BoltIcon } from '@heroicons/react/24/outline'
import { Container } from './Container'
import { SOCIAL_LINKS } from '@/lib/constants'

const footerLinks = {
  Product: [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'Free Audit', href: '/audit' },
    { label: 'About', href: '/about' },
  ],
  Resources: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-navy text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-20 pointer-events-none" />
      <Container className="relative">
        <div className="pt-16 pb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-2 mb-4 group w-fit">
                <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center shadow-glow">
                  <BoltIcon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold font-heading">
                  Riz<span className="text-teal">Flow</span>
                </span>
              </Link>
              <p className="text-slate-300 text-sm leading-relaxed max-w-xs mb-6">
                AI-powered operations that give agency founders back 10–20 hours every week. Based in
                Singapore, serving SEA.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
                <a
                  href={SOCIAL_LINKS.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-teal/20 flex items-center justify-center transition-colors duration-200"
                  aria-label="Twitter/X"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-sm font-semibold text-white font-heading mb-4 uppercase tracking-wider">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        to={link.href}
                        className="text-sm text-slate-400 hover:text-teal transition-colors duration-200"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} RizFlow Pte. Ltd. All rights reserved.
          </p>
          <p className="text-xs text-slate-500">Made with ♥ in Singapore 🇸🇬</p>
        </div>
      </Container>
    </footer>
  )
}
