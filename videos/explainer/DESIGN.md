# Design System

## Overview

RizFlow is a dark-mode SaaS platform targeting business owners and SMEs. The visual identity is obsidian-dark with electric teal/cyan accents — a "neural network at work" aesthetic. Layout uses glass-panel cards on deep navy backgrounds with subtle grid/mesh overlays. Typography is clean Inter for body, bold Montserrat for headings. The overall feel is technical authority made approachable — cyberpunk HUD meets business dashboard.

## Colors

- **Primary Surface**: `#0A0F1A` — Deep obsidian black, fills entire background
- **Surface Elevated**: `#111827` — Slightly lighter navy for glass panels
- **Surface Border**: `#1D293D` — Panel borders, card edges
- **Primary Accent**: `#06B6D4` — Electric teal, primary interactive color, glows, active states
- **Accent Light**: `#22D3EE` — Lighter cyan for hover states, secondary highlights
- **Accent Blue**: `#3B82F6` — Blue for gradient endpoints, secondary accent
- **Accent Gold**: `#F59E0B` — Warm gold for highlights, premium indicators
- **Primary Text**: `#FFFFFF` — White for headings and primary content
- **Secondary Text**: `#94A3B8` — Slate for body copy, labels, descriptions
- **Tertiary Text**: `#64748B` — Muted slate for disabled/tertiary text
- **Success**: `#10B981` — Emerald for "Live" badges, positive indicators
- **Error/Alert**: `#FA2C36` — Red for warnings, critical states

## Typography

- **Heading Font**: Montserrat (500, 600, 700, 800). Bold, geometric, commanding. Used for all h1-h4, section titles, agent names. Tracking tight, often uppercase for labels.
- **Body Font**: Inter (300-700). Clean, highly legible sans-serif. Used for descriptions, body copy, mono labels. Weight 400 for body, 600 for labels, 700 for stats.
- **Mono**: Inter with `font-mono` class. Used for stats, data readouts, badges, terminal-style labels. Tracking wider (tracking-wider, tracking-widest).
- **Heading Scale**: h1 = 72px (hero), h2 = 48px (sections), h3 = 30px (step titles), h4 = 20px (agent names)
- **Body Scale**: 16-18px for descriptions, 11-14px for labels and badges

## Elevation

- **Glass panels**: `bg-obsidian-light/50 backdrop-blur-md border border-white/5 rounded-2xl` — translucent dark panels with subtle blur and barely-visible borders
- **Glow effects**: `shadow-[0_0_30px_rgba(0,229,255,0.1)]` and `shadow-[0_0_15px_rgba(0,229,255,0.05)]` — teal/cyan glow around active cards
- **Grid overlays**: `bg-[linear-gradient(rgba(0,229,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,229,255,0.03)_1px,transparent_1px)]` — subtle cyan grid on card backgrounds
- **Radial glows**: `bg-[radial-gradient(circle_at_bottom_left,rgba(45,212,191,0.05),transparent_40%)]` — soft teal radial gradients on sections
- **Mesh overlays**: SVG wave patterns with `#4FA0B4` strokes at varying opacities — organic flow lines behind hero
- **Scan lines**: Vertical and horizontal scanline animations (`scanline`, `scanline-vertical`) — HUD-style scanning effects
- **Particle dots**: Small `1px` teal dots with `float` animation — ambient neural network feel

## Components

- **Interactive Stepper**: 3-step navigation (Discover → Build & Deploy → Scale) with active step glow, arrows, dot indicators
- **Audit Card**: Dark panel with progress bars, animated percentages, scanline overlay, "Analysis" footer with live badge
- **Deploy Card**: Dark panel with 2x3 grid of tool integrations (Slack, HubSpot, Asana, Telegram, Notion, Gmail), each with Live status badge
- **Grow Card**: Dark panel with animated counter metrics (Operating Costs 60%, Weekly Hours 20+, Revenue Growth 40%), progress bars with slide animations
- **Agent Network Graph**: SVG with animated circles (agent nodes) connected by curved paths with traveling particle dots
- **Step Icons**: Heroicon outlines in teal — MagnifyingGlass, CpuChip, RocketLaunch
- **Status Badges**: Small emerald dots with "Live" text, pulsing indicators
- **Neural Mesh SVG**: Multi-path SVG with gradient strokes, glow filters, and animated motion dots traveling along paths

## Do's and Don'ts

### Do's

- Use thin borders at white/5-10 opacity to define panels — never solid borders
- Use teal/cyan glow (`shadow-glow`, `shadow-glow-cyan`) for active, important, or interactive elements
- Use dark obsidian backgrounds with teal grid overlays for depth
- Keep imagery technical but approachable — HUD elements, data readouts, status badges
- Use `font-mono` for all data, stats, and technical labels
- Animate numbers counting up — never show final values immediately
- Use subtle floating animations (±4-6px y-axis sine) on ambient elements

### Don'ts

- Do not use bright solid backgrounds — stay in the obsidian/dark navy range
- Do not use standard drop shadows — use teal/cyan glow effects instead
- Do not use sharp, jarring transitions — all motion should be fluid (cubic-bezier easing)
- Do not show raw data without animation — everything should feel "live" and "processing"
- Do not use light/white backgrounds for content panels
- Do not use generic stock imagery — use UI mockups, data visualizations, and HUD elements
- Do not exceed 3 accent colors per scene — teal primary, blue secondary, gold sparingly
