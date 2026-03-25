import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const tools = [
  'Slack', 'HubSpot', 'Asana', 'Xero',
  'Notion', 'Zapier', 'Monday.com', 'Stripe',
]

export function SocialProofLogos() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="integrations" className="py-12 bg-black border-y border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05),transparent_50%)]" />
      <div className="container-width relative z-10">
        <p className="text-center text-xs text-slate-500 font-medium uppercase tracking-widest mb-8">
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
              className="group flex items-center justify-center h-9 opacity-40 hover:opacity-100 transition-all duration-300 cursor-default"
            >
              <span className="text-sm font-bold text-slate-400 group-hover:text-white font-heading transition-colors">
                {tool}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
