import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, BoltIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Container } from './Container'
import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const isActive = (href: string) => location.pathname === href

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-soft border-b border-slate-100'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-teal rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform duration-200">
              <BoltIcon className="w-5 h-5 text-white" />
            </div>
            <span
              className={cn(
                'text-xl font-bold font-heading transition-colors duration-300',
                scrolled ? 'text-navy' : 'text-white'
              )}
            >
              Riz<span className="text-teal">Flow</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive(link.href)
                    ? 'text-teal bg-teal/10'
                    : scrolled
                    ? 'text-slate-600 hover:text-navy hover:bg-slate-50'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/audit">
              <Button size="md" variant="primary">
                Get Free Audit
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              scrolled ? 'text-navy hover:bg-slate-100' : 'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div
        className={cn(
          'md:hidden bg-white border-t border-slate-100 overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-96 shadow-lg' : 'max-h-0'
        )}
      >
        <Container>
          <nav className="py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'text-teal bg-teal/10'
                    : 'text-slate-700 hover:bg-slate-50 hover:text-navy'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 pb-2">
              <Link to="/audit" className="block">
                <Button className="w-full" variant="primary">
                  Get Free Audit
                </Button>
              </Link>
            </div>
          </nav>
        </Container>
      </div>
    </header>
  )
}
