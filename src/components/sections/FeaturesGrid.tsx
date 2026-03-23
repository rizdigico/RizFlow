import {
  InboxIcon,
  ClipboardDocumentCheckIcon,
  UserGroupIcon,
  BanknotesIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const features = [
  {
    Icon: InboxIcon,
    title: 'Client Intake Agent',
    desc: 'Automates lead capture, qualification scoring, and onboarding sequences. New clients get instant, personalised responses 24/7.',
    color: 'teal',
  },
  {
    Icon: ClipboardDocumentCheckIcon,
    title: 'Project Tracking Agent',
    desc: 'Real-time task assignment, deadline tracking, and proactive status updates sent automatically. Never miss a milestone again.',
    color: 'navy',
  },
  {
    Icon: UserGroupIcon,
    title: 'Resource Allocation Agent',
    desc: 'Smart matching of team talent to projects based on skills, capacity, and deadlines. Eliminate the scheduling spreadsheet.',
    color: 'teal',
  },
  {
    Icon: BanknotesIcon,
    title: 'Invoice Generation Agent',
    desc: 'Auto-billing on milestone completion, payment reminders, and revenue forecasting. Cash flow on autopilot.',
    color: 'gold',
  },
  {
    Icon: ChatBubbleLeftRightIcon,
    title: 'Communication Agent',
    desc: 'Drafts and sends status emails, schedules meetings, and collects client feedback — all matching your tone of voice.',
    color: 'teal',
  },
  {
    Icon: ShieldCheckIcon,
    title: 'Quality Assurance Agent',
    desc: 'Template compliance, file-naming conventions, and version control checks before anything goes to a client.',
    color: 'navy',
  },
]

type ColorKey = 'teal' | 'navy' | 'gold'
const colorMap: Record<ColorKey, { bg: string; icon: string; border: string }> = {
  teal: { bg: 'bg-teal/10', icon: 'text-teal', border: 'hover:border-teal/30' },
  navy: { bg: 'bg-navy/10', icon: 'text-navy', border: 'hover:border-navy/20' },
  gold: { bg: 'bg-gold/10', icon: 'text-yellow-600', border: 'hover:border-gold/40' },
}

export function FeaturesGrid() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-width">
        <div
          ref={ref}
          className={cn(
            'text-center mb-14 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
            6 Specialised Agents
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold font-heading text-navy">
            Your Autonomous Operations Team
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Each agent is purpose-built for a specific part of your agency's operations — working
            in concert, 24 hours a day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const c = colorMap[feature.color as ColorKey]
            return (
              <div
                key={i}
                className={cn(
                  'group bg-white rounded-2xl p-6 border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default',
                  c.border
                )}
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110',
                    c.bg
                  )}
                >
                  <feature.Icon className={cn('w-6 h-6', c.icon)} />
                </div>
                <h3 className="text-lg font-semibold font-heading text-navy mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
