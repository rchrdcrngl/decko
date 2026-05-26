import { describe, it, expect } from 'vitest'
import { validateDeck, parseDeck } from '../../src/validators/deck.js'

const validDeck = {
  version: '1',
  meta: { title: 'Test' },
  theme: { name: 'midnight' },
  slides: [
    { templateId: 'title-slide', slots: { headline: { type: 'text', content: 'Hi' } } },
  ],
}

describe('validateDeck()', () => {
  it('returns success: true for a valid deck', () => {
    const result = validateDeck(validDeck)
    expect(result.success).toBe(true)
  })

  it('returns the parsed deck data on success', () => {
    const result = validateDeck(validDeck)
    if (!result.success) throw new Error('Expected success')
    expect(result.data.meta.title).toBe('Test')
  })

  it('returns success: false for an invalid deck', () => {
    const result = validateDeck({ version: '1', meta: {} })
    expect(result.success).toBe(false)
  })

  it('returns a ZodError on failure', () => {
    const result = validateDeck({ version: '1' })
    if (result.success) throw new Error('Expected failure')
    expect(result.error.issues.length).toBeGreaterThan(0)
  })

  it('error includes path information for missing fields', () => {
    const result = validateDeck({ ...validDeck, meta: {} })
    if (result.success) throw new Error('Expected failure')
    const paths = result.error.issues.map((i) => i.path.join('.'))
    expect(paths.some((p) => p.includes('title'))).toBe(true)
  })

  it('returns success: false for null input', () => {
    expect(validateDeck(null).success).toBe(false)
  })

  it('returns success: false for non-object input', () => {
    expect(validateDeck('not a deck').success).toBe(false)
  })
})

describe('parseDeck()', () => {
  it('returns parsed deck for valid input', () => {
    const deck = parseDeck(validDeck)
    expect(deck.meta.title).toBe('Test')
  })

  it('throws for invalid input', () => {
    expect(() => parseDeck({ version: '1' })).toThrow()
  })
})
