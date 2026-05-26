import { transitionEngine } from './transitions/index.js'
import { animationEngine } from './animation/index.js'
import { hydrateCharts } from './chart-runtime.js'
import { SpeakerNotes } from './speaker-notes.js'
import type { AmbientRuntime } from './ambient.js'
import type { BlockAnimation } from '@decko/core'

type EventCallback = (data: unknown) => void

export class DeckRuntime {
  private _current = 0
  private _total = 0
  private slides: NodeListOf<Element> | null = null
  private readonly listeners = new Map<string, EventCallback[]>()
  private readonly presenter = new SpeakerNotes()
  private ambientRuntime: AmbientRuntime | null = null

  constructor(private readonly deckData: unknown) {}

  get current(): number {
    return this._current
  }

  get total(): number {
    return this._total
  }

  setAmbient(ambient: AmbientRuntime): void {
    this.ambientRuntime = ambient
  }

  init(): void {
    this.slides = document.querySelectorAll('[data-slide]')
    this._total = this.slides.length
    this.presenter.onNavigate = (i) => this.navigate(i)
    this.presenter.onFullscreen = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.()
      else document.exitFullscreen?.()
    }
    this.presenter.onBlank = (value) => {
      const root = document.getElementById('decko-root')
      if (root) root.style.visibility = value ? 'hidden' : ''
    }
    this.bindKeyboard()
    this.activateSlide(0)
    requestAnimationFrame(() => hydrateCharts())
  }

  navigate(index: number): void {
    const clamped = Math.max(0, Math.min(index, this._total - 1))
    if (clamped === this._current) return
    const from = this.slides?.[this._current]
    const to = this.slides?.[clamped]
    if (!from || !to) return

    const transitionAttr = to.getAttribute('data-transition')
    transitionEngine.play(transitionAttr ?? 'cut', from, to, animationEngine)
    this._current = clamped
    this.triggerSlotAnimations(to)
    if (this.ambientRuntime) this.ambientRuntime.start(to)
    this.emit('slideChange', { index: clamped })
    this.broadcastPresenter(clamped)
  }

  on(event: string, callback: EventCallback): void {
    const existing = this.listeners.get(event) ?? []
    this.listeners.set(event, [...existing, callback])
  }

  private activateSlide(index: number): void {
    if (!this.slides) return
    for (let i = 0; i < this.slides.length; i++) {
      const slide = this.slides[i]
      if (!slide) continue
      slide.classList.toggle('decko-slide--active', i === index)
    }
    this._current = index
    const active = this.slides[index]
    if (active) this.triggerSlotAnimations(active)
    this.emit('slideChange', { index })
    this.broadcastPresenter(index)
  }

  private triggerSlotAnimations(slideEl: Element): void {
    const BASE_DELAY = 150
    const STAGGER = 80
    animationEngine.cancel(slideEl as HTMLElement)

    slideEl.querySelectorAll('.decko-slot').forEach((slot, i) => {
      const el = slot as HTMLElement
      const raw = el.dataset['animation']
      if (raw) {
        try {
          const config = JSON.parse(raw) as BlockAnimation
          const staggeredDelay = (config.delay ?? 0) + BASE_DELAY + i * STAGGER

          if (config.target === 'chars' || config.target === 'words') {
            this.triggerSplitAnimation(el, config, staggeredDelay)
            return
          }

          if (config.preset) {
            void animationEngine.playPreset(el, config.preset, {
              delay: staggeredDelay,
              duration: config.duration,
              easing: config.easing,
              mode: config.mode,
              from: config.from,
              to: config.to,
            })
          } else if (config.from ?? config.to) {
            void animationEngine.play(el, {
              from: config.from ?? { opacity: 0 },
              to: config.to ?? { opacity: 1 },
              duration: config.duration ?? 400,
              delay: staggeredDelay,
              easing: config.easing,
              mode: config.mode,
            })
          } else {
            this.cssSlotEnter(el, BASE_DELAY + i * STAGGER)
          }
        } catch {
          this.cssSlotEnter(el, BASE_DELAY + i * STAGGER)
        }
      } else {
        this.cssSlotEnter(el, BASE_DELAY + i * STAGGER)
      }
    })
  }

  private triggerSplitAnimation(el: HTMLElement, config: BlockAnimation, baseDelay: number): void {
    const splitByChars = config.target === 'chars'
    const stagger = config.stagger ?? (splitByChars ? 60 : 80)
    const preset = config.preset ?? (config.scatter ? 'scatter-in' : 'blast-from-z')
    const duration = config.duration
    const easing = config.easing

    // Find the deepest text-containing element(s)
    const textEls = el.querySelectorAll<HTMLElement>(
      '.decko-text-kinetic, .decko-text, h1, h2, h3, p, span',
    )
    const targets = textEls.length > 0 ? Array.from(textEls) : [el]

    let unitIndex = 0
    for (const target of targets) {
      const originalText = target.textContent ?? ''
      if (!originalText.trim()) continue

      const units = splitByChars
        ? originalText.split('')
        : originalText.split(/\s+/).filter(Boolean)

      target.innerHTML = units
        .map((u) => `<span class="decko-split-unit">${u === ' ' ? '&nbsp;' : u}</span>`)
        .join(splitByChars ? '' : ' ')

      target.querySelectorAll<HTMLElement>('.decko-split-unit').forEach((span) => {
        const delay = baseDelay + unitIndex * stagger
        unitIndex++

        if (config.scatter) {
          const rx = (Math.random() - 0.5) * window.innerWidth * 1.6
          const ry = (Math.random() - 0.5) * window.innerHeight * 2
          const rz = (Math.random() - 0.5) * 1800
          const rr = (Math.random() - 0.5) * 180
          const rs = 0.2 + Math.random() * 2
          void animationEngine.play(span, {
            from: { opacity: 0, x: rx, y: ry, z: rz, rotateZ: rr, scale: rs },
            to: { opacity: 1, x: 0, y: 0, z: 0, rotateZ: 0, scale: 1 },
            duration: duration ?? 900,
            delay,
            easing: easing ?? 'outExpo',
          })
        } else {
          void animationEngine.playPreset(span, preset, {
            delay,
            duration,
            easing,
          })
        }
      })
    }
  }

  // Legacy CSS fallback — keeps backward compat when no data-animation attr
  private cssSlotEnter(el: HTMLElement, delayMs: number): void {
    el.classList.remove('decko-slot--enter')
    void el.offsetWidth
    el.style.animationDelay = `${delayMs}ms`
    el.classList.add('decko-slot--enter')
  }

  private broadcastPresenter(index: number): void {
    if (!this.presenter.isOpen || !this.slides) return
    const slide = this.slides[index]
    const nextSlide = this.slides[index + 1]
    const notes = slide?.getAttribute('data-notes') ?? ''
    const nextTitle = nextSlide
      ? (nextSlide.querySelector('.decko-text--heading, .decko-text--hero')?.textContent ?? '')
      : ''
    this.presenter.send(notes, index, this._total, nextTitle)
  }

  private emit(event: string, data: unknown): void {
    const callbacks = this.listeners.get(event) ?? []
    for (const cb of callbacks) cb(data)
  }

  private bindKeyboard(): void {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') this.navigate(this._current + 1)
      if (e.key === 'ArrowLeft') this.navigate(this._current - 1)
      if (e.key === 'f' || e.key === 'F') document.documentElement.requestFullscreen?.()
      if (e.key === 'Escape') document.exitFullscreen?.()
      if (e.key === 'p' || e.key === 'P') {
        if (this.presenter.isOpen) {
          this.presenter.close()
        } else {
          this.presenter.open()
          this.broadcastPresenter(this._current)
        }
      }
    })
  }
}
