import Navigation from '@/components/Navigation'
import Hero from '@/sections/Hero'
import About from '@/sections/About'
import Stats from '@/sections/Stats'
import Conference from '@/sections/Conference'
import Experience from '@/sections/Experience'
import PublicationsSection from '@/sections/Publications'
import Skills from '@/sections/Skills'
import Contact from '@/sections/Contact'

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Stats />
        <About />
        <PublicationsSection />
        <Experience />
        <Conference />
        <Skills />
        <Contact />
      </main>
    </>
  )
}
