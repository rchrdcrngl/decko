import type { MetricBlock } from '@decko/core'
import { escapeHtml } from '../utils/escape.js'
import { renderRichText } from '../rich-text-renderer.js'

export function renderMetricBlock(block: MetricBlock): string {
  const display = block.display ?? 'kpi'
  const idAttr = block.id ? ` id="${block.id}"` : ''
  const trendClass = block.trend ? ` decko-metric--trend trend--${block.trend}` : ''
  const value = escapeHtml(String(block.value))
  const delta = block.delta
    ? `<span class="decko-metric__delta">${escapeHtml(block.delta)}</span>`
    : ''
  return `<div${idAttr} class="decko-metric decko-metric--${display}${trendClass}">
  <span class="decko-metric__value">${value}</span>
  <span class="decko-metric__label">${renderRichText(block.label)}</span>${delta ? `\n  ${delta}` : ''}
</div>`
}
