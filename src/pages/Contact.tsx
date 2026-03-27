import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { CheckCircleIcon, EnvelopeIcon, MapPinIcon } from '@heroicons/react/24/outline'
import { SITE_URL, SEO_DEFAULTS } from '@/lib/constants'
import { sanitizeInput } from '@/lib/utils'

const CONTACT_WEBHOOK = 'https://riz-flow-mc-db.vercel.app/api/webhook/contact'

const contactBreadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Contact', item: `${SITE_URL}/contact` },
  ],
}

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  company: z.string().min(2, 'Company name required'),
  message: z.string().min(10, 'Please provide some details').max(2000),
})
type FormData = z.infer<typeof schema>

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [serverError, setServerError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setServerError('')
    try {
      const res = await fetch(CONTACT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: sanitizeInput(data.name),
          email: sanitizeInput(data.email),
          company: sanitizeInput(data.company),
          message: sanitizeInput(data.message, 2000),
        }),
      })
      if (!res.ok) throw new Error('Submission failed')
      setSubmitted(true)
    } catch {
      setServerError('System Error: Submission failed. Please try again or email us directly.')
    }
  }

  return (
    <>
      <Helmet>
        <title>Get Started with AI Operations | Contact RizFlow</title>
        <meta name="description" content="Ready to automate your agency? Book a free strategy call with RizFlow. We'll map your workflows and show you what agentic AI can do." />
        <meta name="keywords" content="contact RizFlow, AI operations consultation, agency automation strategy call" />
        <link rel="canonical" href={`${SITE_URL}/contact`} />
        <link rel="alternate" hrefLang="en-SG" href={`${SITE_URL}/contact`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
        <meta property="og:title" content="Get Started with AI Operations | Contact RizFlow" />
        <meta property="og:description" content="Ready to automate your agency? Book a free strategy call with RizFlow. We'll map your workflows and show you what agentic AI can do." />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Get Started with AI Operations | Contact RizFlow" />
        <meta name="twitter:description" content="Ready to automate your agency? Book a free strategy call with RizFlow." />
        <meta name="twitter:image" content={SEO_DEFAULTS.ogImage} />
        <script type="application/ld+json">{JSON.stringify(contactBreadcrumb)}</script>
      </Helmet>

      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden bg-[#050A14] bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]">
        {/* Ambient glows */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-teal-500/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[600px] md:w-[800px] h-[600px] md:h-[800px] bg-cyan-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="container-width relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Contact info */}
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-sm border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse"></span>
                  Terminal Request
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-heading text-white mb-6 leading-tight flex items-center gap-3">
                  Let's Talk
                  <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse inline-block"></span>
                </h1>
                <div className="space-y-3 text-slate-400 font-mono text-sm">
                  <p>{'>'} Questions about RizFlow? Want to explore if we're the right fit?</p>
                  <p>{'>'} Reach out — we reply within 24 hours.</p>
                </div>
              </div>

              <div className="space-y-4 bg-[#0A0F1A]/80 backdrop-blur-md border border-white/5 p-6 rounded-xl">
                <h2 className="text-cyan-400 font-mono text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></span>
                  Network Status
                </h2>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-sm bg-[#050A14] flex items-center justify-center border border-teal-500/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                    <EnvelopeIcon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-500 font-mono uppercase tracking-widest mb-0.5">Email Protocol</p>
                    <p className="text-sm font-mono text-white">rizdigi.co@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-slate-300">
                  <div className="w-10 h-10 rounded-sm bg-[#050A14] flex items-center justify-center border border-teal-500/30 shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                    <MapPinIcon className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-[10px] text-teal-500 font-mono uppercase tracking-widest mb-0.5">Physical Node</p>
                    <p className="text-sm font-mono text-white">Singapore, SEA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form card */}
            <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 rounded-2xl p-5 sm:p-8 shadow-[0_0_30px_rgba(0,229,255,0.1)] relative">
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
              <h2 className="text-xl font-bold font-heading text-white mb-6 flex items-center gap-2">
                <span className="text-teal-400 font-mono">{'>'}</span> Request an Audit or Contact Us
              </h2>

              {submitted ? (
                <div className="text-center py-10 border border-teal-500/20 bg-[#050A14] rounded-lg">
                  <div className="w-16 h-16 bg-teal-500/10 rounded-sm border border-teal-500/30 flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                    <CheckCircleIcon className="w-8 h-8 text-teal-400" />
                  </div>
                  <h3 className="text-xl font-bold font-mono text-white mb-2 uppercase tracking-wide">Request Transmitted</h3>
                  <p className="text-teal-400/80 font-mono text-sm">Awaiting system response (ETA 24h).</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Full Name</label>
                    <input
                      placeholder="Jane Smith"
                      className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
                      {...register('name')}
                    />
                    {errors.name && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.name.message}</p>}
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Business Email</label>
                    <input
                      type="email"
                      placeholder="jane@agency.com"
                      className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
                      {...register('email')}
                    />
                    {errors.email && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.email.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-teal-400 uppercase tracking-widest">Company Name</label>
                    <input
                      placeholder="Acme Agency"
                      className="h-11 w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none"
                      {...register('company')}
                    />
                    {errors.company && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.company.message}</p>}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-teal-400 uppercase tracking-widest block">
                      Project Details / Audit Request
                    </label>
                    <textarea
                      placeholder="Tell us about your agency and what you'd like help with..."
                      className="w-full rounded-sm border border-teal-500/30 bg-[#050A14] px-4 py-3 text-white font-mono text-sm placeholder:text-teal-700/50 transition-all focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20 outline-none min-h-[100px] resize-none"
                      {...register('message')}
                    />
                    {errors.message && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><span>{'>'}</span> {errors.message.message}</p>}
                  </div>

                  {serverError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-wider px-4 py-3 rounded-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                      {serverError}
                    </div>
                  )}
                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full font-mono uppercase tracking-widest"
                    isLoading={isSubmitting}
                  >
                    Initialize Request
                  </Button>
                  <p className="text-xs text-teal-500/60 font-mono text-center uppercase tracking-wider">
                    By submitting, you agree to our{' '}
                    <a href="/privacy-terms" className="text-teal-400 hover:underline">Privacy Policy</a>
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
