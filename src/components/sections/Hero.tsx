import { useState, useEffect } from "react";
import {
  ArrowRightIcon,
  BoltIcon,
  CheckCircleIcon,
  CalendarDaysIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useMeshPulse } from "@/hooks/useMeshPulse";
import { ANIMATION_VARIANTS } from "@/lib/animation-config";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Premium ambient glow background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-dark/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-width relative z-10 py-20 lg:py-32">
        <motion.div
          className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center"
          initial="hidden"
          animate="visible"
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          {/* Left — Content */}
          <motion.div
            className="space-y-8"
            variants={ANIMATION_VARIANTS.enterFromLeft}
          >
            <motion.div variants={ANIMATION_VARIANTS.fadeIn}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.1)]">
                <span className="flex h-2 w-2 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal"></span>
                </span>
                <span
                  className="text-sm text-slate-200 font-medium tracking-wide"
                  style={{ transform: "translateX(-5px)" }}
                >
                  15-25 hours/week saved. No new software required.
                </span>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              variants={ANIMATION_VARIANTS.fadeIn}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold font-heading text-white leading-[1.1] tracking-tight text-shadow-glow">
                Run Your Business <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal via-white to-gold animate-gradient-x drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
                  From Your Phone
                </span>
              </h1>
              <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-lg font-light">
                Not another DIY automation tool. We build, run, and maintain AI
                agents that actually run your operations — admin, billing,
                scheduling, everything. You don&apos;t build it. You don&apos;t
                babysit it. You just check your phone.
              </p>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-5 pt-4"
              variants={ANIMATION_VARIANTS.fadeIn}
            >
              <div className="flex flex-col items-center gap-4 flex-shrink-0 w-full sm:w-auto">
                <Link to="/audit" className="w-full">
                  <Button
                    size="lg"
                    className="w-full h-[56px] relative group overflow-hidden bg-transparent border-0 p-0 text-white rounded-xl shadow-[0_0_25px_rgba(0,229,255,0.5)] hover:shadow-[0_0_40px_rgba(0,229,255,0.8)] transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x group-hover:scale-105 transition-transform" />
                    <div className="relative h-full w-full px-8 flex items-center justify-center gap-2 font-bold text-base">
                      <CalendarDaysIcon className="w-5 h-5" />
                      Get Free Discovery Audit
                      <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Button>
                </Link>
                <p className="text-sm text-blue-200/40 flex items-center justify-center gap-3 w-full">
                  <span>✓ Free audit, no commitment</span>
                  <span className="text-emerald-400/70">·</span>
                  <span className="text-emerald-400/70 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    90-day guarantee
                  </span>
                </p>
              </div>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="w-full h-[56px] px-8 border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/20 transition-all font-semibold rounded-xl text-base"
                >
                  See How It Works
                </Button>
              </a>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10"
              variants={ANIMATION_VARIANTS.fadeIn}
            >
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  "Based in Singapore 🇸🇬",
                  "PDPA Compliant",
                  "Live in 2-4 Weeks",
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-2 text-slate-300 text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-teal filter drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
                    {item}
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-3 pl-20">
                {["Bank-Grade Security", "90-Day Results"].map((item, i) => (
                  <motion.div
                    key={item}
                    className="flex items-center gap-2 text-slate-300 text-sm font-medium"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 3) * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CheckCircleIcon className="w-5 h-5 text-teal filter drop-shadow-[0_0_5px_rgba(0,229,255,0.5)]" />
                    {item}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Agent Network (Glassmorphism) */}
          <motion.div
            className="hidden md:flex items-center justify-center relative"
            variants={ANIMATION_VARIANTS.floatingPulse}
          >
            {/* Soft glow behind SVG */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal/20 to-gold/10 blur-[80px] rounded-full z-0 pointer-events-none" />
            <div className="relative z-10 w-full max-w-lg">
              <AgentNetworkSVG />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator overlay at bottom */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-navy-dark to-transparent pointer-events-none z-20" />
    </section>
  );
}

function TypewriterText({ text }: { text: string }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    if (!text) return;

    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
      }
    }, 20); // Fast typing speed

    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayedText}
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1.5 h-3 bg-teal-300 align-middle ml-1 shadow-[0_0_8px_rgba(45,212,191,0.8)]"
      />
    </>
  );
}

