# Decko

JSON-first presentation framework for developers.

```
Prompt / content
      ↓
decko-agent  →  JSON deck (the AST)
      ↓
@deckohq/core  →  validated, typed deck
      ↓
decko        →  self-contained HTML
```

## Packages

| Package | Description |
|---------|-------------|
| [`@deckohq/core`](./packages/decko-core) | Schema, types, Zod validators, template catalog, registries |
| [`decko`](./packages/decko) | HTML renderer, browser runtime, CLI |

## Quick start

### Browser (CDN)

No build step. Drop JSON into HTML, include two files.

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <link rel="stylesheet" href="https://unpkg.com/@deckohq/decko@latest/dist/css/decko-base.css" />
  <link rel="stylesheet" href="https://unpkg.com/@deckohq/decko@latest/dist/css/decko-theme-midnight.css" />
</head>
<body>
  <script type="application/json" id="deck">
    {
      "version": "1",
      "meta": { "title": "My Deck" },
      "theme": { "name": "midnight" },
      "slides": [
        {
          "templateId": "title-slide",
          "slots": {
            "headline": { "type": "text", "display": "heading", "content": "Hello, world" },
            "subtitle": { "type": "text", "display": "subheading", "content": "Built with Decko" }
          }
        },
        {
          "templateId": "bullets-media",
          "slots": {
            "title": { "type": "text", "display": "heading", "content": "Key points" },
            "content": { "type": "list", "display": "bullets", "items": [
              { "text": "JSON-first" },
              { "text": "No build step" },
              { "text": "LLM-ready" }
            ]}
          }
        }
      ]
    }
  </script>
  <script src="https://unpkg.com/@deckohq/decko@latest/dist/browser/index.global.js"></script>
</body>
</html>
```

The browser runtime reads `#deck`, renders slides, and mounts the presentation. Open the file — no server needed.

Available theme CSS files: `decko-theme-midnight.css` · `decko-theme-nova.css` · `decko-theme-kinetic.css`

### Node / CLI

```bash
npm install decko zod
```

```typescript
import { renderDeck } from 'decko'
import { validateDeck } from '@deckohq/core'

const deck = {
  version: '1',
  meta: { title: 'My Deck' },
  theme: { name: 'midnight' },
  slides: [
    {
      templateId: 'title-slide',
      slots: {
        headline: { type: 'text', display: 'heading', content: 'Hello, world' },
      },
    },
  ],
}

const result = validateDeck(deck)
if (!result.success) throw result.error

const html = await renderDeck(result.data)
```

## CLI

```bash
npx decko render deck.json -o deck.html
npx decko validate deck.json
npx decko init
```

---

## How it works

### Templates and slots

A **template** defines the layout structure of a slide — named content areas (slots) with constraints on what goes in them. A **slide** is an instance of a template with those slots filled.

```
Template "chart-callout"         Slide using it
├── slot "chart"                 ├── slots.chart   → { type: 'chart', ... }
│   accepts: ['chart']           └── slots.context → { type: 'callout', ... }
└── slot "context"
    accepts: ['text', 'callout']
```

19 built-in templates across 5 categories:

| Category | Templates |
|---|---|
| **narrative** | `title-slide` `section-break` `agenda` `closing` `quote` |
| **content** | `single-column` `two-column` `header-body` `bullets-media` `three-up` |
| **data** | `big-metric` `metric-trio` `chart-callout` `table-slide` |
| **visual** | `full-bleed-media` `media-caption` `image-grid` `comparison` `kinetic-canvas` `kinetic-hero` |
| **technical** | `code-walkthrough` `architecture-diagram` `terminal` |

Each template has `aiHints` (`whenToUse`, `goodFor`, `avoid`, `suggestedFollowUp`) so LLMs can pick the right one automatically.

### Blocks

Blocks are atomic content units that fill slots. Every piece of content is a block.

| Type | Use for |
|---|---|
| `text` | Headings, body copy, quotes — `display`: `heading` `subheading` `body` `caption` `quote` `eyebrow` `hero` |
| `text-kinetic` | Art-directed freeform typography with inline CSS control |
| `code` | Code snippets, terminal output |
| `list` | Bullets, steps, checklists, timelines |
| `media` | Images, video, icons |
| `metric` | KPIs, stats, progress bars |
| `chart` | Bar, line, pie, donut, scatter |
| `table` | Tabular data |
| `callout` | Info / warning / success / danger boxes |
| `divider` | Visual separators |
| `group` | Container for other blocks (recursive) |
| `x-{name}` | Custom block escape hatch |

### Positioning slots

Slot position is controlled per-slide via `slotStyles` — no need to create a new template:

```json
{
  "templateId": "chart-callout",
  "slots": { "chart": { "type": "chart", "..." }, "context": { "type": "text", "..." } },
  "slotStyles": {
    "chart":   { "position": "absolute", "left": "0",   "width": "50%" },
    "context": { "position": "absolute", "right": "0",  "width": "45%" }
  }
}
```

### Transitions

Set on `slide.transition`. 8 types: `cut` `fade` `zoom-through` `zoom-out` `pan` `morph` `particle-burst` `wipe`.

### Ambients

Canvas background animations set on `slide.ambient`. 6 types: `particles` `gradient-shift` `aurora` `constellation` `ripple` `orbs`. Control intensity with `low` / `medium` / `high`.

### Renderer

Pure HTML generation — no framework. Each block type has a dedicated render function in `packages/decko/src/renderer/blocks/`. Theme tokens become CSS custom properties (`--decko-color-accent` etc.). To change how a block looks, edit the matching renderer file or override via theme.

---

## Customization

### Add a custom template

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
    goodFor: ['data storytelling', 'annotated charts'],
    avoid: ['dense multi-point arguments'],
    suggestedFollowUp: ['big-metric', 'table-slide'],
  },
})
```

### Add a custom block type

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

### Add a custom theme

```typescript
const myTheme = {
  name: 'my-theme',
  extends: 'midnight',
  tokens: {
    color: { primary: '#ff6b35', background: '#0a0a0a' },
    fonts: { heading: '"Clash Display", sans-serif' },
  },
  css: '.slide { border-radius: 8px; }',
  personality: { mood: 'bold', bestFor: ['product launches'] },
}
```

### Validate content budgets

```typescript
import { validateContent, defaultTemplateRegistry } from '@deckohq/core'

const violations = validateContent(deck.slides, defaultTemplateRegistry)
// [{ slideIndex, slotId, blockId, field, actual, max }]
```

Full schema reference: [`docs/schema.md`](./docs/schema.md)

---

## Development

```bash
pnpm install
pnpm turbo build
pnpm turbo test
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) for how to add custom block types, templates, and themes.

## License

MIT — see [LICENSE](./LICENSE).
