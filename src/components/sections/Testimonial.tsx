import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ANIMATION_VARIANTS } from "@/lib/animation-config";
import { StarIcon } from "@heroicons/react/24/solid";

function AnimatedCounter({
  target,
  suffix = "",
  duration = 1800,
}: {
  target: number;
  suffix?: string;
  duration?: number;
}) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(target * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [started, target, duration]);

  return (
    <span
      className="scroll-trigger"
      ref={(el) => {
        if (el && !started) {
          const obs = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setStarted(true);
                obs.disconnect();
              }
            },
            { threshold: 0.3 },
          );
          obs.observe(el);
        }
      }}
    >
      {value}
      {suffix}
    </span>
  );
}

export function Testimonial() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-teal-500/5 blur-[150px] rounded-full" />
      </div>

      <div className="container-width relative z-10">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={ANIMATION_VARIANTS.staggerContainer}
        >
          {/* Stars */}
          <motion.div
            className="flex items-center justify-center gap-1 mb-6"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-gold" />
            ))}
          </motion.div>

          {/* Quote */}
          <motion.blockquote
            className="text-xl sm:text-2xl lg:text-3xl font-heading text-white leading-relaxed mb-8"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            &ldquo;Before RizFlow, I was spending 3-4 hours a day just on TikTok
            Shop orders and inventory. Now my agents handle all of it
            automatically — orders, restocking, social posts, customer messages.
            I just check my phone in the morning and everything&rsquo;s
            done.&rdquo;
          </motion.blockquote>

          {/* Attribution */}
          <motion.div
            className="flex items-center justify-center gap-4"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            <img
              src="/rainfresh-logo-sm.png"
              alt="RainFreshSG"
              className="w-12 h-12 rounded-full object-cover shadow-[0_0_15px_rgba(45,212,191,0.4)] border border-teal-500/30"
            />
            <div className="text-left">
              <div className="flex items-center gap-2">
                <p className="text-white font-semibold font-heading">
                  RainFreshSG
                </p>
                <a
                  href="https://www.instagram.com/rainfreshsg/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/5 hover:bg-gradient-to-br hover:from-purple-500/20 hover:via-pink-500/20 hover:to-orange-500/20 hover:border-pink-400/30 border border-white/10 transition-all duration-300"
                  aria-label="RainFreshSG Instagram"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="w-3.5 h-3.5 text-slate-400"
                    fill="currentColor"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </a>
              </div>
              <p className="text-slate-400 text-sm font-mono">
                Singapore Home Fragrance Brand
              </p>
            </div>
          </motion.div>

          {/* Results strip — animated counters, stretched wider */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 mt-10 pt-8 border-t border-white/10"
            variants={ANIMATION_VARIANTS.fadeIn}
          >
            {[
              { target: 4, suffix: " hrs/day", label: "Time Saved" },
              { target: 90, suffix: "%", label: "Automation" },
              { target: 2, suffix: " weeks", label: "To Deploy" },
              { target: 3, suffix: "+", label: "Channels Automated" },
            ].map((stat) => (
              <div key={stat.label} className="text-center min-w-[110px]">
                <p className="text-2xl sm:text-3xl font-bold text-teal-400 font-heading drop-shadow-[0_0_10px_rgba(45,212,191,0.4)]">
                  <AnimatedCounter target={stat.target} suffix={stat.suffix} />
                </p>
                <p className="text-xs text-slate-400 font-mono uppercase tracking-widest mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Case study link */}
          <motion.div className="mt-8" variants={ANIMATION_VARIANTS.fadeIn}>
            <a
              href="/case-study/rainfresh-sg"
              className="text-teal-400 hover:text-teal-300 font-mono text-sm underline underline-offset-4 transition-colors"
            >
              Read the full case study →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
