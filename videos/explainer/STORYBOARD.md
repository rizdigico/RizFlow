# Storyboard — RizFlow Explainer

**Format:** 1920x1080
**Audio:** Kokoro TTS voiceover + underscore SFX
**VO direction:** Male, late 20s-early 30s, calm confident, conversational — like a founder explaining their product to a peer over coffee. Not announcer-y. Economy of words. Pauses are features.
**Style basis:** DESIGN.md — obsidian dark, teal/cyan glow, glass panels, HUD elements, neural mesh

---

## Global Direction

- Push teal/cyan presence. Every beat has at least one glow element pulling the eye.
- Motion is visible and intentional. Err toward more movement. Subtle reads as static at 30fps.
- Use captured assets generously — the neural mesh SVG, agent network graph, RizFlow logo.
- Aim for 8-10 visual elements per beat: background texture, midground content, foreground accents, floating decorative elements, animated icons, typographic details.
- Mix 2-3 techniques per beat from techniques.md — don't default to basic fade/scale.
- Underscore: Minimal electronic. Warm sustained pad under everything. Never competes with VO. Gentle swell during impact metrics, drops to near-nothing for the problem statement, resolves on final chord.

---

## Asset Audit

| Asset                     | Type                   | Assign to Beat | Role                                                 |
| ------------------------- | ---------------------- | -------------- | ---------------------------------------------------- |
| og-image.png              | Hero image             | Beat 1         | Background reference for obsidian mood               |
| svgs/overflow-visible.svg | SVG — neural mesh      | Beat 3, Beat 4 | Animated neural connections with traveling particles |
| svgs/top-0.svg            | SVG — wave lines       | Beat 1, Beat 5 | Decorative flow lines behind content                 |
| svgs/bg-navy.svg          | SVG — RizFlow logo     | Beat 5         | Brand mark closer                                    |
| svgs/animate-pulse.svg    | SVG — pulse icon       | Beat 2, Beat 3 | Live status indicators                               |
| svgs/filter.svg           | SVG — checkmark circle | Beat 2         | Audit checkmark                                      |
| svgs/w-12.svg (multiple)  | SVG — agent icons      | Beat 3         | Agent node icons                                     |
| favicon.svg               | Logo                   | Beat 5         | Favicon in CTA                                       |

---

## BEAT 1 — THE PROBLEM (0:00–0:10)

**VO:** "You didn't start your business to do admin. But every week, hours disappear into invoicing, scheduling, client follow-ups, and paperwork. Sound familiar?"

**Concept:** We open inside a business owner's overwhelm. The screen is obsidian-dark. Task labels cascade in from different angles — "INVOICING", "SCHEDULING", "CLIENT FOLLOW-UPS", "PAPERWORK" — each one stacking, overlapping, creating visual noise. It feels claustrophobic. Then a brief pause as a single question hangs.

**Visual:** Dark obsidian background with subtle cyan grid overlay. Task labels (white text, font-mono, small-caps, tracking-widest) fly in from edges with staggered timing. Each label has a thin teal progress bar that fills quickly. A Canvas 2D particle field drifts in the background — tiny teal dots connecting with faint lines. After the cascade, everything briefly dims as "Sound familiar?" appears.

**Mood:** Claustrophobic urgency. Like opening 15 browser tabs at once. The visual noise represents the mental load of manual operations.

**Assets:**

