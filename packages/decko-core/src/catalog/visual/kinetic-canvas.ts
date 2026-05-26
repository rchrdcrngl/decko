import type { TemplateDefinition } from '../../types/index.js'

// Freeform kinetic typography canvas. Slots are absolutely positioned via
// the slide's slotStyles map — no fixed layout enforced by the template.
export const kineticCanvas: TemplateDefinition = {
  id: 'kinetic-canvas',
  name: 'Kinetic Canvas',
  category: 'visual',
  description:
    'Freeform canvas for kinetic typography. Place text-kinetic blocks anywhere on screen via slotStyles. Ideal for bold cinematic title slides, brand reveals, and motion-graphic-style sequences.',
  slots: [
    {
      id: 'bg',
      accepts: ['text-kinetic', 'media'],
      required: false,
      contentBudget: { maxChars: 40 },
    },
    {
      id: 'word-1',
      accepts: ['text-kinetic', 'text'],
      required: true,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'word-2',
      accepts: ['text-kinetic', 'text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'word-3',
      accepts: ['text-kinetic', 'text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'word-4',
      accepts: ['text-kinetic', 'text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'word-5',
      accepts: ['text-kinetic', 'text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'caption',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 12 },
    },
    {
      id: 'accent',
      accepts: ['divider', 'text-kinetic'],
      required: false,
      contentBudget: { maxChars: 20 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse:
      'When you need an art-directed, full-bleed typographic layout with words scattered across the canvas. Use slotStyles to position each slot absolutely.',
    goodFor: [
      'keynote openers',
      'brand reveal slides',
      'cinematic section breaks',
      'product launch moments',
    ],
    avoid: ['content-heavy slides', 'data slides', 'any slide with more than 5 short words'],
    suggestedFollowUp: ['kinetic-hero', 'section-break', 'title-slide'],
  },
}
