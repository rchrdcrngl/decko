import { describe, it, expect } from 'vitest'
import { resolveThemeCss } from '../../src/renderer/theme-resolver.js'
import type { ThemeTokens } from '@decko/core'

const baseTokens: ThemeTokens = {
  colorAccent: '#F97316',
  colorBackground: '#0F0F1A',
  colorSurface: '#1A1A2E',
  colorText: '#F8F8F2',
  colorTextMuted: '#6E6E8E',
  fontDisplay: 'Bebas Neue, sans-serif',
  fontBody: 'Inter, sans-serif',
  fontMono: 'JetBrains Mono, monospace',
  spacingSlide: '3rem',
  radiusCard: '0.75rem',
  motionIntensity: 'moderate',
}

describe('resolveThemeCss()', () => {
  it('returns a string containing :root block', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain(':root')
  })

  it('converts colorAccent to --decko-color-accent', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain('--decko-color-accent:')
    expect(css).toContain('#F97316')
  })

  it('converts colorBackground to --decko-color-background', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain('--decko-color-background:')
    expect(css).toContain('#0F0F1A')
  })

  it('converts fontDisplay to --decko-font-display', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain('--decko-font-display:')
  })

  it('converts spacingSlide to --decko-spacing-slide', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain('--decko-spacing-slide:')
    expect(css).toContain('3rem')
  })

  it('converts radiusCard to --decko-radius-card', () => {
    const css = resolveThemeCss(baseTokens)
    expect(css).toContain('--decko-radius-card:')
  })

  it('applies token overrides over base tokens', () => {
    const css = resolveThemeCss(baseTokens, { colorAccent: '#00FF00' })
    expect(css).toContain('#00FF00')
    expect(css).not.toContain('#F97316')
  })

  it('partial overrides leave other tokens unchanged', () => {
    const css = resolveThemeCss(baseTokens, { colorAccent: '#00FF00' })
    expect(css).toContain('#0F0F1A')
  })
})
