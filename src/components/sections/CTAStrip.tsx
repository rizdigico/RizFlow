import { ArrowRightIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CTAStripProps {
  variant?: 'navy' | 'teal'
}

export function CTAStrip({ variant = 'navy' }: CTAStripProps) {
  return (
    <section className={cn('py-20 relative overflow-hidden', variant === 'navy' ? 'bg-navy' : 'bg-teal')}>
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal/20 rounded-full blur-3xl pointer-events-none" />
      <div className="container-width relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div>
            <p
              className={cn(
                'text-sm font-semibold uppercase tracking-widest font-heading mb-3',
                variant === 'navy' ? 'text-teal' : 'text-navy/80'
              )}
            >
              Limited Slots Available
            </p>
            <h2 className="text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
              Stop Trading Time for Money.
              <br />
              <span className={cn(variant === 'navy' ? 'text-gradient' : 'text-navy')}>
                Start Scaling with AI.
              </span>
            </h2>
            <p
              className={cn(
                'mt-4 text-lg max-w-xl',
                variant === 'navy' ? 'text-slate-300' : 'text-navy/80'
              )}
            >
              Book your free 30-minute Operational Audit. We'll show you exactly how many hours
              you're losing and what it would take to automate them.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <Link to="/audit">
              <Button
                size="lg"
                variant={variant === 'navy' ? 'primary' : 'secondary'}
                className="group min-w-56"
              >
                <CalendarDaysIcon className="w-5 h-5" />
                Get Free Operational Audit
                <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-slate-400 flex items-center gap-1.5">
              <span>✓</span> No commitment required
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
