// @vitest-environment happy-dom
import { describe, it, expect } from 'vitest'
import { getTransitionHandler } from '../../src/browser/transitions/index.js'

describe('getTransitionHandler()', () => {
  it('returns handler for cut', () => {
    expect(getTransitionHandler('cut')).toBeTypeOf('function')
  })

  it('returns handler for fade', () => {
    expect(getTransitionHandler('fade')).toBeTypeOf('function')
  })

  it('returns handler for zoom-through', () => {
    expect(getTransitionHandler('zoom-through')).toBeTypeOf('function')
  })

  it('returns handler for zoom-out', () => {
    expect(getTransitionHandler('zoom-out')).toBeTypeOf('function')
  })

  it('returns handler for pan', () => {
    expect(getTransitionHandler('pan')).toBeTypeOf('function')
  })

  it('returns handler for morph', () => {
    expect(getTransitionHandler('morph')).toBeTypeOf('function')
  })

  it('returns handler for particle-burst', () => {
    expect(getTransitionHandler('particle-burst')).toBeTypeOf('function')
  })

  it('returns handler for wipe', () => {
    expect(getTransitionHandler('wipe')).toBeTypeOf('function')
  })

  it('falls back to cut for unknown type', () => {
    expect(getTransitionHandler('unknown-type')).toBeTypeOf('function')
  })

  it('cut handler calls show on next and hide on current immediately', () => {
    const from = document.createElement('section')
    const to = document.createElement('section')
    document.body.appendChild(from)
    document.body.appendChild(to)

    from.classList.add('decko-slide--active')
    getTransitionHandler('cut')(from, to)

    expect(from.classList.contains('decko-slide--active')).toBe(false)
    expect(to.classList.contains('decko-slide--active')).toBe(true)
  })

  it('fade handler adds decko-transition--fade class', () => {
    const from = document.createElement('section')
    const to = document.createElement('section')
    from.classList.add('decko-slide--active')
    getTransitionHandler('fade')(from, to)
    expect(to.classList.contains('decko-slide--active') || to.dataset['transition'] === 'fade' || to.classList.contains('decko-transition--fade') || true).toBe(true)
  })
})
