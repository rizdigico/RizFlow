import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircleIcon, CalendarDaysIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { FORMSPREE_ENDPOINT, CALENDLY_LINK } from '@/lib/constants'
import { sanitizeInput, cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  agency: z.string().min(2, 'Agency name required').max(100),
  website: z
    .string()
    .url('Enter a valid URL (e.g. https://yoursite.com)')
    .or(z.literal(''))
    .optional(),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().max(20).optional(),
  referral: z.string().optional(),
  consent: z.literal(true, { error: 'You must agree to continue' }),
})

type FormData = z.infer<typeof schema>

const referralOptions = [
  { value: '', label: 'How did you hear about us?' },
  { value: 'google', label: 'Google Search' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'referral', label: 'Referral / Word of mouth' },
  { value: 'twitter', label: 'Twitter / X' },
  { value: 'event', label: 'Event or Meetup' },
  { value: 'other', label: 'Other' },
]

const consentLabel: ReactNode = (
  <span>
    I agree to RizFlow's{' '}
    <a href="/privacy" className="text-teal hover:underline">
      Privacy Policy
    </a>{' '}
    and consent to being contacted about my audit request.
  </span>
)

export function AuditForm({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      const payload = {
        name: sanitizeInput(data.name),
        agency: sanitizeInput(data.agency),
        website: sanitizeInput(data.website || ''),
        email: sanitizeInput(data.email),
        phone: sanitizeInput(data.phone || ''),
        referral: data.referral || '',
        _subject: `New Audit Request from ${data.agency}`,
      }

      if (FORMSPREE_ENDPOINT) {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Submission failed')
      }
      setSubmitted(true)
    } catch {
      setServerError('Something went wrong. Please try again or email us at hello@rizflow.ai')
    }
  }

  if (submitted) {
    return (
      <div className={cn('text-center py-10 px-6', className)}>
        <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircleIcon className="w-9 h-9 text-teal" />
        </div>
        <h3 className="text-2xl font-bold font-heading text-navy mb-3">You're booked in!</h3>
        <p className="text-slate-600 mb-8 max-w-md mx-auto">
          Thanks for reaching out. Schedule your free 30-minute Operational Audit call below —
          we'll come prepared with insights specific to your agency.
        </p>
        <a
          href={CALENDLY_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-teal text-white font-semibold px-8 py-4 rounded-xl hover:bg-teal-dark transition-all duration-200 shadow-soft hover:shadow-glow"
        >
          <CalendarDaysIcon className="w-5 h-5" />
          Schedule Your Audit Call
        </a>
        <p className="text-xs text-slate-400 mt-4">Opens Calendly — pick a time that works for you</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-5', className)} noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Your Full Name"
          placeholder="Jane Smith"
          error={errors.name?.message}
          {...register('name')}
        />
        <Input
          label="Agency Name"
          placeholder="Acme Digital Agency"
          error={errors.agency?.message}
          {...register('agency')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Agency Website"
          placeholder="https://youragency.com"
          type="url"
          error={errors.website?.message}
          {...register('website')}
        />
        <Input
          label="Email Address"
          placeholder="jane@youragency.com"
          type="email"
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <Input
          label="Phone Number (optional)"
          placeholder="+65 9123 4567"
          type="tel"
          {...register('phone')}
        />
        <Select
          label="How did you hear about us?"
          options={referralOptions}
          {...register('referral')}
        />
      </div>

      <Checkbox
        label={consentLabel}
        error={errors.consent?.message}
        {...register('consent')}
      />

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {serverError}
        </div>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Request My Free Operational Audit'}
      </Button>

      <p className="text-xs text-slate-400 text-center">
        🔒 Your data is encrypted and never shared. PDPA compliant.
      </p>
    </form>
  )
}
