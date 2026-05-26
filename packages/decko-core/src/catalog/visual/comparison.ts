import type { TemplateDefinition } from '../../types/index.js'

export const comparison: TemplateDefinition = {
  id: 'comparison',
  name: 'Comparison',
  category: 'visual',
  description: 'Side-by-side before/after or option A vs option B layout with visual blocks and labels.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'left-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'right-label',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 30, maxWords: 4 },
    },
    {
      id: 'left',
      accepts: ['media', 'text', 'list'],
      required: true,
      contentBudget: { maxChars: 250, maxWords: 40, maxLines: 5 },
    },
    {
      id: 'right',
      accepts: ['media', 'text', 'list'],
      required: true,
      contentBudget: { maxChars: 250, maxWords: 40, maxLines: 5 },
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'Explicit before/after or option A vs B comparison where the visual contrast matters',
    goodFor: ['design comparisons', 'before/after results', 'product variants', 'approach tradeoffs'],
    avoid: ['when one option is clearly superior — use a callout instead', 'more than 2 options'],
    suggestedFollowUp: ['two-column', 'header-body', 'bullets-media'],
  },
}
