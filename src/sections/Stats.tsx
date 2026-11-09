import { ArrowUpRight } from 'lucide-react'
import research from '@/data/research.json'

export default function Stats() {
  const date = new Date(`${research.stats.updatedAt}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC',
  })
  const stats = [
    { value: research.stats.citations.toLocaleString('en-US'), label: 'Citations' },
    { value: research.stats.publications, label: 'Publications' },
    { value: research.stats.hIndex, label: 'h-index' },
    { value: research.stats.i10Index, label: 'i10-index' },
  ]
  return (
    <section className="stats-section" aria-label="Research metrics">
      <div className="container">
        <dl className="stats-grid">
          {stats.map(stat => <div className="stat" key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}
        </dl>
        <p className="stats-source">
          <a href={research.stats.profileUrl} target="_blank" rel="noopener noreferrer">{research.stats.source} <ArrowUpRight size={13} aria-hidden="true" /></a>
          <span>Recorded <time dateTime={research.stats.updatedAt}>{date}</time></span>
        </p>
      </div>
    </section>
  )
}
