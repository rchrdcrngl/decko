import type { TemplateDefinition } from '../../types/index.js'

export const codeWalkthrough: TemplateDefinition = {
  id: 'code-walkthrough',
  name: 'Code Walkthrough',
  category: 'technical',
  description: 'A title with a code block and an optional annotation or explanation alongside it.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'code',
      accepts: ['code'],
      required: true,
      contentBudget: { maxLines: 20 },
    },
    {
      id: 'annotation',
      accepts: ['text', 'list', 'callout'],
      required: false,
      contentBudget: { maxChars: 300, maxWords: 50, maxLines: 6 },
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'Showing code with an explanation — API examples, implementation patterns, configuration',
    goodFor: ['technical talks', 'API docs', 'library demos', 'developer onboarding'],
    avoid: ['very long code blocks that exceed 20 lines — split into multiple slides', 'non-technical audiences'],
    suggestedFollowUp: ['terminal', 'architecture-diagram', 'header-body'],
  },
}
