import type { TemplateDefinition } from '../../types/index.js'

export const closing: TemplateDefinition = {
  id: 'closing',
  name: 'Closing / CTA',
  category: 'narrative',
  description: 'Final slide with a key takeaway, call-to-action, or thank-you message. Leaves the audience with the most important next step.',
  slots: [
    {
      id: 'headline',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10, recommendedChars: 50 },
    },
    {
      id: 'cta',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 60, maxWords: 8 },
    },
    {
      id: 'contact',
      accepts: ['text', 'list'],
      required: false,
      contentBudget: { maxChars: 120, maxWords: 20 },
    },
    {
      id: 'logo',
      accepts: ['media'],
      required: false,
      contentBudget: {},
    },
  ],
  layoutModes: ['auto', 'centered'],
  aiHints: {
    whenToUse: 'Last slide of any deck',
    goodFor: ['deck closings', 'sales decks', 'conference talks', 'demos'],
    avoid: ['mid-deck positions'],
    suggestedFollowUp: [],
  },
}
