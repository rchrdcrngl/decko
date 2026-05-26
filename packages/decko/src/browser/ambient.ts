type AmbientType = 'particles' | 'gradient-shift' | 'aurora' | 'constellation' | 'ripple' | 'orbs'
type AmbientIntensity = 'low' | 'medium' | 'high'

interface IntensityConfig {
  particleCount: number
  speed: number
  size: number
  bands: number
}

const INTENSITY: Record<AmbientIntensity, IntensityConfig> = {
  low:    { particleCount: 30,  speed: 0.3, size: 1.5, bands: 3 },
  medium: { particleCount: 60,  speed: 0.6, size: 2.0, bands: 5 },
  high:   { particleCount: 120, speed: 1.0, size: 2.5, bands: 7 },
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  alpha: number
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
  hue: number
}

interface Orb {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  hue: number
  alpha: number
}

export class AmbientRuntime {
  private canvas: HTMLCanvasElement | null = null
  private ctx: CanvasRenderingContext2D | null = null
  private rafId: number | null = null
  private currentSlide: Element | null = null

  constructor(private readonly root: HTMLElement) {}

  start(slideEl: Element): void {
    this.stop()
    const type = slideEl.getAttribute('data-ambient') as AmbientType | null
    if (!type) return

    const intensity = (slideEl.getAttribute('data-ambient-intensity') ?? 'medium') as AmbientIntensity
    this.currentSlide = slideEl

    if (type === 'gradient-shift') {
      slideEl.classList.add('decko-ambient--gradient-shift')
      slideEl.setAttribute('data-ambient-active', intensity)
      return
    }

    const canvas = this.ensureCanvas()
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    this.canvas = canvas
    this.ctx = ctx

    const config = INTENSITY[intensity]
    if (type === 'particles')     this.runParticles(config)
    else if (type === 'aurora')        this.runAurora(config)
    else if (type === 'constellation') this.runConstellation(config)
    else if (type === 'ripple')        this.runRipple(config)
    else if (type === 'orbs')          this.runOrbs(config)
  }

  stop(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    if (this.currentSlide) {
      this.currentSlide.classList.remove('decko-ambient--gradient-shift')
      this.currentSlide.removeAttribute('data-ambient-active')
    }
    this.currentSlide = null
  }

  private ensureCanvas(): HTMLCanvasElement {
    let canvas = this.root.querySelector<HTMLCanvasElement>('#decko-ambient-canvas')
    if (!canvas) {
      canvas = document.createElement('canvas')
      canvas.id = 'decko-ambient-canvas'
      canvas.style.cssText =
        'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1'
      this.root.appendChild(canvas)
    }
    canvas.width = this.root.offsetWidth
    canvas.height = this.root.offsetHeight
    return canvas
  }

