import { useEffect, useRef } from 'react'

// One live vibration spectrum, drawn like an analyzer screen: running-speed
// harmonics (1x-4x of 50 Hz), a bearing outer-race peak (BPFO) with sidebands
// that slowly grows and fades, a broad structural resonance, and a flickering
// noise floor. A faint peak-hold trace follows the maxima. Hovering shows a
// frequency/amplitude marker; a click or tap excites the resonance.

const F_MAX = 1000 // Hz across the plot
const BINS = 360

type Peak = { f: number; a: number; w: number; label?: string }
const HARMONICS: Peak[] = [
  { f: 50, a: 1.0, w: 4, label: '1×' },
  { f: 100, a: 0.55, w: 4, label: '2×' },
  { f: 150, a: 0.32, w: 4, label: '3×' },
  { f: 200, a: 0.18, w: 4 },
]
const BPFO = 236 // Hz
const RESONANCE = { f: 640, w: 70 }

export default function SpectrumView() {
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    const canvas = document.createElement('canvas')
    canvas.style.display = 'block'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    wrap.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let W = 0, H = 0, dpr = 1, wide = true
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = wrap.clientWidth || 1
      H = wrap.clientHeight || 1
      wide = W / H > 1.1
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    const plot = () => wide
      ? { x0: W * 0.47, x1: W * 0.95, top: H * 0.24, base: H * 0.7 }
      : { x0: W * 0.07, x1: W * 0.93, top: H * 0.76, base: H * 0.89 }

    // noise floor: each bin drifts toward a new random target a few times a second
    const noise = new Float32Array(BINS).map(() => Math.random())
    const target = new Float32Array(BINS).map(() => Math.random())
    const hold = new Float32Array(BINS)
    let lastRetarget = 0
    let strike = -100 // clock time of the last excitation

    const t0 = performance.now()
    const now = () => (performance.now() - t0) / 1000

    const pointer = { x: -1, y: -1, inside: false }
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
      const p = plot()
      pointer.inside = e.pointerType === 'mouse' && pointer.x >= p.x0 && pointer.x <= p.x1 && pointer.y >= p.top - 60 && pointer.y <= p.base + 30
    }
    const onDown = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button')) return
      strike = now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)

    const amp = new Float32Array(BINS)
    const spectrum = (t: number) => {
      if (t - lastRetarget > 0.09) {
        lastRetarget = t
        for (let i = 0; i < BINS; i++) target[i] = Math.random()
      }
      const grow = Math.pow(0.5 + 0.5 * Math.sin(t * 0.18 - 1.2), 2) // developing defect
      const hit = Math.exp(-Math.max(0, t - strike) * 1.6) * (t >= strike ? 1 : 0)
      for (let i = 0; i < BINS; i++) {
        noise[i] += (target[i] - noise[i]) * 0.18
        const f = (i / (BINS - 1)) * F_MAX
        // pink-ish floor, a little higher at low frequency
        let a = 0.025 + 0.03 * noise[i] * (1.2 - f / F_MAX) + hit * 0.06 * noise[i]
        for (let k = 0; k < HARMONICS.length; k++) {
          const h = HARMONICS[k]
          const d = (f - h.f) / h.w
          a += h.a * (1 + 0.06 * Math.sin(t * 2.1 + k)) * Math.exp(-d * d)
        }
        for (const [df, g] of [[-50, 0.45], [0, 1], [50, 0.45]] as const) {
          const d = (f - (BPFO + df)) / 3.5
          a += 0.42 * g * grow * Math.exp(-d * d)
        }
        const dr = (f - RESONANCE.f) / RESONANCE.w
        a += (0.07 + 0.55 * hit) * Math.exp(-dr * dr)
        amp[i] = a
        hold[i] = Math.max(a, hold[i] - 0.004)
      }
      return grow
    }

    const draw = (t: number) => {
      const grow = spectrum(t)
      const { x0, x1, top, base } = plot()
      const h = base - top
      const xOf = (i: number) => x0 + (i / (BINS - 1)) * (x1 - x0)
      // compress so the 1x peak fills the plot and small peaks stay visible
      const yOf = (a: number) => base - Math.min(1, Math.pow(a / 1.05, 0.62)) * h

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, W, H)

      // axis and frequency ticks
      ctx.strokeStyle = 'rgba(255,255,255,0.10)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(x0, base + 0.5); ctx.lineTo(x1, base + 0.5); ctx.stroke()
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.textAlign = 'center'
      for (let f = 0; f <= F_MAX; f += 200) {
        const x = x0 + (f / F_MAX) * (x1 - x0)
        ctx.strokeStyle = 'rgba(255,255,255,0.05)'
        ctx.beginPath(); ctx.moveTo(x + 0.5, top - 10); ctx.lineTo(x + 0.5, base); ctx.stroke()
        ctx.fillStyle = 'rgba(160,160,170,0.55)'
        ctx.fillText(f === F_MAX ? `${f} Hz` : String(f), x, base + 18)
      }

      // filled spectrum
      ctx.beginPath()
      ctx.moveTo(x0, base)
      for (let i = 0; i < BINS; i++) ctx.lineTo(xOf(i), yOf(amp[i]))
      ctx.lineTo(x1, base)
      ctx.closePath()
      const fill = ctx.createLinearGradient(0, top, 0, base)
      fill.addColorStop(0, 'rgba(224,168,114,0.30)')
      fill.addColorStop(0.6, 'rgba(95,195,184,0.10)')
      fill.addColorStop(1, 'rgba(95,195,184,0.0)')
      ctx.fillStyle = fill
      ctx.fill()

      // peak hold
      ctx.setLineDash([2, 4])
      ctx.strokeStyle = 'rgba(95,195,184,0.35)'
      ctx.lineWidth = 1
      ctx.beginPath()
      for (let i = 0; i < BINS; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, xOf(i), yOf(hold[i]))
      ctx.stroke()
      ctx.setLineDash([])

      // the trace: glow then crisp line
      ctx.beginPath()
      for (let i = 0; i < BINS; i++) (i ? ctx.lineTo : ctx.moveTo).call(ctx, xOf(i), yOf(amp[i]))
      const line = ctx.createLinearGradient(x0, 0, x1, 0)
      line.addColorStop(0, '#E8B47E')
      line.addColorStop(0.45, '#E0A872')
      line.addColorStop(1, '#5FC3B8')
      ctx.strokeStyle = 'rgba(224,168,114,0.35)'
      ctx.lineWidth = 5
      ctx.lineJoin = 'round'
      ctx.stroke()
      ctx.strokeStyle = line
      ctx.lineWidth = 1.5
      ctx.stroke()

      // peak labels
      ctx.font = '10px "JetBrains Mono", monospace'
      ctx.fillStyle = 'rgba(240,239,234,0.75)'
      for (const p of HARMONICS) {
        if (!p.label) continue
        const i = Math.round((p.f / F_MAX) * (BINS - 1))
        ctx.fillText(p.label, xOf(i), yOf(amp[i]) - 12)
      }
      if (grow > 0.25) {
        const i = Math.round((BPFO / F_MAX) * (BINS - 1))
        ctx.fillStyle = `rgba(232,180,126,${Math.min(1, (grow - 0.25) * 2.5)})`
        ctx.fillText('BPFO', xOf(i), yOf(amp[i]) - 12)
      }

      // hover marker
      if (pointer.inside) {
        const i = Math.max(0, Math.min(BINS - 1, Math.round(((pointer.x - x0) / (x1 - x0)) * (BINS - 1))))
        const x = xOf(i), y = yOf(amp[i])
        ctx.strokeStyle = 'rgba(240,239,234,0.35)'
        ctx.setLineDash([3, 3])
        ctx.beginPath(); ctx.moveTo(x + 0.5, top - 20); ctx.lineTo(x + 0.5, base); ctx.stroke()
        ctx.setLineDash([])
        ctx.fillStyle = '#F0EFEA'
        ctx.beginPath(); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill()
        const f = Math.round((i / (BINS - 1)) * F_MAX)
        const label = `${f} Hz · ${(amp[i] * 4.2).toFixed(2)} mm/s`
        ctx.textAlign = x > x1 - 120 ? 'right' : 'left'
        ctx.fillStyle = 'rgba(240,239,234,0.9)'
        ctx.fillText(label, x + (ctx.textAlign === 'right' ? -8 : 8), top - 24)
        ctx.textAlign = 'center'
      }
    }

    let frame = 0
    let running = false
    let last = 0
    const loop = (ts: number) => {
      // ~30 fps is plenty for an analyzer look and keeps laptops cool
      if (ts - last > 33) { last = ts; draw(now()) }
      frame = requestAnimationFrame(loop)
    }
    const start = () => { if (!running && !reduceMotion) { running = true; frame = requestAnimationFrame(loop) } }
    const stop = () => { running = false; cancelAnimationFrame(frame) }
    for (let k = 0; k < 40; k++) spectrum(k * 0.05)
    draw(8)

    const io = new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? start() : stop()), { threshold: 0 })
    io.observe(wrap)
    const onVis = () => (document.hidden ? stop() : start())
    document.addEventListener('visibilitychange', onVis)

    return () => {
      stop()
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      if (wrap.contains(canvas)) wrap.removeChild(canvas)
    }
  }, [])

  return <div ref={wrapRef} aria-hidden="true" style={{ position: 'absolute', inset: 0 }} />
}
