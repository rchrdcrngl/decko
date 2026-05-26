import { transitionEngine, type TransitionHandler } from './engine.js'
import type { AnimationEngine } from '../animation/engine.js'

export { transitionEngine, type TransitionHandler }

const ALL_CLASSES = [
  'decko-transition--fade',
  'decko-transition--fade-out',
  'decko-transition--pan-in',
  'decko-transition--pan-out',
  'decko-transition--wipe-in',
  'decko-transition--wipe-out',
  'decko-transition--zoom-in',
  'decko-transition--scale-down',
  'decko-transition--morph-in',
  'decko-transition--morph-out',
  'decko-transition--particle-burst',
]

const PAN_VARS: Record<string, { fromX: string; fromY: string; toX: string; toY: string }> = {
  left:  { fromX: '100%',  fromY: '0%',    toX: '-100%', toY: '0%'   },
  right: { fromX: '-100%', fromY: '0%',    toX: '100%',  toY: '0%'   },
  up:    { fromX: '0%',    fromY: '100%',  toX: '0%',    toY: '-100%' },
  down:  { fromX: '0%',    fromY: '-100%', toX: '0%',    toY: '100%'  },
}

const WIPE_VARS: Record<string, { from: string; to: string }> = {
  left:  { from: 'inset(0 100% 0 0)',  to: 'inset(0 0 0 100%)' },
  right: { from: 'inset(0 0 0 100%)', to: 'inset(0 100% 0 0)'  },
  up:    { from: 'inset(100% 0 0 0)', to: 'inset(0 0 100% 0)'  },
  down:  { from: 'inset(0 0 100% 0)', to: 'inset(100% 0 0 0)'  },
}

function clean(el: Element): void {
  el.classList.remove(...ALL_CLASSES)
  const s = (el as HTMLElement).style
  s.removeProperty('--decko-pan-from-x')
  s.removeProperty('--decko-pan-from-y')
  s.removeProperty('--decko-pan-to-x')
  s.removeProperty('--decko-pan-to-y')
  s.removeProperty('--decko-wipe-from')
  s.removeProperty('--decko-wipe-to')
}

function onDone(from: Element, to: Element, ...outClasses: string[]): void {
  from.addEventListener(
    'animationend',
    () => {
      from.classList.remove('decko-slide--active', ...outClasses)
      clean(from)
      clean(to)
    },
    { once: true },
  )
}

// ── Built-in handlers ──────────────────────────────────────────────────────

transitionEngine.register('cut', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  from.classList.remove('decko-slide--active')
  to.classList.add('decko-slide--active')
})

transitionEngine.register('fade', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  to.classList.add('decko-slide--active', 'decko-transition--fade')
  from.classList.add('decko-transition--fade-out')
  onDone(from, to, 'decko-transition--fade-out')
})

transitionEngine.register('zoom-through', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  to.classList.add('decko-slide--active', 'decko-transition--zoom-in')
  from.classList.add('decko-transition--scale-down')
  onDone(from, to, 'decko-transition--scale-down')
})

transitionEngine.register('zoom-out', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  to.classList.add('decko-slide--active')
  from.classList.add('decko-transition--scale-down')
  onDone(from, to, 'decko-transition--scale-down')
})

transitionEngine.register('pan', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  const dir = to.getAttribute('data-transition-dir') ?? 'left'
  const v = PAN_VARS[dir] ?? PAN_VARS['left']!
  const ts = (to as HTMLElement).style
  const fs = (from as HTMLElement).style
  ts.setProperty('--decko-pan-from-x', v.fromX)
  ts.setProperty('--decko-pan-from-y', v.fromY)
  fs.setProperty('--decko-pan-to-x', v.toX)
  fs.setProperty('--decko-pan-to-y', v.toY)
  to.classList.add('decko-slide--active', 'decko-transition--pan-in')
  from.classList.add('decko-transition--pan-out')
  onDone(from, to, 'decko-transition--pan-out')
})

transitionEngine.register('morph', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  to.classList.add('decko-slide--active', 'decko-transition--morph-in')
  from.classList.add('decko-transition--morph-out')
  onDone(from, to, 'decko-transition--morph-out')
})

transitionEngine.register('particle-burst', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  to.classList.add('decko-slide--active')
  from.classList.add('decko-transition--particle-burst')
  onDone(from, to, 'decko-transition--particle-burst')
})

transitionEngine.register('wipe', (from, to, _engine: AnimationEngine) => {
  clean(from)
  clean(to)
  const dir = to.getAttribute('data-transition-dir') ?? 'left'
  const v = WIPE_VARS[dir] ?? WIPE_VARS['left']!
  ;(to as HTMLElement).style.setProperty('--decko-wipe-from', v.from)
  ;(from as HTMLElement).style.setProperty('--decko-wipe-to', v.to)
  to.classList.add('decko-slide--active', 'decko-transition--wipe-in')
  from.classList.add('decko-transition--wipe-out')
  onDone(from, to, 'decko-transition--wipe-out')
})

// Backward-compat shim — existing code calling getTransitionHandler still works
export function getTransitionHandler(type: string): (from: Element, to: Element) => void {
  return (from, to) => transitionEngine.play(type, from, to, undefined as unknown as AnimationEngine)
}
