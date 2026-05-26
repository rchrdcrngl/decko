import { describe, it, expect } from 'vitest'
import { RichTextSchema, InlineNodeSchema } from '../../src/schemas/rich-text.js'

describe('RichTextSchema', () => {
  it('accepts a plain string', () => {
    expect(RichTextSchema.safeParse('hello world').success).toBe(true)
  })

  it('accepts an empty string', () => {
    expect(RichTextSchema.safeParse('').success).toBe(true)
  })

  it('accepts an array of InlineNodes', () => {
    const nodes = [{ text: 'hello' }, { text: ' world', bold: true }]
    expect(RichTextSchema.safeParse(nodes).success).toBe(true)
  })

  it('rejects an empty array', () => {
    expect(RichTextSchema.safeParse([]).success).toBe(false)
  })

  it('rejects null', () => {
    expect(RichTextSchema.safeParse(null).success).toBe(false)
  })

  it('rejects a number', () => {
    expect(RichTextSchema.safeParse(42).success).toBe(false)
  })
})

describe('InlineNodeSchema', () => {
  it('accepts a minimal node with only text', () => {
    expect(InlineNodeSchema.safeParse({ text: 'hi' }).success).toBe(true)
  })

  it('accepts all optional formatting flags', () => {
    const node = {
      text: 'styled',
      bold: true,
      italic: true,
      underline: true,
      strike: true,
      code: true,
      color: '#FF0000',
      bg: '#000000',
      size: 'lg',
      font: 'mono',
    }
    expect(InlineNodeSchema.safeParse(node).success).toBe(true)
  })

  it('accepts a link node', () => {
    const node = { text: 'click me', link: { href: 'https://example.com', target: '_blank' } }
    expect(InlineNodeSchema.safeParse(node).success).toBe(true)
  })

  it('rejects a link with an invalid URL', () => {
    const node = { text: 'bad link', link: { href: 'not-a-url' } }
    expect(InlineNodeSchema.safeParse(node).success).toBe(false)
  })

  it('rejects unknown size values', () => {
    const node = { text: 'hi', size: 'xxl' }
    expect(InlineNodeSchema.safeParse(node).success).toBe(false)
  })

  it('rejects unknown font values', () => {
    const node = { text: 'hi', font: 'comic-sans' }
    expect(InlineNodeSchema.safeParse(node).success).toBe(false)
  })

  it('rejects a node with no text field', () => {
    expect(InlineNodeSchema.safeParse({ bold: true }).success).toBe(false)
  })
})
