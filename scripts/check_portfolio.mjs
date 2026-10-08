import { chromium } from 'playwright'
import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { spawn } from 'node:child_process'

const origin = 'http://127.0.0.1:4173'
const artifactDir = 'portfolio-preview'
const research = JSON.parse(await readFile(new URL('../src/data/research.json', import.meta.url), 'utf8'))
const sample = research.publications.find(paper => /vibration/i.test(paper.title)) ?? research.publications[0]
const term = /vibration/i.test(sample.title) ? 'vibration' : sample.title.split(/\s+/)[0]
const matches = research.publications.filter(paper => `${paper.title} ${paper.authors} ${paper.journal} ${paper.year}`.toLowerCase().includes(term.toLowerCase()))
const server = spawn('npm', ['run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'inherit' })
let browser
try {
  let ready = false
  for (let attempt = 0; attempt < 40; attempt++) {
    try { ready = (await fetch(origin)).ok } catch { /* Wait for Vite preview. */ }
    if (ready) break
    if (server.exitCode !== null) throw new Error('Preview server exited before becoming ready')
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  assert.ok(ready, 'Preview server should start')
  browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(origin, { waitUntil: 'networkidle' })
  assert.equal(await page.locator('h1').count(), 1)
  assert.equal(await page.locator('.publication').count(), Math.min(6, research.publications.length))
  if (research.publications.length > 6) {
    await page.getByRole('button', { name: 'Show more papers' }).click()
    assert.equal(await page.locator('.publication').count(), Math.min(12, research.publications.length))
  }
  await page.locator('#publication-search').fill(term)
  const resultTitles = await page.locator('.publication h3 a').allTextContents()
  assert.equal(resultTitles.length, Math.min(6, matches.length))
  assert.ok(resultTitles.every(title => matches.some(paper => paper.title === title)))
  await page.locator('#publication-year').selectOption(sample.year)
  assert.equal(await page.locator('.publication').count(), Math.min(6, matches.filter(paper => paper.year === sample.year).length))
  await page.locator('#publication-search').fill('nomatchtest')
  assert.equal(await page.getByRole('heading', { name: 'No matching papers' }).count(), 1)
  await page.getByRole('button', { name: 'Reset filters', exact: true }).last().click()
  await page.locator('#publication-sort').selectOption('cited')
  const mostCited = [...research.publications].sort((a, b) => (Number.parseInt(b.citations, 10) || 0) - (Number.parseInt(a.citations, 10) || 0))[0]
  assert.equal(await page.locator('.publication h3 a').first().textContent(), mostCited.title)
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click()
  await page.getByRole('button', { name: 'Next photo' }).click()
  assert.match(await page.locator('.photo-gallery figcaption').textContent(), /Lecture delivery/)
  await page.waitForFunction(() => document.querySelector('.gallery-image img').complete && document.querySelector('.gallery-image img').naturalWidth > 0)
  await page.getByRole('button', { name: 'Previous photo' }).click()
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))
  const anchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => !!document.querySelector(link.getAttribute('href'))))
  assert.ok(anchors.every(Boolean))
  assert.equal(await page.locator('a[href="mailto:nouioua.mo@gmail.com"]').count(), 2)
  assert.equal(await page.locator('a[href="tel:+966542429198"]').count(), 1)
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const size = await page.evaluate(() => ({ viewport: innerWidth, page: document.documentElement.scrollWidth }))
    assert.ok(size.page <= size.viewport, `Horizontal overflow at ${width}px: ${size.page}`)
  }
  await page.setViewportSize({ width: 390, height: 844 })
  await page.evaluate(() => window.scrollTo(0, 0))
  const menu = page.getByRole('button', { name: 'Open navigation menu' })
  await menu.click()
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true')
  await page.keyboard.press('Escape')
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false')
  assert.equal(await page.locator('.menu-toggle').evaluate(element => element === document.activeElement), true)
  await menu.click()
  await page.locator('#navigation-links').getByRole('link', { name: 'Publications', exact: true }).click()
  assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false')
  assert.equal(new URL(page.url()).hash, '#publications')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  assert.equal(await page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior), 'auto')
  await page.goto(origin, { waitUntil: 'networkidle' })
  await page.keyboard.press('Tab')
  assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Skip to main content')
  await page.keyboard.press('Enter')
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content')
  await page.evaluate(() => document.activeElement.blur())
  await page.locator('.photo-gallery').scrollIntoViewIfNeeded()
  await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0))
  await page.evaluate(() => window.scrollTo(0, 0))
  await mkdir(artifactDir, { recursive: true })
  await page.screenshot({ path: `${artifactDir}/mobile.png`, fullPage: true })
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: `${artifactDir}/desktop.png`, fullPage: true })
  assert.deepEqual(errors, [])
  console.log('PASS: publication search, filters, sorting, pagination, empty state, gallery, image loading, anchors, contact links, five responsive widths, mobile navigation, Escape focus return, skip link, reduced motion, and runtime errors.')
} finally {
  await browser?.close()
  server.kill('SIGTERM')
}
