import { useEffect, useRef, useState } from "react";

export function useCountUp(
  target: number,
  duration = 1400,
  decimals = 0,
): {
  value: string;
  done: boolean;
  ref: React.RefObject<HTMLDivElement | null>;
} {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(eased * target);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setCurrent(target);
        setDone(true);
      }
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  const value = done
    ? decimals > 0
      ? target.toFixed(decimals)
      : String(Math.round(target))
    : decimals > 0
      ? current.toFixed(decimals)
      : String(Math.round(current));

  return { value, done, ref };
}
