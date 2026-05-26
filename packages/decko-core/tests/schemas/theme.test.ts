import { describe, it, expect } from 'vitest'
import { ThemeDefinitionSchema } from '../../src/schemas/theme.js'

const validTokens = {
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

const validTheme = {
  id: 'midnight',
  name: 'Midnight',
  tokens: validTokens,
  personality: { mood: 'bold', bestFor: ['tech talks'] },
}

describe('ThemeDefinitionSchema', () => {
  it('accepts a valid theme', () => {
    expect(ThemeDefinitionSchema.safeParse(validTheme).success).toBe(true)
  })

  it('accepts a theme with extends field', () => {
    const theme = { ...validTheme, id: 'my-theme', extends: 'midnight' }
    expect(ThemeDefinitionSchema.safeParse(theme).success).toBe(true)
  })

  it('accepts all valid motionIntensity values', () => {
    for (const motionIntensity of ['none', 'subtle', 'moderate', 'expressive']) {
      const theme = { ...validTheme, tokens: { ...validTokens, motionIntensity } }
      expect(ThemeDefinitionSchema.safeParse(theme).success).toBe(true)
    }
  })

  it('accepts a theme with block style overrides', () => {
    const theme = { ...validTheme, blocks: { text: { heading: { fontSize: '4rem' } } } }
    expect(ThemeDefinitionSchema.safeParse(theme).success).toBe(true)
  })

  it('rejects an invalid motionIntensity', () => {
    const theme = { ...validTheme, tokens: { ...validTokens, motionIntensity: 'extreme' } }
    expect(ThemeDefinitionSchema.safeParse(theme).success).toBe(false)
  })

  it('rejects missing tokens', () => {
    const { tokens: _t, ...noTokens } = validTheme
    expect(ThemeDefinitionSchema.safeParse(noTokens).success).toBe(false)
  })

  it('rejects tokens with a missing required field', () => {
    const { colorAccent: _ca, ...missingAccent } = validTokens
    const theme = { ...validTheme, tokens: missingAccent }
    expect(ThemeDefinitionSchema.safeParse(theme).success).toBe(false)
  })

  it('rejects missing personality', () => {
    const { personality: _p, ...noPersonality } = validTheme
    expect(ThemeDefinitionSchema.safeParse(noPersonality).success).toBe(false)
  })

  it('rejects empty id', () => {
    expect(ThemeDefinitionSchema.safeParse({ ...validTheme, id: '' }).success).toBe(false)
  })
})
