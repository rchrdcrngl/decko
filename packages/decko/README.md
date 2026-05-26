# @deckohq/decko

HTML renderer, browser runtime, and CLI for [Decko](https://github.com/rchrdcrngl/decko) — the JSON-first presentation framework.

```
JSON deck  →  @deckohq/core (validate)  →  @deckohq/decko (render)  →  self-contained HTML
```

## Install

```bash
npm install @deckohq/decko @deckohq/core zod
```

## CLI

```bash
npx decko render deck.json -o deck.html
npx decko validate deck.json
npx decko init
```

## Node API

```typescript
import { renderDeck } from '@deckohq/decko'
import { validateDeck } from '@deckohq/core'

const result = validateDeck(rawJson)
if (!result.success) throw result.error

const html = await renderDeck(result.data)
// html.document — full HTML string
// html.slides   — per-slide HTML array
```

## Browser (CDN, no build step)

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/@deckohq/decko@latest/dist/css/decko-base.css" />
  <link rel="stylesheet" href="https://unpkg.com/@deckohq/decko@latest/dist/css/decko-templates.css" />
  <link rel="stylesheet" href="https://unpkg.com/@deckohq/decko@latest/dist/css/decko-theme-midnight.css" />
</head>
<body>
  <div id="decko-root" data-aspect-ratio="16:9" data-render-mode="csr"></div>
  <nav id="decko-nav">
    <button id="decko-prev">&#8592;</button>
    <span id="decko-counter"></span>
    <button id="decko-next">&#8594;</button>
  </nav>
  <script id="deck-data" type="application/json">
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
        }
      ]
    }
  </script>
  <script src="https://unpkg.com/@deckohq/decko@latest/dist/browser/index.global.js"></script>
</body>
</html>
```

The browser runtime reads `#deck-data`, renders slides into `#decko-root`, and wires up `#decko-nav` controls. No server needed.

Available themes: `decko-theme-midnight.css` · `decko-theme-nova.css` · `decko-theme-kinetic.css`

## Custom themes

```typescript
import { registerTheme, loadTheme } from '@deckohq/decko'

registerTheme({
  name: 'my-theme',
  extends: 'midnight',
  tokens: {
    color: { primary: '#ff6b35', background: '#0a0a0a' },
    fonts: { heading: '"Clash Display", sans-serif' },
  },
  css: '.slide { border-radius: 8px; }',
  personality: { mood: 'bold', bestFor: ['product launches'] },
})
```

## Renderer options

```typescript
const html = await renderDeck(deck, {
  embedAssets: true,   // inline images as base64
  theme: 'nova',       // override deck theme
})
```

## Related packages

- [`@deckohq/core`](https://www.npmjs.com/package/@deckohq/core) — schema, types, validators, template catalog

## License

MIT
