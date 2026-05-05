interface KeyTakeawaysProps {
  items: string[];
}

export function KeyTakeaways({ items }: KeyTakeawaysProps) {
  return (
    <div className="my-8 bg-[#0A0F1A]/60 border border-teal-500/20 rounded-xl p-6 not-prose">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
        <span className="text-xs font-mono text-teal-400 uppercase tracking-widest font-bold">
          Key Takeaways
        </span>
      </div>
      <ol className="space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="text-teal-400 font-mono text-sm font-bold mt-0.5 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-slate-300 text-sm font-sans leading-relaxed">
              {item}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
