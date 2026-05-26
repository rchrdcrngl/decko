import { describe, it, expect } from 'vitest'
import { getEasing, registerEasing, getEasingTiming } from '../../src/browser/animation/easing.js'

describe('getEasing()', () => {
  it('returns function for built-in names', () => {
    for (const name of ['linear', 'outExpo', 'outBack', 'outElastic', 'inExpo', 'outCubic', 'outQuint', 'inOutCubic']) {
      expect(getEasing(name)).toBeTypeOf('function')
    }
  })

  it('falls back to outExpo for unknown names', () => {
    const fallback = getEasing('nonexistent')
    const outExpo = getEasing('outExpo')
    expect(fallback(0.5)).toBeCloseTo(outExpo(0.5))
  })

  it('linear returns t', () => {
    const fn = getEasing('linear')
    expect(fn(0)).toBe(0)
    expect(fn(0.5)).toBe(0.5)
    expect(fn(1)).toBe(1)
  })

  it('outExpo reaches 1 at t=1', () => {
    expect(getEasing('outExpo')(1)).toBe(1)
  })

  it('outExpo returns 0 approaching t=0', () => {
    expect(getEasing('outExpo')(0)).toBeCloseTo(0, 5)
  })

  it('outBack overshoots > 1 mid-range', () => {
    const fn = getEasing('outBack')
    const midValue = fn(0.8)
    expect(midValue).toBeGreaterThan(1)
  })
})

describe('registerEasing()', () => {
  it('registers custom easing and retrieves it', () => {
    const custom = (t: number) => t * t
    registerEasing('custom-test', custom)
    expect(getEasing('custom-test')(0.5)).toBeCloseTo(0.25)
  })
})

describe('getEasingTiming()', () => {
  it('returns cubic-bezier string for known names', () => {
    expect(getEasingTiming('outExpo')).toMatch(/cubic-bezier/)
  })

  it('falls back to outExpo timing for unknown names', () => {
    expect(getEasingTiming('unknown')).toBe(getEasingTiming('outExpo'))
  })
})
