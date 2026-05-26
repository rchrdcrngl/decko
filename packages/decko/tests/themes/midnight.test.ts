import { describe, it, expect } from 'vitest'
import { ThemeDefinitionSchema } from '@deckohq/core'
import { midnightTheme } from '../../src/themes/midnight/index.js'

describe('midnightTheme', () => {
  it('passes ThemeDefinitionSchema', () => {
    const result = ThemeDefinitionSchema.safeParse(midnightTheme)
    expect(result.success).toBe(true)
  })

  it('has id "midnight"', () => {
    expect(midnightTheme.id).toBe('midnight')
  })

  it('has all required token fields', () => {
    const { tokens } = midnightTheme
    expect(tokens.colorAccent).toBeTruthy()
    expect(tokens.colorBackground).toBeTruthy()
    expect(tokens.fontDisplay).toBeTruthy()
    expect(tokens.fontBody).toBeTruthy()
    expect(tokens.motionIntensity).toBeTruthy()
  })
})
