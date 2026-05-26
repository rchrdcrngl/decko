import type { XBlock } from '@decko/core'
import { escapeAttr, escapeHtml } from '../utils/escape.js'

export function renderCustomBlock(block: XBlock): string {
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const propsJson = escapeAttr(JSON.stringify(block.props))
  return `<div${idAttr} class="decko-block decko-block--custom" data-block-type="${escapeHtml(block.type)}" data-props="${propsJson}"></div>`
}
