import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface AccordionItem {
  question: string
  answer: string
}

interface AccordionProps {
  items: AccordionItem[]
  className?: string
}

export function Accordion({ items, className }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, i) => (
        <div
          key={i}
          className={cn(
            'rounded-xl border transition-all duration-200',
            open === i ? 'border-teal/40 shadow-soft' : 'border-slate-200 hover:border-teal/30'
          )}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-6 py-4 text-left"
            aria-expanded={open === i}
          >
            <span className="font-semibold text-navy text-sm md:text-base pr-4">{item.question}</span>
            <ChevronDownIcon
              className={cn(
                'w-5 h-5 text-teal flex-shrink-0 transition-transform duration-200',
                open === i && 'rotate-180'
              )}
            />
          </button>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300',
              open === i ? 'max-h-96' : 'max-h-0'
            )}
          >
            <p className="px-6 pb-5 text-slate-600 text-sm md:text-base leading-relaxed">{item.answer}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
