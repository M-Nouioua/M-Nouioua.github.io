import { useEffect, useRef, useState } from 'react'
import { Mail, Phone, MapPin, ExternalLink } from 'lucide-react'
import FloatingIcosahedron from '@/components/FloatingIcosahedron'

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
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
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#0A0A0B', padding: '6rem 2rem 0' }}
    >
      <FloatingIcosahedron size={2} color="#C4956A" opacity={0.06} speed={0.002} right="5%" top="20%" />
      <FloatingIcosahedron size={1.5} color="#5A8A9A" opacity={0.05} speed={0.003} left="5%" top="50%" />

      <div className="mx-auto relative" style={{ maxWidth: 1200, zIndex: 1 }}>
        <div
          className="flex flex-col md:flex-row gap-12 md:gap-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div className="flex-1">
            <span className="font-mono text-xs uppercase" style={{ color: '#C4956A', letterSpacing: '0.15em' }}>Contact</span>
            <h2 className="font-heading mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F5F5F0', fontWeight: 400, lineHeight: 1.1 }}>
              Let's Collaborate
            </h2>

            <div className="flex flex-col gap-5 mt-8">
              <div className="flex items-center gap-3">
                <Mail size={18} style={{ color: '#C4956A', flexShrink: 0 }} />
                <span className="font-mono" style={{ color: '#F5F5F0', fontSize: '0.9375rem' }}>nouioua.mo@gmail.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} style={{ color: '#C4956A', flexShrink: 0 }} />
                <span className="font-mono" style={{ color: '#F5F5F0', fontSize: '0.9375rem' }}>+966-542429198</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} style={{ color: '#C4956A', flexShrink: 0 }} />
                <span className="font-mono" style={{ color: '#F5F5F0', fontSize: '0.9375rem' }}>Al-Khobar, Saudi Arabia</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 mt-8">
              <a href="https://www.linkedin.com/in/mourad-nouioua-b73844429" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]" style={{ color: '#C4956A', textDecoration: 'none' }}>
                LinkedIn <ExternalLink size={14} />
              </a>
              <a href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]" style={{ color: '#C4956A', textDecoration: 'none' }}>
                Google Scholar <ExternalLink size={14} />
              </a>
              <a href="https://orcid.org/0000-0003-0439-2112" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]" style={{ color: '#C4956A', textDecoration: 'none' }}>
                ORCID <ExternalLink size={14} />
              </a>
              <a href="https://pure.kfupm.edu.sa/en/persons/mourad-nouioua/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]" style={{ color: '#C4956A', textDecoration: 'none' }}>
                KFUPM Profile <ExternalLink size={14} />
              </a>
            </div>
          </div>

          <div className="flex-1 flex items-start">
            <p className="font-body" style={{ fontSize: '1rem', color: '#8A8A8A', lineHeight: 1.8 }}>
              Currently based at KFUPM, Al-Khobar. Open to research collaborations in predictive maintenance, smart manufacturing, and industrial AI.
            </p>
          </div>
        </div>
      </div>

      <div
        className="mx-auto mt-16 pb-8 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ maxWidth: 1200, borderTop: '1px solid #222222', paddingTop: '2rem' }}
      >
        <span className="font-mono text-xs" style={{ color: '#555555' }}>© 2026 Nouioua Mourad. All rights reserved.</span>
        <div className="flex items-center gap-4">
          <a href="https://www.linkedin.com/in/mourad-nouioua-b73844429" target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors duration-300 hover:text-[#C4956A]" style={{ color: '#555555', textDecoration: 'none' }}>LinkedIn</a>
          <a href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ" target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors duration-300 hover:text-[#C4956A]" style={{ color: '#555555', textDecoration: 'none' }}>Scholar</a>
          <a href="https://orcid.org/0000-0003-0439-2112" target="_blank" rel="noopener noreferrer" className="font-mono text-xs transition-colors duration-300 hover:text-[#C4956A]" style={{ color: '#555555', textDecoration: 'none' }}>ORCID</a>
        </div>
      </div>
    </section>
  )
}
