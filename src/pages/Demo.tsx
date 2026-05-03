import { useState, useRef, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { FlowingMesh } from "@/components/animations/FlowingMesh";
import { ActionTimeline } from "@/components/ActionTimeline";
import { SITE_URL, SEO_DEFAULTS } from "@/lib/constants";
import {
  INDUSTRIES,
  type Industry,
  type IndustryScenario,
} from "@/data/demo-industries";
import {
  ArrowRightIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  ClockIcon,
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

// ── Types ──
interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

interface SessionStats {
  messagesHandled: number;
  estimatedTimeSaved: number; // minutes
  industry: string;
}

// ── Demo Analytics ──
function trackDemoEvent(event: string, data?: Record<string, unknown>) {
  try {
    const stored = JSON.parse(
      localStorage.getItem("rizflow_demo_analytics") || "{}",
    );
    const events = stored.events || [];
    events.push({ event, data, timestamp: Date.now() });
    // Keep last 100 events
    if (events.length > 100) events.splice(0, events.length - 100);
    stored.events = events;
    localStorage.setItem("rizflow_demo_analytics", JSON.stringify(stored));
  } catch {
    // localStorage unavailable, silently skip
  }
}

function getDemoAnalytics() {
  try {
    return JSON.parse(localStorage.getItem("rizflow_demo_analytics") || "{}");
  } catch {
    return {};
  }
}

// ── Animated Counter ──
function AnimatedCounter({
  target,
  duration = 1200,
  suffix = "",
}: {
  target: number;
  duration?: number;
  suffix?: string;
}) {
  const [value, setValue] = useState(0);
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current) return;
    ref.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4); // easeOutQuart
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return (
    <span>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}

// ── Chat Component ──
function LiveChat({
  industry,
  scenario,
  onStatsUpdate,
}: {
  industry: Industry;
  scenario: IndustryScenario | null;
  onStatsUpdate: (stats: SessionStats) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messageCount, setMessageCount] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // When scenario changes, reset chat and start with the scenario's first message
  useEffect(() => {
    if (!scenario) {
      setMessages([]);
      setMessageCount(0);
      return;
    }

    const systemMsg: ChatMessage = {
      role: "system",
      content: industry.systemPrompt,
      timestamp: Date.now(),
    };
    const userMsg: ChatMessage = {
      role: "user",
      content: scenario.firstMessage,
      timestamp: Date.now(),
    };

    setMessages([systemMsg, userMsg]);
    setMessageCount(1);
    setError(null);
    setInput("");

    // Auto-send to get AI response
    sendToAI([systemMsg, userMsg], industry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenario?.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendToAPI(
    msgs: ChatMessage[],
    ind: Industry,
  ): Promise<{ reply: string; model: string }> {
    const apiMessages = msgs
      .filter((m) => m.role !== "system")
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    const response = await fetch("/api/demo/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: ind.systemPrompt },
          ...apiMessages,
        ],
        industry: ind.id,
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

  async function sendToAI(currentMessages: ChatMessage[], ind: Industry) {
    setIsLoading(true);
    setError(null);

    try {
      const result = await sendToAPI(currentMessages, ind);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: result.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setMessageCount((prev) => prev + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setError(errorMessage);
      // Show error as assistant message so user sees it in context
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
    if (!trimmed || isLoading) return;

    const userMsg: ChatMessage = {
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setMessageCount((prev) => prev + 1);

    sendToAI(newMessages, industry);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleRetry() {
    // Re-send the last user message
    const lastUserIdx = messages.findLastIndex((m) => m.role === "user");
    if (lastUserIdx === -1) return;
    const msgsUpToLast = messages.slice(0, lastUserIdx + 1);
    setMessages(msgsUpToLast);
    sendToAI(msgsUpToLast, industry);
  }

  // Update parent stats whenever message count changes
  useEffect(() => {
    const timeSaved = Math.round(messageCount * 2.5); // ~2.5 min saved per message
    onStatsUpdate({
      messagesHandled: messageCount,
      estimatedTimeSaved: timeSaved,
      industry: industry.id,
    });
  }, [messageCount, industry.id, onStatsUpdate]);

  const visibleMessages = messages.filter((m) => m.role !== "system");

  return (
    <div className="flex flex-col h-full">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {visibleMessages.length === 0 && !scenario && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
            <ChatBubbleLeftRightIcon className="w-12 h-12 opacity-30" />
            <p className="text-sm">
              Select a scenario above or type your own message below
            </p>
            <p className="text-xs text-slate-500">
              This is a live AI agent — your messages are processed in real-time
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
                {msg.content.startsWith("⚠️") ? (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="whitespace-pre-wrap">
                    {msg.role === "assistant" && (
                      <span className="inline-block w-2 h-2 rounded-full bg-teal-400 mr-2 animate-pulse" />
                    )}
                    {msg.content}
                  </div>
                )}
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

      {/* Input area */}
      <div className="border-t border-slate-700/50 p-3 bg-[#0A0F1A]">
        {error && !messages.some((m) => m.content.startsWith("⚠️")) && (
          <div className="flex items-center gap-2 mb-2 text-xs text-red-400">
            <ExclamationTriangleIcon className="w-3.5 h-3.5" />
            <span>{error}</span>
            <button
              onClick={handleRetry}
              className="ml-auto text-teal-400 hover:text-teal-300 underline"
            >
              Retry
            </button>
          </div>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              scenario
                ? "Type a follow-up message..."
                : "Describe a situation for your business..."
            }
            rows={2}
            className="flex-1 bg-[#050A14] border border-slate-700/50 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 resize-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="flex-shrink-0 h-11 w-11 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-white flex items-center justify-center hover:from-teal-400 hover:to-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
          >
            <PaperAirplaneIcon className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-1.5 text-center">
          Live AI demo powered by RizFlow • Responses are generated in real-time
        </p>
      </div>
    </div>
  );
}

// ── Main Demo Page ──
export function Demo() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(
    null,
  );
  const [selectedScenario, setSelectedScenario] =
    useState<IndustryScenario | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    messagesHandled: 0,
    estimatedTimeSaved: 0,
    industry: "",
  });
  const [phase, setPhase] = useState<"select" | "demo">("select");

  // Track industry selection for analytics
  const handleIndustrySelect = useCallback((industry: Industry) => {
    setSelectedIndustry(industry);
    setSelectedScenario(null);
    setPhase("demo");
    setSessionStats({
      messagesHandled: 0,
      estimatedTimeSaved: 0,
      industry: industry.id,
    });
    trackDemoEvent("industry_selected", { industry: industry.id });
  }, []);

  const handleScenarioSelect = useCallback(
    (scenario: IndustryScenario) => {
      setSelectedScenario(scenario);
      trackDemoEvent("scenario_selected", {
        industry: selectedIndustry?.id,
        scenario: scenario.id,
      });
    },
    [selectedIndustry],
  );

  const handleBack = useCallback(() => {
    if (selectedScenario) {
      setSelectedScenario(null);
    } else {
      setSelectedIndustry(null);
      setPhase("select");
    }
  }, [selectedScenario]);

  return (
    <>
      <Helmet>
        <title>
          Live AI Demo — See RizFlow Agents in Action | {SEO_DEFAULTS.title}
        </title>
        <meta
          name="description"
          content="Interact with live AI agents built for your industry. See how RizFlow automates reservations, orders, leads, and more — in real-time."
        />
        <meta property="og:title" content="Live AI Demo — RizFlow" />
        <meta
          property="og:description"
          content="Choose your industry and chat with a real AI agent. No simulation — real responses, real automation."
        />
        <meta property="og:url" content={`${SITE_URL}/demo`} />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="relative min-h-screen bg-[#050A14] text-white overflow-hidden">
        <FlowingMesh />

        {/* ── Industry Selection Phase ── */}
        <AnimatePresence mode="wait">
          {phase === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero */}
              <section className="pt-28 pb-12">
                <Container>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center max-w-3xl mx-auto"
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-400 text-sm font-medium mb-6">
                      <BoltIcon className="w-4 h-4" />
                      Live AI Demo — No Simulation
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-teal-100 to-cyan-200 bg-clip-text text-transparent leading-tight">
                      See It Work For Your Industry
                    </h1>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-4">
                      Choose your industry and interact with a{" "}
                      <strong className="text-teal-300">real AI agent</strong> —
                      not a scripted simulation. Type your own messages and
                      watch it respond live.
                    </p>
                    <p className="text-sm text-slate-500">
                      Powered by RizFlow • Free to try • No signup required
                    </p>
                  </motion.div>
                </Container>
              </section>

              {/* Industry Cards */}
              <section className="pb-16">
                <Container>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                    {INDUSTRIES.map((industry, idx) => (
                      <motion.button
                        key={industry.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.08 }}
                        onClick={() => handleIndustrySelect(industry)}
                        className={`group relative p-6 rounded-2xl border ${industry.borderColor} ${industry.bgColor} hover:border-opacity-60 transition-all duration-300 text-left hover:shadow-[0_0_30px_rgba(0,229,255,0.1)]`}
                      >
                        <div className="text-3xl mb-3">{industry.icon}</div>
                        <h3
                          className={`text-lg font-semibold ${industry.color} mb-1`}
                        >
                          {industry.name}
                        </h3>
                        <p className="text-sm text-slate-400 mb-3">
                          {industry.tagline}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-teal-400 group-hover:text-teal-300 transition-colors">
                          <span>Try it live</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </motion.button>
                    ))}
                  </div>

                  {/* Trust metrics */}
                  <div className="mt-12 text-center">
                    <div className="inline-flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-1.5">
                        <CheckCircleIcon className="w-4 h-4 text-emerald-400" />
                        Real AI responses
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BoltIcon className="w-4 h-4 text-teal-400" />
                        ~3s response time
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ChatBubbleLeftRightIcon className="w-4 h-4 text-cyan-400" />
                        5 industries
                      </span>
                    </div>
                  </div>
                </Container>
              </section>
            </motion.div>
          )}

          {/* ── Demo Chat Phase ── */}
          {phase === "demo" && selectedIndustry && (
            <motion.div
              key="demo"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-screen flex flex-col pt-16 md:pt-20"
            >
              {/* Top Bar */}
              <div className="sticky top-16 md:top-20 z-30 bg-[#0A0F1A]/95 backdrop-blur-sm border-b border-slate-800/50">
                <Container>
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleBack}
                        className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                          />
                        </svg>
                        Back
                      </button>
                      <div className="h-4 w-px bg-slate-700" />
                      <span className="text-xl">{selectedIndustry.icon}</span>
                      <div>
                        <h2
                          className={`text-sm font-semibold ${selectedIndustry.color}`}
                        >
                          {selectedIndustry.name}
                        </h2>
                        <p className="text-xs text-slate-500">
                          {selectedIndustry.tagline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs text-emerald-400 font-medium">
                          Live
                        </span>
                      </div>
                    </div>
                  </div>
                </Container>
              </div>

              {/* Content — fills remaining viewport, no page-level scroll */}
              <div className="flex-1 overflow-hidden">
                <Container className="h-full">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full py-4">
                    {/* Left sidebar: Scenarios + Metrics */}
                    <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-1">
                      {/* Industry Description */}
                      <div
                        className={`rounded-xl border ${selectedIndustry.borderColor} ${selectedIndustry.bgColor} p-4`}
                      >
                        <p className="text-sm text-slate-300 leading-relaxed">
                          {selectedIndustry.description}
                        </p>
                      </div>

                      {/* Scenarios */}
                      <div className="space-y-2">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider px-1">
                          Try a scenario
                        </h3>
                        {selectedIndustry.scenarios.map((scenario) => (
                          <button
                            key={scenario.id}
                            onClick={() => handleScenarioSelect(scenario)}
                            className={`w-full text-left p-3 rounded-xl border transition-all duration-200 ${
                              selectedScenario?.id === scenario.id
                                ? `${selectedIndustry.borderColor} ${selectedIndustry.bgColor} ${selectedIndustry.color}`
                                : "border-slate-700/50 bg-[#0A0F1A] hover:border-slate-600"
                            }`}
                          >
                            <div className="text-sm font-medium text-white">
                              {scenario.title}
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">
                              {scenario.description}
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Or type your own */}
                      <div className="p-3 rounded-xl border border-dashed border-slate-600 text-center">
                        <p className="text-xs text-slate-400">
                          Or type your own message in the chat →
                        </p>
                      </div>

                      {/* Session Metrics */}
                      <div className="grid grid-cols-2 gap-2">
                        {selectedIndustry.metrics.map((metric) => (
                          <div
                            key={metric.label}
                            className="rounded-xl border border-slate-700/50 bg-[#0A0F1A] p-3"
                          >
                            <div className="text-lg">{metric.icon}</div>
                            <div className="text-lg font-bold text-white mt-1">
                              {metric.value}
                            </div>
                            <div className="text-[10px] text-slate-400 leading-tight">
                              {metric.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Your session stats */}
                      {sessionStats.messagesHandled > 0 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-4"
                        >
                          <h4 className="text-xs font-medium text-teal-400 uppercase tracking-wider mb-2">
                            Your session
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xl font-bold text-white">
                                <AnimatedCounter
                                  target={sessionStats.messagesHandled}
                                />
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Messages handled
                              </div>
                            </div>
                            <div>
                              <div className="text-xl font-bold text-white">
                                ~
                                <AnimatedCounter
                                  target={sessionStats.estimatedTimeSaved}
                                  suffix="min"
                                />
                              </div>
                              <div className="text-[10px] text-slate-400">
                                Time saved
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* CTA in sidebar */}
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center space-y-3"
                      >
                        <p className="text-slate-400 text-xs">
                          This is what RizFlow can do for{" "}
                          <strong className="text-white">
                            {selectedIndustry.name}
                          </strong>{" "}
                          businesses.
                        </p>
                        <Link to="/audit" className="block">
                          <Button variant="cta" size="sm" className="w-full">
                            Get Your Free Audit
                            <ArrowRightIcon className="w-4 h-4" />
                          </Button>
                        </Link>
                        <button
                          onClick={() => {
                            setSelectedIndustry(null);
                            setSelectedScenario(null);
                            setPhase("select");
                          }}
                          className="text-xs text-slate-400 hover:text-teal-300 transition-colors flex items-center gap-1 mx-auto"
                        >
                          <ArrowPathIcon className="w-3.5 h-3.5" />
                          Try another industry
                        </button>
                      </motion.div>
                    </div>

                    {/* Right: Chat Area */}
                    <div className="lg:col-span-8 flex flex-col min-h-0">
                      <div className="flex-1 rounded-2xl border border-slate-700/50 bg-[#0A0F1A] overflow-hidden shadow-[0_0_30px_rgba(0,229,255,0.05)] flex flex-col min-h-0">
                        {/* Chat header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-[#0D1525]">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500/80" />
                              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                              <div className="w-3 h-3 rounded-full bg-green-500/80" />
                            </div>
                            <span className="text-xs text-slate-400 ml-2 font-mono">
                              rizflow-agent —{" "}
                              {selectedIndustry.name
                                .toLowerCase()
                                .replace(/[^a-z]/g, "-")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-slate-500">
                            <ClockIcon className="w-3.5 h-3.5" />
                            <span>Real-time AI</span>
                          </div>
                        </div>

                        {/* Chat body */}
                        <LiveChat
                          industry={selectedIndustry}
                          scenario={selectedScenario}
                          onStatsUpdate={setSessionStats}
                        />
                      </div>

                      {/* Action Timeline — shows automated actions after AI response */}
                      {selectedScenario?.actions &&
                        selectedScenario.actions.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.3 }}
                            className="mt-3 rounded-xl border border-slate-700/40 bg-[#0A0F1A]/80 p-3"
                          >
                            <ActionTimeline
                              actions={selectedScenario.actions}
                              triggerKey={selectedScenario.id}
                            />
                          </motion.div>
                        )}
                    </div>
                  </div>
                </Container>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
