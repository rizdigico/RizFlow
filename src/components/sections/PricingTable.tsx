import { CheckIcon, StarIcon } from '@heroicons/react/24/solid'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    price: '1,800',
    tagline: 'For agencies up to 15 people',
    description: 'Core automation to reclaim your time and streamline daily operations.',
    features: [
      'Client Intake Agent',
      'Project Tracking Agent',
      'Resource Allocation Agent',
      'Invoice Generation Agent',
      'Weekly performance report',
      'Email support',
      'Up to 3 integrations',
    ],
    cta: 'Start with Starter',
    highlighted: false,
  },
  {
    name: 'Professional',
    price: '3,000',
    tagline: 'For agencies 15–40 people',
    description: 'Full automation suite with advanced analytics and client communications.',
    features: [
      'Everything in Starter',
      'Communication Agent',
      'Quality Assurance Agent',
      'Revenue forecasting',
      'Custom workflow builder',
      'Analytics dashboard',
      'Priority support',
      'Up to 8 integrations',
      'Monthly strategy call',
    ],
    cta: 'Get Started — Best Value',
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: '4,500',
    tagline: 'For agencies 40+ people',
    description: 'Full-scale automation with white-label options and API access.',
    features: [
      'Everything in Professional',
      'Strategic ops planning',
      'Client success agent',
      'Financial forecasting',
      'White-label portal',
      'API access',
      'Unlimited integrations',
      'Dedicated success manager',
      'Quarterly business review',
    ],
    cta: 'Contact for Enterprise',
    highlighted: false,
  },
]

export function PricingTable() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section className="section-padding bg-white">
      <div className="container-width">
        <div
          ref={ref}
          className={cn(
            'text-center mb-14 transition-all duration-700',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}
        >
          <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold font-heading text-navy">
            Simple, Predictable Pricing
          </h2>
          <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto">
            No setup fees. No per-seat charges. Cancel anytime. Start with a free audit.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative rounded-2xl p-8 flex flex-col transition-all duration-300',
                plan.highlighted
                  ? 'bg-navy text-white shadow-2xl scale-[1.02] border-2 border-teal/40'
                  : 'bg-white border-2 border-slate-100 hover:border-teal/30 hover:shadow-lg'
              )}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge variant="teal" className="px-4 py-1.5 shadow-lg">
                    <StarIcon className="w-3 h-3 mr-1" /> Most Popular
                  </Badge>
                </div>
              )}

              <div className="mb-8">
                <h3
                  className={cn(
                    'text-xl font-bold font-heading mb-1',
                    plan.highlighted ? 'text-white' : 'text-navy'
                  )}
                >
                  {plan.name}
                </h3>
                <p className={cn('text-sm mb-4', plan.highlighted ? 'text-slate-300' : 'text-slate-500')}>
                  {plan.tagline}
                </p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={cn('text-sm font-medium', plan.highlighted ? 'text-slate-300' : 'text-slate-400')}>
                    SGD
                  </span>
                  <span
                    className={cn(
                      'text-5xl font-black font-heading',
                      plan.highlighted ? 'text-white' : 'text-navy'
                    )}
                  >
                    ${plan.price}
                  </span>
                  <span className={cn('text-sm', plan.highlighted ? 'text-slate-400' : 'text-slate-400')}>
                    /month
                  </span>
                </div>
                <p className={cn('text-sm leading-relaxed', plan.highlighted ? 'text-slate-300' : 'text-slate-500')}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                        plan.highlighted ? 'bg-teal/20' : 'bg-teal/10'
                      )}
                    >
                      <CheckIcon className="w-3 h-3 text-teal" />
                    </div>
                    <span className={cn('text-sm', plan.highlighted ? 'text-slate-200' : 'text-slate-600')}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Link to="/audit">
                <Button
                  variant={plan.highlighted ? 'gold' : 'outline'}
                  className={cn(
                    'w-full',
                    !plan.highlighted && 'border-navy text-navy hover:bg-navy hover:text-white'
                  )}
                >
                  {plan.cta}
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Add-ons */}
        <div className="mt-16 bg-slate-50 rounded-2xl p-8">
          <h3 className="text-xl font-bold font-heading text-navy mb-6 text-center">Add-On Services</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Custom Agent Development', price: '$150/hr' },
              { name: 'Advanced Integration', price: '$1,000–$3,000' },
              { name: 'Team Training Workshop', price: '$500/session' },
              { name: 'Process Consulting', price: '$200/hr' },
            ].map((addon) => (
              <div key={addon.name} className="bg-white rounded-xl p-4 border border-slate-100 text-center shadow-soft">
                <p className="text-sm font-medium text-navy mb-1">{addon.name}</p>
                <p className="text-teal font-semibold text-sm">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
