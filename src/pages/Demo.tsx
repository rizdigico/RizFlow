import { useState, useEffect, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";
import {
  BoltIcon,
  ArrowRightIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  CogIcon,
  UserGroupIcon,
  PlayIcon,
  PauseIcon,
  QueueListIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

// ── Agent Definitions ──
type AgentId =
  | "intake"
  | "workflow"
  | "billing"
  | "comms"
  | "qa"
  | "orchestrator";

interface Agent {
  id: AgentId;
  name: string;
  icon: string;
  color: string;
  glow: string;
}

const AGENTS: Agent[] = [
  {
    id: "intake",
    name: "Intake Agent",
    icon: "📥",
    color: "text-cyan-400",
    glow: "shadow-[0_0_15px_rgba(6,182,212,0.4)]",
  },
  {
    id: "workflow",
    name: "Workflow Agent",
    icon: "📊",
    color: "text-blue-400",
    glow: "shadow-[0_0_15px_rgba(96,165,250,0.4)]",
  },
  {
    id: "billing",
    name: "Billing Agent",
    icon: "💳",
    color: "text-gold",
    glow: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
  },
  {
    id: "comms",
    name: "Comms Agent",
    icon: "📩",
    color: "text-teal-400",
    glow: "shadow-[0_0_15px_rgba(45,212,191,0.4)]",
  },
  {
    id: "qa",
    name: "QA Agent",
    icon: "✅",
    color: "text-green-400",
    glow: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
  },
  {
    id: "orchestrator",
    name: "Orchestrator",
    icon: "🧠",
    color: "text-purple-400",
    glow: "shadow-[0_0_15px_rgba(168,85,247,0.4)]",
  },
];

// ── Scenario Definitions ──
interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  steps: WorkflowStep[];
}

interface WorkflowStep {
  agent: AgentId;
  action: string;
  detail: string;
  duration: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: "customer-inquiry",
    title: "Customer Inquiry",
    description:
      "A new customer reaches out — watch how agents handle it end-to-end",
    icon: "💬",
    steps: [
      {
        agent: "intake",
        action: "RECEIVED",
        detail: "New customer inquiry detected — auto-qualifying lead...",
        duration: 1800,
      },
      {
        agent: "intake",
        action: "QUALIFIED",
        detail: "Lead scored 87/100 — high-value prospect identified",
        duration: 1400,
      },
      {
        agent: "orchestrator",
        action: "ROUTING",
        detail: "Orchestrator routing qualified lead to Comms Agent...",
        duration: 1200,
      },
      {
        agent: "comms",
        action: "DRAFTING",
        detail:
          "Comms Agent drafting personalized response — matching brand tone...",
        duration: 2000,
      },
      {
        agent: "comms",
        action: "SENT",
        detail:
          "Customer response sent via WhatsApp — response time: 47 seconds",
        duration: 1000,
      },
      {
        agent: "workflow",
        action: "CREATED",
        detail:
          "Workflow Agent created follow-up task — scheduled for 24 hours",
        duration: 1200,
      },
      {
        agent: "qa",
        action: "VERIFIED",
        detail:
          "QA Agent verified response quality — tone, accuracy, compliance: all passed",
        duration: 1500,
      },
      {
        agent: "orchestrator",
        action: "COMPLETE",
        detail:
          "Workflow complete — customer inquiry resolved in under 2 minutes",
        duration: 800,
      },
    ],
  },
  {
    id: "order-fulfillment",
    title: "Order Fulfillment",
    description: "From order placement to delivery — full automated pipeline",
    icon: "📦",
    steps: [
      {
        agent: "intake",
        action: "ORDER_RECEIVED",
        detail: "Order #RF-1847 received — 3 items, total $284.50",
        duration: 1200,
      },
      {
        agent: "billing",
        action: "PAYMENT_PROCESSING",
        detail: "Billing Agent verifying payment — Stripe charge confirmed",
        duration: 1800,
      },
      {
        agent: "workflow",
        action: "FULFILLMENT_QUEUED",
        detail:
          "Order assigned to fulfilment queue — estimated delivery: 2 business days",
        duration: 1400,
      },
      {
        agent: "comms",
        action: "NOTIFICATION_SENT",
        detail:
          "Customer notified — order confirmation sent via email & WhatsApp",
        duration: 1000,
      },
      {
        agent: "qa",
        action: "QUALITY_CHECK",
        detail: "QA checklist verified — packaging, address, items all match",
        duration: 1600,
      },
      {
        agent: "workflow",
        action: "SHIPPED",
        detail: "Shipping label generated — tracking number: SG-2026-1847-QL",
        duration: 1200,
      },
      {
        agent: "comms",
        action: "TRACKING_SENT",
        detail: "Tracking info sent to customer — delivery window: Thu-Fri",
        duration: 800,
      },
      {
        agent: "orchestrator",
        action: "COMPLETE",
        detail:
          "Order #RF-1847 fulfilled — all 6 agent handoffs completed autonomously",
        duration: 600,
      },
    ],
  },
  {
    id: "billing-reminder",
    title: "Smart Invoicing",
    description: "Automated invoicing, payment tracking, and smart reminders",
    icon: "💰",
    steps: [
      {
        agent: "billing",
        action: "INVOICE_GENERATED",
        detail: "Invoice #INV-2045 generated — amount: $1,250.00, due: 30 days",
        duration: 1500,
      },
      {
        agent: "comms",
        action: "INVOICE_SENT",
        detail:
          "Invoice sent to client via email — professional template applied",
        duration: 1200,
      },
      {
        agent: "orchestrator",
        action: "REMINDER_SCHEDULED",
        detail:
          "Orchestrator set 7-day and 3-day reminder rules before due date",
        duration: 1000,
      },
      {
        agent: "billing",
        action: "PAYMENT_RECEIVED",
        detail: "Payment received — $1,250.00 — Stripe transfer confirmed",
        duration: 1600,
      },
      {
        agent: "billing",
        action: "RECEIPT_ISSUED",
        detail:
          "Receipt auto-generated and sent to client — PDF attachment included",
        duration: 1000,
      },
      {
        agent: "workflow",
        action: "LOGGED",
        detail: "Transaction logged to accounting — Xero sync updated",
        duration: 800,
      },
      {
        agent: "qa",
        action: "VERIFIED",
        detail: "QA verified payment reconciliation — all amounts match",
        duration: 1200,
      },
      {
        agent: "orchestrator",
        action: "COMPLETE",
        detail: "Invoice-to-receipt cycle completed — zero manual intervention",
        duration: 600,
      },
    ],
  },
];

