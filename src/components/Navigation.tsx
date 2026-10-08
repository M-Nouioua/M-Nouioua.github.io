import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { profile } from '@/data/profile'

const links = [
  { label: 'Research', href: '#research' },
  { label: 'Publications', href: '#publications' },
  { label: 'Experience', href: '#experience' },
  { label: 'Expertise', href: '#skills' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }
    const closeOutside = (event: PointerEvent) => {
      if (!panelRef.current?.contains(event.target as Node) &&
          !toggleRef.current?.contains(event.target as Node)) setMobileOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 1000px)')
    const closeOnDesktop = () => { if (desktop.matches) setMobileOpen(false) }
    document.addEventListener('keydown', closeOnEscape)
    document.addEventListener('pointerdown', closeOutside)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      document.removeEventListener('keydown', closeOnEscape)
      document.removeEventListener('pointerdown', closeOutside)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [mobileOpen])

  return (
    <header className="site-header">
      <nav className="container nav-shell" aria-label="Main navigation">
        <a className="wordmark" href="#hero" onClick={() => setMobileOpen(false)}>
          <span className="monogram" aria-hidden="true">MN</span>
          <span>Mourad Nouioua<span className="wordmark-subtitle">Mechanical engineering researcher</span></span>
        </a>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={mobileOpen}
          aria-controls="navigation-links"
          onClick={() => setMobileOpen(open => !open)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        <div
          ref={panelRef}
          id="navigation-links"
          className={`nav-links ${mobileOpen ? 'is-open' : ''}`}
          onBlur={event => {
            if (!event.currentTarget.contains(event.relatedTarget) &&
                event.relatedTarget !== toggleRef.current) setMobileOpen(false)
          }}
        >
          {links.map(link => (
            <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)}>{link.label}</a>
          ))}
          <a className="nav-scholar" href={profile.scholar} target="_blank" rel="noopener noreferrer">
            Scholar <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
      </nav>
    </header>
  )
}