function AgentNetworkSVG() {
  const pulseProps = useMeshPulse();
  const [taskText, setTaskText] = useState(
    "Initializing Orchestrator Swarm...",
  );
  const [activeNode, setActiveNode] = useState<number>(0);

  useEffect(() => {
    const tasks = [
      {
        text: "[ADMIN] Client report generated and filed — no manual entry needed",
        node: 0,
      },
      {
        text: "[PROJECTS] Deliverable #3 marked complete — client notified.",
        node: 1,
      },
      {
        text: "[ORCHESTRATOR] Routing weekly summary to Comms Agent...",
        node: 5,
      },
      {
        text: "[COMMS] Follow-up email drafted — matching your brand tone...",
        node: 3,
      },
      {
        text: "[SOCIAL] Instagram post scheduled for peak engagement window.",
        node: 4,
      },
      { text: "[COMMS] Status update sent to client via WhatsApp.", node: 3 },
      {
        text: "[PROJECTS] Deadline alert — milestone review in 2 days.",
        node: 1,
      },
      { text: "[ORCHESTRATOR] Running daily operations report...", node: 5 },
      {
        text: "[FINANCE] Invoice #2045 sent — payment tracked automatically.",
        node: 2,
      },
    ];
    let i = 0;
    const interval = setInterval(() => {
      setTaskText(tasks[i].text);
      setActiveNode(tasks[i].node);
      i = (i + 1) % tasks.length;
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { cx: 130, cy: 110, label: "Admin Agent", icon: "📋", isCenter: false },
    { cx: 360, cy: 90, label: "Projects Agent", icon: "📊", isCenter: false },
    { cx: 400, cy: 230, label: "Finance Agent", icon: "💳", isCenter: false },
    { cx: 250, cy: 310, label: "Comms Agent", icon: "📩", isCenter: false },
    { cx: 110, cy: 260, label: "Social Agent", icon: "📱", isCenter: false },
    { cx: 255, cy: 200, label: "Orchestrator", icon: "🧠", isCenter: true },
  ];

  // Create a mesh network by connecting more nodes
  const edges = [
    [0, 5],
    [1, 5],
    [2, 5],
    [3, 5],
    [4, 5], // All to center
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [4, 0], // Outer ring
    [0, 3],
    [1, 4], // Cross connections
  ];

  return (
    <motion.div
      className="relative w-full max-w-[550px] aspect-[4/3] sm:aspect-square flex items-center justify-center p-4 sm:p-8 bg-navy-950/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,229,255,0.2)]"
      initial={{ opacity: 0, scale: 0.95, rotateY: 5 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{ perspective: 1200 }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
        {/* Deep Cyberpunk Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 [mask-image:radial-gradient(circle_at_center,white,transparent_80%)]" />

        {/* Floating particles background */}
        <div className="absolute inset-0 mix-blend-screen opacity-50">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-teal rounded-full blur-[1px]"
              initial={{
                x: Math.random() * 500,
                y: Math.random() * 400,
                opacity: Math.random() * 0.5 + 0.1,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </div>

      <svg
        viewBox="20 20 460 360"
        className="w-full h-full overflow-visible z-10"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D97706" stopOpacity="0.8" />
          </linearGradient>
          <filter id="hyper-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="8" result="blur1" />
            <feGaussianBlur stdDeviation="4" result="blur2" />
            <feMerge>
              <feMergeNode in="blur1" />
              <feMergeNode in="blur2" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="subtle-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Real-time scanning line pattern */}
          <linearGradient id="scanline" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.5" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* Connections / Edges */}
        {edges.map(([a, b], i) => {
          const isCenterConnection = a === 5 || b === 5;
          const isActivePath = a === activeNode || b === activeNode;
          // Use smooth bezier curves for a more organic, neural look
          const d = `M ${nodes[a].cx} ${nodes[a].cy} Q ${(nodes[a].cx + nodes[b].cx) / 2 + (isCenterConnection ? 30 : -20)} ${(nodes[a].cy + nodes[b].cy) / 2 + (isCenterConnection ? -10 : 30)} ${nodes[b].cx} ${nodes[b].cy}`;

          return (
            <g key={`edge-group-${i}`}>
              {/* Base structural path */}
              <motion.path
                d={d}
                fill="none"
                stroke={isActivePath ? "url(#edgeGradient)" : "#1E293B"}
                strokeWidth={isActivePath ? "2" : "1"}
                strokeOpacity={isActivePath ? "0.8" : "0.4"}
                strokeDasharray="4 4"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  strokeDashoffset: isActivePath ? [0, -30] : 0,
                }}
                transition={{
                  pathLength: { duration: 2, delay: i * 0.05 },
                  strokeDashoffset: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              />

              {/* High-speed data telemetry (only on active connections) */}
              {isActivePath && (
                <>
                  <circle r="4" fill="#06B6D4" filter="url(#subtle-glow)">
                    <animateMotion
                      dur="1.5s"
                      repeatCount="indefinite"
                      path={d}
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;1;0"
                      keyTimes="0;0.1;0.9;1"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                  <circle r="2" fill="#F8FAFC">
                    <animateMotion
                      dur="1s"
                      repeatCount="indefinite"
                      path={d}
                      begin="0.5s"
                    />
                    <animate
                      attributeName="opacity"
                      values="0;1;0"
                      keyTimes="0;0.5;1"
                      dur="1s"
                      repeatCount="indefinite"
                      begin="0.5s"
                    />
                  </circle>
                </>
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {nodes.map((node, i) => {
          const isActive = i === activeNode;

          return (
            <motion.g
              key={`node-${i}`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                delay: 0.2 + i * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
            >
              {/* Ambient Node Aura */}
              <motion.circle
                cx={node.cx}
                cy={node.cy}
                r={node.isCenter ? 55 : isActive ? 40 : 35}
                fill={
                  node.isCenter ? "#06B6D4" : isActive ? "#3B82F6" : "#1E293B"
                }
                filter="url(#hyper-glow)"
                animate={{
                  opacity: node.isCenter
                    ? [0.15, 0.3, 0.15]
                    : isActive
                      ? [0.3, 0.6, 0.3]
                      : 0.1,
                  scale: isActive ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  duration: node.isCenter ? 3 : 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Core Hardware Shell */}
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.isCenter ? 42 : 28}
                fill="#0A0F1A"
                stroke={
                  node.isCenter ? "#06B6D4" : isActive ? "#60A5FA" : "#334155"
                }
                strokeWidth={node.isCenter ? "2" : "1.5"}
                className="drop-shadow-xl"
              />

              {/* Rotating inner ring for Orchestrator */}
              {node.isCenter && (
                <motion.circle
                  cx={node.cx}
                  cy={node.cy}
                  r={36}
                  fill="none"
                  stroke="url(#edgeGradient)"
                  strokeWidth="1"
                  strokeDasharray="10 20"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{ originX: `${node.cx}px`, originY: `${node.cy}px` }}
                />
              )}

              {/* Node Icon */}
              <text
                x={node.cx}
                y={node.cy + (node.isCenter ? 8 : 6)}
                textAnchor="middle"
                fontSize={node.isCenter ? "26" : "18"}
                fill={isActive || node.isCenter ? "#FFFFFF" : "#94A3B8"}
                className="select-none filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-colors duration-300"
                style={{
                  filter: isActive
                    ? "drop-shadow(0 0 8px rgba(255,255,255,0.8))"
                    : "none",
                }}
              >
                {node.icon}
              </text>

              {/* Hardware Label Display */}
              <rect
                x={node.cx - 40}
                y={node.cy + (node.isCenter ? 50 : 36)}
                width="80"
                height="20"
                rx="4"
                fill="#0A0F1A"
                stroke={isActive ? "#06B6D4" : "#334155"}
                strokeWidth="1"
                className="transition-colors duration-300"
              />
              <text
                x={node.cx}
                y={node.cy + (node.isCenter ? 63 : 49)}
                textAnchor="middle"
                fontSize="9"
                fill={isActive ? "#22D3EE" : "#94A3B8"}
                fontWeight="700"
                className="select-none tracking-wider font-mono transition-colors duration-300"
              >
                {node.label.toUpperCase()}
              </text>

              {/* Active processing indicator dots */}
              {isActive && !node.isCenter && (
                <motion.circle
                  cx={node.cx - 30}
                  cy={node.cy + 46}
                  r="2"
                  fill="#22C55E"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              )}
            </motion.g>
          );
        })}
      </svg>

      {/* Cybernetic Status Overlay */}
      <motion.div
        className="absolute top-4 left-4 flex items-center gap-4 pointer-events-none z-20 bg-[#0A0F1A]/80 backdrop-blur-md border border-cyan/20 px-3 py-1.5 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2 border-r border-cyan/20 pr-4">
          <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
          <span className="font-bold">System Live</span>
        </div>
        <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
          <span className="tracking-widest">UPTIME:</span>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-teal-400 font-bold tracking-wider"
          >
            99.99%
          </motion.span>
        </div>
      </motion.div>

      {/* High-Tech Terminal Console */}
      <motion.div
        className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 w-[90%] sm:w-[85%] bg-[#050A14]/95 backdrop-blur-3xl border border-teal-500/30 rounded-xl shadow-[0_0_50px_rgba(0,229,255,0.2)] overflow-hidden"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, type: "spring", stiffness: 200, damping: 20 }}
      >
        {/* Console Header */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-teal-950/40 border-b border-teal-500/20">
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
            <div className="w-2 h-2 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
            <div className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
          </div>
          <p className="text-teal-400 text-[9px] font-bold tracking-[0.2em] uppercase font-mono flex items-center gap-1.5">
            <BoltIcon className="w-2.5 h-2.5" />
            Business.log
          </p>
        </div>

        {/* Console Output */}
        <div className="p-3 sm:p-4 flex items-start gap-3 font-mono">
          <div className="mt-0.5 relative flex items-center justify-center w-3.5 h-3.5 rounded-sm bg-teal-500/10 border border-teal-500/40 flex-shrink-0 shadow-[0_0_10px_rgba(45,212,191,0.2)]">
            <span className="absolute inset-0 bg-teal-400 opacity-20 animate-pulse"></span>
            <span className="text-teal-400 text-[8px] ml-[1px]">▶</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-teal-300 text-[11px] sm:text-xs font-semibold tracking-wide leading-relaxed drop-shadow-[0_0_8px_rgba(45,212,191,0.6)] min-h-[36px] sm:min-h-[40px]">
              <TypewriterText text={taskText} />
            </p>
            <div className="mt-2 flex items-center gap-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-teal-500/50 via-cyan-500/10 to-transparent" />
              <span className="text-[7px] text-teal-500/50 tracking-widest uppercase">
                Agent Network Active
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
