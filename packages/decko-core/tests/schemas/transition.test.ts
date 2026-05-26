import { describe, it, expect } from 'vitest'
import { SlideTransitionSchema } from '../../src/schemas/transition.js'

describe('SlideTransitionSchema', () => {
  it('accepts a cut transition', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'cut' }).success).toBe(true)
  })

  it('accepts a fade transition without duration', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'fade' }).success).toBe(true)
  })

  it('accepts a fade transition with duration', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'fade', duration: 0.5 }).success).toBe(true)
  })

  it('rejects a fade transition with non-positive duration', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'fade', duration: 0 }).success).toBe(false)
    expect(SlideTransitionSchema.safeParse({ type: 'fade', duration: -1 }).success).toBe(false)
  })

  it('accepts a zoom-through transition with targetId', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'zoom-through', targetId: 'block-1' }).success).toBe(true)
  })

  it('rejects zoom-through without targetId', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'zoom-through' }).success).toBe(false)
  })

  it('accepts a zoom-out transition with originId', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'zoom-out', originId: 'block-1' }).success).toBe(true)
  })

  it('accepts a pan transition in all 4 directions', () => {
    for (const direction of ['left', 'right', 'up', 'down']) {
      expect(SlideTransitionSchema.safeParse({ type: 'pan', direction }).success).toBe(true)
    }
  })

  it('rejects a pan transition with invalid direction', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'pan', direction: 'diagonal' }).success).toBe(false)
  })

  it('accepts a morph transition', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'morph', fromId: 'a', toId: 'b' }).success).toBe(true)
  })

  it('rejects a morph transition missing toId', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'morph', fromId: 'a' }).success).toBe(false)
  })

  it('accepts a particle-burst transition', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'particle-burst', originId: 'hero' }).success).toBe(true)
  })

  it('accepts a wipe transition', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'wipe', direction: 'left' }).success).toBe(true)
  })

  it('rejects an unknown transition type', () => {
    expect(SlideTransitionSchema.safeParse({ type: 'explode' }).success).toBe(false)
  })

  it('rejects a transition with no type field', () => {
    expect(SlideTransitionSchema.safeParse({ direction: 'left' }).success).toBe(false)
  })
})
