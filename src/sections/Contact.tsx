import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { profile, profileLinks } from '@/data/profile'

export default function Contact() {
  return (
    <>
      <section id="contact" className="section contact-section" aria-labelledby="contact-title">
        <div className="container contact-grid">
          <div><p className="eyebrow">06 / Contact</p><h2 id="contact-title">Let's work on<br /><em>the next question.</em></h2><p className="contact-intro">For research collaborations, academic enquiries, or a copy of my CV, please get in touch.</p>
            <a className="button button-primary" href={`mailto:${profile.email}`}>Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="contact-details">
            <a className="contact-line" href={`mailto:${profile.email}`}><Mail size={20} aria-hidden="true" /><span><span className="detail-label">Email</span>{profile.email}</span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <a className="contact-line" href={`tel:${profile.phone}`}><Phone size={20} aria-hidden="true" /><span><span className="detail-label">Phone</span>+966 54 242 9198</span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <div className="contact-line"><MapPin size={20} aria-hidden="true" /><span><span className="detail-label">Based in</span>{profile.location}</span></div>
            <div className="profile-links">{profileLinks.map(link => <a className="text-link" key={link.label} href={link.href} target="_blank" rel="noopener noreferrer">{link.label} <ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>
          </div>
        </div>
      </section>
      <footer className="site-footer"><div className="container footer-inner"><p>© {new Date().getFullYear()} Mourad Nouioua</p><p>Mechanical engineering · Research · Practice</p><a href="#hero">Back to top <ArrowUp size={15} aria-hidden="true" /></a></div></footer>
    </>
  )
}
