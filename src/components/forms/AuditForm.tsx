import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { sanitizeInput, cn } from '@/lib/utils'

const AUDIT_WEBHOOK = 'https://trade-participant-whom-shield.trycloudflare.com/webhook/audit'

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  agency: z.string().min(2, 'Agency name required').max(100),
  website: z
    .string()
    .optional()
    .refine(val => {
      if (!val || val.trim() === '') return true
      let url = val.trim()
      if (!/^[a-zA-Z][\w+\-.]*:\/\//.test(url)) url = `https://${url}`
      try {
        const parsed = new URL(url)
        const blocked = ['javascript:', 'data:', 'vbscript:', 'file:', 'blob:']
        return !blocked.includes(parsed.protocol.toLowerCase())
      } catch {
        return false
      }
    }, 'Enter a valid URL (e.g. yoursite.com or https://yoursite.com)'),
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
  <span className="font-mono text-[10px] sm:text-xs text-slate-300 leading-tight">
    I agree to RizFlow's{' '}
    <a href="/privacy-terms" className="text-teal-400 hover:underline">
      Privacy Policy
    </a>{' '}
    and consent to being contacted.
  </span>
)

export function AuditForm({ className }: { className?: string }) {
  const navigate = useNavigate()
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
      const rawWebsite = data.website?.trim() || ''
      const normalizedWebsite = rawWebsite && !/^[a-zA-Z][\w+\-.]*:\/\//.test(rawWebsite)
        ? `https://${rawWebsite}`
        : rawWebsite
      const payload = {
        name: sanitizeInput(data.name),
        agency: sanitizeInput(data.agency),
        website: sanitizeInput(normalizedWebsite),
        email: sanitizeInput(data.email),
        phone: sanitizeInput(data.phone || ''),
        referral: data.referral || '',
        consent: data.consent,
      }

      const res = await fetch(AUDIT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Submission failed')
      navigate('/thank-you')
    } catch {
      setServerError('System Error: Submission failed. Try again or email rizdigi.co@gmail.com')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={cn('space-y-5', className)} noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Your Full Name</label>
          <input
            placeholder="Jane Smith"
            className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
            {...register('name')}
          />
          {errors.name && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.name.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Agency Name</label>
          <input
            placeholder="Acme Digital Agency"
            className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
            {...register('agency')}
          />
          {errors.agency && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.agency.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Agency Website</label>
          <input
            placeholder="youragency.com or https://youragency.com"
            type="text"
            className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
            {...register('website')}
          />
          {errors.website && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.website.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Email Address</label>
          <input
            placeholder="jane@youragency.com"
            type="email"
            className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
            {...register('email')}
          />
          {errors.email && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.email.message}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Phone (Optional)</label>
          <input
            placeholder="+65 9123 4567"
            type="tel"
            className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
            {...register('phone')}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Referral Source</label>
          <div className="relative">
            <select
              className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm appearance-none transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
              {...register('referral')}
            >
              {referralOptions.map((o) => (
                <option key={o.value} value={o.value} className="bg-[#050A14] text-white">
                  {o.label}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-teal-500">
              ▼
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4">
        <div className="flex items-center h-5">
          <input
            type="checkbox"
            className="w-4 h-4 rounded-sm border border-teal-500/30 bg-[#050A14] text-teal-500 focus:ring-cyan-400/20 focus:ring-offset-0 focus:ring-1 transition-all"
            {...register('consent')}
          />
        </div>
        <div className="flex flex-col">
          <label className="text-sm font-mono">{consentLabel}</label>
          {errors.consent && <p className="text-xs text-red-400 font-mono mt-1 flex items-center gap-1"><span>{'>'}</span> {errors.consent.message}</p>}
        </div>
      </div>

      {serverError && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider px-4 py-3 rounded-sm flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
          {serverError}
        </div>
      )}

      <Button type="submit" variant="cta" size="lg" className="w-full font-mono uppercase tracking-widest mt-4" isLoading={isSubmitting}>
        {isSubmitting ? 'Processing...' : 'Execute Audit Request'}
      </Button>

      <p className="text-xs font-mono text-teal-500/60 text-center uppercase tracking-wider flex items-center justify-center gap-2 mt-4">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
        Encrypted & PDPA Compliant
      </p>
    </form>
  )
}
