import type { TemplateDefinition } from '../../types/index.js'

export const imageGrid: TemplateDefinition = {
  id: 'image-grid',
  name: 'Image Grid',
  category: 'visual',
  description: 'A 2×2 grid of images or media blocks. For showcasing a collection, team photos, or product variants.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 60, maxWords: 8 },
    },
    {
      id: 'image-1',
      accepts: ['media'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'image-2',
      accepts: ['media'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'image-3',
      accepts: ['media'],
      required: false,
      contentBudget: {},
    },
    {
      id: 'image-4',
      accepts: ['media'],
      required: false,
      contentBudget: {},
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'Showcasing multiple visuals of equal importance — products, team, portfolio',
    goodFor: ['portfolios', 'product galleries', 'team pages', 'case study visuals'],
    avoid: ['more than 4 images on one slide', 'images with text that needs to be readable'],
    suggestedFollowUp: ['full-bleed-media', 'media-caption', 'header-body'],
  },
}
