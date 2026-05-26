import type { CodeBlock } from '@decko/core'
import { escapeHtml } from '../utils/escape.js'

export function renderCodeBlock(block: CodeBlock): string {
  const langClass = block.language ? ` class="language-${block.language}"` : ''
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const display = block.display ?? 'block'
  return `<pre${idAttr} class="decko-code decko-code--${display}"><code${langClass}>${escapeHtml(block.code)}</code></pre>`
}
