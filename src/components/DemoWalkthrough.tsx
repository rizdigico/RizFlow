import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WALKTHROUGH_KEY = "rizflow_demo_walkthrough_dismissed";

const STEPS = [
  {
    icon: "😫",
    title: "Running a business shouldn't feel like this",
    subtitle: "The stuff that eats your day",
    bullets: [
      "Repeating the same tasks over and over — orders, follow-ups, updates",
      "Things slip through the cracks — missed replies, forgotten reorders",
      "You're the bottleneck — nothing moves until you handle it personally",
      "Hiring help is expensive, training takes months, people leave",
    ],
    color: "text-red-400",
    borderColor: "border-red-500/30",
    dotColor: "bg-red-400",
  },
  {
    icon: "⚡",
    title: "An AI team that never sleeps",
    subtitle: "Works inside the tools you already use",
    bullets: [
      "Handles orders, enquiries, and follow-ups — instantly, 24/7",
      "Tracks stock, reorders supplies, and updates your records — on its own",
      "Posts to your socials, replies to customers, and keeps things moving",
      "Connects to WhatsApp, Gmail, Sheets, Shopify — no new software needed",
    ],
    color: "text-teal-400",
    borderColor: "border-teal-500/30",
    dotColor: "bg-teal-400",
  },
  {
    icon: "🎬",
    title: "See it for yourself",
    subtitle: "Watch a real AI agent handle your type of business",
    bullets: [
      "Pick your industry — or describe YOUR business",
      "Chat with a live AI agent that actually takes action",
      "Watch it send emails, update spreadsheets, place orders — in real time",
      "No setup, no login, no credit card — just see what's possible",
    ],
    color: "text-cyan-400",
    borderColor: "border-cyan-500/30",
    dotColor: "bg-cyan-400",
  },
];

export function DemoWalkthrough({
  onComplete,
  open,
}: {
  onComplete: () => void;
  open?: boolean;
}) {
  const [step, setStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WALKTHROUGH_KEY);
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    if (open) {
      setStep(0);
      setIsVisible(true);
    }
  }, [open]);

  function dismiss() {
    localStorage.setItem(WALKTHROUGH_KEY, "true");
    setIsVisible(false);
    setTimeout(onComplete, 300);
  }

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      dismiss();
    }
  }

  if (!isVisible) return null;

  const current = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 sm:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) dismiss();
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-lg bg-[#0A0F1A] border border-slate-700/60 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.12)]"
        >
          {/* Top accent line */}
          <div className="h-[2px] bg-gradient-to-r from-red-500 via-teal-500 to-cyan-500" />

          <div className="p-8">
            {/* Skip button */}
            <button
              onClick={dismiss}
              className="absolute top-5 right-6 text-slate-500 hover:text-slate-300 transition-colors text-sm"
            >
              Skip
            </button>

            {/* Step content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="text-center mb-6">
                  <span className="text-5xl block mb-4">{current.icon}</span>
                  <h3 className={`text-2xl font-bold ${current.color} mb-1.5`}>
                    {current.title}
                  </h3>
                  <p className="text-sm text-slate-400">{current.subtitle}</p>
                </div>

                <div
                  className={`rounded-xl border ${current.borderColor} bg-white/[0.02] p-5 mb-6`}
                >
                  <ul className="space-y-3">
                    {current.bullets.map((bullet, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 text-[15px] text-slate-300"
                      >
                        {step === 0 ? (
                          <span className="text-red-400 mt-0.5 flex-shrink-0 text-base">
                            ✕
                          </span>
                        ) : step === 1 ? (
                          <span className="text-teal-400 mt-0.5 flex-shrink-0 text-base">
                            ✓
                          </span>
                        ) : (
                          <span className="text-cyan-400 mt-0.5 flex-shrink-0 text-base">
                            →
                          </span>
                        )}
                        {bullet}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap justify-center gap-2 mb-2"
                  >
                    {[
                      "WhatsApp",
                      "Gmail",
                      "Google Sheets",
                      "Shopify",
                      "Instagram",
                      "Slack",
                    ].map((tool, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-md text-xs text-slate-400 bg-slate-800/60 border border-slate-700/40"
                      >
                        {tool}
                      </span>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Progress dots + navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      i === step
                        ? `${current.dotColor} scale-125`
                        : i < step
                          ? "bg-slate-500"
                          : "bg-slate-700"
                    }`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-3">
                {step > 0 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={handleNext}
                  className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    step === STEPS.length - 1
                      ? "bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:shadow-[0_0_25px_rgba(0,229,255,0.5)]"
                      : "bg-slate-700/50 text-slate-200 hover:bg-slate-600/50 border border-slate-600/50"
                  }`}
                >
                  {step === STEPS.length - 1 ? "Start Exploring" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function WalkthroughTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="How does this work?"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-400 hover:text-teal-300 hover:border-teal-500/40 hover:bg-slate-800 backdrop-blur-sm transition-all duration-200 shadow-lg"
    >
      <span className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-xs font-bold leading-none">
        ?
      </span>
      <span className="text-sm font-medium hidden sm:inline">
        How does this work?
      </span>
    </button>
  );
}
