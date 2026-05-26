import type { TemplateDefinition } from '../../types/index.js'

export const tableSlide: TemplateDefinition = {
  id: 'table-slide',
  name: 'Table',
  category: 'data',
  description: 'A full-width table with an optional title and footnote. For structured comparisons and data grids.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'table',
      accepts: ['table'],
      required: true,
      contentBudget: { maxLines: 12 },
    },
    {
      id: 'footnote',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 120, maxWords: 20 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'When presenting structured data that requires rows and columns',
    goodFor: ['feature comparison matrices', 'pricing tables', 'data summaries', 'schedules'],
    avoid: ['tables with more than 10 rows — split into multiple slides', 'tables with more than 6 columns'],
    suggestedFollowUp: ['chart-callout', 'metric-trio', 'header-body'],
  },
}
