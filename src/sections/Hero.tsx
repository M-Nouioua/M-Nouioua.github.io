import { useEffect, useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'
import SpectrumView from '@/components/SpectrumView'
import research from '@/data/research.json'

const FOCUS = ['Intelligent Machining', 'Vibration Diagnostics', 'Tool Wear Monitoring', 'Industrial AI']

function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault()
  document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Hero() {
  const [mounted, setMounted] = useState(false)
  const [word, setWord] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const id = reduce ? undefined : setInterval(() => setWord((w) => (w + 1) % FOCUS.length), 2600)
    return () => { clearTimeout(t); if (id) clearInterval(id) }
  }, [])

  // staggered entrance for each block of the text column
  const enter = (i: number): React.CSSProperties => ({
    opacity: mounted ? 1 : 0,
    transform: mounted ? 'translateY(0)' : 'translateY(18px)',
    transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.1}s`,
  })

  const { citations, hIndex, publications } = research.stats

  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: '100svh', minHeight: 640, backgroundColor: '#08080A' }}
    >
      <SpectrumView />

      {/* legibility: dark on the text side, open on the visual side */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(90deg, rgba(8,8,10,0.97) 0%, rgba(8,8,10,0.86) 30%, rgba(8,8,10,0.35) 55%, rgba(8,8,10,0) 75%)',
        }}
      />
      <div
        className="absolute inset-0 md:hidden"
        style={{
          zIndex: 1, pointerEvents: 'none',
          background: 'linear-gradient(180deg, rgba(8,8,10,0.96) 0%, rgba(8,8,10,0.88) 48%, rgba(8,8,10,0.2) 78%, rgba(8,8,10,0) 100%)',
        }}
      />
      {/* blend into the next section */}
      <div
        className="absolute left-0 right-0 bottom-0"
        style={{ zIndex: 1, height: 140, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(13,13,15,0), #0D0D0F)' }}
      />

      {/* Content */}
      <div
        className="relative mx-auto h-full flex flex-col justify-start md:justify-center px-6 md:px-10 pt-28 md:pt-0"
        style={{ zIndex: 2, maxWidth: 1200 }}
      >
        <div style={{ maxWidth: 620 }}>
          {/* Status */}
          <div
            className="inline-flex items-center gap-2 font-mono text-xs"
            style={{
              ...enter(0),
              color: '#B4B4BA', border: '1px solid #26262C', borderRadius: 999, padding: '0.35rem 0.9rem',
              letterSpacing: '0.08em', backgroundColor: 'rgba(13,13,15,0.7)', backdropFilter: 'blur(8px)',
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#6DBF8A', boxShadow: '0 0 8px #6DBF8A', animation: 'pulse 2s infinite' }} />
            Postdoctoral Fellow · KFUPM IRC-IMR
          </div>

          {/* Name */}
          <h1
            className="font-heading"
            style={{
              ...enter(1),
              fontSize: 'clamp(3.2rem, 7.5vw, 6.4rem)', fontWeight: 400, lineHeight: 0.98,
              letterSpacing: '-0.02em', margin: '1.6rem 0 0', color: '#F0EFEA',
            }}
          >
            Mourad
            <br />
            <span
              style={{
                background: 'linear-gradient(100deg, #C4956A 0%, #E8C39C 45%, #C4956A 90%)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}
            >
              Nouioua
            </span>
          </h1>

          {/* Rotating focus */}
          <div
            className="font-mono flex items-center gap-3"
            style={{ ...enter(2), marginTop: '1.6rem', fontSize: 'clamp(0.78rem, 1.4vw, 0.9rem)', letterSpacing: '0.08em' }}
          >
            <span style={{ width: 28, height: 1, backgroundColor: '#C4956A', flexShrink: 0 }} />
            <span className="hidden sm:inline" style={{ color: '#8E8E97', textTransform: 'uppercase' }}>Research in</span>
            <span
              aria-live="polite"
              style={{ position: 'relative', display: 'inline-block', height: '1.5em', overflow: 'hidden', width: 'calc(22ch + 2em)' }}
            >
              {FOCUS.map((f, i) => (
                <span
                  key={f}
                  style={{
                    position: 'absolute', left: 0, top: 0, whiteSpace: 'nowrap', color: '#5FC3B8',
                    textTransform: 'uppercase',
                    opacity: i === word ? 1 : 0,
                    transform: `translateY(${i === word ? 0 : i === (word + FOCUS.length - 1) % FOCUS.length ? -100 : 100}%)`,
                    transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease',
                  }}
                  aria-hidden={i !== word}
                >
                  {f}
                </span>
              ))}
            </span>
          </div>

          {/* Descriptor */}
          <p
            className="font-body"
            style={{ ...enter(3), fontSize: 'clamp(0.95rem, 1.5vw, 1.05rem)', color: '#A4A4AB', lineHeight: 1.75, marginTop: '1.4rem', maxWidth: 500 }}
          >
            PhD mechanical engineer turning machine signals into decisions, from cutting-tool wear
            to rotating machinery, with experiments, signal processing and machine learning.
          </p>

          {/* CTAs */}
          <div className="flex gap-3 flex-wrap" style={{ ...enter(4), marginTop: '2.2rem' }}>
            <a
              href="#publications"
              onClick={(e) => scrollTo(e, '#publications')}
              className="group font-mono text-xs uppercase inline-flex items-center gap-2 transition-colors duration-300 hover:bg-[#D4AA7D]"
              style={{
                color: '#0D0D0F', backgroundColor: '#C4956A', border: '1px solid #C4956A', borderRadius: 999,
                padding: '0.8rem 1.5rem', textDecoration: 'none', letterSpacing: '0.1em',
              }}
            >
              Publications
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a
              href="#contact"
              onClick={(e) => scrollTo(e, '#contact')}
              className="font-mono text-xs uppercase transition-colors duration-300 hover:border-[#C4956A] hover:text-[#C4956A]"
              style={{
                color: '#B4B4BA', backgroundColor: 'rgba(13,13,15,0.6)', border: '1px solid #2A2A30', borderRadius: 999,
                padding: '0.8rem 1.5rem', textDecoration: 'none', letterSpacing: '0.1em', backdropFilter: 'blur(6px)',
              }}
            >
              Contact
            </a>
          </div>

          {/* Credentials */}
          <div
            className="font-mono flex flex-wrap items-center gap-x-5 gap-y-2"
            style={{ ...enter(5), marginTop: '2.4rem', fontSize: '0.72rem', color: '#7C7C86', letterSpacing: '0.06em' }}
          >
            <span><span style={{ color: '#F0EFEA' }}>{citations.toLocaleString('en-US')}+</span> citations</span>
            <span className="hidden sm:inline-block" style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#3A3A42' }} />
            <span>h-index <span style={{ color: '#F0EFEA' }}>{hIndex}</span></span>
            <span className="hidden sm:inline-block" style={{ width: 3, height: 3, borderRadius: '50%', backgroundColor: '#3A3A42' }} />
            <span><span style={{ color: '#F0EFEA' }}>{publications}+</span> publications</span>
          </div>
        </div>
      </div>

      {/* plot caption, like an instrument readout */}
      <div
        className="absolute hidden md:flex flex-col items-end gap-1 font-mono"
        style={{ zIndex: 2, right: 40, bottom: 40, fontSize: '0.62rem', letterSpacing: '0.14em', color: '#5C5C66', pointerEvents: 'none' }}
      >
        <span style={{ color: '#7C7C86' }}>LIVE VIBRATION SPECTRUM · FFT</span>
        <span>HOVER TO READ · CLICK TO EXCITE</span>
      </div>

      {/* Scroll */}
      <a
        href="#research"
        onClick={(e) => scrollTo(e, '#research')}
        aria-label="Scroll to research"
        className="absolute left-1/2 flex flex-col items-center gap-2"
        style={{ bottom: '1.5rem', transform: 'translateX(-50%)', zIndex: 2, textDecoration: 'none' }}
      >
        <span className="font-mono" style={{ fontSize: '0.55rem', color: '#5C5C66', letterSpacing: '0.18em', textTransform: 'uppercase' }}>Scroll</span>
        <ChevronDown size={16} style={{ color: '#5C5C66' }} className="animate-bounce" />
      </a>
    </section>
  )
}
