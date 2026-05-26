import type { TemplateDefinition } from '../../types/index.js'

export const bigMetric: TemplateDefinition = {
  id: 'big-metric',
  name: 'Big Metric',
  category: 'data',
  description: 'A single dominant metric displayed at large scale with supporting context. Best for "the number that matters".',
  slots: [
    {
      id: 'metric',
      accepts: ['metric'],
      required: true,
      contentBudget: { maxChars: 20, maxWords: 4 },
    },
    {
      id: 'context',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 150, maxWords: 25 },
    },
    {
      id: 'eyebrow',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 40, maxWords: 6 },
    },
  ],
  layoutModes: ['auto', 'centered'],
  aiHints: {
    whenToUse: 'When a single number tells the entire story — revenue, growth rate, NPS, users',
    goodFor: ['executive summaries', 'milestone announcements', 'fundraising decks'],
    avoid: ['multiple metrics — use metric-trio instead', 'metrics that need explanation longer than 2 sentences'],
    suggestedFollowUp: ['metric-trio', 'chart-callout', 'header-body'],
  },
}
