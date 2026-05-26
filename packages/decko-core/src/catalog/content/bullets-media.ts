import type { TemplateDefinition } from '../../types/index.js'

export const bulletsMedia: TemplateDefinition = {
  id: 'bullets-media',
  name: 'Bullets + Media',
  category: 'content',
  description: 'A title with bullet points on one side and a supporting image or diagram on the other.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'bullets',
      accepts: ['list'],
      required: true,
      contentBudget: { maxChars: 300, maxWords: 50, maxLines: 6 },
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
      contentBudget: { maxChars: 80, maxWords: 15 },
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'When explaining a concept that benefits from both text and a visual aid',
    goodFor: ['feature explanations', 'how-it-works slides', 'architecture diagrams with annotations'],
    avoid: ['when the image is decorative only — use two-column with media instead'],
    suggestedFollowUp: ['two-column', 'header-body', 'code-walkthrough'],
  },
}
