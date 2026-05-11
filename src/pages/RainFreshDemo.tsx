import { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { SITE_URL } from "@/lib/constants";
import { Container } from "@/components/layout/Container";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { ActionTimeline } from "@/components/ActionTimeline";
import {
  rainfreshScenarios,
  rainfreshTools,
  rainfreshMetrics,
} from "@/data/rainfresh-demo";
import type { ActionStep } from "@/data/demo-industries";
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  ChatBubbleLeftRightIcon,
  BoltIcon,
} from "@heroicons/react/24/outline";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// ── Types ──
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

// ── Animated Counter ──
function AnimatedCounter({
  target,
  suffix = "",
  prefix = "",
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const duration = 1600;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target]);

  return (
    <span>
      {prefix}
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Chat Component ──
function RainFreshChat({
  scenario,
  onMessageCount,
}: {
  scenario: (typeof rainfreshScenarios)[number] | null;
  onMessageCount: (n: number) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scenario) {
      setMessages([]);
      onMessageCount(0);
      return;
    }

    const systemMsg: ChatMessage = {
      role: "system",
      content: scenario.systemPrompt,
      timestamp: Date.now(),
    };
    const userMsg: ChatMessage = {
      role: "user",
      content: scenario.userMessage,
      timestamp: Date.now(),
    };

    setMessages([systemMsg, userMsg]);
    onMessageCount(1);
    setError(null);
    setInput("");
    sendToAI([systemMsg, userMsg], scenario.systemPrompt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendToAPI(msgs: ChatMessage[], systemPrompt: string) {
    const apiMessages = msgs
      .filter((m) => m.role !== "system")
      .map((m) => ({ role: m.role, content: m.content }));

    const response = await fetch("/api/demo/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "system", content: systemPrompt }, ...apiMessages],
        industry: "ecommerce",
      }),
    });

    if (!response.ok) {
      const errData = await response
        .json()
        .catch(() => ({ error: "Request failed" }));
      throw new Error(errData.error || `Error ${response.status}`);
    }

    return response.json();
  }

  async function sendToAI(
    currentMessages: ChatMessage[],
    systemPrompt: string,
  ) {
    setIsLoading(true);
    setError(null);
    try {
      const result = await sendToAPI(currentMessages, systemPrompt);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      onMessageCount(messages.length + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(errorMessage);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMessage}`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSend() {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !scenario) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    onMessageCount(messages.length + 2);
    sendToAI(newMessages, scenario.systemPrompt);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50 bg-[#0A0F1A]">
        <div className="flex items-center gap-2">
          <img
            src="/rainfresh-logo-sm.png"
            alt="RainFreshSG Agent"
            className="w-7 h-7 rounded-full shadow-[0_0_10px_rgba(45,212,191,0.4)] object-cover"
          />
          <div>
            <p className="text-xs font-semibold text-white">rainfresh-agent</p>
            <p className="text-[10px] text-slate-500">rainfresh-sg</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-emerald-400 font-mono">Live</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {visibleMessages.length === 0 && !scenario && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <ChatBubbleLeftRightIcon className="w-10 h-10 opacity-30" />
            <p className="text-sm">
              Pick a scenario to see the agent in action
            </p>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {visibleMessages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-teal-500/20 text-teal-100 border border-teal-500/30"
                    : msg.content.startsWith("⚠️")
                      ? "bg-red-500/10 text-red-300 border border-red-500/30"
                      : "bg-[#0F1A2E] text-slate-200 border border-slate-700/50"
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {msg.role === "assistant" &&
                    !msg.content.startsWith("⚠️") && (
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
                    )}
                  {msg.content}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-slate-400 text-sm"
          >
            <div className="flex gap-1">
              <span
                className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-teal-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <span>Agent is thinking...</span>
          </motion.div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700/50 p-3 bg-[#0A0F1A]">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              scenario
                ? "Type a follow-up message..."
                : "Pick a scenario to start..."
            }
            disabled={!scenario || isLoading}
            rows={1}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 resize-none disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading || !scenario}
            className="p-2.5 rounded-xl bg-teal-500/20 text-teal-400 hover:bg-teal-500/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-600 mt-1.5 text-center">
          Live demo — RainFreshSG agent processes messages in real-time
        </p>
      </div>
    </div>
  );
}

// ── Metric Card with Scroll Animation ──
function MetricCard({ metric }: { metric: (typeof rainfreshMetrics)[number] }) {
  const { ref, isVisible } = useScrollAnimation();
  const showNumber = metric.changeNum > 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="text-center p-3 rounded-lg bg-white/[0.03] border border-slate-700/30 hover:border-teal-500/30 transition-colors duration-300"
    >
      <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider mb-1">
        {metric.label}
      </p>
      <p className="text-xl font-bold text-teal-400 font-mono drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]">
        {isVisible && showNumber ? (
          <>
            {metric.prefix}
            <AnimatedCounter target={metric.changeNum} suffix={metric.suffix} />
          </>
        ) : (
          metric.change
        )}
      </p>
      <p className="text-[9px] text-slate-600 mt-0.5">
        {metric.before} → {metric.after}
      </p>
    </motion.div>
  );
}

// ── Main Page ──
export function RainFreshDemo() {
  const [selectedScenario, setSelectedScenario] = useState<
    (typeof rainfreshScenarios)[number] | null
  >(null);
  const [messageCount, setMessageCount] = useState(0);

  return (
    <>
      <Helmet>
        <title>RainFreshSG Agent System — See RizFlow AI in Action</title>
        <meta
          name="description"
          content="Watch how RizFlow's AI agents automate RainFreshSG's TikTok Shop orders, inventory alerts, social media, and customer inquiries — live agent system demo."
        />
        <link rel="canonical" href={`${SITE_URL}/case-studies`} />
        <meta property="og:url" content={`${SITE_URL}/case-studies`} />
      </Helmet>

      <section className="relative bg-navy-dark min-h-screen pt-16 md:pt-20">
        {/* Background effects */}
        <motion.div className="absolute inset-0 z-0 opacity-30 mix-blend-screen pointer-events-none">
          <FlowingMesh opacity={0.5} parallax={false} />
        </motion.div>
        <div className="absolute inset-0 z-0 bg-[url('/grid.svg')] bg-[length:32px_32px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0)_80%)] opacity-10 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-teal/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 lg:py-12">
          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 text-sm text-teal-400 hover:text-teal-300 transition-colors mb-4"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Case Studies
            </Link>

            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🌿</span>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold font-heading text-white">
                  RainFreshSG{" "}
                  <span className="text-teal-400">Agent System</span>
                </h1>
                <p className="text-sm text-slate-400">
                  See how RizFlow agents automate orders, inventory, social &
                  inquiries for this Singapore home fragrance brand
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="px-2.5 py-1 rounded-full bg-teal/10 border border-teal/20 text-[10px] text-teal-400 font-mono uppercase tracking-wider">
                Home & Lifestyle
              </span>
              <span className="px-2.5 py-1 rounded-full bg-cyan/10 border border-cyan/20 text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                TikTok Shop
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald/10 border border-emerald/20 text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                Verified Results
              </span>
            </div>
          </motion.div>

          {/* ── Main Grid ── */}
          <div className="grid lg:grid-cols-12 gap-6">
            {/* Left sidebar */}
            <div className="lg:col-span-4 space-y-4">
              {/* Scenarios */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 p-4"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <BoltIcon className="w-3.5 h-3.5 text-teal-400" />
                  Choose a Workflow
                </h3>
                <div className="space-y-2">
                  {rainfreshScenarios.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedScenario(s)}
                      className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${
                        selectedScenario?.id === s.id
                          ? "bg-teal-500/10 border-teal-500/40 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
                          : "bg-white/[0.02] border-slate-700/30 hover:border-teal-500/20 hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{s.icon}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {s.label}
                          </p>
                          <p className="text-[10px] text-slate-500 truncate">
                            {s.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Connected Tools */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 p-4"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <svg
                    className="w-3.5 h-3.5 text-cyan-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  Connected Tools
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {rainfreshTools.map((tool) => (
                    <div
                      key={tool.name}
                      className="p-2 rounded-lg bg-white/[0.03] border border-slate-700/30 text-center"
                    >
                      <span className="text-lg block">{tool.icon}</span>
                      <p className="text-[10px] font-medium text-white mt-0.5">
                        {tool.name}
                      </p>
                      <p className="text-[8px] text-slate-500 leading-tight">
                        {tool.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Mini metrics */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
                className="rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 p-4"
              >
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Your Session
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-teal-400 font-mono">
                      {messageCount}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Messages handled
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-teal-400 font-mono">
                      ~{messageCount * 2}min
                    </p>
                    <p className="text-[10px] text-slate-500">Time saved</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Chat + Actions */}
            <div className="lg:col-span-8 flex flex-col min-h-0 gap-3">
              {/* Chat card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex-1 rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 shadow-[0_0_30px_rgba(0,229,255,0.06)] overflow-hidden min-h-[400px]"
              >
                <RainFreshChat
                  scenario={selectedScenario}
                  onMessageCount={setMessageCount}
                />
              </motion.div>

              {/* Action Timeline */}
              <AnimatePresence>
                {selectedScenario && selectedScenario.actions.length > 0 && (
                  <motion.div
                    key={selectedScenario.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                    className="rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 p-3"
                  >
                    <ActionTimeline
                      actions={selectedScenario.actions}
                      triggerKey={selectedScenario.id}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Metrics Banner ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="mt-10 rounded-xl border border-teal-500/20 bg-[#0A0F1A] shadow-[0_0_40px_rgba(0,229,255,0.08)] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/30 to-transparent" />

            <div className="relative z-10 p-6">
              <h2 className="text-lg font-bold font-heading text-white mb-4 flex items-center gap-2">
                <span>📊</span> RainFreshSG Results
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {rainfreshMetrics.map((m) => (
                  <MetricCard key={m.label} metric={m} />
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-8 rounded-xl border border-teal-500/30 bg-[#0A0F1A] p-8 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.08)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)] bg-[size:10px_10px]" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-teal-400/40 to-transparent" />

            <div className="relative z-10">
              <span className="text-4xl block mb-4">🚀</span>
              <h2 className="text-2xl font-bold font-heading text-white mb-2">
                Want this for your business?
              </h2>
              <p className="text-slate-400 mb-6 max-w-md mx-auto">
                RainFreshSG went from 2-3 hours/day on manual ops to fully
                automated TikTok Shop orders, Alibaba restocking, and social
                scheduling. See what RizFlow can do for you.
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  to="/audit"
                  className="group relative px-6 py-3 rounded-lg text-white font-medium transition-all overflow-hidden shadow-[0_0_25px_rgba(45,212,191,0.3)] hover:shadow-[0_0_40px_rgba(45,212,191,0.6)]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal via-teal-light to-teal bg-[length:200%_auto] animate-gradient-x" />
                  <span className="relative flex items-center gap-2 font-bold">
                    Get Your Free Audit
                    <ArrowRightIcon className="w-4 h-4" />
                  </span>
                </Link>
                <Link
                  to="/demo"
                  className="px-6 py-3 bg-white/5 backdrop-blur-md rounded-lg text-slate-300 font-medium transition-all border border-white/10 hover:bg-white/10 hover:border-white/20"
                >
                  Try General Demo
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
