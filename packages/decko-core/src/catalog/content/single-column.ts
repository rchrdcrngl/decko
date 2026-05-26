import type { TemplateDefinition } from '../../types/index.js'

export const singleColumn: TemplateDefinition = {
  id: 'single-column',
  name: 'Single Column',
  category: 'content',
  description: 'A title with a single body block below it. The simplest content layout.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'body',
      accepts: ['text', 'list', 'callout'],
      required: true,
      contentBudget: { maxChars: 500, maxWords: 80, maxLines: 8 },
    },
  ],
  layoutModes: ['auto', 'top-heavy'],
  aiHints: {
    whenToUse: 'When the content is a single focused point with supporting explanation',
    goodFor: ['explanations', 'definitions', 'short paragraphs', 'key principles'],
    avoid: ['multiple equal-weight points', 'data-heavy content'],
    suggestedFollowUp: ['two-column', 'bullets-media', 'header-body'],
  },
}
