import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, Search, X } from 'lucide-react'
import research from '@/data/research.json'

const PAGE_SIZE = 6
const publications = research.publications
const years = [...new Set(publications.map(pub => pub.year))].sort((a, b) => Number(b) - Number(a))
const pinned = new Set(research.pinnedDois.map(doi => doi.toLowerCase()))

export default function PublicationsSection() {
  const [query, setQuery] = useState('')
  const [year, setYear] = useState('all')
  const [sort, setSort] = useState('featured')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const filtered = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const results = publications.filter(pub => {
      const searchable = `${pub.title} ${pub.authors} ${pub.journal} ${pub.year}`.toLowerCase()
      return (year === 'all' || pub.year === year) && terms.every(term => searchable.includes(term))
    })
    if (sort === 'newest') results.sort((a, b) => Number(b.year) - Number(a.year))
    if (sort === 'cited') results.sort((a, b) => (Number.parseInt(b.citations, 10) || 0) - (Number.parseInt(a.citations, 10) || 0))
    return results
  }, [query, year, sort])

  const reset = () => { setQuery(''); setYear('all'); setSort('featured'); setLimit(PAGE_SIZE) }
  const hasFilters = query !== '' || year !== 'all' || sort !== 'featured'

  return (
    <section id="publications" className="section publications-section" aria-labelledby="publications-title">
      <div className="container">
        <div className="section-intro">
          <div><p className="eyebrow">02 / Publications</p><h2 id="publications-title">Selected research.</h2></div>
          <div className="intro-copy">
            <p>Recent work and established studies in manufacturing, materials, and machine diagnostics.</p>
            <a className="text-link" href={research.stats.profileUrl} target="_blank" rel="noopener noreferrer">Full publication record <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
        </div>
        <div className="publication-controls" role="search" aria-label="Search selected publications">
          <div className="search-field">
            <label className="sr-only" htmlFor="publication-search">Search publications by title, author, journal, or year</label>
            <Search size={19} aria-hidden="true" />
            <input id="publication-search" type="search" value={query} placeholder="Search by topic, title, author…" onChange={event => { setQuery(event.target.value); setLimit(PAGE_SIZE) }} />
          </div>
          <div className="select-field"><label htmlFor="publication-year">Year</label><select id="publication-year" value={year} onChange={event => { setYear(event.target.value); setLimit(PAGE_SIZE) }}><option value="all">All years</option>{years.map(value => <option key={value} value={value}>{value}</option>)}</select></div>
          <div className="select-field"><label htmlFor="publication-sort">Sort</label><select id="publication-sort" value={sort} onChange={event => { setSort(event.target.value); setLimit(PAGE_SIZE) }}><option value="featured">Featured first</option><option value="newest">Newest first</option><option value="cited">Most cited</option></select></div>
        </div>
        <div className="results-bar">
          <p role="status" aria-live="polite" aria-atomic="true">Showing {Math.min(limit, filtered.length)} of {filtered.length} selected papers</p>
          {hasFilters && <button type="button" className="text-link clear-filters" onClick={reset}>Reset filters <X size={14} aria-hidden="true" /></button>}
        </div>
        <div className="publication-list">
          {filtered.slice(0, limit).map(pub => {
            const isPinned = pinned.has(pub.link.replace(/^https?:\/\/doi\.org\//i, '').toLowerCase())
            return (
              <article className="publication" key={pub.link}>
                <div className="publication-year"><span>{pub.year}</span>{isPinned && <span className="featured-label">Featured</span>}</div>
                <div className="publication-content">
                  <p className="publication-journal">{pub.journal}</p>
                  <h3><a href={pub.link} target="_blank" rel="noopener noreferrer">{pub.title}<ArrowUpRight size={18} aria-hidden="true" /></a></h3>
                  <p className="publication-authors">{pub.authors}</p>
                  <div className="publication-meta">
                    {pub.citations !== 'New' && <span>{pub.citations} citations · OpenAlex</span>}
                    <a href={pub.link} target="_blank" rel="noopener noreferrer" aria-label={`Read paper: ${pub.title}`}>Read paper <ArrowUpRight size={13} aria-hidden="true" /></a>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
        {filtered.length === 0 && <div className="empty-results"><h3>No matching papers</h3><p>Try a broader term such as “vibration” or “machining”, or choose a different year.</p><button className="button button-secondary" type="button" onClick={reset}>Reset filters</button></div>}
        {limit < filtered.length && <div className="load-more"><button className="button button-secondary" type="button" onClick={() => setLimit(current => current + PAGE_SIZE)}>Show more papers <ArrowDown size={16} aria-hidden="true" /></button></div>}
        <p className="publication-source">Selected records from ORCID; paper citation counts from OpenAlex. Updated <time dateTime={research.publicationsUpdatedAt}>{new Date(`${research.publicationsUpdatedAt}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' })}</time>. Counts may differ from Google Scholar.</p>
      </div>
    </section>
  )
}
