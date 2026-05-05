interface SectionHeadingProps {
  number: string;
  children: React.ReactNode;
}

export function SectionHeading({ number, children }: SectionHeadingProps) {
  return (
    <div className="flex items-center gap-3 mb-4 mt-12 not-prose">
      <span className="text-teal-400/60 font-mono text-sm font-bold tracking-tight">
        {number}
      </span>
      <span className="text-slate-600 font-mono text-xs">—</span>
      <h2 className="text-2xl font-heading font-bold text-white">{children}</h2>
    </div>
  );
}
