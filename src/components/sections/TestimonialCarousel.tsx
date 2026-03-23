import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

const testimonials = [
  {
    quote:
      'RizFlow cut our ops workload by 18 hours a week. We finally have time to focus on client strategy instead of chasing approvals and sending status emails.',
    name: 'Sarah Tan',
    title: 'Founder',
    company: 'Pixel & Co. Digital Agency',
    location: 'Singapore',
    initials: 'ST',
    savings: '18 hrs/week saved',
  },
  {
    quote:
      'The Invoice Generation Agent alone paid for the entire subscription in the first month. Our billing cycle went from 2 weeks to same-day.',
    name: 'Marcus Lim',
    title: 'Operations Manager',
    company: 'GrowthLab SEA',
    location: 'Kuala Lumpur',
    initials: 'ML',
    savings: '2× faster billing',
  },
  {
    quote:
      'I was skeptical of AI tools after being burned before. But RizFlow connected to our existing Asana and HubSpot setup seamlessly — zero disruption.',
    name: 'Priya Nair',
    title: 'CEO',
    company: 'BrandForward Consulting',
    location: 'Singapore',
    initials: 'PN',
    savings: 'Zero setup friction',
  },
]

export function TestimonialCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timer = setInterval(
      () => setActive((prev) => (prev + 1) % testimonials.length),
      5500
    )
    return () => clearInterval(timer)
  }, [])

  const prev = () => setActive((active - 1 + testimonials.length) % testimonials.length)
  const next = () => setActive((active + 1) % testimonials.length)
  const t = testimonials[active]

  return (
    <section className="section-padding bg-navy overflow-hidden">
      <div className="container-width">
        <div className="text-center mb-12">
          <span className="text-sm font-semibold text-teal uppercase tracking-widest font-heading">
            What Founders Say
          </span>
          <h2 className="mt-3 text-4xl md:text-5xl font-bold font-heading text-white">
            Real Results, Real Agencies
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-navy-light border border-white/10 rounded-3xl p-8 md:p-12 min-h-[260px]">
            <svg
              className="w-10 h-10 text-teal/30 mb-4"
              fill="currentColor"
              viewBox="0 0 32 32"
              aria-hidden="true"
            >
              <path d="M10 8C6.686 8 4 10.686 4 14v10h10V14H7a3 3 0 016 0v-6zm18 0c-3.314 0-6 2.686-6 6v10h10V14h-7a3 3 0 016 0v-6z" />
            </svg>
            <blockquote className="text-white text-xl leading-relaxed mb-8 font-light italic">
              "{t.quote}"
            </blockquote>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <Avatar size="md" fallback={t.initials} className="border-2 border-teal/30" />
                <div>
                  <p className="text-white font-semibold">{t.name}</p>
                  <p className="text-slate-400 text-sm">
                    {t.title}, {t.company}
                  </p>
                  <p className="text-slate-500 text-xs">{t.location}</p>
                </div>
              </div>
              <div className="bg-teal/10 border border-teal/20 rounded-xl px-4 py-2 text-center">
                <p className="text-teal font-bold text-sm">{t.savings}</p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-teal hover:text-teal transition-colors flex items-center justify-center"
              aria-label="Previous testimonial"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    'h-2 rounded-full transition-all duration-300',
                    i === active ? 'bg-teal w-6' : 'bg-white/30 hover:bg-white/50 w-2'
                  )}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-white/20 text-white hover:border-teal hover:text-teal transition-colors flex items-center justify-center"
              aria-label="Next testimonial"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
