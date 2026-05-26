// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AnimationEngine } from '../../src/browser/animation/engine.js'

function makeEngine() {
  return new AnimationEngine()
}

describe('AnimationEngine', () => {
  let engine: ReturnType<typeof makeEngine>

  beforeEach(() => {
    engine = makeEngine()
  })

  describe('registerPreset / playPreset', () => {
    it('falls back to fade-in for unknown preset', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      await engine.playPreset(el, 'nonexistent-preset', { delay: 0, duration: 1 })
      expect(el.style.opacity).toBe('1')
      el.remove()
    })

    it('registers and plays custom preset', async () => {
      engine.registerPreset('test-slide', {
        from: { x: -50, opacity: 0 },
        to: { x: 0, opacity: 1 },
        duration: 16,
        easing: 'linear',
      })
      const el = document.createElement('div')
      document.body.appendChild(el)
      await engine.playPreset(el, 'test-slide')
      expect(el.style.opacity).toBe('1')
      el.remove()
    })
  })

  describe('play()', () => {
    it('sets final opacity after duration', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      await engine.play(el, {
        from: { opacity: 0 },
        to: { opacity: 1 },
        duration: 16,
        easing: 'linear',
      })
      expect(el.style.opacity).toBe('1')
      el.remove()
    })

    it('applies transform for x/y translation', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      await engine.play(el, {
        from: { x: 100, y: 0 },
        to: { x: 0, y: 0 },
        duration: 16,
        easing: 'linear',
      })
      expect(el.style.transform).toContain('translate3d(0px')
      el.remove()
    })

    it('resolves the promise when done', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      let resolved = false
      const p = engine.play(el, { from: { opacity: 0 }, to: { opacity: 1 }, duration: 16 })
      p.then(() => { resolved = true })
      await p
      expect(resolved).toBe(true)
      el.remove()
    })
  })

  describe('cancel()', () => {
    it('cancels in-flight tweens on element', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      const p = engine.play(el, { from: { opacity: 0 }, to: { opacity: 1 }, duration: 2000 })
      engine.cancel(el)
      await p // should resolve immediately after cancel
      el.remove()
    })
  })

  describe('cancelAll()', () => {
    it('resolves all pending tweens', async () => {
      const els = [1, 2, 3].map(() => {
        const el = document.createElement('div')
        document.body.appendChild(el)
        return el
      })
      const promises = els.map((el) =>
        engine.play(el, { from: { opacity: 0 }, to: { opacity: 1 }, duration: 2000 }),
      )
      engine.cancelAll()
      await Promise.all(promises)
      els.forEach((el) => el.remove())
    })
  })

  describe('mode auto-detection', () => {
    it('uses js mode when z is present', async () => {
      const el = document.createElement('div')
      document.body.appendChild(el)
      // Just verify it completes without error (3D path)
      await engine.play(el, {
        from: { z: -500, opacity: 0 },
        to: { z: 0, opacity: 1 },
        duration: 16,
      })
      el.remove()
    })
  })
})

describe('AnimationEngine.registerEasing()', () => {
  it('registers and uses custom easing', async () => {
    const eng = makeEngine()
    const bounced = vi.fn((t: number) => t)
    eng.registerEasing('my-easing', bounced)
    const el = document.createElement('div')
    document.body.appendChild(el)
    await eng.play(el, {
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 16,
      easing: 'my-easing',
    })
    expect(bounced).toHaveBeenCalled()
    el.remove()
  })
})
