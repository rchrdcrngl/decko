import type { KineticTextBlock, TextBlock } from '@deckohq/core'
import { renderRichText } from '../rich-text-renderer.js'

const DISPLAY_TAG: Record<string, string> = {
  heading: 'h1',
  subheading: 'h2',
  hero: 'h1',
  eyebrow: 'p',
  label: 'p',
  caption: 'p',
  quote: 'blockquote',
  body: 'p',
}

export function renderTextBlock(block: TextBlock): string {
  const tag = DISPLAY_TAG[block.display ?? 'body'] ?? 'p'
  const display = block.display ?? 'body'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  return `<${tag}${idAttr} class="decko-text decko-text--${display}">${renderRichText(block.content)}</${tag}>`
}

export function renderKineticTextBlock(block: KineticTextBlock): string {
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const ghostClass = block.ghost ? ' decko-text-kinetic--ghost' : ''

  const styles: string[] = []
  if (block.fontSize) styles.push(`font-size:${block.fontSize}`)
  if (block.color) styles.push(`color:${block.color}`)
  if (block.fontFamily) styles.push(`font-family:${block.fontFamily}`)
  if (block.fontWeight !== undefined) styles.push(`font-weight:${block.fontWeight}`)
  if (block.letterSpacing) styles.push(`letter-spacing:${block.letterSpacing}`)

  const styleAttr = styles.length ? ` style="${styles.join(';')}"` : ''
  return `<div${idAttr} class="decko-text-kinetic${ghostClass}"${styleAttr}>${block.content}</div>`
}
