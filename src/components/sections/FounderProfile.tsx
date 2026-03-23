import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

interface FounderProfileProps {
  compact?: boolean
}

export function FounderProfile({ compact = false }: FounderProfileProps) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-10 items-center', compact && 'gap-6')}>
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-teal/30 to-navy overflow-hidden border-4 border-teal/20 shadow-2xl flex items-center justify-center">
          <span className="text-5xl font-black text-teal font-heading select-none">A</span>
        </div>
        <div className="absolute -bottom-2 -right-2 bg-teal rounded-full p-2.5 shadow-lg">
          <div className="w-3 h-3 rounded-full bg-white" />
        </div>
      </div>

      <div className="flex-1 text-center md:text-left">
        <Badge variant="teal" className="mb-3">
          Founder
        </Badge>
        <h3
          className={cn(
            'font-bold font-heading text-navy mb-1',
            compact ? 'text-2xl' : 'text-3xl'
          )}
        >
          Aariz Rahman
        </h3>
        <p className="text-teal font-medium mb-4">Founder & CEO, RizFlow</p>
        <p className="text-slate-600 leading-relaxed max-w-xl mb-5">
          Former agency operator who spent years building operations for digital agencies across
          Singapore and SEA. Built RizFlow to solve the exact problem I lived every day — too
          much time on operations, not enough on strategy.
        </p>
        {!compact && (
          <blockquote className="text-slate-500 text-sm leading-relaxed max-w-xl mb-6 italic border-l-3 border-teal/40 pl-4 border-l-2">
            "I'm building RizFlow while studying — because I believe the future of service businesses
            is human creativity powered by AI operations. A solo founder with the right tools can
            serve 20 clients as effectively as a team of 10."
          </blockquote>
        )}
        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
          <a
            href="https://linkedin.com/in/aariz"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" size="sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </Button>
          </a>
          <Link to="/audit">
            <Button variant="primary" size="sm">
              Book Free Audit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
