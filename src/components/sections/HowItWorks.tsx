import { MagnifyingGlassIcon, CpuChipIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const steps = [
  {
    number: '01',
    Icon: MagnifyingGlassIcon,
    title: 'Discover',
    subtitle: 'Free Operational Audit',
    description:
      "We map your agency's current workflows, identify bottlenecks, and quantify exactly how many hours are lost to manual operations each week. Clear, actionable findings — no fluff.",
    benefits: ['30-minute strategy call', 'Full workflow mapping', 'Time-savings projection', 'Zero commitment'],
    color: 'teal' as const,
    dark: false,
  },
  {
    number: '02',
    Icon: CpuChipIcon,
    title: 'Deploy',
    subtitle: 'Configure AI Agents to Your Workflow',
    description:
      'Our team configures specialized AI agents that plug into your existing PM tools, CRM, and email systems. No rip-and-replace. Your team is live within 48 hours.',
    benefits: ['Connects to your existing tools', 'Custom agent configuration', 'Team onboarding included', 'Live within 48 hours'],
    color: 'navy' as const,
    dark: true,
  },
  {
    number: '03',
    Icon: RocketLaunchIcon,
    title: 'Grow',
    subtitle: 'Focus on Strategy While Agents Run 24/7',
    description:
      'Your AI agents handle the repetitive work around the clock. Review outputs in under 30 minutes per week and reinvest your reclaimed hours into higher-value work.',
    benefits: ['Agents run 24/7', '<30 min/week oversight', 'Weekly performance reports', 'Continuous optimisation'],
    color: 'teal' as const,
    dark: false,
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-width">
        <div
          ref={ref}
          className={cn(
            'text-center mb-16 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
            The Process
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold font-heading text-navy">
            How RizFlow Works
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            Three steps from discovery to a fully autonomous operations layer for your agency.
          </p>
        </div>

        <div className="space-y-6">
          {steps.map((step, i) => {
            const isEven = i % 2 === 1
            return (
              <div
                key={i}
                className={cn(
                  'rounded-3xl overflow-hidden',
                  step.dark ? 'bg-navy' : 'bg-slate-50'
                )}
              >
                <div
                  className={cn(
                    'container-width py-14 grid md:grid-cols-2 gap-12 items-center',
                    isEven && 'md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1'
                  )}
                >
                  {/* Content */}
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <span
                        className={cn(
                          'text-6xl font-black font-heading select-none',
                          step.dark ? 'text-white/10' : 'text-slate-100'
                        )}
                      >
                        {step.number}
                      </span>
                      <div
                        className={cn(
                          'w-12 h-12 rounded-xl flex items-center justify-center',
                          step.color === 'teal' ? 'bg-teal/15' : 'bg-white/10'
                        )}
                      >
                        <step.Icon
                          className={cn(
                            'w-6 h-6',
                            step.color === 'teal' ? 'text-teal' : 'text-teal'
                          )}
                        />
                      </div>
                    </div>
                    <h3
                      className={cn(
                        'text-3xl font-bold font-heading mb-1',
                        step.dark ? 'text-white' : 'text-navy'
                      )}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={cn(
                        'text-sm font-semibold mb-4 uppercase tracking-wide',
                        step.color === 'teal' ? 'text-teal' : 'text-teal'
                      )}
                    >
                      {step.subtitle}
                    </p>
                    <p
                      className={cn(
                        'text-lg leading-relaxed mb-6',
                        step.dark ? 'text-slate-300' : 'text-slate-600'
                      )}
                    >
                      {step.description}
                    </p>
                    <ul className="space-y-2.5">
                      {step.benefits.map((b) => (
                        <li key={b} className="flex items-center gap-3">
                          <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal" />
                          </div>
                          <span className={cn('text-sm', step.dark ? 'text-slate-300' : 'text-slate-700')}>
                            {b}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Visual */}
                  <div className="flex items-center justify-center">
                    <StepVisual index={i} dark={step.dark} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function StepVisual({ index, dark }: { index: number; dark: boolean }) {
  if (index === 0) {
    return (
      <div className="w-72 bg-navy rounded-2xl p-6 shadow-2xl border border-white/10">
        <p className="text-xs text-teal font-semibold font-heading uppercase tracking-widest mb-4">
          Audit Report
        </p>
        {['Client Intake', 'Project Tracking', 'Invoicing', 'Communications'].map((item, i) => (
          <div key={item} className="flex items-center justify-between mb-3">
            <span className="text-white text-sm">{item}</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 rounded-full bg-white/10 w-20 overflow-hidden">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${[60, 40, 75, 30][i]}%` }}
                />
              </div>
              <span className="text-slate-400 text-xs">{[60, 40, 75, 30][i]}%</span>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
          <span className="text-slate-400 text-xs">Est. time savings</span>
          <span className="text-teal font-bold text-sm">14 hrs/week</span>
        </div>
      </div>
    )
  }

  if (index === 1) {
    return (
      <div className="w-72 bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
        <p className="text-xs text-navy font-semibold font-heading uppercase tracking-widest mb-4">
          Agent Configuration
        </p>
        {[
          { name: 'Slack', connected: true },
          { name: 'HubSpot CRM', connected: true },
          { name: 'Xero Accounting', connected: true },
          { name: 'Asana PM', connected: false },
        ].map((tool) => (
          <div key={tool.name} className="flex items-center justify-between mb-3">
            <span className="text-slate-700 text-sm">{tool.name}</span>
            <span
              className={cn(
                'text-xs px-2.5 py-0.5 rounded-full font-medium',
                tool.connected ? 'bg-teal/10 text-teal' : 'bg-slate-100 text-slate-400'
              )}
            >
              {tool.connected ? '● Connected' : '○ Pending'}
            </span>
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full bg-navy w-3/4" />
          </div>
          <p className="text-xs text-slate-400 mt-1.5">Setup 75% complete</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-72 bg-navy rounded-2xl p-6 shadow-2xl border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-teal font-semibold font-heading uppercase tracking-widest">
          Weekly Report
        </p>
        <span className="text-xs text-slate-400">This week</span>
      </div>
      {[
        { label: 'Hours saved', value: '18.5 hrs', change: '+12%' },
        { label: 'Tasks automated', value: '247', change: '+8%' },
        { label: 'Response time', value: '4.2 mins', change: '-63%' },
      ].map((metric) => (
        <div key={metric.label} className="flex items-center justify-between mb-3">
          <span className="text-slate-300 text-sm">{metric.label}</span>
          <div className="text-right">
            <span className="text-white text-sm font-semibold">{metric.value}</span>
            <span className="text-teal text-xs ml-2">{metric.change}</span>
          </div>
        </div>
      ))}
      <div className="mt-3 flex items-center gap-2 bg-teal/10 rounded-lg px-3 py-2">
        <div className="w-2 h-2 rounded-full bg-teal animate-pulse" />
        <span className="text-teal text-xs font-medium">All 6 agents running</span>
      </div>
    </div>
  )
}
