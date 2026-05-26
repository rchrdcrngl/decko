import type { TemplateDefinition } from '../../types/index.js'

export const mediaCaption: TemplateDefinition = {
  id: 'media-caption',
  name: 'Media + Caption',
  category: 'visual',
  description: 'A large media block with a title and caption below. For annotated screenshots, diagrams, or product images.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'media',
      accepts: ['media'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'caption',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 150, maxWords: 25 },
    },
  ],
  layoutModes: ['auto', 'top-heavy'],
  aiHints: {
    whenToUse: 'When a screenshot or diagram needs a label and brief explanation',
    goodFor: ['product screenshots', 'UI demos', 'annotated diagrams', 'before/after images'],
    avoid: ['when text is as important as the image — use bullets-media instead'],
    suggestedFollowUp: ['header-body', 'bullets-media', 'two-column'],
  },
}
