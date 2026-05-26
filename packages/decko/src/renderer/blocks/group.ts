import type { GroupBlock } from '@deckohq/core'
import type { Block } from '@deckohq/core'

// Forward reference resolved at runtime — avoids circular import with block-renderer
let _renderBlock: (block: Block) => string

export function initGroupRenderer(renderBlock: (block: Block) => string): void {
  _renderBlock = renderBlock
}

export function renderGroupBlock(block: GroupBlock): string {
  const display = block.display ?? 'columns'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const children = block.blocks.map((b) => _renderBlock(b)).join('')
  return `<div${idAttr} class="decko-group decko-group--${display}">${children}</div>`
}
