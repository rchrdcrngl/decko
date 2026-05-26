import type { Block } from '@decko/core'
import {
  renderTextBlock,
  renderKineticTextBlock,
  renderCodeBlock,
  renderListBlock,
  renderMediaBlock,
  renderMetricBlock,
  renderChartBlock,
  renderTableBlock,
  renderGroupBlock,
  initGroupRenderer,
  renderCalloutBlock,
  renderDividerBlock,
  renderCustomBlock,
} from './blocks/index.js'

// Wire up group renderer with this dispatcher (resolves circular dependency)
initGroupRenderer(renderBlock)

export function renderBlock(block: Block): string {
  switch (block.type) {
    case 'text':
      return renderTextBlock(block)
    case 'text-kinetic':
      return renderKineticTextBlock(block)
    case 'code':
      return renderCodeBlock(block)
    case 'list':
      return renderListBlock(block)
    case 'media':
      return renderMediaBlock(block)
    case 'metric':
      return renderMetricBlock(block)
    case 'chart':
      return renderChartBlock(block)
    case 'table':
      return renderTableBlock(block)
    case 'group':
      return renderGroupBlock(block)
    case 'callout':
      return renderCalloutBlock(block)
    case 'divider':
      return renderDividerBlock(block)
    default:
      // x-* custom blocks
      return renderCustomBlock(block)
  }
}
