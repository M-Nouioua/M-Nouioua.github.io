import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'

const photos = [
  { src: '/assets/advanced-projects-award.jpg', alt: 'Mourad Nouioua, right, receiving recognition at the Rally for Advanced Projects', caption: 'Rally for Advanced Projects · Recognition' },
  { src: '/assets/presenting.png', alt: 'Mourad Nouioua delivering a lecture from a podium', caption: 'Lecture delivery' },
]

export default function Conference() {
  const [active, setActive] = useState(0)
  const changePhoto = (direction: number) => setActive(current => (current + direction + photos.length) % photos.length)
  return (
    <section id="conference" className="section teaching-section" aria-labelledby="teaching-title">
      <div className="container teaching-grid">
        <div className="teaching-copy">
          <p className="eyebrow">04 / Knowledge exchange</p><h2 id="teaching-title">Sharing research.<br /><em>Building practical skills.</em></h2>
          <p>Lectures, technical workshops, and industrial training connect research methods with engineering practice.</p>
          <ul className="teaching-topics">
            <li>Mechanical engineering, vibration analysis, and condition monitoring</li>
            <li>Signal processing, machine learning, and Industrial IoT</li>
            <li>Predictive maintenance and diagnostic instrumentation</li>
          </ul>
        </div>
        <div className="photo-gallery" role="region" aria-roledescription="carousel" aria-label="Lectures and recognition">
          <figure>
            <div className="gallery-image"><img src={photos[active].src} alt={photos[active].alt} loading="lazy" decoding="async" /></div>
            <figcaption aria-live="polite" aria-atomic="true">{photos[active].caption}<span>{active + 1} / {photos.length}</span></figcaption>
          </figure>
          <div className="gallery-controls"><button type="button" className="icon-button" aria-label="Previous photo" onClick={() => changePhoto(-1)}><ArrowLeft size={19} /></button><button type="button" className="icon-button" aria-label="Next photo" onClick={() => changePhoto(1)}><ArrowRight size={19} /></button></div>
        </div>
      </div>
    </section>
  )
}
