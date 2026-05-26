import type { TemplateDefinition } from '../../types/index.js'

// Pre-wired kinetic hero — mirrors the Scene 1 layout from keynote.html.
// word-1/3/5 are primary display text; word-2/4 are light ghost/accent text.
// Ghost bg word sits behind everything at near-zero opacity.
export const kineticHero: TemplateDefinition = {
  id: 'kinetic-hero',
  name: 'Kinetic Hero',
  category: 'visual',
  description:
    'Art-directed cinematic opener. Three large display words scattered diagonally with a ghost background word, two accent labels, and an optional tagline. Position each word via slotStyles for full control.',
  slots: [
    {
      id: 'ghost-bg',
      accepts: ['text-kinetic'],
      required: false,
      contentBudget: { maxChars: 20, maxWords: 1 },
    },
    {
      id: 'word-top',
      accepts: ['text-kinetic', 'text'],
      required: true,
      contentBudget: { maxChars: 20, maxWords: 2 },
    },
    {
      id: 'word-mid',
      accepts: ['text-kinetic', 'text'],
      required: true,
      contentBudget: { maxChars: 20, maxWords: 2 },
    },
    {
      id: 'word-bottom',
      accepts: ['text-kinetic', 'text'],
      required: true,
      contentBudget: { maxChars: 20, maxWords: 2 },
    },
    {
      id: 'label-top',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 5 },
    },
    {
      id: 'label-bottom',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 60, maxWords: 8 },
    },
    {
      id: 'tagline',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse:
      'Opening slide for product launches, keynotes, or brand reveals where maximum visual impact matters. Pairs with kinetic theme.',
    goodFor: [
      'product launch openers',
      'conference keynotes',
      'brand reveal slides',
      'creative agency pitches',
    ],
    avoid: ['content-heavy slides', 'slides with more than 3 main words', 'data presentations'],
    suggestedFollowUp: ['kinetic-canvas', 'section-break', 'title-slide'],
  },
}
