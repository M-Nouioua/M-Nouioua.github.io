const categories = [
  { label: 'Diagnostics & monitoring', skills: ['Vibration analysis', 'Tool wear prediction', 'Fault diagnosis', 'Acoustic emission', 'Signal processing'] },
  { label: 'AI & data science', skills: ['Machine learning', 'Ensemble learning', 'AutoML', 'Feature extraction', 'Multi-sensor fusion', 'XGBoost', 'VMD'] },
  { label: 'Industrial systems', skills: ['Industrial IoT', 'Edge computing', 'Smart data acquisition', 'Rotating machinery', 'CNC manufacturing'] },
  { label: 'Engineering tools', skills: ['MATLAB', 'Python', 'SolidWorks', 'Minitab', 'ADRE 408 DSPi', 'Bently Nevada'] },
]

export default function Skills() {
  return (
    <section id="skills" className="section skills-section" aria-labelledby="skills-title">
      <div className="container"><p className="eyebrow">05 / Expertise</p><h2 id="skills-title">Methods & tools.</h2>
        <div className="skills-grid">{categories.map(category => (
          <div className="skill-category" key={category.label}><h3>{category.label}</h3><ul>{category.skills.map(skill => <li key={skill}>{skill}</li>)}</ul></div>
        ))}</div>
      </div>
    </section>
  )
}
