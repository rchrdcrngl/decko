import type { TemplateDefinition } from '../../types/index.js'

export const architectureDiagram: TemplateDefinition = {
  id: 'architecture-diagram',
  name: 'Architecture Diagram',
  category: 'technical',
  description: 'A large diagram or system architecture image with a title and supporting bullet points.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'diagram',
      accepts: ['media'],
      required: true,
      contentBudget: {},
    },
    {
      id: 'notes',
      accepts: ['list', 'text'],
      required: false,
      contentBudget: { maxChars: 300, maxWords: 50, maxLines: 6 },
    },
  ],
  layoutModes: ['auto', 'split', 'top-heavy'],
  aiHints: {
    whenToUse: 'Presenting system diagrams, infrastructure layouts, or data flow with explanatory bullets',
    goodFor: ['architecture reviews', 'technical design docs', 'engineering all-hands', 'system overviews'],
    avoid: ['diagrams without explanation for non-technical audiences'],
    suggestedFollowUp: ['code-walkthrough', 'bullets-media', 'two-column'],
  },
}
