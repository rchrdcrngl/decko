import type { TemplateDefinition } from '../../types/index.js'

export const sectionBreak: TemplateDefinition = {
  id: 'section-break',
  name: 'Section Break',
  category: 'narrative',
  description: 'A visual divider between major sections of a deck. Contains a section number or label and a section title.',
  slots: [
    {
      id: 'label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 20, maxWords: 3 },
    },
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 60, maxWords: 8, recommendedChars: 40 },
    },
    {
      id: 'description',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 120, maxWords: 20 },
    },
  ],
  layoutModes: ['auto', 'centered', 'bottom-heavy'],
  aiHints: {
    whenToUse: 'Between major sections, chapters, or topics in a long deck',
    goodFor: ['long decks', 'multi-topic presentations', 'structured narratives'],
    avoid: ['short decks under 6 slides', 'single-topic decks'],
    suggestedFollowUp: ['header-body', 'two-column', 'title-slide'],
  },
}
