import { ArrowRightIcon, BoltIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy">
      {/* Grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      {/* Ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <div className="container-width relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — Content */}
          <div className="space-y-8">
            <Badge variant="teal" className="text-sm px-4 py-1.5 animate-fade-in">
              <BoltIcon className="w-3.5 h-3.5 mr-1.5" />
              AI Operations Platform for Agencies
            </Badge>

            <div className="space-y-5 animate-slide-up">
              <h1 className="text-5xl lg:text-6xl font-bold font-heading text-white leading-[1.1] tracking-tight">
                AI-Powered Ops That Saves Founders{' '}
                <span className="text-gradient">10–20 hrs</span> Every Week
              </h1>
              <p className="text-xl text-slate-300 leading-relaxed max-w-lg">
                Deploy specialized AI agents to handle client intake, tracking, invoicing & comms
                — so you focus on strategy and growth.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in">
              <Link to="/audit">
                <Button size="lg" variant="primary" className="group w-full sm:w-auto">
                  Get Free Operational Audit
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                </Button>
              </Link>
              <a href="#how-it-works">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full sm:w-auto"
                >
                  See How It Works
                </Button>
              </a>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-2">
              {['20+ agencies in SEA', 'PDPA compliant', 'Live within 48 hrs'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-slate-400 text-sm">
                  <CheckCircleIcon className="w-4 h-4 text-teal flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — SVG Agent Network */}
          <div className="hidden lg:flex items-center justify-center">
            <AgentNetworkSVG />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2.5 rounded-full bg-teal animate-pulse" />
        </div>
      </div>
    </section>
  )
}

function AgentNetworkSVG() {
  const nodes = [
    { cx: 200, cy: 150, label: 'Intake', icon: '📥', color: '#2ECC71', isCenter: false },
    { cx: 360, cy: 90, label: 'Tracking', icon: '📊', color: '#F1C40F', isCenter: false },
    { cx: 400, cy: 230, label: 'Invoicing', icon: '💳', color: '#2ECC71', isCenter: false },
    { cx: 250, cy: 310, label: 'Comms', icon: '📩', color: '#F1C40F', isCenter: false },
    { cx: 110, cy: 260, label: 'QA', icon: '✅', color: '#2ECC71', isCenter: false },
    { cx: 255, cy: 200, label: 'Control', icon: '🎯', color: '#2ECC71', isCenter: true },
  ]
  const edges = [
    [0, 5], [1, 5], [2, 5], [3, 5], [4, 5],
    [0, 1], [1, 2], [2, 3], [3, 4],
  ]

  return (
    <div className="relative w-full max-w-md">
      <svg viewBox="60 60 380 290" className="w-full drop-shadow-2xl" aria-hidden="true">
        <defs>
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
          </radialGradient>
          <filter id="nodeGlow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Center glow */}
        <circle cx="255" cy="200" r="90" fill="url(#centerGlow)" />

        {/* Edges */}
        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a].cx}
            y1={nodes[a].cy}
            x2={nodes[b].cx}
            y2={nodes[b].cy}
            stroke="#2ECC71"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="5 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="0;-18"
              dur={`${1.8 + i * 0.25}s`}
              repeatCount="indefinite"
            />
          </line>
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <g key={i} filter="url(#nodeGlow)">
            <circle
              cx={node.cx}
              cy={node.cy}
              r={node.isCenter ? 36 : 26}
              fill={node.isCenter ? '#2ECC71' : '#243660'}
              stroke={node.color}
              strokeWidth="2"
            >
              {!node.isCenter && (
                <animate
                  attributeName="r"
                  values="26;29;26"
                  dur={`${2.2 + i * 0.35}s`}
                  repeatCount="indefinite"
                />
              )}
            </circle>
            <text
              x={node.cx}
              y={node.cy - 5}
              textAnchor="middle"
              fontSize="13"
              fill="white"
              className="select-none"
            >
              {node.icon}
            </text>
            <text
              x={node.cx}
              y={node.cy + 10}
              textAnchor="middle"
              fontSize="8.5"
              fill={node.isCenter ? '#fff' : '#94A3B8'}
              fontWeight="600"
              className="select-none"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Status card */}
      <div className="absolute top-2 right-2 bg-navy-dark/90 backdrop-blur-sm border border-teal/20 rounded-xl px-4 py-3 shadow-lg">
        <p className="text-teal text-xs font-semibold font-heading tracking-widest">MISSION CONTROL</p>
        <p className="text-white text-sm font-bold mt-0.5">6 Agents Active</p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
          <span className="text-slate-400 text-xs">Running 24/7</span>
        </div>
      </div>
    </div>
  )
}
