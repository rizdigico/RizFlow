/**
 * RizFlow Design System
 *
 * Central token registry for the RizFlow agentic-AI operations platform.
 * Inspired by the flowing organic mesh patterns in the RizFlow logo.
 */

// ---------------------------------------------------------------------------
// Color tokens
// ---------------------------------------------------------------------------

export const COLORS = {
  primary: {
    teal: "#2ECC71",
    "teal-light": "#4ED989",
    "teal-dark": "#25A35A",
  },
  secondary: {
    navy: "#1A2B4C",
    "navy-light": "#243660",
  },
  accents: {
    gold: "#F1C40F",
  },
} as const;

export type PrimaryColor = keyof typeof COLORS.primary;
export type SecondaryColor = keyof typeof COLORS.secondary;
export type AccentColor = keyof typeof COLORS.accents;

// ---------------------------------------------------------------------------
// Animation configuration (Framer Motion compatible)
// ---------------------------------------------------------------------------

export const ANIMATION_CONFIG = {
  spring: {
    type: "spring" as const,
    stiffness: 100,
    damping: 15,
    mass: 1,
  },
  ease: "easeInOut" as const,
} as const;

// ---------------------------------------------------------------------------
// SVG mesh pattern configuration
// ---------------------------------------------------------------------------

export const MESH_PATTERN = {
  strokeColor: "#2ECC71",
  strokeWidth: 1.5,
  opacity: 0.2,
  gridSize: 20,
} as const;

export type MeshPatternConfig = typeof MESH_PATTERN;
