const experience = [
  {
    date: 'Sep 2024 – Present',
    title: 'Postdoctoral Researcher',
    org: 'King Fahd University of Petroleum and Minerals',
    location: 'Saudi Arabia',
    description: 'Developing vibration-based diagnostic systems for rotating and cutting machinery. Combining vibration, force, and vision data with AI-based tools for condition monitoring and predictive maintenance.',
  },
  {
    date: 'Dec 2020 – Sep 2024',
    title: 'Senior Researcher & Head of Machining Process Division',
    org: 'Mechanics Research Centre',
    location: 'Constantine, Algeria',
    description: 'Led research on machining performance, vibration and acoustic emission monitoring, and process optimisation. Integrated smart sensing, signal processing, and machine learning into Industry 4.0 research.',
  },
  {
    date: 'Mar 2017 – Dec 2020',
    title: 'Maintenance Engineer',
    org: 'HUPP-Pharmaceutical',
    location: 'Constantine, Algeria',
    description: 'Carried out preventive and corrective maintenance on pharmaceutical production equipment, including Bosch, Marchesini, and Romaco systems.',
  },
]

export default function Experience() {
  return (
    <section id="experience" className="section experience-section" aria-labelledby="experience-title">
      <div className="container experience-layout">
        <div><p className="eyebrow">03 / Experience</p><h2 id="experience-title">From industry<br /><em>to research.</em></h2><p className="experience-intro">Practical maintenance experience informs my approach to experimental research and machine diagnostics.</p></div>
        <ol className="timeline">
          {experience.map((item, index) => (
            <li key={item.title} className={index === 0 ? 'current-role' : ''}>
              <p className="timeline-date">{item.date}{index === 0 && <span>Current</span>}</p>
              <h3>{item.title}</h3><p className="timeline-org">{item.org}</p>
              <p className="timeline-location">{item.location}</p><p className="timeline-description">{item.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
