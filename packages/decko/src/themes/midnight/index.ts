import type { ThemeDefinition } from '@decko/core'

export const midnightTheme: ThemeDefinition = {
  id: 'midnight',
  name: 'Midnight',
  tokens: {
    colorAccent: '#818cf8',
    colorBackground: '#06060f',
    colorSurface: '#0e0e22',
    colorText: '#f1f0ff',
    colorTextMuted: '#6b6b9a',
    fontDisplay: 'Outfit, Sora, Inter, system-ui, sans-serif',
    fontBody: 'DM Sans, Inter, system-ui, sans-serif',
    fontMono: 'JetBrains Mono, Fira Code, monospace',
    spacingSlide: '3.5rem',
    radiusCard: '1rem',
    motionIntensity: 'moderate',
  },
  personality: {
    mood: 'bold',
    bestFor: ['tech talks', 'product launches', 'developer content', 'startups'],
  },
}
