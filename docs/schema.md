# Decko Schema Reference

Everything you need to build, extend, and feed decks to an LLM.

---

## Hierarchy

```
Deck
└── Slide[]
    ├── templateId           → which template to use
    ├── slots                → filled content areas
    │   └── Block | Block[]  → actual content
    ├── transition           → slide-to-slide animation
    ├── ambient              → background canvas effect
    ├── slotStyles           → CSS position overrides per slot
    └── composition          → density / rhythm / gravity hints
```

---

## Blocks

Blocks are atomic content units. Every piece of content in a slide is a block.

### Built-in types

| Type | Purpose | Key fields |
|---|---|---|
| `text` | Prose, headings, quotes | `content: RichText`, `display` |
| `text-kinetic` | Freeform art-directed typography | `content: string`, `fontSize`, `color`, `fontWeight`, `ghost` |
| `code` | Code snippets, terminals | `code: string`, `language`, `filename`, `highlight: number[]` |
| `list` | Bullet lists, steps, checklists | `items: ListItem[]`, `display` |
| `media` | Images, video, icons | `src: string`, `alt`, `caption` |
| `metric` | KPIs, stats, progress | `value`, `label`, `delta`, `trend` |
| `chart` | Bar, line, pie, donut, scatter | `chartType`, `data: ChartData` |
| `table` | Tabular data | `headers: RichText[]`, `rows: RichText[][]` |
| `callout` | Info/warning/success boxes | `body: RichText`, `title?` |
| `divider` | Visual separator | `display` only |
| `group` | Container for other blocks | `blocks: Block[]` — recursive |
| `x-{name}` | Custom block escape hatch | `props: Record<string, unknown>` |

### Display variants

Each block type has a `display` field that drives visual style:

| Block | Display options |
|---|---|
| `text` | `heading` `subheading` `body` `label` `caption` `quote` `eyebrow` `hero` |
| `code` | `block` `inline` `terminal` |
| `list` | `bullets` `numbered` `steps` `checklist` `timeline` `icon-row` `pill-row` |
| `media` | `image` `video` `icon` `avatar` `logo` |
| `metric` | `kpi` `stat-callout` `ring` `progress` `rating` `badge` `inline` |
| `chart` | `minimal` `filled` `outlined` `gradient` |
| `table` | `default` `compact` `striped` `borderless` |
| `group` | `columns` `cards` `comparison` `avatars` `icon-grid` `pricing` |
| `callout` | `info` `warning` `success` `danger` `neutral` `highlight` |
| `divider` | `line` `dots` `space` `gradient` |

### RichText

`RichText = string | InlineNode[]`

`InlineNode` supports: `bold`, `italic`, `code`, `link`, `animate` (per-word animation).

### ListItem

Recursive tree structure:

```ts
interface ListItem {
  text: RichText
  checked?: boolean   // for checklist display
  icon?: string       // for icon-row display
  children?: ListItem[]
}
```

### Block animation

Every block accepts an optional `animation` field:

```ts
{
  preset?: string           // named animation preset
  duration?: number         // ms
  delay?: number            // ms
  easing?: string           // CSS easing
  from?: Record<string, unknown>   // initial CSS/transform state
  to?: Record<string, unknown>     // final state
  target?: 'block' | 'chars' | 'words' | 'lines'  // stagger scope
  stagger?: number          // ms between stagger targets
  scatter?: boolean         // 3D random start for chars/words
}
```

### Custom blocks

Custom blocks follow the `x-{name}` naming convention:

```ts
{
  type: 'x-my-block',    // must match /^x-[a-z][a-z0-9-]*$/
  props: { ... }         // any shape — no schema enforcement
}
```

Register via `BlockRegistry.register({ type, schema })`. Use `defaultBlockRegistry` for the singleton.

---

## Templates

Templates define the layout structure of a slide — which content areas exist, what they accept, and how an LLM should use them.

### TemplateDefinition

```ts
{
  id: string
  name: string
  category: TemplateCategory
  description: string
  slots: TemplateSlot[]        // content areas (min 1)
  layoutModes: LayoutMode[]    // supported layout variants
  aiHints: {
    whenToUse: string
    goodFor: string[]
    avoid: string[]
    suggestedFollowUp: string[]
  }
}
```

### TemplateCategory

`narrative` | `content` | `data` | `visual` | `technical`

### LayoutMode

