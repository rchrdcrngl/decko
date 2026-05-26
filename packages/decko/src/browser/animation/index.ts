import { registerBuiltInPresets } from './presets.js'

export { animationEngine, AnimationEngine } from './engine.js'
export { registerEasing, getEasing } from './easing.js'
export type { AnimationPreset, TweenOptions, EasingFn } from './engine.js'
export { registerBuiltInPresets } from './presets.js'

// Explicit call — not a bare import, safe under sideEffects:false
registerBuiltInPresets()
