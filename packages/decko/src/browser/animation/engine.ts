import type { AnimatableProps } from '@decko/core'
import { getEasing, getEasingTiming, registerEasing, type EasingFn } from './easing.js'

export type { EasingFn }

export interface AnimationPreset {
  from: AnimatableProps
  to: AnimatableProps
  duration: number
  easing?: string
  mode?: 'js' | 'css'
}

export interface TweenOptions {
  from: AnimatableProps
  to: AnimatableProps
  duration: number
  delay?: number
  easing?: string
  mode?: 'js' | 'css'
  onComplete?: () => void
}

interface Tween {
  el: HTMLElement
  from: AnimatableProps
  to: AnimatableProps
  duration: number
  delay: number
  easingFn: EasingFn
  elapsed: number
  delayElapsed: number
  done: boolean
  resolve: () => void
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function needs3d(props: AnimatableProps): boolean {
  return (
    props.z !== undefined ||
    props.rotateX !== undefined ||
    props.rotateY !== undefined
  )
}

function resolveMode(opts: TweenOptions | AnimationPreset): 'js' | 'css' {
  if (opts.mode) return opts.mode
  if (needs3d(opts.from) || needs3d(opts.to)) return 'js'
  return 'js'
}

function setProps(el: HTMLElement, props: AnimatableProps): void {
  const transforms: string[] = []
  if (props.x !== undefined || props.y !== undefined || props.z !== undefined) {
    transforms.push(`translate3d(${props.x ?? 0}px,${props.y ?? 0}px,${props.z ?? 0}px)`)
  }
  if (props.scale !== undefined) transforms.push(`scale(${props.scale})`)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    transforms.push(`scale(${props.scaleX ?? 1},${props.scaleY ?? 1})`)
  }
  if (props.rotateX !== undefined) transforms.push(`rotateX(${props.rotateX}deg)`)
  if (props.rotateY !== undefined) transforms.push(`rotateY(${props.rotateY}deg)`)
  if (props.rotateZ !== undefined) transforms.push(`rotateZ(${props.rotateZ}deg)`)
  if (props.skewX !== undefined) transforms.push(`skewX(${props.skewX}deg)`)
  if (props.width !== undefined) el.style.width = `${props.width}px`
  if (props.opacity !== undefined) el.style.opacity = String(props.opacity)
  if (transforms.length) el.style.transform = transforms.join(' ')
}

function interpolateProps(from: AnimatableProps, to: AnimatableProps, t: number): AnimatableProps {
  const result: AnimatableProps = {}
  const keys = new Set([...Object.keys(from), ...Object.keys(to)]) as Set<keyof AnimatableProps>
  for (const k of keys) {
    const a = from[k] ?? (to[k] !== undefined ? 0 : undefined)
    const b = to[k] ?? (from[k] !== undefined ? 0 : undefined)
    if (a !== undefined && b !== undefined) {
      ;(result as Record<string, number>)[k] = lerp(a, b, t)
    }
  }
  return result
}

function propsToKeyframe(props: AnimatableProps): Record<string, string | number> {
  const transforms: string[] = []
  if (props.x !== undefined || props.y !== undefined || props.z !== undefined) {
    transforms.push(`translate3d(${props.x ?? 0}px,${props.y ?? 0}px,${props.z ?? 0}px)`)
  }
  if (props.scale !== undefined) transforms.push(`scale(${props.scale})`)
  if (props.scaleX !== undefined || props.scaleY !== undefined) {
    transforms.push(`scale(${props.scaleX ?? 1},${props.scaleY ?? 1})`)
  }
  if (props.rotateX !== undefined) transforms.push(`rotateX(${props.rotateX}deg)`)
  if (props.rotateY !== undefined) transforms.push(`rotateY(${props.rotateY}deg)`)
  if (props.rotateZ !== undefined) transforms.push(`rotateZ(${props.rotateZ}deg)`)
  if (props.skewX !== undefined) transforms.push(`skewX(${props.skewX}deg)`)

  const frame: Record<string, string | number> = {}
  if (transforms.length) frame['transform'] = transforms.join(' ')
  if (props.opacity !== undefined) frame['opacity'] = props.opacity
  if (props.width !== undefined) frame['width'] = `${props.width}px`
  return frame
}

