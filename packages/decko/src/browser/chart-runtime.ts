import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface ChartPayload {
  chartType: 'bar' | 'line' | 'pie' | 'donut' | 'scatter'
  data: {
    labels: string[]
    datasets: Array<{ label?: string; values: number[]; color?: string }>
  }
}

function toChartJsType(type: ChartPayload['chartType']): string {
  return type === 'donut' ? 'doughnut' : type
}

function buildDatasets(payload: ChartPayload) {
  return payload.data.datasets.map((ds) => ({
    label: ds.label ?? '',
    data: ds.values,
    backgroundColor: ds.color,
    borderColor: ds.color,
  }))
}

export function hydrateCharts(root: ParentNode = document): void {
  const canvases = root.querySelectorAll<HTMLCanvasElement>('canvas[data-chart]')
  for (const canvas of canvases) {
    const raw = canvas.getAttribute('data-chart')
    if (!raw) continue
    let payload: ChartPayload
    try {
      payload = JSON.parse(raw) as ChartPayload
    } catch {
      continue
    }
    new Chart(canvas, {
      type: toChartJsType(payload.chartType) as never,
      data: {
        labels: payload.data.labels,
        datasets: buildDatasets(payload),
      },
      options: { responsive: true, animation: false },
    })
  }
}
