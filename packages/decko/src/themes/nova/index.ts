import type { ThemeDefinition } from '@decko/core'

export const novaTheme: ThemeDefinition = {
  id: 'nova',
  name: 'Nova',
  tokens: {
    colorAccent: '#e8f400',
    colorBackground: '#0d0d0d',
    colorSurface: '#1a1a1a',
    colorText: '#f0ece4',
    colorTextMuted: 'rgba(240, 236, 228, 0.38)',
    fontDisplay: "'Bebas Neue', Impact, sans-serif",
    fontBody: "'Syne', system-ui, sans-serif",
    fontMono: "'DM Mono', 'Courier New', monospace",
    spacingSlide: '3.5rem',
    radiusCard: '0px',
    motionIntensity: 'expressive',
  },
  css: `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');

/* ── Kinetic text blocks ────────────────────────────────────── */
.decko-text-kinetic {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 0.92;
  text-transform: uppercase;
  transform-style: preserve-3d;
  transform-origin: center center;
  display: block;
  color: var(--decko-color-text);
}

.decko-text-kinetic--ghost {
  color: rgba(232, 244, 0, 0.04);
  pointer-events: none;
  user-select: none;
}

/* ── Typography ─────────────────────────────────────────────── */
.decko-text--heading,
.decko-text--hero {
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: 0.92;
}

.decko-text--eyebrow {
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--decko-color-accent);
}

.decko-text--subheading {
  font-family: 'Syne', system-ui, sans-serif;
  font-weight: 400;
  letter-spacing: -0.01em;
  opacity: 0.75;
}

.decko-text--quote {
  font-family: 'Bebas Neue', Impact, sans-serif;
  border-left: 4px solid var(--decko-color-accent);
  border-radius: 0;
  background: transparent;
  padding: 0 0 0 1.5rem;
}

/* ── Callout ────────────────────────────────────────────────── */
.decko-callout {
  background: transparent;
  border: 1px solid rgba(240, 236, 228, 0.08);
  border-top: 3px solid currentColor;
  box-shadow: none;
  backdrop-filter: none;
}

.decko-callout--info    { background: transparent; border-color: rgba(240, 236, 228, 0.08); box-shadow: none; }
.decko-callout--success { background: transparent; border-color: rgba(240, 236, 228, 0.08); box-shadow: none; }
.decko-callout--warning,
.decko-callout--highlight { background: transparent; border-color: rgba(240, 236, 228, 0.08); box-shadow: none; }
.decko-callout--danger  { background: transparent; border-color: rgba(240, 236, 228, 0.08); box-shadow: none; }

/* ── Metric cards ───────────────────────────────────────────── */
.decko-metric {
  background: transparent;
  border: 1px solid rgba(240, 236, 228, 0.08);
  border-left: 3px solid var(--decko-color-accent);
  box-shadow: none;
  backdrop-filter: none;
}

.decko-metric--kpi .decko-metric__value {
  color: var(--decko-color-text);
  font-family: 'Bebas Neue', Impact, sans-serif;
}

/* ── Code block ─────────────────────────────────────────────── */
.decko-code {
  background: var(--decko-color-surface);
  border: 1px solid rgba(240, 236, 228, 0.08);
  border-left: 3px solid var(--decko-color-accent);
  box-shadow: none;
}

/* ── Table ──────────────────────────────────────────────────── */
.decko-table td {
  border-bottom: 1px solid rgba(240, 236, 228, 0.08);
}

.decko-table th {
  border-bottom: 2px solid var(--decko-color-accent);
}

.decko-table--striped tr:nth-child(even) td {
  background: rgba(240, 236, 228, 0.03);
}

/* ── Media ──────────────────────────────────────────────────── */
.decko-media__img,
.decko-media__video {
  border-radius: 0;
  box-shadow: none;
  filter: contrast(1.05);
}

/* ── Big metric — no card, just the number ──────────────────── */
[data-template="big-metric"] .decko-metric {
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  padding-left: 0;
  padding-right: 0;
}

/* ── Progress bar ───────────────────────────────────────────── */
#decko-kinetic-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--decko-color-accent);
  box-shadow: none;
  z-index: 300;
  border-radius: 0;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0;
}

/* ── Nav ────────────────────────────────────────────────────── */
#decko-nav {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  z-index: 200;
  background: var(--decko-color-background);
  border: 1px solid rgba(240, 236, 228, 0.18);
  border-radius: 0;
  padding: 5px 8px;
  backdrop-filter: none;
  box-shadow: none;
}

#decko-nav button {
  width: 30px;
  height: 30px;
  border-radius: 0;
  border: 1px solid rgba(240, 236, 228, 0.12);
  background: transparent;
  color: rgba(240, 236, 228, 0.4);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.12s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

#decko-nav button:hover {
  background: var(--decko-color-accent);
  border-color: var(--decko-color-accent);
  color: var(--decko-color-background);
  box-shadow: none;
}

#decko-nav button:disabled {
  opacity: 0.2;
  cursor: default;
}

/* ── Slide counter ──────────────────────────────────────────── */
#decko-counter {
  position: fixed;
  top: 28px;
  right: 36px;
  font-family: 'DM Mono', monospace;
  font-weight: 400;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: rgba(240, 236, 228, 0.2);
  z-index: 200;
  pointer-events: none;
  text-transform: uppercase;
}

/* ── Per-slide accent bar ───────────────────────────────────── */
.decko-slide::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: var(--decko-color-accent);
  z-index: 10;
  pointer-events: none;
}

/* ── Kinetic template slot positioning ─────────────────────── */
[data-template="kinetic-canvas"] .decko-slot,
[data-template="kinetic-hero"] .decko-slot {
  position: absolute;
}

/* ── Title slide — bottom-left ─────────────────────────────── */
[data-template="title-slide"].decko-slide--active {
  align-items: flex-start;
  justify-content: flex-end;
  text-align: left;
}

/* ── Section break — bottom-left + label row ───────────────── */
[data-template="section-break"].decko-slide--active {
  align-items: flex-start;
  justify-content: flex-end;
  text-align: left;
}

[data-template="section-break"] [data-slot="label"] {
  display: flex;
  align-items: center;
  gap: 1rem;
}

[data-template="section-break"] [data-slot="label"]::before {
  content: '';
  width: 2rem;
  height: 2px;
  background: var(--decko-color-accent);
  flex-shrink: 0;
  display: inline-block;
}

/* ── Quote — left-aligned, grotesk display size ────────────── */
[data-template="quote"].decko-slide--active {
  text-align: left;
}

.decko-text--quote {
  font-size: clamp(2.25rem, 5vw, 4rem);
  text-transform: uppercase;
  line-height: 0.96;
  padding-left: 2rem;
}

/* ── Bullet list — grotesk dash markers ────────────────────── */
.decko-list--bullets {
  list-style: none;
  padding-left: 0;
}

.decko-list--bullets li {
  padding-left: 1.25rem;
  position: relative;
  color: rgba(240, 236, 228, 0.72);
}

.decko-list--bullets li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 5px;
  height: 1px;
  background: var(--decko-color-accent);
}

/* ── Big metric — grotesk scale ────────────────────────────── */
[data-template="big-metric"] [data-slot="metric"] .decko-metric__value {
  font-size: clamp(7rem, 18vw, 13rem);
  letter-spacing: 0.01em;
  color: var(--decko-color-text);
}

/* ── Delta colors ───────────────────────────────────────────── */
.trend--up   .decko-metric__delta { color: #52e08a; }
.trend--down .decko-metric__delta { color: #ff4d4d; }

/* ── Inline code — no radius ────────────────────────────────── */
.decko-code--inline { border-radius: 0; }

/* ── Light slide — invert text for #f0ece4 backgrounds ─────── */
.decko-slide[style*="f0ece4"] {
  color: #0d0d0d;
}

.decko-slide[style*="f0ece4"] .decko-text,
.decko-slide[style*="f0ece4"] .decko-text--body,
.decko-slide[style*="f0ece4"] .decko-text--heading,
.decko-slide[style*="f0ece4"] .decko-text--hero,
.decko-slide[style*="f0ece4"] .decko-text--quote,
.decko-slide[style*="f0ece4"] .decko-text-kinetic {
  color: #0d0d0d;
}

.decko-slide[style*="f0ece4"] .decko-text--subheading {
  color: rgba(13, 13, 13, 0.42);
}

.decko-slide[style*="f0ece4"] .decko-text--eyebrow {
  filter: saturate(1.3) brightness(0.7);
}

.decko-slide[style*="f0ece4"] .decko-list--bullets li {
  color: rgba(13, 13, 13, 0.72);
}

.decko-slide[style*="f0ece4"] .decko-metric {
  border-color: rgba(13, 13, 13, 0.12);
  border-left-color: var(--decko-color-accent);
}

.decko-slide[style*="f0ece4"] .decko-metric__value {
  color: #0d0d0d;
}

.decko-slide[style*="f0ece4"] .decko-metric__label {
  color: rgba(13, 13, 13, 0.42);
}

.decko-slide[style*="f0ece4"] .decko-callout {
  border-color: rgba(13, 13, 13, 0.12);
  border-top-color: currentColor;
}

.decko-slide[style*="f0ece4"] .decko-table td {
  border-bottom-color: rgba(13, 13, 13, 0.1);
  color: #0d0d0d;
}

.decko-slide[style*="f0ece4"] .decko-table th {
  color: #0d0d0d;
}
`,
  personality: {
    mood: 'brutalist',
    bestFor: ['creative pitches', 'brand manifestos', 'portfolio reviews', 'agency work', 'culture decks'],
  },
}
