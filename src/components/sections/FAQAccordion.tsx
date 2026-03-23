import { Accordion } from '@/components/ui/Accordion'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

const faqs = [
  {
    question: 'Do I need to change my existing tools?',
    answer:
      'No. Our agents connect to your current PM, CRM, email, and accounting systems via API or secure connectors — no rip-and-replace required. We integrate with Asana, HubSpot, Slack, Xero, Notion, and 50+ other tools.',
  },
  {
    question: 'How is my data protected?',
    answer:
      'All data is encrypted in transit (TLS 1.3) and at rest (AES-256). Each client has fully isolated data environments. We are GDPR and PDPA compliant. Your data is never used to train public AI models.',
  },
  {
    question: 'How much of my time will setup require?',
    answer:
      'The onboarding process takes about 4–6 hours spread over one week — a kickoff call, workflow mapping session, and sign-off review. After setup, expect less than 30 minutes per week to review agent outputs and approve optimisations.',
  },
  {
    question: 'How quickly will I see results?',
    answer:
      'Most clients start seeing meaningful time savings within the first 2 weeks of deployment. Full ROI is typically achieved within the first month. We track this in your weekly report.',
  },
  {
    question: 'What if the agents make a mistake?',
    answer:
      'Human-in-the-loop approvals are built in for high-stakes actions (sending client emails, raising invoices). You review and approve before anything goes out. The agents handle drafting and scheduling — you maintain final control.',
  },
  {
    question: 'Can I cancel anytime?',
    answer:
      'Yes. There are no lock-in contracts. You can cancel with 30 days notice. We are confident in the results, so we do not rely on lock-in to retain clients.',
  },
  {
    question: 'Is RizFlow suitable for agencies outside Singapore?',
    answer:
      'Absolutely. We serve agencies across Southeast Asia including Malaysia, Indonesia, Philippines, and Thailand. Timezone coverage and multi-currency invoicing are fully supported.',
  },
]

interface FAQAccordionProps {
  limit?: number
}

export function FAQAccordion({ limit }: FAQAccordionProps) {
  const { ref, isVisible } = useScrollAnimation()
  const items = limit ? faqs.slice(0, limit) : faqs

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      )}
    >
      <Accordion items={items} />
    </div>
  )
}
