import type { TableBlock } from '@deckohq/core'
import { escapeHtml } from '../utils/escape.js'
import { renderRichText } from '../rich-text-renderer.js'

export function renderTableBlock(block: TableBlock): string {
  const display = block.display ?? 'default'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const headers = block.headers.map((h) => `<th>${renderRichText(h)}</th>`).join('')
  const rows = block.rows
    .map((row) => `<tr>${row.map((cell) => `<td>${renderRichText(cell)}</td>`).join('')}</tr>`)
    .join('')
  const caption = block.caption
    ? `<caption>${escapeHtml(block.caption)}</caption>`
    : ''
  return `<table class="decko-table decko-table--${display}"${idAttr}>${caption}<thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
}
