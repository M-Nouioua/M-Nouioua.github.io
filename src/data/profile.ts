import research from './research.json'

export const profile = {
  name: 'Mourad Nouioua',
  email: 'nouioua.mo@gmail.com',
  phone: '+966542429198',
  location: 'Al-Khobar, Saudi Arabia',
  scholar: research.stats.profileUrl,
  linkedin: 'https://www.linkedin.com/in/mourad-nouioua-b73844429',
  orcid: 'https://orcid.org/0000-0003-0439-2112',
  institution: 'https://pure.kfupm.edu.sa/en/persons/mourad-nouioua/',
}

export const profileLinks = [
  { label: 'Google Scholar', href: profile.scholar },
  { label: 'ORCID', href: profile.orcid },
  { label: 'KFUPM profile', href: profile.institution },
  { label: 'LinkedIn', href: profile.linkedin },
]
