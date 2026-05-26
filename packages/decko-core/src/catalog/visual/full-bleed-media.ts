import type { TemplateDefinition } from '../../types/index.js'

export const fullBleedMedia: TemplateDefinition = {
  id: 'full-bleed-media',
  name: 'Full Bleed Media',
  category: 'visual',
  description: 'A full-screen image or video with an optional text overlay. Maximum visual impact.',
  slots: [
    {
      id: 'media',
      accepts: ['media'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'overlay-text',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 12 },
    },
    {
      id: 'caption',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 15 },
    },
  ],
  layoutModes: ['auto', 'centered', 'bottom-heavy'],
  aiHints: {
    whenToUse: 'When a strong visual needs to breathe — product photos, architectural diagrams, inspiring imagery',
    goodFor: ['product launches', 'visual storytelling', 'photography', 'impact moments'],
    avoid: ['slides with significant amounts of text', 'data slides'],
    suggestedFollowUp: ['header-body', 'bullets-media', 'quote'],
  },
}
