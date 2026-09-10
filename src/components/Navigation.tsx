import { useEffect, useState, useCallback } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Research', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.4)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <>
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(8,8,10,0.92)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
          borderBottom: scrolled ? '1px solid #1E1E22' : '1px solid transparent',
        }}
      >
        <div
          className="flex items-center justify-between mx-auto"
          style={{ maxWidth: 1200, height: 60, padding: '0 2.5rem' }}
        >
          {/* Logo */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
            className="font-heading"
            style={{ color: '#F0EFEA', fontSize: '1.05rem', fontWeight: 400, textDecoration: 'none', letterSpacing: '0.03em' }}
          >
            N. Mourad
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-body text-sm transition-colors duration-300 hover:text-[#C4956A]"
                style={{ color: '#6A6A72', textDecoration: 'none', fontWeight: 400 }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ width: 1, height: 14, backgroundColor: '#2A2A30' }} />
            <a
              href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ"
              target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs transition-colors duration-300 hover:text-[#C4956A]"
              style={{ color: '#505058', textDecoration: 'none' }}
            >
              Scholar
            </a>
            <a
              href="https://www.linkedin.com/in/mourad-nouioua-b73844429"
              target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs transition-colors duration-300 hover:text-[#C4956A]"
              style={{ color: '#505058', textDecoration: 'none' }}
            >
              LinkedIn
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{ color: '#F0EFEA', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
          style={{ backgroundColor: 'rgba(8,8,10,0.97)', backdropFilter: 'blur(20px)' }}
        >
          <div className="flex flex-col items-center gap-9">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="font-heading transition-colors duration-300 hover:text-[#C4956A]"
                style={{ color: '#F0EFEA', textDecoration: 'none', fontSize: '2rem', fontWeight: 300 }}
              >
                {link.label}
              </a>
            ))}
            <div style={{ width: 32, height: 1, backgroundColor: '#2A2A30', margin: '0.5rem 0' }} />
            <a
              href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ"
              target="_blank" rel="noopener noreferrer"
              className="font-mono text-xs"
              style={{ color: '#505058', textDecoration: 'none', letterSpacing: '0.1em' }}
            >
              Google Scholar
            </a>
          </div>
        </div>
      )}
    </>
  )
}
