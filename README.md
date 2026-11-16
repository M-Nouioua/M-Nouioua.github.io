# Mourad Nouioua — Research portfolio

Personal academic website for Dr. Mourad Nouioua, built with React, TypeScript, Vite, and CSS. The site presents research areas, publications, professional experience, knowledge exchange, expertise, and contact information.

**Live website:** https://m-nouioua.github.io/

## Features

- Responsive dark-and-bronze design with a portrait-led introduction.
- Search selected publications by title, topic, author, journal, or year.
- Filter by year and sort by featured order, recency, or OpenAlex citation count.
- Load more papers without leaving the page; access the complete record on Google Scholar.
- Keyboard-accessible mobile navigation, skip link, visible focus states, and reduced-motion support.
- Email and telephone links, academic profiles, and manual photo navigation.
- Canonical URL, social-sharing metadata, Person structured data, favicon, and sitemap.
- CSS presentation without WebGL rendering in the page's active component tree.

## Local development

Use Node.js 20.19+ or a supported newer LTS release.

```bash
npm ci --legacy-peer-deps
npm run dev
npm run build
npm run preview
```

## Content maintenance

- `src/data/research.json`: the source for metrics and selected publications. Headline metrics are recorded from Google Scholar and retain their exact values and date. Paper citation counts use OpenAlex and are labelled separately.
- `scripts/update_publications.py`: imports publication records from ORCID and counts from OpenAlex. The existing update workflow is unchanged. Edit `pinnedDois` to select featured papers; manual edits to generated publication entries may be overwritten.
- `src/data/profile.ts`: shared contact information and academic profile links.
- `src/sections/`: research narrative, experience, expertise, and teaching content.
- `public/assets/`: existing portrait, lecture, and award photographs.
- `index.html`: search and social metadata. Keep profile URLs consistent when changing them.

The CV is available by email; no download link is shown because a public CV file is not included in this repository.

## Deployment

Pull requests run the production build and browser checks through the validation workflow. Successful browser checks attach desktop and mobile screenshots as the `portfolio-preview` artifact on the Actions run. Merging into `main` triggers the existing GitHub Pages deployment workflow. In repository settings, GitHub Pages should use **GitHub Actions** as its source.
