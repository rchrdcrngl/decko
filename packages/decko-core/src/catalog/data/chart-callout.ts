import type { TemplateDefinition } from '../../types/index.js'

export const chartCallout: TemplateDefinition = {
  id: 'chart-callout',
  name: 'Chart + Callout',
  category: 'data',
  description: 'A chart on one side with a highlighted takeaway or metric callout on the other.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'chart',
      accepts: ['chart'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'callout',
      accepts: ['metric', 'callout', 'text'],
      required: true,
      contentBudget: { maxChars: 150, maxWords: 25 },
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'When a chart needs a highlighted insight — the number that matters most from the chart',
    goodFor: ['trend analysis', 'performance reviews', 'data storytelling'],
    avoid: ['when the chart alone tells the story — use header-body instead'],
    suggestedFollowUp: ['metric-trio', 'table-slide', 'header-body'],
  },
}
