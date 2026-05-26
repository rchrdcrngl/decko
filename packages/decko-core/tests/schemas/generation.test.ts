import { describe, it, expect } from 'vitest'
import { GenerationEventSchema } from '../../src/schemas/generation.js'

const minimalSlide = {
  templateId: 'title-slide',
  slots: { headline: { type: 'text', content: 'Hi' } },
}

const minimalDeck = {
  version: '1',
  meta: { title: 'Test' },
  theme: { name: 'midnight' },
  slides: [minimalSlide],
}

describe('GenerationEventSchema', () => {
  it('accepts a start event', () => {
    expect(GenerationEventSchema.safeParse({ type: 'start', totalSlides: 8 }).success).toBe(true)
  })

  it('rejects start event with zero totalSlides', () => {
    expect(GenerationEventSchema.safeParse({ type: 'start', totalSlides: 0 }).success).toBe(false)
  })

  it('accepts an outline event', () => {
    const event = {
      type: 'outline',
      slides: [{ index: 0, templateId: 'title-slide', title: 'Intro' }],
    }
    expect(GenerationEventSchema.safeParse(event).success).toBe(true)
  })

  it('accepts an outline event with slides missing optional title', () => {
    const event = { type: 'outline', slides: [{ index: 0, templateId: 'title-slide' }] }
    expect(GenerationEventSchema.safeParse(event).success).toBe(true)
  })

  it('accepts a slide_start event', () => {
    expect(GenerationEventSchema.safeParse({ type: 'slide_start', slideIndex: 2 }).success).toBe(true)
  })

  it('rejects slide_start with negative slideIndex', () => {
    expect(GenerationEventSchema.safeParse({ type: 'slide_start', slideIndex: -1 }).success).toBe(false)
  })

  it('accepts a slide_complete event', () => {
    const event = { type: 'slide_complete', slideIndex: 0, slide: minimalSlide }
    expect(GenerationEventSchema.safeParse(event).success).toBe(true)
  })

  it('accepts a done event with a valid deck', () => {
    const event = { type: 'done', deck: minimalDeck }
    expect(GenerationEventSchema.safeParse(event).success).toBe(true)
  })

  it('accepts an error event', () => {
    expect(GenerationEventSchema.safeParse({ type: 'error', message: 'LLM timeout' }).success).toBe(true)
  })

  it('rejects an unknown event type', () => {
    expect(GenerationEventSchema.safeParse({ type: 'unknown', data: {} }).success).toBe(false)
  })

  it('rejects an event missing its type field', () => {
    expect(GenerationEventSchema.safeParse({ slideIndex: 0 }).success).toBe(false)
  })
})
