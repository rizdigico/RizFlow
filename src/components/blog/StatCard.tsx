interface StatCardProps {
  stats: { value: string; label: string }[];
}

export function StatCard({ stats }: StatCardProps) {
  return (
    <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-3 not-prose">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-[#0A0F1A]/80 border border-white/[0.06] rounded-xl p-4 text-center"
        >
          <p className="text-xl sm:text-2xl font-bold font-heading text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]">
            {stat.value}
          </p>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
