import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ActionStep } from "@/data/demo-industries";

interface ActionTimelineProps {
  actions: ActionStep[];
  triggerKey: string; // changes to restart animation (e.g., scenario id or message count)
}

export function ActionTimeline({ actions, triggerKey }: ActionTimelineProps) {
  const [visibleSteps, setVisibleSteps] = useState<string[]>([]);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    // Reset on trigger change
    setVisibleSteps([]);
    setCompletedSteps([]);

    if (!actions.length) return;

    // Stagger the appearance of each step
    const showTimers: ReturnType<typeof setTimeout>[] = [];
    const completeTimers: ReturnType<typeof setTimeout>[] = [];

    actions.forEach((action, idx) => {
      // Show the step after its delayMs
      const showTimer = setTimeout(() => {
        setVisibleSteps((prev) => [...prev, action.id]);
      }, action.delayMs);
      showTimers.push(showTimer);

      // Mark as completed 600ms after showing (simulates tool execution)
      const completeTimer = setTimeout(() => {
        setCompletedSteps((prev) => [...prev, action.id]);
      }, action.delayMs + 600);
      completeTimers.push(completeTimer);
    });

    return () => {
      showTimers.forEach(clearTimeout);
      completeTimers.forEach(clearTimeout);
    };
  }, [triggerKey, actions]);

  if (!actions.length) return null;

  return (
    <div className="mt-3 space-y-0">
      <div className="flex items-center gap-1.5 mb-2">
        <svg
          className="w-3.5 h-3.5 text-teal-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="text-[11px] font-medium text-teal-400 uppercase tracking-wider">
          Automated Actions
        </span>
      </div>

      <AnimatePresence>
        {actions.map((action) => {
          const isVisible = visibleSteps.includes(action.id);
          const isCompleted = completedSteps.includes(action.id);

          if (!isVisible) return null;

          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -8, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="flex items-start gap-2 py-1.5 group"
            >
              {/* Status indicator */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="w-4 h-4 rounded-full bg-teal-500/20 border border-teal-500/60 flex items-center justify-center"
                  >
                    <svg
                      className="w-2.5 h-2.5 text-teal-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-teal-400/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                  </div>
                )}
              </div>

              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs">{action.icon}</span>
                  <span className="text-xs font-medium text-slate-200 truncate">
                    {action.label}
                  </span>
                  {isCompleted && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-[10px] text-teal-500 font-mono"
                    >
                      via {action.tool}
                    </motion.span>
                  )}
                </div>
                {/* Detail on hover or always visible when completed */}
                <AnimatePresence>
                  {isCompleted && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="text-[10px] text-slate-500 mt-0.5 leading-snug"
                    >
                      {action.detail}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
