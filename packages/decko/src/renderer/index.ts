import type { Deck } from '@decko/core'
import { Renderer } from './renderer.js'
import type { RenderedDeck, RendererOptions } from './renderer.js'

export { Renderer }
export type { RenderedDeck, RendererOptions }

export function renderDeck(deck: Deck, options?: RendererOptions): RenderedDeck {
  return new Renderer(options).render(deck)
}
