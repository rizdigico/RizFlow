import { useEffect, useRef, useState } from "react";

export function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const resetKey = useRef(0);

  const reset = () => {
    resetKey.current += 1;
    setIsVisible(false);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    setIsVisible(false);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, resetKey.current]);

  return { ref, isVisible, reset };
}
