import { describe, it, expect } from 'vitest'
import { DeckSchema } from '../../src/schemas/deck.js'

const minimalSlide = {
  templateId: 'title-slide',
  slots: {
    headline: { type: 'text', content: 'Hello' },
  },
}

const minimalDeck = {
  version: '1',
  meta: { title: 'Test Deck' },
  theme: { name: 'midnight' },
  slides: [minimalSlide],
}

describe('DeckSchema', () => {
  it('accepts a minimal valid deck', () => {
    expect(DeckSchema.safeParse(minimalDeck).success).toBe(true)
  })

  it('accepts a deck with all meta fields', () => {
    const deck = {
      ...minimalDeck,
      meta: {
        title: 'Full Meta',
        author: 'Jane Doe',
        org: 'Acme Corp',
        date: '2025-01-01',
        aspectRatio: '16:9',
        language: 'en',
      },
    }
    expect(DeckSchema.safeParse(deck).success).toBe(true)
  })

  it('accepts a deck with variables', () => {
    const deck = { ...minimalDeck, variables: { COMPANY: 'Acme', YEAR: '2025' } }
    expect(DeckSchema.safeParse(deck).success).toBe(true)
  })

  it('accepts a deck with theme token overrides', () => {
    const deck = {
      ...minimalDeck,
      theme: { name: 'midnight', tokens: { colorAccent: '#FF0000' } },
    }
    expect(DeckSchema.safeParse(deck).success).toBe(true)
  })

  it('defaults aspectRatio to 16:9', () => {
    const result = DeckSchema.safeParse(minimalDeck)
    expect(result.success && result.data.meta.aspectRatio).toBe('16:9')
  })

  it('defaults language to en', () => {
    const result = DeckSchema.safeParse(minimalDeck)
    expect(result.success && result.data.meta.language).toBe('en')
  })

  it('rejects version other than "1"', () => {
    expect(DeckSchema.safeParse({ ...minimalDeck, version: '2' }).success).toBe(false)
    expect(DeckSchema.safeParse({ ...minimalDeck, version: 1 }).success).toBe(false)
  })

  it('rejects a deck with no slides', () => {
    expect(DeckSchema.safeParse({ ...minimalDeck, slides: [] }).success).toBe(false)
  })

  it('rejects a deck with missing title', () => {
    const deck = { ...minimalDeck, meta: { author: 'Jane' } }
    expect(DeckSchema.safeParse(deck).success).toBe(false)
  })

  it('rejects an invalid aspect ratio', () => {
    const deck = { ...minimalDeck, meta: { ...minimalDeck.meta, aspectRatio: '21:9' } }
    expect(DeckSchema.safeParse(deck).success).toBe(false)
  })

  it('rejects a deck missing theme', () => {
    const { theme: _theme, ...noTheme } = minimalDeck
    expect(DeckSchema.safeParse(noTheme).success).toBe(false)
  })

  it('parses and returns typed data', () => {
    const result = DeckSchema.safeParse(minimalDeck)
    if (!result.success) throw new Error('Expected success')
    expect(result.data.version).toBe('1')
    expect(result.data.slides).toHaveLength(1)
  })
})
