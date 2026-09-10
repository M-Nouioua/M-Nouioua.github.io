import { useEffect, useRef, useState } from 'react'

interface StatItemProps {
  value: string
  label: string
  delay: number
}

function StatItem({ value, label, delay }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target) } },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
        textAlign: 'center',
        padding: '2rem 1.5rem',
        borderRight: '1px solid #1E1E22',
      }}
    >
      <div className="font-heading" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', color: '#C4956A', fontWeight: 400, lineHeight: 1 }}>
        {value}
      </div>
      <div className="font-mono text-xs uppercase mt-2" style={{ color: '#505058', letterSpacing: '0.12em' }}>
        {label}
      </div>
    </div>
  )
}

export default function Stats() {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(e.target) } },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      style={{ backgroundColor: '#0D0D0F', borderTop: '1px solid #1E1E22', borderBottom: '1px solid #1E1E22' }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: 1200,
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.6s ease',
        }}
      >
        <StatItem value="1031+" label="Citations" delay={0} />
        <StatItem value="18" label="h-index" delay={0.08} />
        <StatItem value="19" label="i10-index" delay={0.16} />
        <div style={{ textAlign: 'center', padding: '2rem 1.5rem', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1) 0.24s, transform 0.7s cubic-bezier(0.16,1,0.3,1) 0.24s' }}>
          <div className="font-heading" style={{ fontSize: 'clamp(2.2rem,4vw,3.5rem)', color: '#C4956A', fontWeight: 400, lineHeight: 1 }}>42+</div>
          <div className="font-mono text-xs uppercase mt-2" style={{ color: '#505058', letterSpacing: '0.12em' }}>Publications</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #1E1E22', padding: '0.75rem 2rem', textAlign: 'center' }}>
        <a
          href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ"
          target="_blank" rel="noopener noreferrer"
          className="font-mono text-xs transition-colors duration-300 hover:text-[#D4AA7D]"
          style={{ color: '#505058', textDecoration: 'none', letterSpacing: '0.08em' }}
        >
          Source: Google Scholar · September 2026 →
        </a>
      </div>
    </section>
  )
}
