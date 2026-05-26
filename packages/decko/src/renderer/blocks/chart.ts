import type { ChartBlock } from '@deckohq/core'
import { escapeHtml } from '../utils/escape.js'

export function renderChartBlock(block: ChartBlock): string {
  const display = block.display ?? 'minimal'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const chartJson = escapeHtml(JSON.stringify({ chartType: block.chartType, data: block.data }))
  const caption = block.title
    ? `<figcaption class="decko-chart__title">${escapeHtml(block.title)}</figcaption>`
    : ''
  return `<figure${idAttr} class="decko-chart decko-chart--${display}">
  <canvas data-chart="${chartJson}"></canvas>${caption ? `\n  ${caption}` : ''}
</figure>`
}
