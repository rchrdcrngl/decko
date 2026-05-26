import type { ListBlock, ListItem } from '@deckohq/core'
import { renderRichText } from '../rich-text-renderer.js'

function renderItem(item: ListItem): string {
  const checkedAttr = item.checked !== undefined ? ` data-checked="${item.checked}"` : ''
  const icon = item.icon ? `<span class="decko-list__icon" aria-hidden="true">${item.icon}</span>` : ''
  const children =
    item.children && item.children.length > 0
      ? `<ul class="decko-list__nested">${item.children.map(renderItem).join('')}</ul>`
      : ''
  return `<li${checkedAttr}>${icon}${renderRichText(item.text)}${children}</li>`
}

export function renderListBlock(block: ListBlock): string {
  const display = block.display ?? 'bullets'
  const isOrdered = display === 'numbered' || display === 'steps'
  const tag = isOrdered ? 'ol' : 'ul'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const items = block.items.map(renderItem).join('')
  return `<${tag}${idAttr} class="decko-list decko-list--${display}">${items}</${tag}>`
}
