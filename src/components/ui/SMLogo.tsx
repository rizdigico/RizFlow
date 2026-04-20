import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SMLogoProps {
  className?: string;
  animated?: boolean;
}

export function SMLogo({ className, animated = true }: SMLogoProps) {
  // A flowy, interconnected 'S' and 'M' abstract design
  return (
    <motion.svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-10 h-10", className)}
      whileHover={animated ? { scale: 1.05, rotate: 2 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <defs>
        <linearGradient id="sm-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" /> {/* Cyan */}
          <stop offset="50%" stopColor="#22D3EE" /> {/* Cyan Light */}
          <stop offset="100%" stopColor="#3B82F6" /> {/* Blue */}
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background soft glow */}
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#sm-gradient)"
        opacity="0.1"
        filter="url(#glow)"
        animate={
          animated
            ? {
                scale: [1, 1.1, 1],
                opacity: [0.1, 0.15, 0.1],
              }
            : {}
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The "S" Path - Flowy wave */}
      <motion.path
        d="M65,30 C65,30 45,20 35,35 C25,50 75,50 65,65 C55,80 35,70 35,70"
        stroke="url(#sm-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={
          animated
            ? { pathLength: 0, opacity: 0 }
            : { pathLength: 1, opacity: 1 }
        }
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      {/* The "M" Path - Intersecting geometry */}
      <motion.path
        d="M20,70 L30,45 L50,60 L70,45 L80,70"
        stroke="white"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={
          animated
            ? { pathLength: 0, opacity: 0 }
            : { pathLength: 1, opacity: 1 }
        }
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
      />

      {/* Interactive floating dot */}
      <motion.circle
        cx="50"
        cy="25"
        r="4"
        fill="#06B6D4"
        initial={animated ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
        animate={
          animated
            ? {
                opacity: 1,
                scale: 1,
                y: [0, -4, 0],
              }
            : {}
        }
        transition={{
          opacity: { delay: 1.5, duration: 0.5 },
          scale: { delay: 1.5, duration: 0.5 },
          y: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 },
        }}
      />
    </motion.svg>
  );
}
