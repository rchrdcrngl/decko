// @vitest-environment happy-dom
import { describe, it, expect, beforeEach } from 'vitest'
import { DeckRuntime } from '../../src/browser/runtime.js'

function buildDom(slideCount: number) {
  document.body.innerHTML = Array.from(
    { length: slideCount },
    (_, i) => `<section class="decko-slide" data-slide="${i}"></section>`,
  ).join('')
}

beforeEach(() => {
  document.body.innerHTML = ''
})

describe('DeckRuntime.init()', () => {
  it('finds all [data-slide] elements', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    expect(rt.total).toBe(3)
  })

  it('activates slide 0 on init', () => {
    buildDom(2)
    const rt = new DeckRuntime({})
    rt.init()
    expect(rt.current).toBe(0)
    const slide = document.querySelector('[data-slide="0"]')
    expect(slide?.classList.contains('decko-slide--active')).toBe(true)
  })

  it('hides non-active slides on init', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    const slide1 = document.querySelector('[data-slide="1"]')
    expect(slide1?.classList.contains('decko-slide--active')).toBe(false)
  })
})

describe('DeckRuntime.navigate()', () => {
  it('moves to specified slide index', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    rt.navigate(2)
    expect(rt.current).toBe(2)
    expect(document.querySelector('[data-slide="2"]')?.classList.contains('decko-slide--active')).toBe(true)
  })

  it('clamps to 0 when navigating below range', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    rt.navigate(-5)
    expect(rt.current).toBe(0)
  })

  it('clamps to last slide when navigating beyond range', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    rt.navigate(99)
    expect(rt.current).toBe(2)
  })

  it('removes active class from previous slide', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    rt.navigate(1)
    expect(document.querySelector('[data-slide="0"]')?.classList.contains('decko-slide--active')).toBe(false)
  })

  it('emits slideChange event with index', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    const events: unknown[] = []
    rt.on('slideChange', (d) => events.push(d))
    rt.navigate(1)
    expect(events).toHaveLength(1)
    expect(events[0]).toMatchObject({ index: 1 })
  })
})

describe('DeckRuntime keyboard navigation', () => {
  it('ArrowRight advances to next slide', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }))
    expect(rt.current).toBe(1)
  })

  it('Space advances to next slide', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }))
    expect(rt.current).toBe(1)
  })

  it('ArrowLeft goes to previous slide', () => {
    buildDom(3)
    const rt = new DeckRuntime({})
    rt.init()
    rt.navigate(2)
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }))
    expect(rt.current).toBe(1)
  })
})
