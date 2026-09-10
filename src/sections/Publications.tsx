import { useEffect, useRef, useState } from 'react'
import { ExternalLink } from 'lucide-react'

interface Publication {
  title: string
  journal: string
  year: string
  authors: string
  citations: string
  link: string
}

const publications: Publication[] = [
  {
    title: 'Duty cycle shapes multi-mode transient responses in intermittent rotor–stator rub with no evidence of Sommerfeld capture',
    journal: 'Scientific Reports',
    year: '2026',
    authors: 'M Nouioua, AAD Sarhan, HM Al-Qahtani, S Bashmal, A Laouissi',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:ldfaerwXgEUC',
  },
  {
    title: 'Effect of Rotary Friction Welding Parameters on the Microstructure and Mechanical Performance of Dissimilar AISI 304/AISI 316 L Stainless-Steel Joints',
    journal: 'Arabian Journal for Science and Engineering, 1-23',
    year: '2026',
    authors: 'A Mekahal, E Raouache, C Kezrane, I Elmeguenni, M Nouioua, et al.',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:2P1L_qKh6hAC',
  },
  {
    title: 'Cross-Edge-Validated Tool Condition Monitoring via Joint Natural-Frequency and Damping-Ratio Tracking of Cutting Vibration',
    journal: 'IEEE Transactions on Industrial Informatics',
    year: '2026',
    authors: 'M Nouioua, AAD Sarhan, I Chekalil, V Swaminathan, et al.',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:70eg2SAEIzsC',
  },
  {
    title: 'How friction time controls interfacial evolution and bending strength in steel–alumina rotary friction welded joints',
    journal: 'Int. J. of Advanced Manufacturing Technology, 1-13',
    year: '2026',
    authors: 'F Khalfallah, E Raouache, Z Boumerzoug, S Rajakumar, A Laouissi, et al.',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:35N4QoGY0k4C',
  },
  {
    title: 'How spindle speed and feed rate control PMMA micro-milling: baseline process optimization toward micro-milling of PMMA/GNP nanocomposites',
    journal: 'Int. J. of Advanced Manufacturing Technology, 1-20',
    year: '2026',
    authors: 'S Rawal, AAD Sarhan, AM Sidpara, M Nouioua',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:RYcK_YlVTxYC',
  },
  {
    title: 'Quantitative SEM morphometry for monitoring laser powder-bed-fusion metal-powder feedstock',
    journal: 'Materials Today Communications 55, 115825',
    year: '2026',
    authors: 'M Nouioua, I Chekalil, V Swaminathan, RM Khan, AFM Arif',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:lSLTfruPkqcC',
  },
  {
    title: 'Machine-learning surrogates for the multi-objective optimisation of cutting parameters in dry turning of POM C GF25%',
    journal: 'Int. J. of Advanced Manufacturing Technology, 1-20',
    year: '2026',
    authors: 'N Djouambi, MA Yallese, M Kaddeche, A Maoudj, A Khellaf, M Nouioua',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:NaGl4SEjCO4C',
  },
  {
    title: 'Performance evaluation of ultrasonic assisted leather bonding for improved durability and sustainability',
    journal: 'Results in Engineering, 111524',
    year: '2026',
    authors: 'V Swaminathan, I Chekalil, A Alsheghri, MF Saffiudeen, S Khan, et al.',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:RGFaLdJalmkC',
  },
  {
    title: 'Multi-Objective Optimization of Passive Solar Chimney Ventilation in Eastern Algeria: A Case Study Combining Surrogate Modeling and Metaheuristic Search',
    journal: 'Energies 19 (12), 2776',
    year: '2026',
    authors: 'B Belfegas, A Laouissi, V Swaminathan, Y Karmi, R Elhadj, M Nouioua',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:ns9cj8rnVeAC',
  },
  {
    title: 'SPINDER: an open-source 18-DoF hexapod robot with hierarchical central pattern generator control and analytic inverse kinematics',
    journal: 'Scientific Reports',
    year: '2026',
    authors: 'A Maoudj, AA Saputra, B Brahmi, M Nouioua',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:O3NaXMp0MMsC',
  },
  {
    title: 'Cloud-based collaborative CNC manufacturing framework integrating tool wear monitoring and scheduling support',
    journal: 'Scientific Reports',
    year: '2026',
    authors: 'Imran, Mourad Nouioua, Samir Mekid',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:YFjsv_pBGBYC',
  },
  {
    title: 'AI-Driven Decision Support for Multi-Objective Optimization of Turning Parameters in Grey Cast Iron Machining',
    journal: 'Results in Engineering',
    year: '2026',
    authors: 'Nouioua, Mourad, et al.',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:blknAaTinKkC',
  },
  {
    title: 'Vibration-Based Tool Wear Prediction via Ensemble Learning and AutoML-Guided VMD Mode Selection',
    journal: 'Journal of Vibration Engineering & Technologies 14.1',
    year: '2026',
    authors: 'M Nouioua, Imran, S Mekid',
    citations: 'New',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:maZDTaKrznsC',
  },
  {
    title: 'Assessment of turning AISI 316L under MWCNT-reinforced nanofluid-assisted MQL and optimization by NSGA-II and TOPSIS',
    journal: 'Int. J. of Advanced Manufacturing Technology 127 (7)',
    year: '2023',
    authors: 'B Oussama, YF Yapan, A Uysal, C Abdelhakim, N Mourad',
    citations: '29',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:R3hNpaxXUhUC',
  },
  {
    title: 'The analysis of tool vibration signals by spectral kurtosis and ICEEMDAN modes energy for insert wear monitoring in turning',
    journal: 'Int. J. of Advanced Manufacturing Technology 115 (9)',
    year: '2021',
    authors: 'ML Bouhalais, M Nouioua',
    citations: '43',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:ufrVoPGSRksC',
  },
  {
    title: 'Vibration-based tool wear monitoring using ANN fed by spectral centroid indicator and RMS of CEEMDAN modes',
    journal: 'Int. J. of Advanced Manufacturing Technology 115 (9)',
    year: '2021',
    authors: 'M Nouioua, ML Bouhalais',
    citations: '32',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:W7OEmFMy1HYC',
  },
  {
    title: 'Predictive modeling and multi-response optimization in turning of POM C using RSM and desirability function',
    journal: 'Measurement 95, 99-115',
    year: '2017',
    authors: 'A Chabbi, MA Yallese, I Meddour, M Nouioua, T Mabrouki, F Girardin',
    citations: '158',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:UeHWp8X0CEIC',
  },
  {
    title: 'Investigation of MQL, dry, and wet turning by RSM and ANN',
    journal: 'Int. J. of Advanced Manufacturing Technology 93 (5), 2485-2504',
    year: '2017',
    authors: 'M Nouioua, MA Yallese, R Khettabi, S Belhadi, ML Bouhalais, F Girardin',
    citations: '115',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:Tyk-4Ss8FVUC',
  },
  {
    title: 'Machinability study and ANN-MOALO-based multi-response optimization during Eco-Friendly machining of EN-GJL-250 cast iron',
    journal: 'Int. J. of Advanced Manufacturing Technology 117 (3), 1179-1203',
    year: '2021',
    authors: 'A Laouissi, M Nouioua, MA Yallese, H Abderazek, H Maouche',
    citations: '29',
    link: 'https://scholar.google.com/citations?view_op=view_citation&hl=en&user=tEKyL0UAAAAJ&citation_for_view=tEKyL0UAAAAJ:LkGwnXOMwfcC',
  },
]

