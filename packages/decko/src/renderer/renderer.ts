import type { Deck, TemplateDefinition, ThemeDefinition } from '@deckohq/core'
import { renderSlide } from './slide-renderer.js'
import { resolveThemeCss } from './theme-resolver.js'
import { assembleHtml } from './html-assembler.js'

export interface SlideHTML {
  index: number
  html: string
}

export interface AssetRef {
  src: string
  type: 'image' | 'video'
}

export interface RenderedDeck {
  html: string
  slides: SlideHTML[]
  assets: AssetRef[]
}

export interface RendererOptions {
  theme?: ThemeDefinition
  templateMap?: Map<string, TemplateDefinition>
  cssUrls?: string[]
  scriptUrls?: string[]
  baseUrl?: string
  mode?: 'ssr' | 'csr'
}

export class Renderer {
  constructor(private readonly options: RendererOptions = {}) {}

  render(deck: Deck): RenderedDeck {
    const theme = this.options.theme
    const inlineThemeCss = theme
      ? [resolveThemeCss(theme.tokens), theme.css ?? ''].filter(Boolean).join('\n')
      : undefined

    const slides: SlideHTML[] = deck.slides.map((slide, index) => ({
      index,
      html: renderSlide(slide, index),
    }))

    const html = assembleHtml(
      slides.map((s) => s.html),
      deck,
      theme ?? ({ id: 'none', name: 'None', tokens: {} as never, personality: { mood: '', bestFor: [] } }),
      {
        cssUrls: this.options.cssUrls,
        scriptUrls: this.options.scriptUrls,
        inlineThemeCss,
        mode: this.options.mode,
      },
    )

    return { html, slides, assets: [] }
  }
}
