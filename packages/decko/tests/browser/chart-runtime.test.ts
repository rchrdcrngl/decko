// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { hydrateCharts } from '../../src/browser/chart-runtime.js'

// Chart.js uses canvas context — mock it for jsdom
beforeEach(() => {
  HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
    canvas: { width: 300, height: 150 },
  })
})

describe('hydrateCharts()', () => {
  it('does nothing when no canvas[data-chart] elements exist', () => {
    document.body.innerHTML = '<div></div>'
    expect(() => hydrateCharts()).not.toThrow()
  })

  it('skips canvas missing data-chart attribute', () => {
    document.body.innerHTML = '<canvas></canvas>'
    expect(() => hydrateCharts()).not.toThrow()
  })

  it('does not throw for valid chart data', () => {
    const data = JSON.stringify({
      chartType: 'bar',
      data: { labels: ['A', 'B'], datasets: [{ values: [1, 2] }] },
    })
    document.body.innerHTML = `<canvas data-chart="${data.replace(/"/g, '&quot;')}"></canvas>`
    expect(() => hydrateCharts()).not.toThrow()
  })

  it('skips canvas with malformed JSON silently', () => {
    document.body.innerHTML = `<canvas data-chart="not-json"></canvas>`
    expect(() => hydrateCharts()).not.toThrow()
  })
})