function PublicationCard({ pub, index }: { pub: Publication; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 }
    )

    if (cardRef.current) observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <a
      ref={cardRef}
      href={pub.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      style={{
        backgroundColor: '#121214',
        border: '1px solid #222222',
        borderRadius: 8,
        padding: '1.75rem',
        cursor: 'pointer',
        textDecoration: 'none',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: `opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s, border-color 0.4s ease`,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#333333'; e.currentTarget.style.transform = 'translateY(-4px)' }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#222222'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-body" style={{ fontSize: '0.9375rem', color: '#F5F5F0', fontWeight: 500, lineHeight: 1.5 }}>
          {pub.title}
        </h3>
        <ExternalLink size={14} className="flex-shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: '#C4956A' }} />
      </div>

      <p className="font-mono mt-2" style={{ fontSize: '0.75rem', color: '#5A8A9A' }}>
        {pub.journal}
      </p>

      <div className="flex items-center justify-between mt-3">
        <p className="font-body" style={{ fontSize: '0.75rem', color: '#555555' }}>
          {pub.authors}
        </p>
        <div className="flex items-center gap-3">
          <span className="font-mono" style={{ fontSize: '0.6875rem', color: '#C4956A' }}>
            {pub.year}
          </span>
          <span
            className="font-mono text-xs px-2 py-0.5 rounded-full"
            style={{
              fontSize: '0.6875rem',
              color: pub.citations === 'New' ? '#5A8A9A' : '#8A8A8A',
              backgroundColor: '#1A1A1D',
              border: '1px solid #222222',
            }}
          >
            {pub.citations === 'New' ? '2026' : `${pub.citations} cites`}
          </span>
        </div>
      </div>
    </a>
  )
}

export default function PublicationsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [headerVisible, setHeaderVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHeaderVisible(true)
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
      id="publications"
      ref={sectionRef}
      className="relative"
      style={{ backgroundColor: '#0A0A0B', padding: '8rem 2rem' }}
    >
      <div className="mx-auto relative" style={{ maxWidth: 1200, zIndex: 1 }}>
        <div
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <span className="font-mono text-xs uppercase" style={{ color: '#C4956A', letterSpacing: '0.15em' }}>
            Publications
          </span>
          <h2 className="font-heading mt-4" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#F5F5F0', fontWeight: 400, lineHeight: 1.1 }}>
            Selected Papers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {publications.map((pub, index) => (
            <PublicationCard key={index} pub={pub} index={index} />
          ))}
        </div>

        <div className="text-center mt-10">
          <a
            href="https://scholar.google.com/citations?user=tEKyL0UAAAAJ"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-body text-sm transition-colors duration-300 hover:text-[#D4AA7D]"
            style={{ color: '#C4956A', textDecoration: 'none' }}
          >
            View all publications on Google Scholar
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  )
}
