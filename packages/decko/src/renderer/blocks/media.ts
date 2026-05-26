import type { MediaBlock } from '@deckohq/core'
import { escapeAttr, escapeHtml } from '../utils/escape.js'
import { renderRichText } from '../rich-text-renderer.js'

export function renderMediaBlock(block: MediaBlock): string {
  const display = block.display ?? 'image'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const altAttr = block.alt ? ` alt="${escapeAttr(block.alt)}"` : ' alt=""'
  const caption = block.caption
    ? `<figcaption class="decko-media__caption">${renderRichText(block.caption)}</figcaption>`
    : ''

  let media: string
  if (display === 'video') {
    media = `<video src="${escapeAttr(block.src)}" class="decko-media__video" controls></video>`
  } else {
    media = `<img src="${escapeAttr(block.src)}"${altAttr} class="decko-media__img decko-media--${escapeHtml(display)}" loading="lazy">`
  }

  return `<figure${idAttr} class="decko-media decko-media--${display}">${media}${caption}</figure>`
}
