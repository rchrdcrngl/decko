import type { ThemeDefinition } from '@deckohq/core'

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`

export const kineticTheme: ThemeDefinition = {
  id: 'kinetic',
  name: 'Kinetic',
  tokens: {
    colorAccent: '#e8ff00',
    colorBackground: '#0a0a0a',
    colorSurface: '#111111',
    colorText: '#ffffff',
    colorTextMuted: 'rgba(255,255,255,0.35)',
    fontDisplay: "'Bebas Neue', 'Oswald', 'Barlow Condensed', sans-serif",
    fontBody: "'Barlow Condensed', sans-serif",
    fontMono: "'JetBrains Mono', 'Fira Code', monospace",
    spacingSlide: '3rem',
    radiusCard: '0.125rem',
    motionIntensity: 'expressive',
  },
  css: `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Oswald:wght@200;300;400;500;600;700&display=swap');

/* ── 3D stage ──────────────────────────────────────────────── */
#decko-root {
  perspective: 1200px;
  perspective-origin: 50% 50%;
  background: var(--decko-color-background);
}

.decko-slide {
  transform-style: preserve-3d;
}

/* ── Grain overlay on every slide ──────────────────────────── */
.decko-slide::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  background-image: ${GRAIN_SVG};
  opacity: 0.35;
  mix-blend-mode: overlay;
}

/* ── Kinetic text blocks ────────────────────────────────────── */
.decko-text-kinetic {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.02em;
  line-height: 1;
  transform-style: preserve-3d;
  transform-origin: center center;
  display: block;
}

.decko-text-kinetic--ghost {
  color: rgba(255, 255, 255, 0.04);
  pointer-events: none;
  user-select: none;
}

/* ── Typography ─────────────────────────────────────────────── */
.decko-text--heading,
.decko-text--hero {
  font-family: 'Bebas Neue', 'Barlow Condensed', sans-serif;
  letter-spacing: 0.02em;
  line-height: 0.9;
  text-transform: uppercase;
}

.decko-text--eyebrow {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 200;
  letter-spacing: 0.35em;
  text-transform: uppercase;
  color: var(--decko-color-text-muted);
}

.decko-text--subheading {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 300;
  letter-spacing: 0.05em;
}

/* ── Accent color overrides ─────────────────────────────────── */
.decko-metric--kpi .decko-metric__value {
  color: var(--decko-color-accent);
}

.decko-divider--gradient {
  background: linear-gradient(90deg, var(--decko-color-accent), transparent);
  height: 2px;
  border: none;
}

/* ── Progress bar ───────────────────────────────────────────── */
#decko-kinetic-bar {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--decko-color-accent), #fff);
  box-shadow: 0 0 6px rgba(232, 255, 0, 0.4);
  z-index: 300;
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  width: 0;
}

/* ── Nav dots ───────────────────────────────────────────────── */
#decko-nav {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 200;
}

#decko-nav button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.05);
  color: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(8px);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

#decko-nav button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
}

/* slide counter — fixed top-right, matches keynote .num */
#decko-counter {
  position: fixed;
  top: 32px;
  right: 40px;
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.15em;
  color: rgba(255, 255, 255, 0.25);
  z-index: 200;
  pointer-events: none;
}
`,
  personality: {
    mood: 'bold',
    bestFor: ['product launches', 'keynotes', 'brand reveals', 'creative pitches'],
  },
}
