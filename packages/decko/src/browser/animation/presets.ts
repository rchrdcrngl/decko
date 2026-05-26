import { animationEngine } from './engine.js'

export function registerBuiltInPresets(): void {
  animationEngine.registerPreset('fade-in', {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: 400,
    easing: 'outCubic',
  })

  animationEngine.registerPreset('slide-from-left', {
    from: { x: -100, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 600,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('slide-from-right', {
    from: { x: 100, opacity: 0 },
    to: { x: 0, opacity: 1 },
    duration: 600,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('slide-from-bottom', {
    from: { y: 60, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 500,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('blast-from-z', {
    from: { z: -1200, opacity: 0, scale: 2.5 },
    to: { z: 0, opacity: 1, scale: 1 },
    duration: 800,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('drop-in', {
    from: { y: -300, rotateX: 60, opacity: 0, scale: 2.5 },
    to: { y: 0, rotateX: 0, opacity: 1, scale: 1 },
    duration: 700,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('scale-up', {
    from: { scale: 0, opacity: 0 },
    to: { scale: 1, opacity: 1 },
    duration: 500,
    easing: 'outBack',
  })

  animationEngine.registerPreset('elastic-up', {
    from: { y: 200, scale: 1.8, opacity: 0 },
    to: { y: 0, scale: 1, opacity: 1 },
    duration: 900,
    easing: 'outElastic',
  })

  animationEngine.registerPreset('slide-from-top', {
    from: { y: -80, opacity: 0 },
    to: { y: 0, opacity: 1 },
    duration: 500,
    easing: 'outExpo',
  })

  // Used with target:'chars' — chars start scattered, converge. Runtime overrides
  // from.x/y/z per-char with random values when scatter:true is set.
  animationEngine.registerPreset('scatter-in', {
    from: { opacity: 0, scale: 0.3, rotateZ: 45 },
    to: { opacity: 1, scale: 1, rotateZ: 0 },
    duration: 900,
    easing: 'outExpo',
  })

  // Per-letter crash from above with tilt — use with target:'chars'
  animationEngine.registerPreset('letter-crash-in', {
    from: { y: -300, z: 400, rotateX: 80, rotateZ: 0, opacity: 0, scale: 2.5 },
    to: { y: 0, z: 0, rotateX: 0, rotateZ: 0, opacity: 1, scale: 1 },
    duration: 700,
    easing: 'outExpo',
  })

  // Blast in with skew — kinetic editorial entrance
  animationEngine.registerPreset('skew-in-left', {
    from: { x: -window.innerWidth, skewX: -12, opacity: 0 },
    to: { x: 0, skewX: 0, opacity: 1 },
    duration: 750,
    easing: 'outExpo',
  })

  animationEngine.registerPreset('skew-in-right', {
    from: { x: window.innerWidth, skewX: 12, opacity: 0 },
    to: { x: 0, skewX: 0, opacity: 1 },
    duration: 750,
    easing: 'outExpo',
  })

  // Pop with back-ease for decorative elements like accent squares
  animationEngine.registerPreset('pop', {
    from: { scale: 0, rotateZ: 45, opacity: 0 },
    to: { scale: 1, rotateZ: 0, opacity: 1 },
    duration: 500,
    easing: 'outBack',
  })
}
