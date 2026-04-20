import { Fragment, type ReactNode } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

interface DropdownItem {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
}

interface DropdownProps {
  trigger: string | ReactNode;
  items: DropdownItem[];
  className?: string;
}

export function Dropdown({ trigger, items, className }: DropdownProps) {
  return (
    <Menu as="div" className={cn("relative inline-block", className)}>
      <Menu.Button className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-navy hover:text-teal transition-colors rounded-lg hover:bg-slate-50">
        {trigger}
        <ChevronDownIcon className="w-4 h-4" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-lg border border-slate-100 focus:outline-none z-10">
          <div className="p-1">
            {items.map((item, i) => (
              <Menu.Item key={i}>
                {({ active }) => (
                  <button
                    onClick={item.onClick}
                    className={cn(
                      "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm",
                      active ? "bg-teal/5 text-teal" : "text-slate-700",
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
