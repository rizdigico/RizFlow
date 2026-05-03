import { motion } from "framer-motion";

interface SuggestedPromptsProps {
  prompts: string[];
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

export function SuggestedPrompts({
  prompts,
  onSelect,
  disabled = false,
}: SuggestedPromptsProps) {
  if (!prompts.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="flex flex-wrap gap-1.5 mt-2"
    >
      {prompts.map((prompt, i) => (
        <motion.button
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 + i * 0.08 }}
          onClick={() => onSelect(prompt)}
          disabled={disabled}
          className="px-2.5 py-1.5 rounded-lg text-[11px] text-slate-400 bg-slate-800/50 border border-slate-700/40 hover:border-teal-500/40 hover:text-teal-300 hover:bg-teal-500/5 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {prompt}
        </motion.button>
      ))}
    </motion.div>
  );
}
