import { useCountUp } from "@/hooks/useCountUp";

interface StatItem {
  value: string;
  label: string;
  animateTo?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

interface StatCardProps {
  stats: StatItem[];
}

function AnimatedStat({ stat }: { stat: StatItem }) {
  const { value, done, ref } = useCountUp(
    stat.animateTo ?? 0,
    1400,
    stat.decimals ?? 0,
  );

  const display = stat.animateTo
    ? `${stat.prefix ?? ""}${value}${stat.suffix ?? ""}`
    : stat.value;

  return (
    <div
      ref={ref}
      className="bg-[#0A0F1A]/80 border border-white/[0.06] rounded-xl p-4 text-center group hover:border-teal-500/30 transition-all duration-300"
    >
      <p className="text-xl sm:text-2xl font-bold font-heading text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.3)] transition-all duration-300 group-hover:drop-shadow-[0_0_12px_rgba(45,212,191,0.5)]">
        {display}
      </p>
      <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">
        {stat.label}
      </p>
    </div>
  );
}

export function StatCard({ stats }: StatCardProps) {
  return (
    <div className="my-8 grid grid-cols-2 sm:grid-cols-4 gap-3 not-prose">
      {stats.map((stat, i) => (
        <AnimatedStat key={i} stat={stat} />
      ))}
    </div>
  );
}
