import type { TemplateDefinition } from '../../types/index.js'

export const twoColumn: TemplateDefinition = {
  id: 'two-column',
  name: 'Two Column',
  category: 'content',
  description: 'A title with two equal side-by-side content columns. Good for comparisons, pros/cons, or two parallel concepts.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'left',
      accepts: ['text', 'list', 'callout', 'media'],
      required: true,
      contentBudget: { maxChars: 300, maxWords: 50, maxLines: 6 },
    },
    {
      id: 'right',
      accepts: ['text', 'list', 'callout', 'media'],
      required: true,
      contentBudget: { maxChars: 300, maxWords: 50, maxLines: 6 },
    },
    {
      id: 'left-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 5 },
    },
    {
      id: 'right-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 5 },
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'When presenting two parallel or contrasting ideas with equal visual weight',
    goodFor: ['comparisons', 'pros and cons', 'before/after', 'two approaches'],
    avoid: ['more than two ideas', 'very long text in either column'],
    suggestedFollowUp: ['single-column', 'bullets-media', 'header-body'],
  },
}