`auto` | `top-heavy` | `bottom-heavy` | `centered` | `split`

### Built-in templates (19)

**Narrative** — story flow, section markers
`title-slide` · `section-break` · `agenda` · `closing` · `quote`

**Content** — prose and mixed content
`single-column` · `two-column` · `header-body` · `bullets-media` · `three-up`

**Data** — numbers and structured data
`big-metric` · `metric-trio` · `chart-callout` · `table-slide`

**Visual** — image-forward, art-directed
`full-bleed-media` · `media-caption` · `image-grid` · `comparison` · `kinetic-canvas` · `kinetic-hero`

**Technical** — code and architecture
`code-walkthrough` · `architecture-diagram` · `terminal`

---

## Slots

Slots are the named content areas inside a template. They define what goes where.

### TemplateSlot (blueprint — defined on the template)

```ts
{
  id: string                           // unique within template
  accepts: (BlockType | `x-${string}`)[]  // which block types are allowed
  required: boolean
  repeatable?: boolean                 // allow multiple blocks in this slot
  contentBudget: {
    maxChars?: number
    maxWords?: number
    maxLines?: number
    recommendedChars?: number
  }
  default?: Block                      // fallback if slot not filled
}
```

### SlideSlots (filled — on the slide instance)

```ts
// Record<slotId, Block | Block[]>
{
  "title": { type: "text", display: "heading", content: "My Slide" },
  "content": [
    { type: "list", display: "bullets", items: [...] },
    { type: "code", code: "...", language: "ts" }
  ]
}
```

`Block[]` is valid when `repeatable: true` on the slot definition.

### SlotStyles (CSS position overrides)

Per-slide, per-slot CSS overrides. Used heavily by kinetic templates for freeform placement:

```ts
// slide.slotStyles: Record<slotId, SlotStyle>
{
  "headline": {
    position: "absolute",
    top: "10%",
    left: "5%",
    width: "60%",
    zIndex: 2,
    transformOrigin: "top left"
  }
}
```

Fields: `position`, `top`, `left`, `right`, `bottom`, `width`, `height`, `zIndex`, `transformOrigin` (all CSS strings).

---

## Ambients

Ambients are canvas-based background animations that run behind slide content.

### SlideAmbient

```ts
{
  type: AmbientType
  intensity?: 'low' | 'medium' | 'high'   // default: medium
}
```

### AmbientType

| Type | Effect |
|---|---|
| `particles` | Floating white dots |
| `gradient-shift` | Slow color transitions |
| `aurora` | Vertical light rays, sinusoidal drift, green-to-blue |
| `constellation` | Particles with distance-based connecting lines |
| `ripple` | Expanding concentric rings from random origins |
| `orbs` | Floating radial-gradient orbs with hue cycling |

### Intensity

| Level | Particles | Speed | Size |
|---|---|---|---|
| `low` | 30 | 0.3 | 1.5px |
| `medium` | 60 | 0.6 | 2.0px |
| `high` | 120 | 1.0 | 2.5px |

Ambients render on a `canvas#decko-ambient-canvas` element, `z-index: 1`, absolute-positioned behind all content. Driven by `requestAnimationFrame` at 60fps.

---

## Transitions

Transitions define the motion effect between slides.

### SlideTransition

Discriminated union on `type`:

| Type | Effect | Extra fields |
|---|---|---|
| `cut` | Immediate — no animation | — |
| `fade` | Fade out → fade in | `duration?: number` |
| `zoom-through` | Zoom into a target block | `targetId: string` |
| `zoom-out` | Zoom out from an origin block | `originId: string` |
| `pan` | Slide in a direction | `direction: 'left'\|'right'\|'up'\|'down'` |
| `morph` | Morph between two blocks | `fromId: string`, `toId: string` |
| `particle-burst` | Particle explosion from origin | `originId: string` |
| `wipe` | Directional wipe | `direction: 'left'\|'right'\|'up'\|'down'` |

Transition runs from previous slide → current slide. Set on `slide.transition`.

Custom transitions: register a `TransitionHandler` with `transitionEngine.register(name, handler)`. Falls back to `cut` if name not found.

---

## Slide

A slide is a template instance with filled slots and optional overrides.

