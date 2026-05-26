// @vitest-environment happy-dom
import { describe, it, expect, vi } from 'vitest'
import { transitionEngine, type TransitionHandler } from '../../src/browser/transitions/index.js'
import { AnimationEngine } from '../../src/browser/animation/engine.js'

function makeSlides() {
  const from = document.createElement('section')
  const to = document.createElement('section')
  from.classList.add('decko-slide--active')
  document.body.appendChild(from)
  document.body.appendChild(to)
  return { from, to, cleanup: () => { from.remove(); to.remove() } }
}

const engine = new AnimationEngine()

describe('transitionEngine built-ins', () => {
  it('cut — removes active from from, adds to to', () => {
    const { from, to, cleanup } = makeSlides()
    transitionEngine.play('cut', from, to, engine)
    expect(from.classList.contains('decko-slide--active')).toBe(false)
    expect(to.classList.contains('decko-slide--active')).toBe(true)
    cleanup()
  })

  it('fade — adds fade classes', () => {
    const { from, to, cleanup } = makeSlides()
    transitionEngine.play('fade', from, to, engine)
    expect(to.classList.contains('decko-slide--active')).toBe(true)
    expect(to.classList.contains('decko-transition--fade')).toBe(true)
    expect(from.classList.contains('decko-transition--fade-out')).toBe(true)
    cleanup()
  })

  it('falls back to cut for unknown type', () => {
    const { from, to, cleanup } = makeSlides()
    transitionEngine.play('nonexistent-transition', from, to, engine)
    expect(from.classList.contains('decko-slide--active')).toBe(false)
    expect(to.classList.contains('decko-slide--active')).toBe(true)
    cleanup()
  })

  it('pan — sets CSS vars and pan classes', () => {
    const { from, to, cleanup } = makeSlides()
    to.setAttribute('data-transition-dir', 'left')
    transitionEngine.play('pan', from, to, engine)
    expect(to.classList.contains('decko-transition--pan-in')).toBe(true)
    expect(from.classList.contains('decko-transition--pan-out')).toBe(true)
    cleanup()
  })

  it('wipe — sets wipe classes', () => {
    const { from, to, cleanup } = makeSlides()
    to.setAttribute('data-transition-dir', 'left')
    transitionEngine.play('wipe', from, to, engine)
    expect(to.classList.contains('decko-transition--wipe-in')).toBe(true)
    expect(from.classList.contains('decko-transition--wipe-out')).toBe(true)
    cleanup()
  })
})

describe('transitionEngine.register()', () => {
  it('registers and plays custom transition', () => {
    const handler: TransitionHandler = vi.fn((from, to) => {
      from.classList.remove('decko-slide--active')
      to.classList.add('decko-slide--active')
    })
    transitionEngine.register('custom-zoom', handler)
    const { from, to, cleanup } = makeSlides()
    transitionEngine.play('custom-zoom', from, to, engine)
    expect(handler).toHaveBeenCalledWith(from, to, engine)
    expect(to.classList.contains('decko-slide--active')).toBe(true)
    cleanup()
  })

  it('passes engine to handler', () => {
    let receivedEngine: AnimationEngine | null = null
    transitionEngine.register('engine-check', (_, __, eng) => {
      receivedEngine = eng as AnimationEngine
    })
    const { from, to, cleanup } = makeSlides()
    transitionEngine.play('engine-check', from, to, engine)
    expect(receivedEngine).toBe(engine)
    cleanup()
  })
})
