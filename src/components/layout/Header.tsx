import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bars3Icon, XMarkIcon, BoltIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { SMLogo } from '@/components/ui/SMLogo'
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
    <motion.header
      className={cn(
        'fixed top-0 left-0 right-0 z-40',
        scrolled
          ? 'bg-navy-950/90 backdrop-blur-md border-b border-white/10 shadow-soft'
          : 'bg-transparent'
      )}
      animate={{ boxShadow: scrolled ? '0 4px 6px -1px rgba(0,0,0,0.05)' : '0 0 0 0 rgba(0,0,0,0)' }}
      transition={{ duration: 0.3 }}
    >
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <SMLogo />
            <span className="font-bold text-white tracking-wide text-xl group-hover:text-cyan-light transition-colors">RizFlow</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0">
            {NAV_LINKS.map((link, i) => (
              <motion.div key={link.href} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                <Link to={link.href} className="relative group">
                  <span
                    className={cn(
                      'px-4 py-2 block text-sm font-medium transition-colors duration-200',
                      isActive(link.href)
                        ? 'text-teal'
                        : scrolled
                        ? 'text-slate-300 hover:text-white'
                        : 'text-white/80 hover:text-white'
                    )}
                  >
                    {link.label}
                  </span>
                  {isActive(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-teal to-teal-light"
                      layoutId="underline"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-teal to-teal-light origin-left"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Link to="/audit">
              <Button size="md" variant="cta" className="flex items-center gap-2">
                <CalendarDaysIcon className="w-4 h-4" />
                Get Free Audit
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn(
              'md:hidden p-2 rounded-lg transition-colors',
              'text-white hover:bg-white/10'
            )}
            aria-label="Toggle menu"
          >
            {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-gradient-to-b from-white to-slate-50 border-t border-teal/10 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Container>
              <motion.nav
                className="py-4 flex flex-col gap-1"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
              >
                {NAV_LINKS.map((link) => (
                  <motion.div
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      to={link.href}
                      className={cn(
                        'px-4 py-3 rounded-lg text-sm font-medium transition-colors block',
                        isActive(link.href)
                          ? 'text-teal bg-teal/10'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-navy'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  className="pt-2 pb-2"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <Link to="/audit" className="block">
                    <Button className="w-full flex items-center justify-center gap-2" variant="cta">
                      <CalendarDaysIcon className="w-4 h-4" />
                      Get Free Audit
                    </Button>
                  </Link>
                </motion.div>
              </motion.nav>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
