import { Helmet } from 'react-helmet-async'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { EnvelopeIcon, CalendarDaysIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/layout/Container'
import { Badge } from '@/components/ui/Badge'
import { FORMSPREE_ENDPOINT, CALENDLY_LINK, SOCIAL_LINKS, SITE_URL } from '@/lib/constants'
import { sanitizeInput } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Valid email required'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})
type FormData = z.infer<typeof schema>

export function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    if (FORMSPREE_ENDPOINT) {
      await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: sanitizeInput(data.name),
          email: sanitizeInput(data.email),
          message: sanitizeInput(data.message, 2000),
          _subject: `Contact from ${data.name}`,
        }),
      })
    }
    setSubmitted(true)
  }

  return (
    <>
      <Helmet>
        <title>Contact RizFlow — Get in Touch | RizFlow</title>
        <meta
          name="description"
          content="Reach out to RizFlow. Chat about AI operations for your agency, ask a question, or book your free audit directly."
        />
        <meta property="og:url" content={`${SITE_URL}/contact`} />
      </Helmet>

      <section className="pt-32 pb-24 bg-slate-50 min-h-screen">
        <Container>
          <div className="text-center mb-14">
            <Badge variant="teal" className="mb-4">Get in Touch</Badge>
            <h1 className="text-5xl font-bold font-heading text-navy mb-4">Let's Talk</h1>
            <p className="text-xl text-slate-500 max-w-xl mx-auto">
              Questions about RizFlow? Want to explore if we're the right fit? Reach out — we
              reply within 24 hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {/* Contact info */}
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft flex gap-4">
                <div className="w-12 h-12 bg-teal/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-teal" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy font-heading mb-1">Email</h3>
                  <a
                    href="mailto:hello@rizflow.ai"
                    className="text-teal hover:underline text-sm"
                  >
                    hello@rizflow.ai
                  </a>
                  <p className="text-slate-400 text-xs mt-0.5">We reply within 24 hours</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft flex gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CalendarDaysIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-navy font-heading mb-2">Book a Call</h3>
                  <a href={CALENDLY_LINK} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" size="sm">
                      Schedule Free Audit
                    </Button>
                  </a>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-soft">
                <h3 className="font-semibold text-navy font-heading mb-3">Follow Along</h3>
                <div className="flex gap-4">
                  <a
                    href={SOCIAL_LINKS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-teal transition-colors font-medium"
                  >
                    LinkedIn ↗
                  </a>
                  <a
                    href={SOCIAL_LINKS.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-600 hover:text-teal transition-colors font-medium"
                  >
                    Twitter/X ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-soft">
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircleIcon className="w-12 h-12 text-teal mx-auto mb-4" />
                  <h3 className="text-xl font-bold font-heading text-navy mb-2">Message Sent!</h3>
                  <p className="text-slate-500">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <Input
                    label="Your Name"
                    placeholder="Jane Smith"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="jane@agency.com"
                    error={errors.email?.message}
                    {...register('email')}
                  />
                  <Textarea
                    label="Your Message"
                    placeholder="Tell us about your agency and what you'd like help with..."
                    error={errors.message?.message}
                    className="min-h-[140px]"
                    {...register('message')}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    isLoading={isSubmitting}
                  >
                    Send Message
                  </Button>
                </form>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
