import type { TemplateDefinition } from '../../types/index.js'

export const threeUp: TemplateDefinition = {
  id: 'three-up',
  name: 'Three Up',
  category: 'content',
  description: 'A title with three equal content blocks side by side. Good for three pillars, three benefits, or three options.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'col-1',
      accepts: ['text', 'list', 'callout', 'metric'],
      required: true,
      contentBudget: { maxChars: 200, maxWords: 35, maxLines: 5 },
    },
    {
      id: 'col-2',
      accepts: ['text', 'list', 'callout', 'metric'],
      required: true,
      contentBudget: { maxChars: 200, maxWords: 35, maxLines: 5 },
    },
    {
      id: 'col-3',
      accepts: ['text', 'list', 'callout', 'metric'],
      required: true,
      contentBudget: { maxChars: 200, maxWords: 35, maxLines: 5 },
    },
    {
      id: 'col-1-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'col-2-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'col-3-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'When presenting exactly three parallel concepts, benefits, or categories',
    goodFor: ['three pillars', 'three-step process', 'feature comparison', 'three benefits'],
    avoid: ['more or fewer than 3 items — use bullets for variable counts', 'deeply nested content'],
    suggestedFollowUp: ['header-body', 'two-column', 'kpi-dashboard'],
  },
}
