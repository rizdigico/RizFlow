import { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion';

const stats = [
  { id: 1, name: 'Projects Delivered', value: 150, suffix: '+' },
  { id: 2, name: 'Client Retention', value: 98, suffix: '%' },
  { id: 3, name: 'Design Awards', value: 12, suffix: '' },
  { id: 4, name: 'Global Clients', value: 45, suffix: '+' },
];

function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 50,
    stiffness: 100,
  });

  useEffect(() => {
    if (inView) {
      motionValue.set(value);
    }
  }, [inView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat('en-US').format(Math.floor(latest));
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

export function Stats() {
  return (
    <section className="py-24 relative overflow-hidden bg-black border-y border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(79,70,229,0.05)_0%,transparent_50%)]" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">
                <AnimatedNumber value={stat.value} />
                {stat.suffix}
              </div>
              <div className="text-sm md:text-base text-gray-400 font-medium tracking-wide uppercase">
                {stat.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
