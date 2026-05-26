import type { Deck, ThemeDefinition } from '@deckohq/core'
import { escapeHtml } from './utils/escape.js'

export interface AssembleOptions {
  cssUrls?: string[]
  scriptUrls?: string[]
  inlineThemeCss?: string
  mode?: 'ssr' | 'csr'
}

export function assembleHtml(
  slideHtmlChunks: string[],
  deck: Deck,
  _theme: ThemeDefinition,
  options: AssembleOptions = {},
): string {
  const { cssUrls = [], scriptUrls = [], inlineThemeCss, mode = 'ssr' } = options
  const lang = deck.meta.language ?? 'en'
  const title = escapeHtml(deck.meta.title)
  const aspectRatio = deck.meta.aspectRatio ?? '16:9'
  const deckJson = JSON.stringify(deck)

  const linkTags = cssUrls
    .map((url) => `  <link rel="stylesheet" href="${url}">`)
    .join('\n')

  const inlineStyle = inlineThemeCss
    ? `  <style>\n${inlineThemeCss}\n  </style>`
    : ''

  const criticalCss = '  <style>html,body{background:#000}</style>'
  const headExtras = [criticalCss, linkTags, inlineStyle].filter(Boolean).join('\n')

  const scriptTags = scriptUrls
    .map((url) => `  <script src="${url}"></script>`)
    .join('\n')

  const rootContent =
    mode === 'csr'
      ? ''
      : `\n    ${slideHtmlChunks.join('\n    ')}\n  `

  const rootModeAttr = mode === 'csr' ? ` data-render-mode="csr"` : ''

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
${headExtras}
</head>
<body>
  <div id="decko-root" data-aspect-ratio="${aspectRatio}"${rootModeAttr}>${rootContent}</div>
  <nav id="decko-nav">
    <button id="decko-prev" aria-label="Previous slide">&#8592;</button>
    <span id="decko-counter"></span>
    <button id="decko-next" aria-label="Next slide">&#8594;</button>
  </nav>
  <script id="deck-data" type="application/json">${deckJson}</script>
${scriptTags}
</body>
</html>`
}
