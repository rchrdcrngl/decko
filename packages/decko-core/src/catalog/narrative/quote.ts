import type { TemplateDefinition } from '../../types/index.js'

export const quote: TemplateDefinition = {
  id: 'quote',
  name: 'Pull Quote',
  category: 'narrative',
  description: 'A full-bleed slide dominated by a single impactful quote or testimonial. Visual breathing room with strong typography.',
  slots: [
    {
      id: 'quote',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 200, maxWords: 35, recommendedChars: 120 },
    },
    {
      id: 'attribution',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 12 },
    },
    {
      id: 'avatar',
      accepts: ['media'],
      required: false,
      contentBudget: {},
    },
  ],
  layoutModes: ['auto', 'centered'],
  aiHints: {
    whenToUse: 'When you have a striking quote, customer testimonial, or mission statement that deserves its own slide',
    goodFor: ['testimonials', 'mission statements', 'inspirational quotes', 'customer wins'],
    avoid: ['multiple quotes', 'long block quotes over 40 words'],
    suggestedFollowUp: ['header-body', 'kpi-dashboard', 'two-column'],
  },
}
