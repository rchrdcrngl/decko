# @deckohq/core

Schema, types, Zod validators, template catalog, and registries for [Decko](https://github.com/rchrdcrngl/decko) — the JSON-first presentation framework.

## Install

```bash
npm install @deckohq/core zod
```

## What's in here

| Export | Description |
|--------|-------------|
| Zod schemas | Runtime validators for `Deck`, `Slide`, all 11 block types |
| TypeScript types | Compile-time types inferred from schemas |
| `validateDeck()` | Validate a full deck object |
| `validateContent()` | Check content budgets across slides |
| `defaultTemplateRegistry` | 19 built-in slide templates with AI hints |
| `defaultBlockRegistry` | Registry of all block types |
| Template catalog | Pre-built templates across 5 categories |

## Usage

### Validate a deck

```typescript
import { validateDeck } from '@deckohq/core'

const result = validateDeck(rawJson)
if (!result.success) throw result.error

// result.data is fully typed
console.log(result.data.slides.length)
```

### Use templates

```typescript
import { defaultTemplateRegistry } from '@deckohq/core'

const template = defaultTemplateRegistry.get('chart-callout')
console.log(template.slots)        // slot definitions
console.log(template.aiHints)      // LLM guidance
```

### Register a custom template

```typescript
import { defaultTemplateRegistry } from '@deckohq/core'

defaultTemplateRegistry.register({
  id: 'my-template',
  name: 'My Template',
  category: 'content',
  description: 'Left chart, right callout',
  slots: [
    { id: 'chart', accepts: ['chart'], required: true, repeatable: false, contentBudget: {} },
    { id: 'aside', accepts: ['callout', 'text'], required: false, repeatable: false, contentBudget: { maxChars: 200 } },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'Single chart with a short explanatory note',
    goodFor: ['data storytelling'],
    avoid: ['dense multi-point arguments'],
    suggestedFollowUp: ['big-metric'],
  },
})
```

### Register a custom block type

```typescript
import { defaultBlockRegistry } from '@deckohq/core'
import { z } from 'zod'

defaultBlockRegistry.register({
  type: 'x-my-block',
  schema: z.object({
    type: z.literal('x-my-block'),
    props: z.object({ label: z.string() }),
  }),
})
```

### Validate content budgets

```typescript
import { validateContent, defaultTemplateRegistry } from '@deckohq/core'

const violations = validateContent(deck.slides, defaultTemplateRegistry)
// [{ slideIndex, slotId, blockId, field, actual, max }]
```

## Built-in templates

| Category | Templates |
|---|---|
| **narrative** | `title-slide` `section-break` `agenda` `closing` `quote` |
| **content** | `single-column` `two-column` `header-body` `bullets-media` `three-up` |
| **data** | `big-metric` `metric-trio` `chart-callout` `table-slide` |
| **visual** | `full-bleed-media` `media-caption` `image-grid` `comparison` `kinetic-canvas` `kinetic-hero` |
| **technical** | `code-walkthrough` `architecture-diagram` `terminal` |

## Related packages

- [`@deckohq/decko`](https://www.npmjs.com/package/@deckohq/decko) — HTML renderer, browser runtime, CLI

## License

MIT
