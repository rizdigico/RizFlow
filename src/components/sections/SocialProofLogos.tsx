import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const tools = [
  { name: "Slack", url: "https://slack.com" },
  { name: "HubSpot", url: "https://www.hubspot.com" },
  { name: "Asana", url: "https://asana.com" },
  { name: "Xero", url: "https://www.xero.com" },
  { name: "Notion", url: "https://www.notion.so" },
  { name: "Zapier", url: "https://zapier.com" },
  { name: "Monday.com", url: "https://monday.com" },
  { name: "Stripe", url: "https://stripe.com" },
];

export function SocialProofLogos() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="integrations"
      className="py-12 bg-black border-y border-white/5 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05),transparent_50%)]" />
      <div className="container-width relative z-10">
        <p className="text-center text-xs text-slate-500 font-medium uppercase tracking-widest mb-8">
          Integrates with tools your business already uses
        </p>
        <div
          ref={ref}
          className={cn(
            "flex flex-wrap items-center justify-center gap-8 md:gap-12 transition-all duration-700",
            isVisible ? "opacity-100" : "opacity-0",
          )}
        >
          {tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center h-9 opacity-40 hover:opacity-100 transition-all duration-300 cursor-pointer"
            >
              <span className="text-sm font-bold text-slate-400 group-hover:text-white font-heading transition-colors">
                {tool.name}
              </span>
            </a>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500 font-mono tracking-wider mt-8">
          +50 more
        </p>
      </div>
    </section>
  );
}
