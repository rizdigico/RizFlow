import { useEffect, useRef, useState, useCallback } from "react";

export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementRef = useRef<HTMLDivElement | null>(null);
  const resetKeyRef = useRef(0);

  const reset = useCallback(() => {
    resetKeyRef.current += 1;
    setIsVisible(false);
    // Re-observe the element after a reset
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
    // Defer re-observation to ensure DOM is settled
    requestAnimationFrame(() => {
      const el = elementRef.current;
      if (!el || !el.isConnected) return;
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
      observerRef.current = observer;
    });
  }, [threshold]);

  // Callback ref: creates/destroys observer as element changes
  const callbackRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Disconnect old observer
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }
      elementRef.current = node;
      if (!node) return;

      // Use rAF to ensure element is rendered and positioned
      requestAnimationFrame(() => {
        if (!node.isConnected) return;
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
        observer.observe(node);
        observerRef.current = observer;
      });
    },
    [threshold],
  );

  return { ref: callbackRef, isVisible, reset };
}
