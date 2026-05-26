import type { CalloutBlock } from '@deckohq/core'
import { renderRichText } from '../rich-text-renderer.js'

export function renderCalloutBlock(block: CalloutBlock): string {
  const display = block.display ?? 'neutral'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const title = block.title
    ? `<p class="decko-callout__title">${renderRichText(block.title)}</p>`
    : ''
  return `<aside${idAttr} class="decko-callout decko-callout--${display}" role="note">${title}<p class="decko-callout__body">${renderRichText(block.body)}</p></aside>`
}
