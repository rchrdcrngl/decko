import { describe, it, expect } from 'vitest'
import { Renderer, renderDeck } from '../../src/renderer/index.js'
import { midnightTheme } from '../../src/themes/midnight/index.js'
import type { Deck } from '@deckohq/core'

const fixture: Deck = {
  version: '1',
  meta: { title: 'Test Deck', aspectRatio: '16:9', language: 'en' },
  theme: { name: 'midnight' },
  slides: [
    {
      templateId: 'title-slide',
      slots: {
        headline: { type: 'text', display: 'heading', content: 'Hello Decko' },
        subtitle: { type: 'text', display: 'subheading', content: 'A subtitle' },
      },
    },
    {
      templateId: 'header-body',
      slots: {
        title: { type: 'text', display: 'heading', content: 'Slide 2' },
        body: { type: 'text', display: 'body', content: 'Body content here.' },
      },
    },
  ],
}

describe('Renderer', () => {
  it('render() returns a RenderedDeck with html string', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(typeof result.html).toBe('string')
    expect(result.html.length).toBeGreaterThan(0)
  })

  it('html starts with <!DOCTYPE html>', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.html.trimStart().startsWith('<!DOCTYPE html>')).toBe(true)
  })

  it('html contains slide content', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.html).toContain('Hello Decko')
    expect(result.html).toContain('Body content here.')
  })

  it('slides array has one entry per slide', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.slides).toHaveLength(2)
  })

  it('each slide has an index and html', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.slides[0]?.index).toBe(0)
    expect(typeof result.slides[0]?.html).toBe('string')
  })

  it('html contains the deck JSON in #deck-data', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.html).toContain('id="deck-data"')
    expect(result.html).toContain('Hello Decko')
  })

  it('html contains CSS custom properties from theme', () => {
    const renderer = new Renderer({ theme: midnightTheme })
    const result = renderer.render(fixture)
    expect(result.html).toContain('--decko-color-accent')
  })
})

describe('renderDeck() convenience function', () => {
  it('produces the same output as new Renderer().render()', () => {
    const result = renderDeck(fixture, { theme: midnightTheme })
    expect(result.html.trimStart().startsWith('<!DOCTYPE html>')).toBe(true)
    expect(result.html).toContain('Hello Decko')
  })
})
