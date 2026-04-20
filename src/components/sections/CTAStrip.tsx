import { ArrowRightIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CTAStripProps {
  variant?: "navy" | "teal";
}

export function CTAStrip({ variant = "navy" }: CTAStripProps) {
  return (
    <section className="py-20 relative overflow-hidden bg-black border-t border-white/10">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="container-width relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 text-center lg:text-left">
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white leading-tight">
              Stop Trading Time for Money.
              <br />
              <span className="text-gradient">
                Start Running Your Business From Your Phone.
              </span>
            </h2>
            <p className="mt-4 text-lg max-w-xl text-blue-200/60">
              Book your free 30-minute Discovery Audit. We'll map your
              workflows, recommend the right custom AI agents, and show you
              exactly how many hours you can reclaim.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 flex-shrink-0">
            <Link to="/audit">
              <Button
                size="lg"
                variant="cta"
                className="group w-full sm:w-auto sm:min-w-56"
              >
                <CalendarDaysIcon className="w-5 h-5 mr-2" />
                Get Free Discovery Audit
                <ArrowRightIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <p className="text-sm text-blue-200/40 flex items-center gap-1.5">
              <span>✓</span> No commitment required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
