import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { profile } from '@/data/profile'

export default function Hero() {
  return (
    <section id="hero" className="hero" aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="eyebrow hero-affiliation"><span className="status-dot" aria-hidden="true" />Postdoctoral Researcher · KFUPM</p>
          <h1 id="hero-title">Mourad<br /><span>Nouioua.</span></h1>
          <p className="hero-specialism">Mechanical engineering.<br />Intelligent manufacturing.</p>
          <p className="hero-description">
            I study machining, vibration diagnostics, and smart manufacturing,
            combining experiments, signal processing, and machine learning to
            understand how machines perform.
          </p>
          <div className="action-row">
            <a className="button button-primary" href="#publications">Explore publications <ArrowDown size={17} aria-hidden="true" /></a>
            <a className="button button-secondary" href="#contact">Get in touch <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <a className="hero-institution text-link" href={profile.institution} target="_blank" rel="noopener noreferrer">
            King Fahd University of Petroleum & Minerals <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <figure className="hero-portrait">
          <div className="portrait-frame">
            <img src="/assets/portrait.png" alt="Dr. Mourad Nouioua" fetchPriority="high" decoding="async" />
            <div className="portrait-corner" aria-hidden="true" />
          </div>
          <figcaption><span>PhD · Mechanical Engineering</span><span>{profile.location}</span></figcaption>
        </figure>
      </div>
      <div className="container hero-bottom">
        <span>Machining & materials</span><span>Machine diagnostics</span><span>Industrial AI</span>
        <a href="#research" aria-label="Explore research areas"><ArrowDown size={18} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
