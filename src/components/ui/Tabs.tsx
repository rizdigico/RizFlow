import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  label: string;
  content: ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  className?: string;
}

export function Tabs({ tabs, className }: TabsProps) {
  const [active, setActive] = useState(0);
  return (
    <div className={className}>
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl w-fit">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              active === i
                ? "bg-white text-navy shadow-soft"
                : "text-slate-500 hover:text-navy",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="mt-6">{tabs[active].content}</div>
    </div>
  );
}
