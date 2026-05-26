import type { RichText, InlineNode } from '@deckohq/core'
import { escapeHtml, escapeAttr } from './utils/escape.js'

function renderInlineNode(node: InlineNode): string {
  let inner = escapeHtml(node.text)

  // Innermost formatting first
  if (node.code) inner = `<code>${inner}</code>`
  if (node.bold) inner = `<strong>${inner}</strong>`
  if (node.italic) inner = `<em>${inner}</em>`
  if (node.underline) inner = `<u>${inner}</u>`
  if (node.strike) inner = `<s>${inner}</s>`

  // Collect style attributes
  const styles: string[] = []
  if (node.color) styles.push(`color:${node.color}`)
  if (node.bg) styles.push(`background:${node.bg}`)
  if (node.size) styles.push(`font-size:var(--decko-text-${node.size})`)
  if (node.font) styles.push(`font-family:var(--decko-font-${node.font})`)

  const styleAttr = styles.length ? ` style="${styles.join(';')}"` : ''

  if (node.link) {
    const targetAttr = node.link.target ? ` target="${node.link.target}"` : ''
    return `<a href="${escapeAttr(node.link.href)}"${targetAttr}${styleAttr}>${inner}</a>`
  }

  if (styleAttr) {
    return `<span${styleAttr}>${inner}</span>`
  }

  return inner
}

export function renderRichText(rt: RichText): string {
  if (typeof rt === 'string') return escapeHtml(rt)
  return rt.map(renderInlineNode).join('')
}
