import { ArrowUpRight } from 'lucide-react'
import { profile } from '@/data/profile'

const areas = [
  {
    title: 'Tool condition monitoring',
    description: 'Using cutting vibration, signal decomposition, and machine learning to study tool wear and machining performance.',
    keywords: 'Vibration analysis · Signal processing · Sensor fusion',
  },
  {
    title: 'Machining & process optimisation',
    description: 'Investigating cutting parameters, cooling conditions, surface quality, and tool life through experiments and predictive models.',
    keywords: 'Turning & milling · MQL · Multi-objective optimisation',
  },
  {
    title: 'Machine diagnostics',
    description: 'Studying rotating machinery and fault detection, with an emphasis on vibration-based monitoring and predictive maintenance.',
    keywords: 'Rotordynamics · Condition monitoring · Industrial IoT',
  },
  {
    title: 'Additive manufacturing',
    description: 'Characterising metal-powder feedstock for laser powder bed fusion using quantitative microscopy and image analysis.',
    keywords: 'Laser powder bed fusion · SEM · Powder characterisation',
  },
]

export default function About() {
  return (
    <section id="research" className="section" aria-labelledby="research-title">
      <div className="container">
        <div className="section-intro">
          <div><p className="eyebrow">01 / Research</p><h2 id="research-title">Understanding machines.<br /><em>Improving manufacturing.</em></h2></div>
          <div className="intro-copy">
            <p>My work connects mechanical engineering with data-driven methods. I bring experience in industrial maintenance and machining research to questions about process performance, machine health, and manufacturing quality.</p>
            <a className="text-link" href={profile.orcid} target="_blank" rel="noopener noreferrer">Explore my ORCID record <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="research-grid">
          {areas.map((area, index) => (
            <article key={area.title} className="research-area">
              <span className="area-number" aria-hidden="true">0{index + 1}</span>
              <div><h3>{area.title}</h3><p>{area.description}</p><span className="research-keywords">{area.keywords}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
