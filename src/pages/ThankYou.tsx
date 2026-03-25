import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { CALENDLY_LINK, SITE_URL } from '@/lib/constants'

export function ThankYou() {
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    function handleMessage(e: MessageEvent) {
      if (
        e.data?.type === 'CAL:bookingSuccessfulV2' ||
        e.data?.type === 'cal:bookingSuccessful' ||
        e.data?.type === 'bookingSuccessful'
      ) {
        setBooked(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  const steps = [
    { label: 'INITIATING', done: true, active: false },
    { label: 'AWAITING_INPUT', done: booked, active: !booked },
    { label: 'CONNECTION_ESTABLISHED', done: false, active: booked },
  ]

  return (
    <>
      <Helmet>
        <title>
          {booked ? 'System Standing By | RizFlow' : 'Transmission Received | RizFlow'}
        </title>
        <meta name="description" content="Your audit request was received. Book your free 30-minute Operational Audit call with RizFlow." />
        <meta property="og:url" content={`${SITE_URL}/thank-you`} />
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="min-h-screen bg-[#050A14] pt-24 pb-16 relative overflow-hidden flex flex-col justify-center">
        {/* Cyberpunk Grid */}
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ 
            backgroundImage: `linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)`, 
            backgroundSize: '40px 40px' 
          }} 
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-width relative z-10 max-w-5xl mx-auto px-4 w-full">
          {/* Header */}
          <div className="text-center mb-12">
            <div className={`w-20 h-20 rounded-lg flex items-center justify-center mx-auto mb-6 transition-all duration-500 border backdrop-blur-md ${booked ? 'bg-teal-500/10 border-teal-400 shadow-[0_0_30px_rgba(0,229,255,0.2)]' : 'bg-[#0A0F1A]/80 border-teal-500/30'}`}>
              {booked ? (
                // Glowing neon checkmark
                <svg className="w-10 h-10 text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.8)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                // Pulsing terminal cursor
                <div className="w-6 h-8 bg-teal-400 animate-pulse drop-shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
              )}
            </div>
            
            <span className="font-mono text-teal-400 uppercase tracking-widest text-sm mb-3 block">
              {booked ? '[ SYS_STATUS: CONFIRMED ]' : '[ SYS_STATUS: PENDING ]'}
            </span>
            <h1 className="text-4xl md:text-5xl font-mono font-bold text-white mb-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
              {booked ? "Connection Established" : "Transmission Received"}
            </h1>
            <p className="font-mono text-sm text-slate-400 max-w-md mx-auto uppercase tracking-wider">
              {booked
                ? "Secure channel initialized. Stand by for audit procedures."
                : "Awaiting user input to configure audit schedule."
              }
            </p>
          </div>

          {/* Step progress (Terminal style) */}
          <div className="flex items-center justify-center gap-0 mb-12 font-mono">
            {steps.map((step, i) => (
              <div key={step.label} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`px-3 py-1 text-xs border transition-all duration-500 ${
                    step.done
                      ? 'bg-teal-500/20 border-teal-400 text-teal-400 drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]'
                      : step.active
                      ? 'bg-[#0A0F1A] border-teal-500/50 text-teal-400 animate-pulse'
                      : 'bg-[#050A14] border-white/10 text-slate-600'
                  }`}>
                    {step.label}
                  </div>
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-px mx-2 transition-colors duration-500 ${
                    i === 0 || (i === 1 && booked) ? 'bg-teal-400/50' : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Confirmed state */}
          {booked ? (
            <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] rounded-xl p-10 text-center max-w-2xl mx-auto font-mono">
              <div className="mb-8 font-mono text-sm text-slate-400 text-left bg-[#050A14] p-4 border border-white/5 rounded">
                <p className="text-teal-400 mb-2">&gt; System logs:</p>
                <p>_ Handshake successful.</p>
                <p>_ Invite packet transmitted to designated email.</p>
                <p>_ Awaiting next cycle.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-teal-500/20 border border-teal-400 text-teal-400 uppercase tracking-widest text-sm px-8 py-3 rounded hover:bg-teal-400 hover:text-[#050A14] transition-all duration-300 shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:shadow-[0_0_25px_rgba(45,212,191,0.4)]"
                >
                  [ RETURN_HOME ]
                </a>
              </div>
            </div>
          ) : (
            /* Cal.com iframe */
            <div className="bg-[#0A0F1A]/95 backdrop-blur-3xl border border-teal-500/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] rounded-xl overflow-hidden max-w-5xl mx-auto w-full">
              <div className="px-6 py-4 border-b border-teal-500/20 bg-[#050A14] flex items-center justify-between">
                <span className="font-mono text-xs text-teal-400 uppercase tracking-widest">
                  [ EXECUTE: SCHEDULE_AUDIT ]
                </span>
                <span className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-slate-600" />
                  <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                </span>
              </div>
              <div className="p-2 bg-white rounded-b-xl w-full">
                {/* Wrap iframe in white bg to match calendly default or leave as is */}
                <iframe
                  src={`${CALENDLY_LINK}?embed=true`}
                  className="w-full"
                  style={{ height: '850px', border: 'none', minWidth: '100%' }}
                  title="Book your free audit call"
                  loading="lazy"
                />
              </div>
            </div>
          )}

          <div className="text-center mt-12 font-mono text-xs text-slate-600 uppercase tracking-widest">
            <span className="opacity-50">Support_Channel: </span>
            <a href="mailto:rizdigi.co@gmail.com" className="text-teal-400/70 hover:text-teal-400 transition-colors">
              rizdigi.co@gmail.com
            </a>
          </div>
        </div>
      </section>
    </>
  )
}