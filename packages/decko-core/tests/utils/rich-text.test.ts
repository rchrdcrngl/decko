import { describe, it, expect } from 'vitest'
import {
  isRichTextString,
  richTextToPlainString,
  resolveVariables,
} from '../../src/utils/rich-text.js'

describe('isRichTextString()', () => {
  it('returns true for a string', () => {
    expect(isRichTextString('hello')).toBe(true)
  })

  it('returns false for an InlineNode array', () => {
    expect(isRichTextString([{ text: 'hi' }])).toBe(false)
  })
})

describe('richTextToPlainString()', () => {
  it('returns the string unchanged for a plain string input', () => {
    expect(richTextToPlainString('hello world')).toBe('hello world')
  })

  it('concatenates text from InlineNode array', () => {
    const nodes = [{ text: 'Hello' }, { text: ' ' }, { text: 'World', bold: true }]
    expect(richTextToPlainString(nodes)).toBe('Hello World')
  })

  it('returns empty string for an empty string input', () => {
    expect(richTextToPlainString('')).toBe('')
  })
})

describe('resolveVariables()', () => {
  it('replaces {{TOKEN}} in a plain string', () => {
    expect(resolveVariables('Hello {{NAME}}', { NAME: 'Alice' })).toBe('Hello Alice')
  })

  it('replaces multiple tokens in a plain string', () => {
    expect(resolveVariables('{{COMPANY}} — {{YEAR}}', { COMPANY: 'Acme', YEAR: '2025' })).toBe(
      'Acme — 2025',
    )
  })

  it('leaves unresolved tokens unchanged when variable not provided', () => {
    expect(resolveVariables('Hello {{UNKNOWN}}', {})).toBe('Hello {{UNKNOWN}}')
  })

  it('replaces tokens in each InlineNode text', () => {
    const nodes = [{ text: 'Welcome to {{COMPANY}}', bold: true }]
    const result = resolveVariables(nodes, { COMPANY: 'Decko' })
    expect(Array.isArray(result)).toBe(true)
    if (Array.isArray(result)) {
      expect(result[0]?.text).toBe('Welcome to Decko')
    }
  })

  it('preserves InlineNode formatting when resolving variables', () => {
    const nodes = [{ text: '{{COMPANY}}', bold: true, color: '#FF0000' }]
    const result = resolveVariables(nodes, { COMPANY: 'Decko' })
    if (Array.isArray(result)) {
      expect(result[0]?.bold).toBe(true)
      expect(result[0]?.color).toBe('#FF0000')
    }
  })

  it('handles empty variables map', () => {
    const result = resolveVariables('{{NAME}}', {})
    expect(result).toBe('{{NAME}}')
  })
})
