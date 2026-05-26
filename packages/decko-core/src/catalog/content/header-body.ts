import type { TemplateDefinition } from '../../types/index.js'

export const headerBody: TemplateDefinition = {
  id: 'header-body',
  name: 'Header + Body',
  category: 'content',
  description: 'A prominent title, an optional subtitle, and a flexible body slot. The workhorse content template.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 12, recommendedChars: 55 },
    },
    {
      id: 'subtitle',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 120, maxWords: 20 },
    },
    {
      id: 'body',
      accepts: ['text', 'list', 'callout', 'code', 'table'],
      required: true,
      contentBudget: { maxChars: 600, maxWords: 100, maxLines: 10 },
    },
  ],
  layoutModes: ['auto', 'top-heavy'],
  aiHints: {
    whenToUse: 'When you need a clear heading with supporting content below — the default for most content slides',
    goodFor: ['explanations', 'feature descriptions', 'process steps', 'key points'],
    avoid: ['when equal visual weight between two topics is needed — use two-column instead'],
    suggestedFollowUp: ['two-column', 'single-column', 'kpi-dashboard'],
  },
}
