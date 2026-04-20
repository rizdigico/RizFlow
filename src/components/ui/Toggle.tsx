import { Switch } from "@headlessui/react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
  label?: string;
}

export function Toggle({ enabled, onChange, label }: ToggleProps) {
  return (
    <Switch.Group as="div" className="flex items-center gap-3">
      <Switch
        checked={enabled}
        onChange={onChange}
        className={cn(
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2",
          enabled ? "bg-teal" : "bg-slate-200",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200",
            enabled ? "translate-x-6" : "translate-x-1",
          )}
        />
      </Switch>
      {label && (
        <Switch.Label className="text-sm font-medium text-slate-700 cursor-pointer">
          {label}
        </Switch.Label>
      )}
    </Switch.Group>
  );
}
