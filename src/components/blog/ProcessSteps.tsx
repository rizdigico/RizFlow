interface ProcessStepsProps {
  steps: { title: string; desc: string }[];
}

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="my-8 border-l border-teal-500/30 pl-6 space-y-6 not-prose">
      {steps.map((step, i) => (
        <div key={i}>
          <div className="flex items-center gap-3 mb-1">
            <span className="text-xs font-mono text-teal-400 font-bold">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="text-white font-heading font-bold text-base">
              {step.title}
            </h3>
          </div>
          <p className="text-slate-300 text-sm font-sans leading-relaxed pl-8">
            {step.desc}
          </p>
        </div>
      ))}
    </div>
  );
}