  private runParticles(config: IntensityConfig): void {
    const canvas = this.canvas!
    const ctx = this.ctx!
    const w = canvas.width
    const h = canvas.height

    const particles: Particle[] = Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed,
      vy: (Math.random() - 0.5) * config.speed,
      r: Math.random() * config.size + 0.5,
      alpha: Math.random() * 0.4 + 0.1,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private runConstellation(config: IntensityConfig): void {
    const canvas = this.canvas!
    const ctx = this.ctx!
    const w = canvas.width
    const h = canvas.height
    const LINE_DIST = w * (config.speed < 0.5 ? 0.12 : config.speed < 0.8 ? 0.16 : 0.20)

    const particles: Particle[] = Array.from({ length: config.particleCount }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed * 0.5,
      vy: (Math.random() - 0.5) * config.speed * 0.5,
      r: Math.random() * config.size * 0.6 + 0.8,
      alpha: Math.random() * 0.5 + 0.3,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!
          const b = particles[j]!
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINE_DIST) {
            const lineAlpha = (1 - dist / LINE_DIST) * 0.3
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(255,255,255,${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`
        ctx.fill()
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0
      }

      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private runRipple(config: IntensityConfig): void {
    const canvas = this.canvas!
    const ctx = this.ctx!
    const w = canvas.width
    const h = canvas.height
    const maxRipples = Math.round(config.particleCount / 10) + 2
    const expandSpeed = config.speed * 1.2 + 0.4
    const ripples: Ripple[] = []
    const HUES = [200, 220, 260, 180, 240]
    let hueIdx = 0
    let spawnTimer = 0

    const spawnRipple = () => {
      ripples.push({
        x: Math.random() * w,
        y: Math.random() * h,
        radius: 0,
        maxRadius: Math.min(w, h) * (0.15 + Math.random() * 0.25),
        alpha: 0.5,
        hue: HUES[hueIdx++ % HUES.length]!,
      })
    }

    spawnRipple()

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]!
        r.radius += expandSpeed
        r.alpha = (1 - r.radius / r.maxRadius) * 0.4

        ctx.beginPath()
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2)
        ctx.strokeStyle = `hsla(${r.hue}, 80%, 70%, ${r.alpha})`
        ctx.lineWidth = 1.5
        ctx.stroke()

        // Second ring slightly behind
        if (r.radius > 20) {
          ctx.beginPath()
          ctx.arc(r.x, r.y, r.radius - 12, 0, Math.PI * 2)
          ctx.strokeStyle = `hsla(${r.hue}, 80%, 70%, ${r.alpha * 0.4})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        if (r.radius >= r.maxRadius) ripples.splice(i, 1)
      }

      spawnTimer++
      const spawnInterval = Math.round(120 / config.speed)
      if (spawnTimer >= spawnInterval && ripples.length < maxRipples) {
        spawnRipple()
        spawnTimer = 0
      }

      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private runOrbs(config: IntensityConfig): void {
    const canvas = this.canvas!
    const ctx = this.ctx!
    const w = canvas.width
    const h = canvas.height
    const count = Math.round(config.bands * 0.8) + 1
    const HUES = [220, 260, 200, 300, 180, 240, 280]

    const orbs: Orb[] = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * config.speed * 0.4,
      vy: (Math.random() - 0.5) * config.speed * 0.4,
      radius: Math.min(w, h) * (0.18 + Math.random() * 0.14),
      hue: HUES[i % HUES.length]!,
      alpha: 0.12 + Math.random() * 0.1,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (const orb of orbs) {
        const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius)
        grad.addColorStop(0, `hsla(${orb.hue}, 80%, 65%, ${orb.alpha})`)
        grad.addColorStop(0.5, `hsla(${orb.hue}, 80%, 65%, ${orb.alpha * 0.5})`)
        grad.addColorStop(1, `hsla(${orb.hue}, 80%, 65%, 0)`)

        ctx.beginPath()
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        orb.x += orb.vx
        orb.y += orb.vy

        // Soft bounce at edges
        if (orb.x - orb.radius < 0 || orb.x + orb.radius > w) orb.vx *= -1
        if (orb.y - orb.radius < 0 || orb.y + orb.radius > h) orb.vy *= -1
      }

      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }

  private runAurora(config: IntensityConfig): void {
    const canvas = this.canvas!
    const ctx = this.ctx!
    const w = canvas.width
    const h = canvas.height
    let time = 0

    // Aurora curtain columns — vertical light rays with sinusoidal lateral drift
    // Colors: greens/teals primary, blue/purple fringe at top
    const columnCount = config.bands + 2
    interface AuroraColumn {
      x: number        // base horizontal position (0..1)
      width: number    // relative width (0..1)
      hue: number      // green 120-160, teal 160-200, blue fringe 200-260
      phase: number    // lateral drift phase offset
      shimmerPhase: number
      bottomY: number  // base of curtain (0..1 of canvas height)
      heightFrac: number // curtain height as fraction of canvas height
    }

    const columns: AuroraColumn[] = Array.from({ length: columnCount }, (_, i) => ({
      x: i / columnCount + (Math.random() * 0.15),
      width: 0.08 + Math.random() * 0.14,
      hue: 120 + Math.random() * 80,  // 120 (green) → 200 (teal-blue)
      phase: Math.random() * Math.PI * 2,
      shimmerPhase: Math.random() * Math.PI * 2,
      bottomY: 0.55 + Math.random() * 0.3,
      heightFrac: 0.2 + Math.random() * 0.35,
    }))

    const tick = () => {
      ctx.clearRect(0, 0, w, h)

      for (const col of columns) {
        // Lateral drift — curtain sways gently side to side
        const drift = Math.sin(time * 0.4 + col.phase) * 0.04
        const cx = (col.x + drift) * w
        const cw = col.width * w

        const bottomPx = col.bottomY * h
        const topPx = bottomPx - col.heightFrac * h

        // Shimmer — brightness flickers along the curtain
        const shimmer = 0.5 + 0.5 * Math.sin(time * 1.8 + col.shimmerPhase)
        const baseAlpha = (0.08 + shimmer * 0.1) * config.speed

        // Vertical gradient: dense at bottom edge, fading to nothing at top
        const grad = ctx.createLinearGradient(0, topPx, 0, bottomPx)
        const saturation = 80 + shimmer * 15
        const lightness = 55 + shimmer * 15
        // Top of curtain: hint of blue/purple fringe
        grad.addColorStop(0, `hsla(${(col.hue + 40) % 360}, ${saturation}%, ${lightness}%, 0)`)
        grad.addColorStop(0.3, `hsla(${(col.hue + 20) % 360}, ${saturation}%, ${lightness}%, ${baseAlpha * 0.4})`)
        // Middle: bright primary color
        grad.addColorStop(0.65, `hsla(${col.hue}, ${saturation}%, ${lightness}%, ${baseAlpha})`)
        // Bottom: dense, sharp lower edge
        grad.addColorStop(0.88, `hsla(${col.hue}, ${saturation + 5}%, ${lightness - 5}%, ${baseAlpha * 1.2})`)
        grad.addColorStop(1, `hsla(${col.hue}, ${saturation}%, ${lightness}%, 0)`)

        // Horizontal gradient: soft column edges
        const hGrad = ctx.createLinearGradient(cx - cw / 2, 0, cx + cw / 2, 0)
        hGrad.addColorStop(0, 'rgba(0,0,0,0)')
        hGrad.addColorStop(0.25, 'rgba(255,255,255,1)')
        hGrad.addColorStop(0.75, 'rgba(255,255,255,1)')
        hGrad.addColorStop(1, 'rgba(0,0,0,0)')

        // Draw curtain using composite: fill rect masked by horizontal gradient
        ctx.save()
        ctx.globalCompositeOperation = 'source-over'

        // Build curtain path with wavy right/left edges
        ctx.beginPath()
        ctx.moveTo(cx - cw / 2, bottomPx)
        for (let y = bottomPx; y >= topPx; y -= 3) {
          const progress = (bottomPx - y) / (bottomPx - topPx)
          const wobble = Math.sin(progress * 6 + time * 1.2 + col.phase) * cw * 0.06
          ctx.lineTo(cx - cw / 2 + wobble, y)
        }
        for (let y = topPx; y <= bottomPx; y += 3) {
          const progress = (bottomPx - y) / (bottomPx - topPx)
          const wobble = Math.sin(progress * 5 + time * 0.9 + col.phase + Math.PI) * cw * 0.06
          ctx.lineTo(cx + cw / 2 + wobble, y)
        }
        ctx.closePath()
        ctx.fillStyle = grad
        ctx.fill()
        ctx.restore()
      }

      time += 0.008
      this.rafId = requestAnimationFrame(tick)
    }
    this.rafId = requestAnimationFrame(tick)
  }
}
