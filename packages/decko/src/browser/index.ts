import { DeckRuntime } from './runtime.js'
import { renderSlide } from '../renderer/slide-renderer.js'
import { animationEngine } from './animation/index.js'
import { transitionEngine } from './transitions/index.js'
import type { Deck } from '@deckohq/core'
import type { AnimationPreset, EasingFn } from './animation/engine.js'
import type { TransitionHandler } from './transitions/engine.js'

type BlockHydrator = (el: Element, props: unknown) => void

const blockRegistry = new Map<string, BlockHydrator>()

function hydrateCustomBlocks(root: ParentNode = document): void {
  root.querySelectorAll('[data-block-type]').forEach((el) => {
    const type = el.getAttribute('data-block-type')
    if (!type) return
    const hydrator = blockRegistry.get(type)
    if (!hydrator) return
    try {
      const props = JSON.parse(el.getAttribute('data-props') ?? '{}')
      hydrator(el, props)
    } catch {
      // malformed data-props — skip
    }
  })
}

const dataEl = document.getElementById('deck-data')
if (dataEl?.textContent) {
  const deckData = JSON.parse(dataEl.textContent) as unknown

  const rootEl = document.getElementById('decko-root')
  if (rootEl?.getAttribute('data-render-mode') === 'csr') {
    const deck = deckData as Deck
    const fragment = document.createDocumentFragment()
    deck.slides.forEach((slide, index) => {
      const div = document.createElement('div')
      div.innerHTML = renderSlide(slide, index)
      const el = div.firstElementChild
      if (el) fragment.appendChild(el)
    })
    rootEl.appendChild(fragment)
  }

  const runtime = new DeckRuntime(deckData)
  runtime.init()

  const prevBtn = document.getElementById('decko-prev') as HTMLButtonElement | null
  const nextBtn = document.getElementById('decko-next') as HTMLButtonElement | null
  const counter = document.getElementById('decko-counter')

  function updateNav(): void {
    const cur = runtime.current
    const tot = runtime.total
    if (counter) counter.textContent = `${cur + 1} / ${tot}`
    if (prevBtn) prevBtn.disabled = cur === 0
    if (nextBtn) nextBtn.disabled = cur === tot - 1
  }

  prevBtn?.addEventListener('click', () => { runtime.navigate(runtime.current - 1); updateNav() })
  nextBtn?.addEventListener('click', () => { runtime.navigate(runtime.current + 1); updateNav() })
  runtime.on('slideChange', updateNav)
  runtime.on('slideChange', () => hydrateCustomBlocks())
  updateNav()
  hydrateCustomBlocks()

  if (document.querySelector('[data-ambient]')) {
    import('./ambient.js').then(({ AmbientRuntime }) => {
      const rootEl = document.getElementById('decko-root')
      if (!rootEl) return
      const ambient = new AmbientRuntime(rootEl)
      runtime.setAmbient(ambient)
      const firstActive = document.querySelector('.decko-slide--active')
      if (firstActive) ambient.start(firstActive)
    })
  }

  ;(window as Window & { Decko?: unknown }).Decko = {
    goTo: (n: number) => runtime.navigate(n),
    on: runtime.on.bind(runtime),
    registerBlock(type: string, hydrator: BlockHydrator): void {
      blockRegistry.set(type, hydrator)
    },
    registerAnimation(name: string, preset: AnimationPreset): void {
      animationEngine.registerPreset(name, preset)
    },
    registerEasing(name: string, fn: EasingFn): void {
      animationEngine.registerEasing(name, fn)
    },
    registerTransition(name: string, handler: TransitionHandler): void {
      transitionEngine.register(name, handler)
    },
  }
}
