# MIDAS: Frontend Architecture & UI/UX Standard
**Document Version:** 1.0 (The Golden Standard)
**Project Context:** Midas is an autonomous AI feature-agent built for the Audiera Participation Economy on the BNB Chain. 
**Design Philosophy:** "The Golden Standard." Institutional-grade obsidian canvas with striking, kinetic gold accents. The product feels like a high-end financial engine—measured, self-assured, and relentlessly focused on revenue generation. Every surface either earns its light or stays dark. We use ambient gold glows, crisp 1px borders, and live data feeds to prove the agent's value visually.

---

## 0. PROJECT STRUCTURE

Midas/
├── MIDAS.md                  # This file — project-wide AI/design directives
├── frontend/                 # Next.js 16 app (React 19, Tailwind v4)
│   ├── AGENTS.md             # Next 16 API discipline
│   ├── app/                  # Next.js App Router
│   │   ├── layout.tsx        # Root layout (fonts, dark class on <html>)
│   │   ├── page.tsx          # Single-page sprint (Hero, Engine, Proof, Stack)
│   │   ├── globals.css       # Tailwind v4 theme, obsidian + gold tokens
│   │   └── favicon.ico
│   ├── components/
│   │   ├── ui/               # Atoms — buttons, glow primitives, tx-hashes
│   │   ├── blocks/           # Molecules — bento grids, the 4-step pipeline, live stats
│   │   └── layout/           # Organisms — navbar, footer
│   ├── lib/                  # Utilities, constants, web3 helpers
│   ├── public/               # Static assets
│   │   └── brand/            # BNB Chain, Audiera logos
│   ├── package.json
│   └── tailwind.config.ts    # Custom color and animation tokens

---

## 1. DESIGN PROCEDURES (MANDATORY)

### Procedure 1: The Midas Touch (Progressive Illumination)
Elevation is communicated through **ambient gold glow**, not drop shadow. 
* Sit on an obsidian canvas (`#0A0A0A`) or an elevated surface (`#111113`).
* Separation via **1px borders**: `border-white/10` default → `border-white/20` on hover → `border-amber-500/50` when active.
* Use `<GlowCard>` for all data containers. The mouse-tracked spotlight effect should reveal a faint, metallic gold highlight ring.

### Procedure 2: Proof-of-Work Art Direction
No generic illustrations. The product's actual output is the hero image.
* Use real (or highly accurate mock) JSON output to show the `openclaw.json` config.
* Use **BscScan Transaction Hashes** as visual elements. A scrolling ticker of 50/50 revenue splits proves the agent works.
* The "4-Step Pipeline" (Extract, Synthesize, Elevate, Enrich) should be a visual, connected node graph, not just text.

### Procedure 3: 8-Point Spatial Grid (Mathematical Rhythm)
Every margin, padding, line-height, and gap MUST be a multiple of **8** (or **4** for micro-adjustments).
* **Macro (Sections):** `py-24`, `py-32`
* **Micro (Cards/Inputs):** `p-6`, `p-8`, `gap-4`
* Enforce the Tailwind scale strictly. No arbitrary pixel values.

### Procedure 4: Physical Motion (Framer Springs)
All motion uses Framer Motion (`motion/react`) with spring physics. No CSS `ease-in-out` for interactive states.
* **Default spring:** `type: "spring", stiffness: 400, damping: 30`
* **Hover states:** `whileHover={{ scale: 0.98 }}` to depress buttons into the page.
* **Scroll entry:** `whileInView={{ ... }}` with `viewport={{ once: true, margin: "-15%" }}`.

### Procedure 5: Geometry Rules (Intentional Edges)
* **CTAs & Badges:** `rounded-full` (Pills signal a primary action or status).
* **Bento Cards & Containers:** `rounded-2xl` max.
* **Code Blocks & Terminal Panels:** `rounded-none`. Hard edges signal raw machine output.

---

## 2. DESIGN TOKENS

### A. Typography
1. **Display:** `Space Grotesk` or `Geist Sans` (weight 600+)
   * *Usage:* `<h1>`, Hero headlines. Needs to look technical, aggressive, and bold.
2. **Interface:** `Geist Sans` (weight 400–500)
   * *Usage:* Body copy, buttons, labels.
3. **The Machine:** `Geist Mono` or `JetBrains Mono`
   * *Usage:* **CRITICAL.** Wallet addresses, tx hashes, `$BEAT` amounts, JSON config.
   * *Styling:* `text-xs` or `text-sm`, `tracking-wide`.

### B. Color Palette (Obsidian + Gold)
**Canvas:**
* `#0A0A0A` — **Obsidian** primary canvas (`bg-background`)
* `#111113` — **Elevated** surface for cards (`bg-card`)
* `#17171A` — **Raised** surface for code blocks/terminals

**The Gold Standard (Brand Accents):**
* `#F59E0B` — **Amber-500** — primary accent, active state (`--primary`)
* `#FCD34D` — **Amber-300 / bright** — hover, highlight, focus rings (The "Midas" flash)
* `#B45309` — **Amber-700 / deep** — deep gradient stops
* `#D4AF37` — **Metallic Gold** — reserved strictly for the revenue/split text and high-value data points.

**Borders & Text:**
* `border-white/10` — default UI borders.
* `#F4F4F5` (`zinc-100`) — primary text.
* `#A1A1AA` (`zinc-400`) — muted text.

---

## 3. COMPONENT LIBRARY DIRECTIVE
* **Base Logic:** Radix UI + `@base-ui/react`.
* **Icons:** `hugeicons-react` (Crisp, technical linework).
* **Premium Ecosystem:**
  * **Aceternity UI:** `BentoGrid` (for the feature breakdown), `TextGenerateEffect` (for the hero subheadline).
  * **Magic UI:** `BorderBeam` (wrap the "Live Split" BscScan cards in a gold BorderBeam to draw the eye), `AnimatedList` (for the live feed of tracks Midas is currently scanning).
* **The "Midas" Override:** Every component pulled from Aceternity or Magic UI that defaults to Indigo/Blue MUST be overridden to the Amber/Gold palette. 

---

## 4. NEXT.JS 16 DISCIPLINE
* **Framework:** Next.js 16 (App Router)
* **Language:** TypeScript (strict)
* **Styling:** Tailwind CSS v4
* **Rule:** Client components (`"use client"`) are restricted to interactive leaves (Framer motion wrappers, buttons). All heavy lifting, data fetching, and page layouts MUST remain Server Components.