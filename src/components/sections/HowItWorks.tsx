import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, CpuChipIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { cn } from '@/lib/utils'

function AnimatedPercentage({ targetPct }: { targetPct: number }) {
  const [currentPct, setCurrentPct] = useState(0)

  useEffect(() => {
    // Phase 1: Rapidly count up to target percentage
    const duration = 1500 // 1.5 seconds
    const start = performance.now()
    let animationFrame: number

    const animateCountUp = (time: number) => {
      const elapsed = time - start
      const progress = Math.min(elapsed / duration, 1)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      
      if (progress < 1) {
        setCurrentPct(Math.floor(targetPct * easeOutQuart))
        animationFrame = requestAnimationFrame(animateCountUp)
      } else {
        setCurrentPct(targetPct)
        // Phase 2: Start fluctuating slightly to look "live"
        const fluctuateInterval = setInterval(() => {
          // Fluctuate between -2% and +2% of target
          const fluctuation = Math.floor(Math.random() * 5) - 2
          setCurrentPct(Math.max(0, Math.min(100, targetPct + fluctuation)))
        }, 1000 + Math.random() * 1500) // Random interval between 1-2.5s

        return () => clearInterval(fluctuateInterval)
      }
    }

    animationFrame = requestAnimationFrame(animateCountUp)

    return () => cancelAnimationFrame(animationFrame)
  }, [targetPct])

  return <>{currentPct}</>
}

const steps = [
  {
    number: '01',
    Icon: MagnifyingGlassIcon,
    title: 'Discover',
    description: "We map your agency's current workflows, identify bottlenecks, and specify exactly how many hours are lost to manual operations each week.",
    cta: 'Start Your Audit',
    ctaHref: '/audit',
    visual: <AuditCard />,
  },
  {
    number: '02',
    Icon: CpuChipIcon,
    title: 'Deploy',
    description: 'Our AI agents are configured and seamlessly integrated into your existing tools. No rip-and-replace. Your team is live within 48 hours.',
    cta: 'See Integrations',
    ctaHref: '#integrations',
    visual: <DeployCard />,
  },
  {
    number: '03',
    Icon: RocketLaunchIcon,
    title: 'Grow',
    description: 'Your AI agents handle repetitive work around the clock. Review outputs in under 30 minutes per week and invest reclaimed hours into high-value work.',
    cta: 'View Case Studies',
    ctaHref: '/about',
    visual: <GrowCard />,
  },
]