```ts
{
  templateId: string           // must exist in TemplateRegistry
  slots: SlideSlots            // filled content
  layoutMode?: LayoutMode      // override template's default
  background?: SlideBackground // color | image | gradient | theme-default
  composition?: Composition    // density, rhythm, gravity, accent hints
  transition?: SlideTransition // motion from previous slide
  ambient?: SlideAmbient       // background canvas animation
  slotStyles?: Record<slotId, SlotStyle>  // CSS position overrides
  animations?: Record<blockId, BlockAnimation>  // per-block animation
}
```

### SlideBackground

```ts
{ type: 'color', value: string }
| { type: 'image', src: string, overlay?: string }
| { type: 'gradient', value: string }
| { type: 'theme-default' }
```

### Composition

Metadata hints for layout engine:

```ts
{
  density?: 'minimal' | 'balanced' | 'dense'
  rhythm?: 'tight' | 'normal' | 'loose'
  gravity?: 'top' | 'center' | 'bottom'
  accent?: string   // CSS color
}
```

---

## Deck

Top-level document:

```ts
{
  version: string
  meta: DeckMeta
  theme?: ThemeDefinition
  variables?: Record<string, string>  // CSS variable overrides
  slides: Slide[]
}
```

### DeckMeta

```ts
{
  title: string
  author?: string
  org?: string
  date?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
  language?: string
}
```

---

## What LLMs should know

When an LLM generates or edits a deck, it needs:

1. **Template catalog** — `BUILT_IN_TEMPLATES` (all 19 `TemplateDefinition` objects including `aiHints`). Use `aiHints.whenToUse`, `aiHints.goodFor`, `aiHints.avoid` to pick the right template. `aiHints.suggestedFollowUp` chains slides naturally.

2. **Slot contracts** — for the chosen template, read each slot's `accepts` (allowed block types), `required`, `repeatable`, and `contentBudget` (character/word limits).

3. **Block types** — the block type table above. LLMs should pick the semantically correct block type (e.g. `metric` not `text` for a KPI), and the right `display` variant.

4. **Transition + ambient vocabulary** — use these for tone, not novelty. `fade` is safe everywhere. Kinetic templates pair well with `particle-burst` or `zoom-through`. Ambients add mood but hurt legibility for dense content slides.

5. **Content budget** — `contentBudget` on slots is a hard constraint. Violators are reported by `validateContent()`. Keep text blocks within `recommendedChars` when set.

**What LLMs do NOT need:** `SlotStyle` internals (renderer concern), `TransitionHandler` implementations, `AmbientRuntime` canvas APIs, Zod schemas directly.

---

## Customization

### Custom block type

```ts
import { defaultBlockRegistry } from 'decko-core'
import { z } from 'zod'

defaultBlockRegistry.register({
  type: 'x-my-block',
  schema: z.object({
    type: z.literal('x-my-block'),
    props: z.object({ label: z.string() }),
  }),
})
```

### Custom template

```ts
import { defaultTemplateRegistry } from 'decko-core'

defaultTemplateRegistry.register({
  id: 'my-template',
  name: 'My Template',
  category: 'content',
  description: 'Single focused message with supporting visual',
  slots: [
    {
      id: 'headline',
      accepts: ['text'],
      required: true,
      repeatable: false,
      contentBudget: { maxChars: 80, recommendedChars: 50 },
    },
    {
      id: 'visual',
      accepts: ['media', 'chart', 'x-my-block'],
      required: false,
      repeatable: false,
      contentBudget: {},
    },
  ],
  layoutModes: ['auto', 'split'],
  aiHints: {
    whenToUse: 'Single impactful statement paired with a visual',
    goodFor: ['product reveals', 'key stats', 'hero moments'],
    avoid: ['multi-point arguments', 'dense data'],
    suggestedFollowUp: ['bullets-media', 'big-metric'],
  },
})
```

### Custom theme

Themes have two layers: structured tokens and raw CSS injection.

#### Layer 1 — Tokens

All 11 token fields are required (or inherited via `extends`):

