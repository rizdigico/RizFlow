import type { Transition } from "framer-motion";

export function useMeshPulse() {
  const animate = {
    scale: [1, 1.05, 1],
    opacity: [0.8, 1, 0.8],
    filter: [
      "drop-shadow(0 0 10px rgba(0, 229, 255, 0.4))",
      "drop-shadow(0 0 25px rgba(0, 229, 255, 0.8))",
      "drop-shadow(0 0 10px rgba(0, 229, 255, 0.4))",
    ],
  };

  const transition: Transition = {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut",
  };

  return { animate, transition };
}