- Background: Obsidian fill `#0A0F1A` with CSS grid overlay (cyan lines at 3% opacity)
- Midground: Task labels as kinetic typography — per-word staggered entrance
- Foreground: Canvas 2D particle connections (neural network feel, but dim — the network isn't formed yet)

**Animation choreography:**

- "INVOICING" — SLAMS from left at -5° rotation
- "SCHEDULING" — DROPS from top
- "CLIENT FOLLOW-UPS" — CASCADE in per-word
- "PAPERWORK" — SLIDES from right
- Each task bar FILLS rapidly (0.3s, power2.in)
- "Sound familiar?" — types on slowly (0.05s per character), then pauses
- Canvas particles: dim connections, no bright nodes (the system isn't online yet)

**Transition OUT:** Blur through — `blur:20px, 0.3s power3.in`

**Depth layers:**

- BG: Obsidian fill + cyan grid overlay + radial teal glow bottom-left
- MG: Task labels with teal progress bars
- FG: Floating teal particle dots (dim, sparse)

**SFX:** Soft mechanical clicks as each task label lands. A low drone that builds. On "Sound familiar?" — brief silence, then a single clean chime.

---

## BEAT 2 — DISCOVER (0:10–0:22)

**VO:** "RizFlow maps your workflows, finds exactly where time and money leak, and builds custom AI agents that handle all of it — automatically."

**Transition IN:** Blur through — `scale:0.75→1, blur:20px→0, 0.5s expo.out`

**Concept:** The chaos resolves into clarity. An audit card materializes — the same style from the website but animated. Progress bars fill one by one. "14 hrs/wk saved" badge pulses. The message: we've found the problems, and we have the numbers.

**Visual:** Obsidian background with the cyan grid now brighter. The audit card slides up from below, glass-panel style with backdrop blur. Inside: 5 workflow rows animate in staggered — "Customer Intake 60%", "Workflow Tracking 40%", "Invoicing 75%", "Communications 30%", "Social Media 55%". Each bar FILLS with teal-to-cyan gradient. The "14 hrs/wk saved" badge at bottom pulses with emerald glow. An SVG checkmark circle draws itself (path drawing technique).

**Mood:** Relief. The fog lifts. Numbers appear and they tell a clear story. Technical but accessible — like a doctor showing you your test results.

**Assets:**

- Background: Obsidian fill + brighter cyan grid overlay
- Card: Glass panel with `backdrop-blur-md`, thin `border-white/5`, `shadow-glow-cyan`
- SVG path drawing: Checkmark circle from `svgs/filter.svg`
- Pulse icon from `svgs/animate-pulse.svg`

**Animation choreography:**

- Card SLIDES up from y:80 with blur clearing
- Each workflow row CASCADES in (0.2s stagger)
- Progress bars FILL from 0 to target percentage (0.8s each, ease: power2.out)
- Checkmark circle DRAWS via stroke-dashoffset animation
- "14 hrs/wk saved" badge PULSE-glow (box-shadow animation)
- Counter numbers COUNT UP from 0

**Transition OUT:** Velocity-matched upward — `y:-150, blur:30px, 0.33s power2.in`

**Depth layers:**

- BG: Obsidian fill + cyan grid at 5% + radial teal glow center
- MG: Audit card with workflow bars and progress percentages
- FG: Floating checkmark SVG path drawing, emerald pulse badge

**SFX:** Each progress bar fill — soft ascending tone. On "14 hrs/wk saved" — a warm confirmation chime. Low sustained pad continues.

---

## BEAT 3 — BUILD & DEPLOY (0:22–0:38)

**VO:** "Your agents plug into Slack, HubSpot, Telegram, Notion, and fifty more tools you already use. No rip-and-replace. Live in two to four weeks."

**Transition IN:** Velocity-matched downward — `y:150→0, blur:30px→0, 1.0s power2.out`

**Concept:** The neural network comes alive. Agent nodes (circles with icons) connect to tool logos (Slack, HubSpot, Telegram, Notion, Gmail) via animated paths. Traveling particles flow along the paths. The message: we plug into what you already use, your entire stack lights up green.

**Visual:** The captured neural mesh SVG (`svgs/overflow-visible.svg`) becomes the centerpiece — but fully animated. Agent circles on the left glow teal. Tool logos on the right appear with "Live" badges. Curved SVG paths draw between them. Bright cyan particles travel along each path. The mesh network pulses with life. "No rip-and-replace" appears as kinetic typography below.

**Mood:** Energy, connection, activation. The network is online. Everything lights up simultaneously. Technical but alive.

**Assets:**

- Background: Obsidian fill + cyan grid
- Center: Neural mesh SVG with animated paths and traveling particles (from `svgs/overflow-visible.svg`)
- Left nodes: Agent circles (📋 Admin, 📊 Projects, 💳 Finance, 📩 Comms) — from `svgs/w-12.svg` icons
- Right nodes: Tool logos — Slack, HubSpot, Telegram, Notion, Gmail
- "Live" badges: Emerald pulse from `svgs/animate-pulse.svg`

**Animation choreography:**

- Network SVG paths DRAW themselves via stroke-dashoffset (0.7s each, staggered 0.15s)
- Particles TRAVEL along paths using MotionPathPlugin
- Agent circles SCALE in from 0.3 with elastic ease (staggered 0.1s)
- Tool logos FADE + SLIDE from right (staggered 0.1s)
- Each "Live" badge POPS in after its tool logo appears
- "No rip-and-replace" — per-word kinetic typography

**Transition OUT:** Whip pan left — `x:-400, blur:24px, opacity:0.4, 0.3s power3.in`

**Depth layers:**

- BG: Obsidian fill + dim cyan grid + radial glow center
- MG: Neural mesh network with animated connections
- FG: Floating tool logos with "Live" badges

**SFX:** Path drawing — soft electrical hum per connection. Each "Live" badge — crisp activation click. Building energy. Sustained pad swells.

---

## BEAT 4 — SCALE / IMPACT (0:38–0:50)

**VO:** "Then it just runs. Admin, comms, billing, scheduling — twenty-four seven. You cut operating costs by up to sixty percent. You reclaim twenty plus hours every week. And you check everything from your phone in under thirty minutes."

**Transition IN:** Whip pan right — `x:400→0, blur:24px→0, 0.3s power3.out`

**Concept:** Impact metrics dominate. Three large animated counters take center stage: "60%", "20+ hrs", "40%" with progress bars that fill slowly. This is the payoff — the numbers that business owners care about. Clean, confident, data-driven.

**Visual:** Obsidian background. Three metric cards stack vertically (or in a 1x3 grid on wide format). Each has a large animated counter, a label below, and a gradient progress bar. The bars FILL slowly (2.5s cubic-bezier easing). Canvas 2D particles are now bright and connected — the neural network is fully alive. Subtle glow pulses behind each metric.

**Mood:** Confidence, proof, results. The numbers speak. Calm authority. This is the "show me the money" moment.

**Assets:**

- Background: Obsidian fill + bright cyan grid + canvas particle network (fully connected)
- Metric cards: Glass panels with backdrop blur, teal/green gradients
- Counters: Large bold Montserrat numbers, counting up from 0

**Animation choreography:**

- Three metric cards CASCADE in from below (0.3s stagger)
- Counter numbers COUNT UP from 0 to target (2s ease-out-quart)
- Progress bars FILL slowly (2.5s cubic-bezier(0.16, 1, 0.3, 1))
- Canvas 2D: Bright particle network, nodes connected with pulsing lines
- Each metric has a subtle FLOAT animation (y: ±4px, sine.inOut, yoyo)
- "Scale your business. Not your workload." — types on at the end

**Transition OUT:** Zoom through — `scale:1→1.2, blur:20px, 0.4s power3.in`

**Depth layers:**

- BG: Obsidian + bright grid + Canvas 2D neural network (fully formed, bright)
- MG: Three metric cards with counters and progress bars
- FG: Floating particle dots (bright, active)

**SFX:** Counter activation — ascending tone sequence. Progress bar fills — low warm hum. Final "Scale your business" — bass drop.

---

## BEAT 5 — CTA (0:50–0:60)

**VO:** "Scale your business. Not your workload. Get your free discovery audit at rizflow dot co."

**Transition IN:** Cinematic Zoom — shader transition (0.6s, power2.inOut)

**Concept:** Clean, confident close. RizFlow logo center. Tagline. URL. Everything else fades away. The neural network pulses once in the background as a final heartbeat. Professional and memorable.

**Visual:** Clean obsidian background. RizFlow logo (the SVG mark from `svgs/bg-navy.svg`) centered, large, with teal glow. Below: "Scale your business. Not your workload." in white Montserrat. Below that: "rizflow.co" in bright teal, large, with subtle glow pulse. The neural mesh SVG animates faintly behind everything — one final pulse of life.

**Mood:** Confidence, clarity, action. The close of a good pitch. You know what this is, you know what it does, you know where to go.

**Assets:**

- Background: Obsidian fill + very dim radial teal glow center
- Center: RizFlow logo SVG (`svgs/bg-navy.svg`) — large, centered
- Below: Tagline + URL
- Behind: Faint neural mesh animation

**Animation choreography:**

- Logo FADES in with scale 0.9→1, opacity 0→1 (0.5s, power2.out)
- Neural mesh lines DRAW briefly, then settle to dim
- Tagline — per-word kinetic typography (slide + fade, 0.3s stagger)
- URL — types on character by character (0.03s per char)
- URL has subtle glow pulse (box-shadow animation, 3s cycle)
- One final particle burst from center outward

**Transition:** None — final beat holds for 2s after VO ends.

**Depth layers:**

- BG: Obsidian fill + dim radial glow
- MG: RizFlow logo with glow
- FG: Tagline + URL

**SFX:** Logo reveal — warm swell chord. Tagline — clean type-on clicks. URL — single confirmation tone. Final pad resolves and fades.

---

## Production Architecture

```
videos/explainer/
├── index.html                    root — VO + SFX + beat orchestration
├── DESIGN.md                     brand reference
├── SCRIPT.md                     narration text
├── STORYBOARD.md                 THIS FILE
├── transcript.json               word-level timestamps (from Step 5)
├── narration.wav                 TTS audio (from Step 5)
├── capture/                      captured website data
│   ├── screenshots/
│   ├── assets/
│   │   ├── svgs/
│   │   ├── fonts/
│   │   ├── lottie/
│   │   └── videos/
│   ├── extracted/
│   │   ├── tokens.json
│   │   ├── visible-text.txt
│   │   ├── asset-descriptions.md
│   │   ├── animations.json
│   │   └── assets-catalog.json
│   ├── AGENTS.md
│   └── CLAUDE.md
└── compositions/
    ├── beat-1-problem.html
    ├── beat-2-discover.html
    ├── beat-3-deploy.html
    ├── beat-4-scale.html
    └── beat-5-cta.html
```
