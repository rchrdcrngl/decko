import { describe, it, expect } from 'vitest'
import { renderRichText } from '../../src/renderer/rich-text-renderer.js'

describe('renderRichText()', () => {
  describe('plain string input', () => {
    it('returns string unchanged when no special chars', () => {
      expect(renderRichText('hello world')).toBe('hello world')
    })

    it('escapes < > & in text', () => {
      expect(renderRichText('<script>alert("xss")</script>')).toBe(
        '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;',
      )
    })

    it('escapes ampersands', () => {
      expect(renderRichText('A & B')).toBe('A &amp; B')
    })

    it('returns empty string for empty input', () => {
      expect(renderRichText('')).toBe('')
    })
  })

  describe('InlineNode array input', () => {
    it('renders a plain text node', () => {
      expect(renderRichText([{ text: 'hello' }])).toBe('hello')
    })

    it('renders bold node as <strong>', () => {
      expect(renderRichText([{ text: 'bold', bold: true }])).toContain('<strong>')
      expect(renderRichText([{ text: 'bold', bold: true }])).toContain('</strong>')
    })

    it('renders italic node as <em>', () => {
      expect(renderRichText([{ text: 'italic', italic: true }])).toContain('<em>')
    })

    it('renders underline node as <u>', () => {
      expect(renderRichText([{ text: 'u', underline: true }])).toContain('<u>')
    })

    it('renders strike node as <s>', () => {
      expect(renderRichText([{ text: 'struck', strike: true }])).toContain('<s>')
    })

    it('renders inline code node as <code>', () => {
      expect(renderRichText([{ text: 'code', code: true }])).toContain('<code>')
    })

    it('renders link node as <a href>', () => {
      const html = renderRichText([{ text: 'click', link: { href: 'https://example.com' } }])
      expect(html).toContain('<a')
      expect(html).toContain('href="https://example.com"')
    })

    it('renders link with target="_blank"', () => {
      const html = renderRichText([
        { text: 'ext', link: { href: 'https://example.com', target: '_blank' } },
      ])
      expect(html).toContain('target="_blank"')
    })

    it('renders color via style attribute on span', () => {
      const html = renderRichText([{ text: 'colored', color: '#FF0000' }])
      expect(html).toContain('style=')
      expect(html).toContain('#FF0000')
    })

    it('concatenates multiple nodes', () => {
      const html = renderRichText([{ text: 'Hello' }, { text: ' ' }, { text: 'World', bold: true }])
      expect(html).toContain('Hello')
      expect(html).toContain('World')
      expect(html).toContain('<strong>')
    })

    it('escapes HTML chars in node text', () => {
      const html = renderRichText([{ text: '<b>not bold</b>' }])
      expect(html).not.toContain('<b>')
      expect(html).toContain('&lt;b&gt;')
    })
  })
})
