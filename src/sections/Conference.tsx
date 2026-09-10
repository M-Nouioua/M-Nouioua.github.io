import { useEffect, useRef, useState } from 'react'

// The two photos sit in a stack: whichever is in front is upright, the other is
// rotated behind it so a corner stays visible and clickable. Clicking that
// corner brings it forward and pushes the other one back.
const PHOTOS = [
  {
    src: '/assets/advanced-projects-award.jpg',
    alt: 'Mourad Nouioua, right, receiving an award on stage at the Rally for Advanced Projects',
    caption: 'Rally for Advanced Projects — recognition',
  },
  {
    src: '/assets/presenting.png',
    alt: 'Delivering a lecture from a podium to a seated audience',
    caption: 'Lecture delivery',
  },
]

// Kept clear of the column padding below, so the rotated corner overhangs into
// the padding instead of being clipped by the panel's overflow: hidden.
const TILT = 'rotate(-7deg) translate(-5.5%, -4.5%) scale(0.95)'
const TILT_HOVER = 'rotate(-4.5deg) translate(-4%, -6%) scale(0.965)'

export default function Conference() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const [frontIndex, setFrontIndex] = useState(0)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target) } },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="conference"
      style={{ backgroundColor: '#08080A', padding: '7rem 2.5rem', borderTop: '1px solid #1E1E22' }}
    >
      <div className="mx-auto" style={{ maxWidth: 1200 }}>

        {/* Label */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
            marginBottom: '3.5rem',
          }}
        >
          <span className="font-mono text-xs uppercase" style={{ color: '#C4956A', letterSpacing: '0.2em' }}>
            Knowledge Transfer
          </span>
          <h2
            className="font-heading mt-3"
            style={{ fontSize: 'clamp(2rem,3.5vw,2.8rem)', color: '#F0EFEA', fontWeight: 300, lineHeight: 1.15 }}
          >
            Workshops, Lectures & Training
          </h2>
        </div>

        {/* Two-column: photo stack left, content right */}
        <div className="flex flex-col md:flex-row gap-0" style={{ border: '1px solid #1E1E22', borderRadius: 10, overflow: 'hidden' }}>

          {/* Photo stack column */}
          <div
            className="p-9 md:p-14"
            style={{
              flex: '0 0 45%',
              backgroundColor: '#0A0A0C',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.5rem',
              // padding is on the className so it can shrink on phones; the
              // rotated card overhangs into it rather than being clipped
              minHeight: 420,
              opacity: visible ? 1 : 0,
              transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) 0.15s',
            }}
          >
            <div style={{ position: 'relative', width: '100%', aspectRatio: '4 / 3' }}>
              {PHOTOS.map((photo, i) => {
                const isFront = i === frontIndex
                const isHovered = hovered === i && !isFront
                return (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setFrontIndex(i)}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                    // only the card behind is a control; the front one is just the photo
                    tabIndex={isFront ? -1 : 0}
                    aria-pressed={isFront}
                    aria-label={isFront
                      ? `${photo.caption}, shown in front`
                      : `Bring to front: ${photo.caption}`}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      padding: 0,
                      border: 'none',
                      borderRadius: 8,
                      overflow: 'hidden',
                      background: '#0A0A0C',
                      cursor: isFront ? 'default' : 'pointer',
                      zIndex: isFront ? 2 : 1,
                      transform: isFront ? 'rotate(0deg) translate(0, 0) scale(1)'
                        : isHovered ? TILT_HOVER : TILT,
                      boxShadow: isFront
                        ? '0 22px 48px rgba(0,0,0,0.62)'
                        : '0 12px 30px rgba(0,0,0,0.5)',
                      transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.5s ease',
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block',
                        // the card behind is dimmed so the front one reads first
                        filter: isFront
                          ? 'brightness(0.95) contrast(1.04)'
                          : isHovered ? 'brightness(0.88)' : 'brightness(0.72)',
                        transition: 'filter 0.45s ease',
                      }}
                    />
                    {/* hairline edge, brighter on the active card */}
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: 8,
                        border: `1px solid rgba(196,149,106,${isFront ? 0.3 : 0.2})`,
                        pointerEvents: 'none',
                      }}
                    />
                  </button>
                )
              })}
            </div>

            {/* Caption for whichever photo is in front, plus the swap hint */}
            <div style={{ textAlign: 'center' }}>
              <p className="font-body" style={{ fontSize: '0.8rem', color: '#8A8A90', lineHeight: 1.5 }}>
                {PHOTOS[frontIndex].caption}
              </p>
              <p className="font-mono" style={{ fontSize: '0.65rem', color: '#4A4A52', letterSpacing: '0.08em', marginTop: '0.4rem' }}>
                click the tilted photo to bring it forward
              </p>
            </div>
          </div>

          {/* Content column */}
          <div
            style={{
              flex: 1,
              padding: '3rem',
              backgroundColor: '#0D0D0F',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: '1.75rem',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(20px)',
              transition: 'opacity 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s, transform 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s',
            }}
          >
            {/* Pull quote */}
            <div style={{ borderLeft: '2px solid #C4956A', paddingLeft: '1.25rem' }}>
              <p
                className="font-heading"
                style={{ fontSize: 'clamp(1.1rem,2vw,1.35rem)', color: '#F0EFEA', fontWeight: 300, lineHeight: 1.65, fontStyle: 'italic' }}
              >
                "Sharing knowledge and building practical skills — from university lectures to hands-on industrial training sessions."
              </p>
            </div>

            {/* Context */}
            <p className="font-body" style={{ fontSize: '0.9rem', color: '#8A8A90', lineHeight: 1.8 }}>
              Committed to academic teaching and professional development through structured lectures,
              technical workshops, and targeted training programs that translate research into
              actionable engineering practices.
            </p>

            {/* Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {[
                { icon: '◈', text: 'University lectures on mechanical engineering, vibration analysis & condition monitoring' },
                { icon: '◈', text: 'Technical workshops on signal processing, machine learning tools & IIoT integration' },
                { icon: '◈', text: 'Industrial training sessions on predictive maintenance strategies & diagnostic instrumentation' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'translateX(0)' : 'translateX(10px)',
                    transition: `opacity 0.7s ease ${0.4 + i * 0.1}s, transform 0.7s ease ${0.4 + i * 0.1}s`,
                  }}
                >
                  <span className="font-mono" style={{ color: '#C4956A', fontSize: '0.7rem', marginTop: 4, flexShrink: 0 }}>{item.icon}</span>
                  <span className="font-body" style={{ fontSize: '0.825rem', color: '#6A6A72', lineHeight: 1.65 }}>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Links */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid #1E1E22' }}>
              <a
                href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ"
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs transition-colors duration-300 hover:text-[#D4AA7D]"
                style={{ color: '#C4956A', textDecoration: 'none', letterSpacing: '0.08em' }}
              >
                Google Scholar →
              </a>
              <a
                href="https://pure.kfupm.edu.sa/en/persons/mourad-nouioua/"
                target="_blank" rel="noopener noreferrer"
                className="font-mono text-xs transition-colors duration-300 hover:text-[#8A8A90]"
                style={{ color: '#505058', textDecoration: 'none', letterSpacing: '0.08em' }}
              >
                KFUPM Profile →
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
