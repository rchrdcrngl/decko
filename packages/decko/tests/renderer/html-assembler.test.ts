import { describe, it, expect } from 'vitest'
import { assembleHtml } from '../../src/renderer/html-assembler.js'
import { midnightTheme } from '../../src/themes/midnight/index.js'

const minimalDeck = {
  version: '1' as const,
  meta: {
    title: 'Test Deck',
    aspectRatio: '16:9' as const,
    language: 'en',
  },
  theme: { name: 'midnight' },
  slides: [],
}

describe('assembleHtml()', () => {
  it('starts with <!DOCTYPE html>', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html.trimStart().startsWith('<!DOCTYPE html>')).toBe(true)
  })

  it('contains <html lang> matching deck language', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).toContain('lang="en"')
  })

  it('contains <title> with deck title', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).toContain('<title>Test Deck</title>')
  })

  it('escapes special chars in title', () => {
    const deck = { ...minimalDeck, meta: { ...minimalDeck.meta, title: 'A & <B>' } }
    const html = assembleHtml([], deck, midnightTheme)
    expect(html).toContain('A &amp; &lt;B&gt;')
  })

  it('contains #decko-root wrapper', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).toContain('id="decko-root"')
  })

  it('contains #deck-data script tag with JSON', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).toContain('id="deck-data"')
    expect(html).toContain('type="application/json"')
    expect(html).toContain('"version":"1"')
  })

  it('embeds slide HTML inside #decko-root', () => {
    const slides = ['<section data-slide="0">Slide content</section>']
    const html = assembleHtml(slides, minimalDeck, midnightTheme)
    expect(html).toContain('Slide content')
  })

  it('inlines theme CSS when inlineThemeCss provided', () => {
    const css = '--decko-color-accent: #FF0000;'
    const html = assembleHtml([], minimalDeck, midnightTheme, { inlineThemeCss: css })
    expect(html).toContain(css)
  })

  it('emits <link> tags for each cssUrl', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme, {
      cssUrls: ['./decko-base.css', './decko-theme-midnight.css'],
    })
    expect(html).toContain('<link rel="stylesheet" href="./decko-base.css">')
    expect(html).toContain('<link rel="stylesheet" href="./decko-theme-midnight.css">')
  })

  it('does not emit <link> tags when cssUrls is empty', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).not.toContain('<link rel="stylesheet"')
  })

  it('emits <script src> tags for each scriptUrl', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme, {
      scriptUrls: ['./decko-runtime.js'],
    })
    expect(html).toContain('<script src="./decko-runtime.js">')
  })

  it('does not emit <script src> when scriptUrls is empty', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).not.toContain('<script src=')
  })

  it('contains data-aspect-ratio attribute on root', () => {
    const html = assembleHtml([], minimalDeck, midnightTheme)
    expect(html).toContain('data-aspect-ratio="16:9"')
  })

  describe('mode: csr', () => {
    it('omits slide HTML from #decko-root', () => {
      const slides = ['<section data-slide="0">Slide content</section>']
      const html = assembleHtml(slides, minimalDeck, midnightTheme, { mode: 'csr' })
      expect(html).not.toContain('Slide content')
    })

    it('sets data-render-mode="csr" on #decko-root', () => {
      const html = assembleHtml([], minimalDeck, midnightTheme, { mode: 'csr' })
      expect(html).toContain('data-render-mode="csr"')
    })

    it('still embeds deck JSON in csr mode', () => {
      const html = assembleHtml([], minimalDeck, midnightTheme, { mode: 'csr' })
      expect(html).toContain('id="deck-data"')
      expect(html).toContain('"version":"1"')
    })
  })

  describe('mode: ssr (default)', () => {
    it('embeds slide HTML in #decko-root', () => {
      const slides = ['<section data-slide="0">Slide content</section>']
      const html = assembleHtml(slides, minimalDeck, midnightTheme, { mode: 'ssr' })
      expect(html).toContain('Slide content')
    })

    it('does not set data-render-mode attribute', () => {
      const html = assembleHtml([], minimalDeck, midnightTheme, { mode: 'ssr' })
      expect(html).not.toContain('data-render-mode')
    })
  })
})