```ts
import { renderDeck } from 'decko'

const myTheme = {
  id: 'my-theme',
  name: 'My Theme',
  extends: 'midnight',          // inherit midnight, override below
  tokens: {
    // Colors
    colorAccent: '#ff6b35',       // brand / highlight color
    colorBackground: '#0a0a0a',   // slide background
    colorSurface: '#141414',      // cards, panels, code blocks
    colorText: '#f5f5f5',         // primary text
    colorTextMuted: '#888888',    // secondary / caption text

    // Fonts (CSS font-family stacks)
    fontDisplay: '"Clash Display", sans-serif',   // headings, titles
    fontBody: '"Plus Jakarta Sans", sans-serif',  // body copy
    fontMono: '"JetBrains Mono", monospace',      // code blocks

    // Layout
    spacingSlide: '4rem',         // base slide padding
    radiusCard: '0.5rem',         // block/card corner radius — '0px' = sharp

    // Animation
    motionIntensity: 'subtle',    // 'none' | 'subtle' | 'moderate' | 'expressive'
  },
  personality: {
    mood: 'bold',
    bestFor: ['product launches', 'startup pitches'],
  },
}
```

Tokens become CSS custom properties automatically:

| Token | CSS property |
|---|---|
| `colorAccent` | `--decko-color-accent` |
| `colorBackground` | `--decko-color-background` |
| `colorSurface` | `--decko-color-surface` |
| `colorText` | `--decko-color-text` |
| `colorTextMuted` | `--decko-color-text-muted` |
| `fontDisplay` | `--decko-font-display` |
| `fontBody` | `--decko-font-body` |
| `fontMono` | `--decko-font-mono` |
| `spacingSlide` | `--decko-spacing-slide` |
| `radiusCard` | `--decko-radius-card` |
| `motionIntensity` | `--decko-motion-intensity` |

#### Layer 2 — CSS injection

Override anything tokens can't reach via the `css` field. Injected verbatim into `<head><style>` after token variables.

```ts
const myTheme = {
  // ...tokens above...
  css: `
    /* Target block types by class: .decko-[type]--[display] */
    .decko-text--heading {
      font-weight: 800;
      letter-spacing: -0.03em;
    }
    .decko-callout {
      border-radius: 0;
      border-left: 3px solid var(--decko-color-accent);
    }
    .decko-code--block {
      border-radius: 0;
      border: 1px solid var(--decko-color-surface);
    }
    .decko-metric--kpi {
      font-family: var(--decko-font-display);
    }

    /* Slide-level */
    .decko-slide {
      padding: var(--decko-spacing-slide);
    }
  `,
}
```

#### CSS classes available to target

```
.decko-slide                 the slide container
.decko-slot                  each content area
.decko-text--heading         text block, heading display
.decko-text--subheading      text block, subheading display
.decko-text--body            text block, body display
.decko-text--caption         text block, caption display
.decko-text--quote           text block, quote display
.decko-text--hero            text block, hero display
.decko-code--block           code block
.decko-code--terminal        terminal display
.decko-list--bullets         bullet list
.decko-list--steps           steps list
.decko-list--checklist       checklist
.decko-list--timeline        timeline
.decko-callout--info         info callout
.decko-callout--warning      warning callout
.decko-callout--success      success callout
.decko-metric--kpi           KPI metric
.decko-metric--stat-callout  stat callout metric
.decko-chart--minimal        minimal chart style
.decko-table--compact        compact table
.decko-group--columns        columns group layout
.decko-group--cards          cards group layout
```

#### Built-in themes for reference

| Theme | `radiusCard` | `motionIntensity` | Character |
|---|---|---|---|
| `midnight` | `1rem` | `moderate` | Dark, rounded, tech |
| `nova` | `0px` | `expressive` | Brutalist, sharp, bold |
| `kinetic` | varies | `expressive` | 3D stage, grain overlay |

#### Block-level overrides

Fine-grained per-block-type style overrides via `blocks`:

```ts
{
  blocks: {
    text: {
      heading: { fontSize: 'clamp(40px, 6vw, 96px)' },
    },
  },
}
```

### Custom transition

```ts
import { transitionEngine } from 'decko'

transitionEngine.register('my-wipe', async (from, to, engine) => {
  await engine.animate(from, { opacity: 0 }, { duration: 300 })
  await engine.animate(to, { opacity: 1 }, { duration: 300 })
})

// Use on a slide:
// transition: { type: 'my-wipe' }
```

---

## Validation

```ts
import { validateDeck, validateContent, defaultTemplateRegistry } from 'decko-core'

// Validate full deck structure
const result = validateDeck(deck)
if (!result.success) console.error(result.errors)

// Validate content budget compliance
const violations = validateContent(deck.slides, defaultTemplateRegistry)
// violations: Array<{ slideIndex, slotId, blockId, field, actual, max }>
```
