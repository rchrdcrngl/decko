import type { TemplateDefinition } from '../../types/index.js'

export const terminal: TemplateDefinition = {
  id: 'terminal',
  name: 'Terminal',
  category: 'technical',
  description: 'A full-width terminal code block with an optional title. For showing CLI commands, shell output, or REPL sessions.',
  slots: [
    {
      id: 'title',
      accepts: ['text'],
      required: false,
      contentBudget: { maxChars: 80, maxWords: 10 },
    },
    {
      id: 'code',
      accepts: ['code'],
      required: true,
      contentBudget: { maxLines: 25 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'Showing CLI commands, shell output, or any monospaced terminal content',
    goodFor: ['CLI tool demos', 'devops talks', 'install instructions', 'command-line tutorials'],
    avoid: ['non-code text', 'content that needs rich formatting'],
    suggestedFollowUp: ['code-walkthrough', 'header-body', 'bullets-media'],
  },
}
