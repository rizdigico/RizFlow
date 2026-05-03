import { Link } from "react-router-dom";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface FounderProfileProps {
  compact?: boolean;
}

export function FounderProfile({ compact = false }: FounderProfileProps) {
  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row items-center justify-between",
        compact ? "gap-6" : "gap-10 lg:gap-24",
      )}
    >
      {/* Founder photo with scanning ring/glow */}
      <div className="relative flex-shrink-0">
        <div
          className="absolute inset-0 rounded-2xl border border-teal-500/30 animate-spin"
          style={{ animationDuration: "10s" }}
        />
        <div
          className="absolute inset-2 rounded-2xl border border-cyan-500/20 animate-spin"
          style={{ animationDuration: "15s", animationDirection: "reverse" }}
        />
        <div className="w-56 h-72 sm:w-64 sm:h-80 rounded-2xl bg-[#0A0F1A] overflow-hidden border-2 border-teal-500/50 shadow-[0_0_30px_rgba(0,229,255,0.2)] relative z-10">
          <img
            src="/founder.jpg"
            alt="Aariz Arfan, Founder of RizFlow"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-teal-500/10 to-transparent pointer-events-none" />
        </div>
      </div>

      <div className="flex-1 text-center lg:text-left w-full">
        {/* Terminal tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#050A14] border border-teal-500/30 rounded-md mb-4 shadow-[0_0_15px_rgba(0,229,255,0.05)]">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span className="font-mono text-xs font-semibold text-teal-400 uppercase tracking-widest">
            System Admin Online
          </span>
        </div>

        <h3
          className={cn(
            "font-bold font-heading text-white mb-2 tracking-wide drop-shadow-md",
            compact ? "text-2xl" : "text-3xl",
          )}
        >
          Aariz Arfan
        </h3>

        <p className="font-mono text-cyan-400 text-sm uppercase tracking-widest mb-5 opacity-90">
          [ Founder, RizFlow ]
        </p>

        <div className="space-y-5 text-slate-300 leading-[1.8] tracking-wide text-[15px] md:text-base w-full mb-8">
          <p>
            A 17‑year‑old Nanyang Polytechnic Business Management student who
            has spent over 2 years working, experimenting, learning & building
            with AI.
          </p>
          <p>
            That lived experience inspired me to build RizFlow, an Agentic-AI
            powered operations partner that deploys specialized agents to handle
            the mundane, rule‑based work so business owners can reclaim their
            focus, scale their services, and avoid burnout—all while I continue
            my studies and build the business side‑by‑side with my learning.
          </p>
        </div>

        {!compact && (
          <blockquote className="bg-[#050A14]/80 backdrop-blur-sm border-l-2 border-teal-500/50 p-5 text-slate-400 text-[15px] md:text-base leading-[1.8] tracking-wide w-full mb-10 relative group shadow-[0_0_20px_rgba(0,229,255,0.03)]">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-teal-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="font-mono text-teal-500/50 text-xl absolute -top-4 -left-2 bg-[#0A0F1A] px-1">
              "
            </span>
            I'm building RizFlow while studying — because I believe the future
            of business is human creativity powered by AI agents. A business
            owner with the right AI agents can run their entire operation from
            their phone.
          </blockquote>
        )}

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <a
            href="https://www.linkedin.com/in/aariz-arfan/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              size="sm"
              className="font-mono uppercase tracking-widest border-teal-500/30 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-400 transition-all shadow-[0_0_10px_rgba(0,229,255,0.05)]"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
              LinkedIn
            </Button>
          </a>
          <Link to="/audit">
            <Button
              variant="cta"
              size="sm"
              className="font-mono uppercase tracking-widest flex items-center gap-2"
            >
              <CalendarDaysIcon className="w-4 h-4" />
              Book Free Discovery Audit
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