export function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <section id="how-it-works" className="relative section-padding">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.05),transparent_40%)]" />

      <div className="container-width relative z-10">
        <div ref={ref} className={cn('text-center mb-16 transition-all duration-700', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')}>
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">How <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">RizFlow</span> Works</h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">Three steps from discovery to a fully autonomous operations layer for your agency.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className={cn('group flex flex-col transition-all duration-700 relative', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8')} style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Connector line (hidden on mobile, visible on desktop) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t border-dashed border-white/10" />
              )}
              
              <div className="relative bg-navy-900/50 backdrop-blur-sm border border-white/5 rounded-2xl p-8 h-full flex flex-col hover:border-teal/30 transition-colors duration-300">
                <div className="flex items-center gap-4 mb-6 relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center border border-teal/20 group-hover:bg-teal/20 transition-colors duration-300 shadow-[0_0_15px_rgba(45,212,191,0.2)]">
                    <step.Icon className="w-6 h-6 text-teal-400" />
                  </div>
                  <div>
                    <span className="text-sm font-bold font-mono text-teal-400 block mb-1">STEP {step.number}</span>
                    <h3 className="text-2xl font-bold font-heading text-white">{step.title}</h3>
                  </div>
                </div>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-grow">{step.description}</p>
                
                <div className="w-full mb-8 relative">
                  {/* Subtle highlight effect behind visual */}
                  <div className="absolute inset-0 bg-teal/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative z-10 transform group-hover:scale-[1.02] transition-transform duration-300">
                    {step.visual}
                  </div>
                </div>
                
                {step.ctaHref.startsWith('#') ? (
                  <a href={step.ctaHref} className="mt-auto text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-2 group-hover:gap-3">
                    {step.cta}
                    <span className="transition-all duration-200">→</span>
                  </a>
                ) : (
                  <Link to={step.ctaHref} className="mt-auto text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors inline-flex items-center gap-2 group-hover:gap-3">
                    {step.cta}
                    <span className="transition-all duration-200">→</span>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function AuditCard() {
  const rows = [
    { label: 'Client Intake', pct: 60 },
    { label: 'Project Tracking', pct: 40 },
    { label: 'Invoicing', pct: 75 },
    { label: 'Communications', pct: 30 },
  ]
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/20 blur-2xl rounded-full group-hover:bg-teal-500/30 transition-colors duration-500 animate-pulse" />
      
      {/* Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-teal-400 to-transparent opacity-50 animate-[slideRight_2s_ease-in-out_infinite]" style={{ animationName: 'scanline-vertical', animationDuration: '2s', animationIterationCount: 'infinite' }} />

      <div className="relative z-10">
        <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
           <span className="w-1.5 h-1.5 bg-teal-400 rounded-sm animate-pulse" />
           Audit Report
        </p>
        {rows.map((r, i) => (
          <div key={r.label} className="flex items-center justify-between mb-2.5 gap-2" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}>
            <span className="text-slate-200 text-[11px] sm:text-xs font-mono whitespace-nowrap">{r.label}</span>
            <div className="flex items-center gap-2 flex-grow justify-end min-w-0">
              <div className="h-1.5 rounded-full bg-white/5 w-16 overflow-hidden border border-white/5">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-400 relative overflow-hidden" 
                  style={{ width: `${r.pct}%`, transitionDelay: `${i * 100}ms` }} 
                >
                  <div className="absolute inset-0 bg-white/20 animate-[slideRight_1s_linear_infinite] w-1/2" />
                </div>
              </div>
              <span className="text-teal-400 font-bold text-[10px] w-8 text-right font-mono drop-shadow-[0_0_5px_rgba(45,212,191,0.5)]"><AnimatedPercentage targetPct={r.pct} />%</span>
            </div>
          </div>
        ))}
        <div className="mt-4 pt-3 border-t border-teal-500/20 flex justify-between items-center bg-teal-950/20 -mx-5 -mb-5 p-5">
          <span className="text-slate-400 text-[10px] flex items-center gap-1.5 font-mono uppercase tracking-widest"><MagnifyingGlassIcon className="w-3 h-3 text-teal-400 animate-pulse"/> Analysis</span>
          <span className="text-teal-400 font-bold text-[10px] bg-teal-500/10 border border-teal-500/30 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.1)] font-mono flex items-center gap-1">
             <span className="w-1 h-1 bg-teal-400 rounded-full animate-ping" />
             14 hrs/wk saved
          </span>
        </div>
      </div>
    </div>
  )
}

function DeployCard() {
  const tools = [
    { 
      name: 'HubSpot', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#FF7A59]">
          <path d="M12.026 21.393c-4.494 0-8.158-3.64-8.158-8.134 0-.825.123-1.637.362-2.42l-2.433-2.18c-.144.608-.225 1.23-.225 1.868 0 5.4 4.378 9.778 9.778 9.778 2.052 0 3.966-.64 5.545-1.722l-2.02-2.585c-.815.545-1.782.868-2.85.868zm10.37-6.064c-.386-3.774-2.73-6.953-6.196-8.23l-.936 3.125c2.083.84 3.593 2.802 3.86 5.17l3.272-.065zm-11.75-9.35c.783 0 1.54.145 2.247.412l2.365-2.22C14.07 3.52 12.87 3.2 11.588 3.2 8.358 3.2 5.518 5.13 4.148 7.89l2.76 1.76c.86-2.17 2.94-3.67 5.34-3.67zm1.196 9.61c-1.258 0-2.28-1.01-2.28-2.257s1.022-2.257 2.28-2.257 2.28 1.01 2.28 2.257-1.022 2.257-2.28 2.257z" />
        </svg>
      ), 
      connected: true 
    },
    { 
      name: 'Slack', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4">
          <path fill="#E01E5A" d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52z" />
          <path fill="#36C5F0" d="M6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313z" />
          <path fill="#2EB67D" d="M8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834z" />
          <path fill="#ECB22E" d="M8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312z" />
          <path fill="#36C5F0" d="M18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834z" />
          <path fill="#2EB67D" d="M17.686 8.834a2.527 2.527 0 0 1-2.522 2.521 2.528 2.528 0 0 1-2.522-2.521V2.522A2.528 2.528 0 0 1 15.164 0a2.528 2.528 0 0 1 2.522 2.522v6.312z" />
          <path fill="#ECB22E" d="M15.164 18.956a2.528 2.528 0 0 1 2.522 2.522A2.528 2.528 0 0 1 15.164 24a2.527 2.527 0 0 1-2.522-2.522v-2.522h2.522z" />
          <path fill="#E01E5A" d="M15.164 17.686a2.527 2.527 0 0 1-2.522-2.521 2.527 2.527 0 0 1 2.522-2.521h6.314A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.521h-6.314z" />
        </svg>
      ), 
      connected: true 
    },
    { 
      name: 'Asana', 
      icon: (
        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#F06A6A]">
          <path d="M12 1.343a4.707 4.707 0 1 0 0 9.413 4.707 4.707 0 0 0 0-9.413zm-6.85 11.23a4.707 4.707 0 1 0 0 9.414 4.707 4.707 0 0 0 0-9.413zm13.7 0a4.707 4.707 0 1 0 0 9.414 4.707 4.707 0 0 0 0-9.413z" />
        </svg>
      ), 
      connected: true 
    },
  ]
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-cyan-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-cyan-500/20 blur-2xl rounded-full group-hover:bg-cyan-500/30 transition-colors duration-500" />
      
      {/* Scanning Line Animation */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-[slideUp_3s_linear_infinite]" style={{ animationName: 'scanline', animationDuration: '3s', animationIterationCount: 'infinite' }} />

      <div className="relative z-10">
        <p className="text-[10px] text-cyan-400 font-bold font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-cyan-400 rounded-sm animate-pulse" />
          Neural Integrations
        </p>
        <div className="space-y-3">
          {tools.map((tool, i) => (
            <div key={tool.name} className="flex items-center justify-between" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}>
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded bg-white/5 border border-cyan-500/20 flex items-center justify-center text-sm shadow-[0_0_10px_rgba(0,229,255,0.1)]">{tool.icon}</span>
                <span className="text-slate-200 text-xs font-medium font-mono">{tool.name}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_5px_rgba(52,211,153,0.8)]" />
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider font-mono">Syncing</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between">
           <span className="text-slate-400 text-[10px] font-mono tracking-widest uppercase">Agent Status:</span>
           <span className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5 font-mono bg-cyan-500/10 px-2 py-1 rounded shadow-[0_0_10px_rgba(0,229,255,0.2)]">
              <CpuChipIcon className="w-3.5 h-3.5" /> Core Online
           </span>
        </div>
      </div>
    </div>
  )
}

function GrowCard() {
  const metrics = [
    { label: 'Hours Saved', value: '120+', change: '+15%', good: true },
    { label: 'Cost Reduced', value: '$4.5k', change: '', good: true },
    { label: 'Output Vol', value: '+35%', change: '', good: true },
  ]
  return (
    <div className="bg-[#0A0F1A] rounded-xl p-5 shadow-[0_0_30px_rgba(0,229,255,0.1)] border border-teal-500/20 w-full relative overflow-hidden group">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-teal-500/10 blur-2xl rounded-full group-hover:bg-teal-500/20 transition-colors duration-500 animate-pulse-glow" />
      
      {/* Processing particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen opacity-30">
        {[...Array(5)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute w-1 h-1 bg-teal-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-5">
          <p className="text-[10px] text-teal-400 font-bold font-mono uppercase tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-sm animate-pulse" />
            Impact Metrics
          </p>
          <div className="flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 shadow-[0_0_10px_rgba(52,211,153,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider font-mono">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {metrics.map((m, i) => (
            <div key={m.label} className="text-center bg-white/5 rounded-lg py-2 border border-white/5 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] group-hover:border-teal-500/30 transition-colors duration-300" style={{ animation: `fadeIn 0.5s ease-out ${i * 0.2}s both` }}>
              <p className="text-white font-bold text-lg font-mono tracking-tight drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{m.value}</p>
              <p className="text-teal-400/80 text-[9px] leading-tight mt-0.5 uppercase tracking-wider font-mono">{m.label}</p>
            </div>
          ))}
        </div>
        <div className="bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-teal-500/20 rounded-lg px-3 py-2 text-center group-hover:bg-gradient-to-r group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <span className="text-teal-400 text-[10px] font-bold font-mono tracking-widest uppercase flex justify-center items-center gap-2">
            <RocketLaunchIcon className="w-3.5 h-3.5 animate-bounce" style={{ animationDuration: '2s' }} /> Capacity Expanded
          </span>
        </div>
      </div>
    </div>
  )
}

