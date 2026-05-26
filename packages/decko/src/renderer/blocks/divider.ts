import type { DividerBlock } from '@deckohq/core'

export function renderDividerBlock(block: DividerBlock): string {
  const display = block.display ?? 'line'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  return `<hr${idAttr} class="decko-divider decko-divider--${display}">`
}