// ── Helpers ──
function getAgent(id: AgentId): Agent {
  return AGENTS.find((a) => a.id === id)!;
}

function formatTime(ms: number): string {
  const s = (ms / 1000).toFixed(1);
  return `${s}s`;
}

// ── Demo Page ──
export function Demo() {
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [logs, setLogs] = useState<
    { agent: Agent; action: string; detail: string; time: string }[]
  >([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [activeAgents, setActiveAgents] = useState<Set<AgentId>>(new Set());

  // Use refs for values the timer callback needs to read without stale closures
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const scenarioRef = useRef<Scenario | null>(null);
  const nextStepRef = useRef(0);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const logEndRef = useRef<HTMLDivElement>(null);

  const resetSimulation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    isPausedRef.current = false;
    setActiveScenario(null);
    setCurrentStepIndex(-1);
    setLogs([]);
    setIsRunning(false);
    setIsPaused(false);
    setTotalTime(0);
    setCompletedSteps(0);
    setActiveAgents(new Set());
  }, []);

  const runNextStep = useCallback(() => {
    const scenario = scenarioRef.current;
    if (!scenario) return;

    const stepIndex = nextStepRef.current;
    if (stepIndex >= scenario.steps.length) {
      setIsRunning(false);
      setActiveAgents(new Set());
      return;
    }

    const step = scenario.steps[stepIndex];
    const agent = getAgent(step.agent);

    setActiveAgents((prev) => new Set(prev).add(step.agent));
    setCurrentStepIndex(stepIndex);

    timerRef.current = setTimeout(() => {
      // If paused, stop here — resume will call runNextStep again
      if (isPausedRef.current) return;

      setTotalTime((t) => t + step.duration);
      setCompletedSteps((c) => c + 1);
      setLogs((prev) => [
        ...prev,
        {
          agent,
          action: step.action,
          detail: step.detail,
          time: formatTime(step.duration),
        },
      ]);

      nextStepRef.current = stepIndex + 1;

      if (stepIndex + 1 < scenario.steps.length) {
        runNextStep();
      } else {
        setIsRunning(false);
        setActiveAgents(new Set());
      }
    }, step.duration);
  }, []);

  const startScenario = useCallback(
    (scenario: Scenario) => {
      resetSimulation();
      setActiveScenario(scenario);
      scenarioRef.current = scenario;
      nextStepRef.current = 0;
      isPausedRef.current = false;
      setIsRunning(true);
      setIsPaused(false);

      // Scroll dashboard into view after a brief render delay
      setTimeout(() => {
        dashboardRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);

      // Small delay for visual effect, then run
      setTimeout(() => {
        runNextStep();
      }, 600);
    },
    [resetSimulation, runNextStep],
  );

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      isPausedRef.current = next;

      if (next) {
        // Pausing — clear the pending timer
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
      } else {
        // Resuming — continue from where we left off
        // Re-run current step (which was interrupted by pause)
        runNextStep();
      }

      return next;
    });
  }, [runNextStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const totalSteps = activeScenario?.steps.length ?? 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  return (
    <>
      <Helmet>
        <title>Live Agent Demo — See RizFlow AI in Action | RizFlow</title>
        <meta
          name="description"
          content="Watch RizFlow's custom AI agents handle real business workflows in real-time. Interactive demo — see how agents coordinate to automate your operations."
        />
        <meta
          name="keywords"
          content="AI agent demo, business automation demo, agentic AI workflow, interactive AI demo, SME automation"
        />
        <link rel="canonical" href={`${SITE_URL}/demo`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/demo`} />
        <meta property="og:title" content="Live Agent Demo — RizFlow" />
        <meta
          property="og:description"
          content="Watch RizFlow's custom AI agents handle real business workflows in real-time."
        />
        <meta property="og:image" content={SEO_DEFAULTS.ogImage} />
        <meta property="og:site_name" content="RizFlow" />
      </Helmet>

      <div className="relative bg-[#050A14] w-full overflow-hidden min-h-screen">
        {/* Background effects — slightly stronger mesh */}
        <div className="absolute inset-0 z-0 opacity-50 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.6} />
        </div>
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(0,229,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

        {/* Hero */}
        <section className="pt-28 md:pt-36 lg:pt-44 pb-12 relative">
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-500/30 bg-[#0A0F1A]/80 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(0,229,255,0.15)]">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-mono text-teal-400 tracking-widest uppercase">
                Live Agent Simulation
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-white mb-6 leading-tight drop-shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Watch Your Business <br />
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-200 animate-gradient-x"
                style={{
                  textShadow:
                    "0 0 40px rgba(0,229,255,0.6), 0 0 80px rgba(0,229,255,0.3)",
                }}
              >
                Run Itself
              </span>
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-mono text-sm tracking-wide mb-8">
              &gt; Choose a scenario below. Watch how RizFlow agents coordinate,
              communicate, and complete real business workflows — autonomously,
              in real-time.
            </p>
            <p className="text-sm text-slate-500 max-w-xl mx-auto">
              This is a simulation. No data is being processed or sent. It
              demonstrates the workflow architecture.
            </p>
          </Container>
        </section>

        {/* Scenario Selector */}
        <section className="pb-8 relative">
          <Container className="relative z-10">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {SCENARIOS.map((scenario) => {
                const isActive = activeScenario?.id === scenario.id;
                return (
                  <motion.button
                    key={scenario.id}
                    onClick={() => startScenario(scenario)}
                    className={`group relative text-left p-6 rounded-xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "border-teal-500/60 bg-[#0A0F1A]/90 shadow-[0_0_30px_rgba(0,229,255,0.2)]"
                        : "border-white/10 bg-[#0A0F1A]/60 hover:border-teal-500/30 hover:bg-[#0A0F1A]/80 hover:shadow-[0_0_20px_rgba(0,229,255,0.1)]"
                    }`}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isRunning && !isActive}
                  >
                    {/* Scan line on hover */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-0 group-hover:opacity-100 animate-[slideRight_2s_ease-in-out_infinite]" />

                    <div className="text-3xl mb-3">{scenario.icon}</div>
                    <h3
                      className={`text-lg font-bold font-mono mb-2 tracking-tight transition-colors ${
                        isActive
                          ? "text-teal-300"
                          : "text-white group-hover:text-teal-200"
                      }`}
                    >
                      {scenario.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-mono opacity-80">
                      {scenario.description}
                    </p>
                    {isActive && isRunning && (
                      <div className="absolute top-3 right-3">
                        <span className="flex h-3 w-3 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500" />
                        </span>
                      </div>
                    )}
                    {isActive &&
                      !isRunning &&
                      completedSteps === totalSteps &&
                      totalSteps > 0 && (
                        <div className="absolute top-3 right-3">
                          <CheckCircleIcon className="w-5 h-5 text-green-400" />
                        </div>
                      )}
                  </motion.button>
                );
              })}
            </div>
          </Container>
        </section>

        {/* Simulation Dashboard */}
        <AnimatePresence mode="wait">
          {activeScenario && (
            <motion.section
              key={activeScenario.id}
              ref={dashboardRef}
              className="pb-20 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <Container className="relative z-10">
                {/* Controls bar */}
                <div className="flex items-center justify-between mb-6 px-1">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold font-mono text-white tracking-tight">
                      <span className="text-teal-400">&gt;</span>{" "}
                      {activeScenario.title}
                    </h2>
                    {isRunning && (
                      <span className="text-xs font-mono text-teal-400 bg-teal-500/10 border border-teal-500/30 px-2 py-0.5 rounded flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {isRunning && (
                      <button
                        onClick={togglePause}
                        className="p-2 rounded-lg border border-white/10 hover:border-teal-500/30 hover:bg-white/5 transition-all text-slate-400 hover:text-teal-300"
                      >
                        {isPaused ? (
                          <PlayIcon className="w-4 h-4" />
                        ) : (
                          <PauseIcon className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={resetSimulation}
                      className="p-2 rounded-lg border border-white/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all text-slate-400 hover:text-red-400"
                      title="Reset"
                    >
                      <ArrowPathIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-500 mb-2">
                    <span>
                      Step {Math.min(completedSteps + 1, totalSteps)} /{" "}
                      {totalSteps}
                    </span>
                    <span>{formatTime(totalTime)} elapsed</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-500 via-cyan-400 to-teal-500 bg-[length:200%_auto] animate-gradient-x rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-6">
                  {/* Left: Agent Status Panel */}
                  <div className="lg:col-span-4">
                    <div className="bg-[#0A0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden">
                      {/* Panel header */}
                      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
                        <UserGroupIcon className="w-4 h-4 text-teal-400" />
                        <span className="text-sm font-bold font-mono text-slate-300 tracking-wide">
                          Agent Network
                        </span>
                      </div>

                      {/* Agent list */}
                      <div className="p-4 space-y-3">
                        {AGENTS.map((agent) => {
                          const isActive = activeAgents.has(agent.id);
                          const isDone =
                            completedSteps > 0 &&
                            !isActive &&
                            logs.some((l) => l.agent.id === agent.id);
                          return (
                            <motion.div
                              key={agent.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                                isActive
                                  ? "border-teal-500/40 bg-teal-500/5 " +
                                    agent.glow
                                  : isDone
                                    ? "border-green-500/20 bg-green-500/5"
                                    : "border-white/5 bg-white/[0.02]"
                              }`}
                              animate={isActive ? { scale: [1, 1.02, 1] } : {}}
                              transition={
                                isActive
                                  ? { duration: 1, repeat: Infinity }
                                  : {}
                              }
                            >
                              <span className="text-xl">{agent.icon}</span>
                              <div className="flex-1 min-w-0">
                                <span
                                  className={`text-sm font-bold font-mono tracking-tight ${
                                    isActive
                                      ? agent.color
                                      : isDone
                                        ? "text-green-400"
                                        : "text-slate-500"
                                  }`}
                                >
                                  {agent.name}
                                </span>
                                <div className="text-[10px] font-mono text-slate-600 mt-0.5">
                                  {isActive
                                    ? "PROCESSING..."
                                    : isDone
                                      ? "COMPLETE"
                                      : "STANDBY"}
                                </div>
                              </div>
                              <div className="flex-shrink-0">
                                {isActive && (
                                  <span className="flex h-2.5 w-2.5 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500" />
                                  </span>
                                )}
                                {isDone && (
                                  <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Metrics */}
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-[#0A0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold font-mono text-teal-400">
                          {completedSteps}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                          Steps Done
                        </div>
                      </div>
                      <div className="bg-[#0A0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-xl p-4 text-center">
                        <div className="text-2xl font-bold font-mono text-cyan-400">
                          {formatTime(totalTime)}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-1">
                          Total Time
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Live Terminal */}
                  <div className="lg:col-span-8">
                    <div className="bg-[#0A0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.05)]">
                      {/* Terminal header */}
                      <div className="px-4 py-2.5 bg-[#050A14]/60 border-b border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500/80 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/80 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
                            <div className="w-2 h-2 rounded-full bg-green-500/80 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                          </div>
                          <span className="text-[10px] font-mono text-teal-400 tracking-[0.2em] uppercase flex items-center gap-1.5">
                            <BoltIcon className="w-3 h-3" />
                            RizFlow Agent Terminal
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-600">
                          <QueueListIcon className="w-3 h-3" />
                          {logs.length} events
                        </div>
                      </div>

                      {/* Terminal output */}
                      <div className="p-4 min-h-[400px] max-h-[500px] overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin">
                        {/* Initial boot message */}
                        {logs.length === 0 && (
                          <div className="text-slate-600 py-8 text-center">
                            <div className="text-teal-500/50 text-xs mb-2">
                              AWAITING INPUT...
                            </div>
                            <div className="text-slate-700 text-xs">
                              Select a scenario to begin simulation
                            </div>
                          </div>
                        )}

                        {logs.map((log, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex items-start gap-3 py-1.5 border-b border-white/[0.03] group"
                          >
                            {/* Step number */}
                            <span className="text-[10px] text-slate-600 w-4 text-right flex-shrink-0 mt-0.5">
                              {String(i + 1).padStart(2, "0")}
                            </span>

                            {/* Agent badge */}
                            <span className="text-xs px-1.5 py-0.5 rounded border flex-shrink-0 border-current/20 bg-current/5">
                              <span className={log.agent.color}>
                                {log.agent.icon}
                              </span>
                            </span>

                            {/* Log content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold ${log.agent.color} tracking-wide`}
                                >
                                  [{log.agent.name.split(" ")[0].toUpperCase()}]
                                </span>
                                <span className="text-[10px] text-slate-600 font-bold tracking-widest">
                                  {log.action}
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">
                                {log.detail}
                              </p>
                            </div>

                            {/* Duration */}
                            <span className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">
                              {log.time}
                            </span>
                          </motion.div>
                        ))}

                        {/* Current step indicator */}
                        {isRunning &&
                          currentStepIndex < totalSteps &&
                          currentStepIndex >= 0 && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center gap-2 py-2"
                            >
                              <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
                              <span className="text-teal-400/60 text-xs font-mono">
                                Processing step {currentStepIndex + 1}...
                              </span>
                            </motion.div>
                          )}

                        {/* Completion message */}
                        {!isRunning &&
                          completedSteps === totalSteps &&
                          totalSteps > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-4 p-4 bg-green-500/5 border border-green-500/20 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <CheckCircleIcon className="w-5 h-5 text-green-400" />
                                <span className="text-green-400 font-bold font-mono tracking-wide text-sm">
                                  WORKFLOW COMPLETE
                                </span>
                              </div>
                              <p className="text-slate-400 text-xs font-mono">
                                All {totalSteps} agent handoffs completed
                                autonomously in {formatTime(totalTime)}. Zero
                                manual intervention required.
                              </p>
                            </motion.div>
                          )}

                        <div ref={logEndRef} />
                      </div>
                    </div>

                    {/* Workflow diagram (horizontal agent flow) */}
                    <div className="mt-4 bg-[#0A0F1A]/80 backdrop-blur-3xl border border-white/10 rounded-xl p-4 overflow-x-auto">
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 mb-3">
                        <QueueListIcon className="w-3.5 h-3.5 text-teal-400" />
                        <span className="tracking-widest uppercase">
                          Agent Pipeline
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-max">
                        {activeScenario.steps.map((step, i) => {
                          const isCompleted = i < completedSteps;
                          const isCurrent = i === currentStepIndex && isRunning;
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <motion.div
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono tracking-wide transition-all duration-300 ${
                                  isCompleted
                                    ? "border-green-500/30 bg-green-500/10 text-green-400"
                                    : isCurrent
                                      ? "border-teal-500/40 bg-teal-500/10 text-teal-300 " +
                                        getAgent(step.agent).glow
                                      : "border-white/5 bg-white/[0.02] text-slate-600"
                                }`}
                                animate={
                                  isCurrent ? { scale: [1, 1.05, 1] } : {}
                                }
                                transition={
                                  isCurrent
                                    ? { duration: 0.8, repeat: Infinity }
                                    : {}
                                }
                              >
                                <span>{getAgent(step.agent).icon}</span>
                                <span className="hidden sm:inline">
                                  {step.action}
                                </span>
                              </motion.div>
                              {i < activeScenario.steps.length - 1 && (
                                <ArrowRightIcon
                                  className={`w-3 h-3 flex-shrink-0 ${
                                    isCompleted
                                      ? "text-green-500/40"
                                      : "text-slate-700"
                                  }`}
                                />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA after completion */}
                {!isRunning &&
                  completedSteps === totalSteps &&
                  totalSteps > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-12 text-center"
                    >
                      <div className="bg-[#0A0F1A]/80 backdrop-blur-3xl border border-teal-500/20 rounded-2xl p-8 max-w-2xl mx-auto shadow-[0_0_40px_rgba(0,229,255,0.1)]">
                        <h3 className="text-2xl font-bold font-heading text-white mb-3">
                          Want This For Your Business?
                        </h3>
                        <p className="text-slate-400 font-mono text-sm mb-6">
                          &gt; Every workflow you just saw — running 24/7, no
                          manual intervention.
                          <br />
                          Custom-built for your specific operations.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                          <Link to="/audit">
                            <Button
                              size="lg"
                              variant="cta"
                              className="flex items-center gap-2"
                            >
                              Get Free Discovery Audit
                              <ArrowRightIcon className="w-5 h-5" />
                            </Button>
                          </Link>
                          <button
                            onClick={resetSimulation}
                            className="text-slate-400 hover:text-white text-sm font-mono flex items-center gap-2 transition-colors"
                          >
                            <ArrowPathIcon className="w-4 h-4" />
                            Run Another Scenario
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
              </Container>
            </motion.section>
          )}
        </AnimatePresence>

        {/* No scenario selected state */}
        {!activeScenario && (
          <section className="pb-20 relative">
            <Container className="relative z-10 text-center">
              <div className="bg-[#0A0F1A]/60 backdrop-blur-3xl border border-white/5 rounded-2xl p-12 max-w-2xl mx-auto">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold font-heading text-white mb-3">
                  Pick a Scenario to Start
                </h3>
                <p className="text-slate-400 font-mono text-sm">
                  &gt; Click any scenario above to watch RizFlow agents handle
                  real business workflows in real-time. Each simulation shows
                  how agents coordinate, communicate, and deliver results —
                  autonomously.
                </p>
                <div className="mt-6 flex items-center justify-center gap-6 text-xs font-mono text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <ClockIcon className="w-3.5 h-3.5 text-teal-500" />
                    <span>Takes ~15 seconds</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ChatBubbleLeftRightIcon className="w-3.5 h-3.5 text-blue-400" />
                    <span>6 specialized agents</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DocumentTextIcon className="w-3.5 h-3.5 text-gold" />
                    <span>Real-time logs</span>
                  </div>
                </div>
              </div>
            </Container>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="pb-20 relative">
          <Container className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <CogIcon className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs text-slate-400 font-mono tracking-wide">
                Simulation only — no real data is processed
              </span>
            </div>
            <div className="max-w-xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-white mb-4">
                See What{" "}
                <span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-amber-300"
                  style={{
                    textShadow:
                      "0 0 30px rgba(0,229,255,0.4), 0 0 60px rgba(245,158,11,0.2)",
                  }}
                >
                  Your Agents
                </span>{" "}
                Could Do
              </h2>
              <p className="text-slate-400 font-mono text-sm mb-8">
                &gt; Every business is different. We build custom agents
                tailored to your exact workflows — intake, fulfilment, billing,
                communications, quality assurance, and more.
              </p>
              <Link to="/audit">
                <Button
                  size="lg"
                  variant="cta"
                  className="flex items-center gap-2 mx-auto"
                >
                  <CalendarIcon className="w-5 h-5" />
                  Get Your Custom Agent Plan
                  <ArrowRightIcon className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Container>
        </section>
      </div>
    </>
  );
}
