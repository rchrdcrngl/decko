import type { TemplateDefinition } from '../../types/index.js'

export const agenda: TemplateDefinition = {
  id: 'agenda',
  name: 'Agenda',
  category: 'narrative',
  description: 'An outline slide listing the topics or sections to be covered. Best placed near the start of the deck.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 40, maxWords: 5 },
    },
    {
      id: 'items',
      accepts: ['list'],
      required: true,
      contentBudget: { maxLines: 7, maxChars: 280, maxWords: 50 },
    },
  ],
  layoutModes: ['auto', 'centered', 'top-heavy'],
  aiHints: {
    whenToUse: 'Second or third slide of a structured deck to set audience expectations',
    goodFor: ['structured decks', 'training material', 'long presentations'],
    avoid: ['short decks under 5 slides', 'decks with a single topic'],
    suggestedFollowUp: ['section-break', 'header-body', 'two-column'],
  },
}
