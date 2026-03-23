import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const tools = [
  'Slack', 'HubSpot', 'Asana', 'Xero',
  'Notion', 'Zapier', 'Monday.com', 'Stripe',
]

export function SocialProofLogos() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="container-width">
        <p className="text-center text-xs text-slate-400 font-medium uppercase tracking-widest mb-8">
          Integrates with tools your team already uses
        </p>
        <div
          ref={ref}
          className={cn(
            'flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-700',
            isVisible ? 'opacity-100' : 'opacity-0'
          )}
        >
          {tools.map((tool) => (
            <div
              key={tool}
              className="group flex items-center justify-center h-9 grayscale hover:grayscale-0 opacity-40 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              <span className="text-sm font-bold text-slate-500 group-hover:text-navy font-heading transition-colors">
                {tool}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
