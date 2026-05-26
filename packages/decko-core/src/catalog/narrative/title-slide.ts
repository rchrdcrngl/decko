import type { TemplateDefinition } from '../../types/index.js'

export const titleSlide: TemplateDefinition = {
  id: 'title-slide',
  name: 'Title Slide',
  category: 'narrative',
  description: 'Opening slide with a dominant headline and optional subtitle. Used to introduce a deck, announce a topic, or set the scene.',
  slots: [
    {
      id: 'headline',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10, recommendedChars: 50 },
    },
    {
      id: 'subtitle',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 120, maxWords: 20, recommendedChars: 80 },
    },
    {
      id: 'eyebrow',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 40, maxWords: 6 },
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
    whenToUse: 'First slide of any deck, or when starting a new major section',
    goodFor: ['deck openers', 'conference talks', 'product launches', 'section intros'],
    avoid: ['mid-deck content slides', 'data-heavy slides'],
    suggestedFollowUp: ['agenda', 'section-break', 'header-body'],
  },
}