export class AnimationEngine {
  private tweens: Tween[] = []
  private rafId: number | null = null
  private lastTime: number | null = null
  private presets = new Map<string, AnimationPreset>()

  registerPreset(name: string, preset: AnimationPreset): void {
    this.presets.set(name, preset)
  }

  registerEasing(name: string, fn: EasingFn): void {
    registerEasing(name, fn)
  }

  play(el: HTMLElement, opts: TweenOptions): Promise<void> {
    const mode = resolveMode(opts)
    if (mode === 'css') return this.playWaapi(el, opts)
    return this.playJs(el, opts)
  }

  playPreset(el: HTMLElement, name: string, overrides: Partial<TweenOptions> = {}): Promise<void> {
    const preset = this.presets.get(name)
    if (!preset) {
      // Unknown preset: fall back to simple fade-in
      return this.play(el, {
        from: { opacity: 0 },
        to: { opacity: 1 },
        duration: 400,
        ...overrides,
      })
    }
    const merged: TweenOptions = {
      from: overrides.from ?? preset.from,
      to: overrides.to ?? preset.to,
      duration: overrides.duration ?? preset.duration,
      easing: overrides.easing ?? preset.easing,
      mode: overrides.mode ?? preset.mode,
      delay: overrides.delay,
      onComplete: overrides.onComplete,
    }
    return this.play(el, merged)
  }

  cancel(elOrRoot: HTMLElement): void {
    for (const tw of this.tweens) {
      if (tw.el === elOrRoot || elOrRoot.contains(tw.el)) {
        tw.done = true
        tw.resolve()
      }
    }
    this.tweens = this.tweens.filter((tw) => !tw.done)
  }

  cancelAll(): void {
    for (const tw of this.tweens) {
      tw.done = true
      tw.resolve()
    }
    this.tweens = []
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
      this.lastTime = null
    }
  }

  private playJs(el: HTMLElement, opts: TweenOptions): Promise<void> {
    return new Promise<void>((resolve) => {
      setProps(el, opts.from)
      const tween: Tween = {
        el,
        from: opts.from,
        to: opts.to,
        duration: opts.duration,
        delay: opts.delay ?? 0,
        easingFn: getEasing(opts.easing ?? 'outExpo'),
        elapsed: 0,
        delayElapsed: 0,
        done: false,
        resolve,
      }
      this.tweens.push(tween)
      this.ensureLoop()
    })
  }

  private playWaapi(el: HTMLElement, opts: TweenOptions): Promise<void> {
    const keyframes = [propsToKeyframe(opts.from), propsToKeyframe(opts.to)]
    const timing: KeyframeAnimationOptions = {
      duration: opts.duration,
      delay: opts.delay ?? 0,
      easing: getEasingTiming(opts.easing ?? 'outExpo'),
      fill: 'both',
    }
    return new Promise<void>((resolve) => {
      const anim = el.animate(keyframes, timing)
      anim.onfinish = () => {
        opts.onComplete?.()
        resolve()
      }
      anim.oncancel = () => resolve()
    })
  }

  private ensureLoop(): void {
    if (this.rafId !== null) return
    this.rafId = requestAnimationFrame((t) => this.tick(t))
  }

  private tick(now: number): void {
    if (this.lastTime === null) this.lastTime = now
    const dt = now - this.lastTime
    this.lastTime = now

    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i]!
      if (tw.done) continue

      tw.delayElapsed += dt
      if (tw.delayElapsed < tw.delay) continue

      tw.elapsed += dt
      const progress = Math.min(tw.elapsed / tw.duration, 1)
      const eased = tw.easingFn(progress)
      setProps(tw.el, interpolateProps(tw.from, tw.to, eased))

      if (progress >= 1) {
        tw.done = true
        tw.resolve()
      }
    }

    this.tweens = this.tweens.filter((tw) => !tw.done)

    if (this.tweens.length > 0) {
      this.rafId = requestAnimationFrame((t) => this.tick(t))
    } else {
      this.rafId = null
      this.lastTime = null
    }
  }
}

export const animationEngine = new AnimationEngine()
