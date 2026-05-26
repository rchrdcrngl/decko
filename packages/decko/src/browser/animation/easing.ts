export type EasingFn = (t: number) => number

const BUILT_IN: Record<string, EasingFn> = {
  linear: (t) => t,
  outExpo: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
  inExpo: (t) => (t === 0 ? 0 : Math.pow(2, 10 * t - 10)),
  outCubic: (t) => 1 - Math.pow(1 - t, 3),
  outQuint: (t) => 1 - Math.pow(1 - t, 5),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t) => {
    const c1 = 1.70158
    const c3 = c1 + 1
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
  },
  outElastic: (t) => {
    if (t === 0 || t === 1) return t
    return Math.pow(2, -10 * t) * Math.sin(((t * 10 - 0.75) * (2 * Math.PI)) / 3) + 1
  },
}

// Cubic-bezier approximations for WAAPI (CSS mode)
export const EASING_TIMING: Record<string, string> = {
  linear: 'linear',
  outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)',
  inExpo: 'cubic-bezier(0.7, 0, 0.84, 0)',
  outCubic: 'cubic-bezier(0.33, 1, 0.68, 1)',
  outQuint: 'cubic-bezier(0.22, 1, 0.36, 1)',
  inOutCubic: 'cubic-bezier(0.65, 0, 0.35, 1)',
  outBack: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  outElastic: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
}

const registry = new Map<string, EasingFn>(Object.entries(BUILT_IN))

export function registerEasing(name: string, fn: EasingFn): void {
  registry.set(name, fn)
}

export function getEasing(name: string): EasingFn {
  return registry.get(name) ?? BUILT_IN['outExpo']!
}

export function getEasingTiming(name: string): string {
  return EASING_TIMING[name] ?? EASING_TIMING['outExpo']!
}
