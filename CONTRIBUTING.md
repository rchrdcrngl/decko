# Contributing to Decko

Thanks for your interest. Here's everything you need.

## Development setup

```bash
# Prerequisites: Node 20+, pnpm 9+
git clone https://github.com/your-org/decko
cd decko
pnpm install
pnpm turbo build
pnpm turbo test
```

## TDD requirement

**Tests are written before implementations.** Every PR that changes behaviour must include:
1. A failing test that captures the new/fixed behaviour
2. The implementation that makes the test pass
3. A changeset (`pnpm changeset`)

No tests → no merge.

## Project structure

```
packages/
  decko-core/   Schema, types, Zod validators, registries, template catalog
  decko/        HTML renderer, browser runtime, CLI
```

## Adding a custom block type (plugin)

Publish as `decko-block-{name}` on npm. Use `registerBlock()`:

```typescript
import { registerBlock } from '@deckohq/core'
import { z } from 'zod'

registerBlock({
  type: 'x-mermaid',
  schema: z.object({
    type: z.literal('x-mermaid'),
    props: z.object({ code: z.string() }),
  }),
})
```

See `packages/decko-core/src/registry/block-registry.ts` for the full API.

## Adding a template (plugin)

Publish as `decko-template-{name}` on npm. Use `registerTemplate()`:

```typescript
import { registerTemplate } from '@deckohq/core'

registerTemplate({
  id: 'my-template',
  name: 'My Template',
  category: 'content',
  description: 'Used by AI to pick this template for ...',
  slots: [
    {
      id: 'headline',
      accepts: ['text'],
      required: true,
      contentBudget: { maxChars: 60, maxWords: 10 },
    },
  ],
  layoutModes: ['auto'],
  aiHints: {
    whenToUse: 'When the slide needs a single dominant heading',
    goodFor: ['intro slides', 'section breaks'],
    avoid: ['data-heavy slides'],
    suggestedFollowUp: ['content-body', 'two-column'],
  },
})
```

## Adding a theme (plugin)

Publish as `decko-theme-{name}` on npm. Export a `ThemeDefinition`:

```typescript
import type { ThemeDefinition } from '@deckohq/core'

const myTheme: ThemeDefinition = {
  id: 'my-theme',
  name: 'My Theme',
  extends: 'midnight',
  tokens: {
    colorAccent: '#FF6B35',
    colorBackground: '#1A1A2E',
    // ... other tokens
  },
  personality: {
    mood: 'energetic',
    bestFor: ['startups', 'product launches'],
  },
}

export default myTheme
```

## Commit format

Conventional Commits are enforced by commitlint:

```
feat(core): add x-mermaid block support
fix(renderer): correct table cell padding
docs: update SCHEMA.md for chart block
```

## Changeset workflow

Every user-facing change needs a changeset:

```bash
pnpm changeset        # select packages + bump type + write summary
git add .changeset/
git commit -m "chore: add changeset"
```

## Schema changes

Breaking schema changes (new required fields, renamed fields, removed fields) require:
1. A new `version` integer in `DeckSchema`
2. A `migrate(fromVersion, deck)` implementation in `@deckohq/core`
3. Updated `SCHEMA.md`
4. A major version bump in both packages

Additive changes (new optional fields) are minor bumps.

## Pull request checklist

- [ ] Tests added for every changed behaviour
- [ ] `pnpm turbo typecheck` passes
- [ ] `pnpm turbo test` passes
- [ ] Changeset added
- [ ] `SCHEMA.md` updated if schema changed
