import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import scholar from '@/data/scholar.json'

interface Publication {
  title: string
  journal: string
  year: string
  authors: string
  citations: string
  link: string
}

const publications: Publication[] = scholar.publications

function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      ref={cardRef}
      href={pub.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{
        backgroundColor: '#121214',
        border: '1px solid #222222',
        borderRadius: 8,
        padding: '1.75rem',
        cursor: 'pointer',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, border-color 0.4s ease`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body" style={{ fontSize: '0.9375rem', color: '#F5F5F0', fontWeight: 500, lineHeight: 1.5 }}>
          {pub.title}
        </h3>
        <ExternalLink size={14} className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#C4956A' }} />
      </div>

      <p className="font-mono mt-2" style={{ fontSize: '0.75rem', color: '#5A8A9A' }}>
        {pub.journal}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="font-body" style={{ fontSize: '0.75rem', color: '#555555' }}>
          {pub.authors}
        </p>
        <div className="flex items-center gap-3">
          <span className="font-mono" style={{ fontSize: '0.6875rem', color: '#C4956A' }}>
            {pub.year}
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={{
              fontSize: '0.6875rem',
              color: pub.citations === 'New' ? '#5A8A9A' : '#8A8A8A',
              backgroundColor: '#1A1A1D',
              border: '1px solid #222222',
            }}
          >
            {pub.citations === 'New' ? '2026' : `${pub.citations} cites`}
          </span>
        </div>
      </div>
    </a>
  )
}

export default function PublicationsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.15 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="publications"
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: '#0A0A0B', padding: '8rem 2rem' }}
    >
      <div className="mx-auto relative" style={{ maxWidth: 1200, zIndex: 1 }}>
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="font-mono text-xs uppercase" style={{ color: '#C4956A', letterSpacing: '0.15em' }}>
            Publications
          </span>
          <h2 className="font-heading mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F5F5F0', fontWeight: 400, lineHeight: 1.1 }}>
            Selected Papers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {publications.map((pub, index) => (
            <PublicationCard key={index} pub={pub} index={index} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href={scholar.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]"
            style={{ color: '#C4956A', textDecoration: 'none' }}
          >
            View all publications on Google Scholar
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
