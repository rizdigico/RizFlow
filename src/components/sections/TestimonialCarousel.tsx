import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cn } from "@/lib/utils";

const caseStudies = [
  {
    title: "Scaling Business X: From Manual to Autonomous Operations",
    before: [
      "Disconnected workflows, manual coordination",
      "Manual data entry, high operational costs",
      "Inconsistent customer communication",
    ],
    after: [
      "60% reduction in manual tasks",
      "5× increase in customer capacity",
      "Streamlined autonomous processes",
    ],
    cta: "Read More",
  },
  {
    title: "Optimising Client Y: Achieving Hyper-Personalised Outreach",
    before: [
      "Generic campaigns, low engagement",
      "Manual lead scoring, scattered analytics",
      "Slow response time to inbound leads",
    ],
    after: [
      "40% increase in conversion rate",
      "Real-time performance tracking",
      "AI-driven engagement at scale",
    ],
    cta: "Read More",
  },
];

export function TestimonialCarousel() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="relative section-padding overflow-hidden bg-black border-y border-white/5">
      {/* Teal organic blob decorations */}
      <motion.div
        className="absolute -top-20 -left-20 w-64 h-64"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <BlobDecoration className="text-teal opacity-20" />
      </motion.div>
      <motion.div
        className="absolute top-10 left-40 w-32 h-32 rotate-45"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <BlobDecoration className="text-teal opacity-15" />
      </motion.div>
      <motion.div
        className="absolute -bottom-16 -right-16 w-72 h-72 rotate-12"
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      >
        <BlobDecoration className="text-teal opacity-20" />
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-48 w-40 h-40 -rotate-30"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        <BlobDecoration className="text-teal opacity-15" />
      </motion.div>

      <div className="container-width relative z-10">
        <div
          ref={ref}
          className={cn(
            "text-center mb-14 transition-all duration-700",
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <h2 className="text-4xl md:text-5xl font-bold font-heading text-white mb-4">
            Success Stories
          </h2>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Witness how agentic AI transforms businesses. Our partners' growth
            journeys, visualized.
          </p>
        </div>

        <motion.div
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
                delayChildren: 0.05,
              },
            },
          }}
        >
          {caseStudies.map((study, i) => (
            <motion.div
              key={i}
              className="bg-navy-900/50 backdrop-blur-md rounded-2xl border border-white/5 p-8 shadow-soft hover:shadow-lg hover:border-teal-500/30 transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              <motion.h3
                className="text-xl font-bold font-heading text-white mb-6 hover:text-teal transition-colors duration-300"
                whileHover={{ x: 4 }}
              >
                {study.title}
              </motion.h3>
              <div className="grid md:grid-cols-[1fr_80px_1fr] gap-4 items-center">
                {/* Before */}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                    Before
                  </p>
                  <ul className="space-y-2">
                    {study.before.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-slate-400"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow path */}
                <div className="flex items-center justify-center">
                  <FlowArrow />
                </div>

                {/* After */}
                <div>
                  <p className="text-xs font-semibold text-teal uppercase tracking-widest mb-3">
                    After
                  </p>
                  <ul className="space-y-2">
                    {study.after.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2.5 text-sm text-white font-medium"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-teal mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <button className="inline-flex items-center gap-1.5 text-teal text-sm font-semibold hover:gap-2.5 transition-all duration-200">
                  {study.cta}
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlowArrow() {
  return (
    <motion.svg
      viewBox="0 0 60 80"
      className="w-14 h-20"
      fill="none"
      aria-hidden="true"
      initial={{ opacity: 0.6 }}
      whileHover={{ opacity: 1 }}
    >
      <motion.path
        d="M30,5 C10,25 50,40 30,60 L30,75"
        stroke="#4FA0B4"
        strokeWidth="2"
        strokeDasharray="4 3"
        strokeLinecap="round"
        animate={{ strokeOpacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <path
        d="M22,68 L30,78 L38,68"
        stroke="#4FA0B4"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <motion.circle
        cx="30"
        cy="5"
        r="4"
        fill="#4FA0B4"
        opacity="0.3"
        animate={{ r: [4, 6, 4] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <circle cx="30" cy="5" r="2" fill="#4FA0B4" />
    </motion.svg>
  );
}

function BlobDecoration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("fill-current", className)}
      aria-hidden="true"
    >
      <path
        d="M42.7,-62.9C50.9,-50.4,50.1,-32.3,53.8,-16.1C57.5,0.1,65.7,14.4,64.3,28.2C62.9,42,51.8,55.3,38.1,63.5C24.4,71.7,8.1,74.8,-8.4,73.1C-24.9,71.4,-41.6,64.9,-54.4,53.6C-67.2,42.3,-76.1,26.2,-76.9,9.9C-77.7,-6.4,-70.4,-22.9,-61.3,-36.8C-52.2,-50.7,-41.3,-62,-28.4,-73.1C-15.5,-84.2,-0.6,-95.1,12.9,-92.9C26.4,-90.7,34.5,-75.4,42.7,-62.9Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}
