import type { TemplateDefinition } from '../../types/index.js'

export const metricTrio: TemplateDefinition = {
  id: 'metric-trio',
  name: 'Metric Trio',
  category: 'data',
  description: 'Three key metrics displayed side by side. Used for KPI summaries and dashboards.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 60, maxWords: 8 },
    },
    {
      id: 'metric-1',
      accepts: ['metric'],
      required: true,
      contentBudget: { maxChars: 20 },
    },
    {
      id: 'metric-2',
      accepts: ['metric'],
      required: true,
      contentBudget: { maxChars: 20 },
    },
    {
      id: 'metric-3',
      accepts: ['metric'],
      required: true,
      contentBudget: { maxChars: 20 },
    },
    {
      id: 'footnote',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 100, maxWords: 15 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'KPI summary slides showing 3 headline numbers at a glance',
    goodFor: ['quarterly reviews', 'progress updates', 'executive summaries'],
    avoid: ['more than 3 metrics — add a table instead', 'metrics without clear labels'],
    suggestedFollowUp: ['chart-callout', 'big-metric', 'header-body'],
  },
}
