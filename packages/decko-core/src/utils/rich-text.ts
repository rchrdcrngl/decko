import type { RichText, InlineNode } from '../types/index.js'

export function isRichTextString(rt: RichText): rt is string {
  return typeof rt === 'string'
}

export function richTextToPlainString(rt: RichText): string {
  if (typeof rt === 'string') return rt
  return rt.map((node) => node.text).join('')
}

export function resolveVariables(rt: RichText, variables: Record<string, string>): RichText {
  if (typeof rt === 'string') {
    return rt.replace(/\{\{(\w+)\}\}/g, (match, key: string) => variables[key] ?? match)
  }
  return rt.map((node): InlineNode => ({
    ...node,
    text: node.text.replace(/\{\{(\w+)\}\}/g, (match, key: string) => variables[key] ?? match),
  }))
}
