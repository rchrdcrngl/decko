import type { AnimationEngine } from '../animation/engine.js'

export type TransitionHandler = (
  from: Element,
  to: Element,
  engine: AnimationEngine,
) => void | Promise<void>

class TransitionEngine {
  private handlers = new Map<string, TransitionHandler>()

  register(name: string, handler: TransitionHandler): void {
    this.handlers.set(name, handler)
  }

  play(name: string, from: Element, to: Element, engine: AnimationEngine): void | Promise<void> {
    const handler = this.handlers.get(name) ?? this.handlers.get('cut')
    if (!handler) return
    return handler(from, to, engine)
  }
}

export const transitionEngine = new TransitionEngine()
