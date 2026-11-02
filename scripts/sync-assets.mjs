#!/usr/bin/env node
/**
 * sync-assets: pull screenshots, headshots and the résumé from the career folder into the site.
 *
 *   npm run sync-assets            # incremental (skips images that are already up to date)
 *   npm run sync-assets -- --force # re-encode everything
 *
 * Sources (override the root with CAREER_DIR=/path/to/career):
 *   <career>/assets/screenshots/<slug>/*.png|jpg|webp  (+ captions.md)
 *   <career>/assets/headshot-casual.png, headshot-suit.png
 *   <career>/Joseph_Morrison_Resume.pdf  (or <career>/resume/Joseph_Morrison_Resume.pdf)
 *
 * Outputs:
 *   public/img/work/<slug>/<name>-<w>.avif|webp
 *   public/img/headshot-<variant>-<w>.avif|webp
 *   public/Joseph_Morrison_Resume.pdf (real file, or a placeholder if none exists yet)
 *   src/content/assets.generated.json  (manifest the site reads; slugs without images get a generated placeholder in the UI)
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const here = path.dirname(fileURLToPath(import.meta.url))
const SITE = path.resolve(here, '..')
const CAREER = process.env.CAREER_DIR ? path.resolve(process.env.CAREER_DIR) : path.resolve(SITE, '..')
const SHOTS = path.join(CAREER, 'assets', 'screenshots')
const OUT_WORK = path.join(SITE, 'public', 'img', 'work')
const OUT_IMG = path.join(SITE, 'public', 'img')
const MANIFEST = path.join(SITE, 'src', 'content', 'assets.generated.json')
const FORCE = process.argv.includes('--force')

const SLUGS = [
  'metriqs',
  'connected-machine-platform',
  'relay',
  'acquisition-radar',
  'link',
  'civic-records-ai',
  'pdu-configurator',
  'marlow',
  'meminios',
  'northstar',
]
const IMG_EXT = /\.(png|jpe?g|webp)$/i
/** Files never published, per slug. Relay console shots render private client code; awaiting the founder's OK. */
const EXCLUDE = { relay: /^console-/i }

const log = (...a) => console.log('[sync-assets]', ...a)
const mkdirp = (p) => fs.mkdirSync(p, { recursive: true })
const isFresh = (out, src) => !FORCE && fs.existsSync(out) && fs.statSync(out).mtimeMs >= fs.statSync(src).mtimeMs

function parseCaptions(dir, files) {
  const file = ['captions.md', 'CAPTIONS.md', 'captions.txt'].map((f) => path.join(dir, f)).find((f) => fs.existsSync(f))
  const map = {}
  if (!file) return map
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/)
  for (const f of files) {
    const stem = f.replace(IMG_EXT, '')
    const line = lines.find((l) => l.includes(f)) ?? lines.find((l) => new RegExp(`(^|[^\\w-])${stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\w-]|$)`).test(l))
    if (!line) continue
    let text = line
      .replace(f, '')
      .replace(stem, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/[`*_]/g, '')
      .replace(/^\s*(?:[-+]|\d+[.)])\s*/, '')
      .replace(/\|/g, ' ')
      .replace(/^[\s:—–\-|.]+/, '')
      .replace(/\s+/g, ' ')
      .trim()
    if (text) map[f] = text
  }
  return map
}

async function lqip(input) {
  const buf = await sharp(input).resize(24).webp({ quality: 40 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

async function encode(input, outBase, widths, srcW) {
  const made = []
  for (const w of widths) {
    const width = Math.min(w, srcW)
    const avif = `${outBase}-${w}.avif`
    const webp = `${outBase}-${w}.webp`
    if (!isFresh(webp, input)) await sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality: 80, effort: 5 }).toFile(webp)
    if (!isFresh(avif, input)) await sharp(input).resize({ width, withoutEnlargement: true }).avif({ quality: 55, effort: 4 }).toFile(avif)
    made.push(path.basename(avif), path.basename(webp))
  }
  return made
}

async function syncProject(slug) {
  const dir = path.join(SHOTS, slug)
  const outDir = path.join(OUT_WORK, slug)
  if (!fs.existsSync(dir)) {
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true })
    return { images: [] }
  }
  const files = fs.readdirSync(dir).filter((f) => IMG_EXT.test(f) && !f.startsWith('.') && !EXCLUDE[slug]?.test(f)).sort()
  const captions = parseCaptions(dir, files)
  mkdirp(outDir)
  const keep = new Set()
  const images = []
  for (const f of files) {
    const input = path.join(dir, f)
    const meta = await sharp(input).metadata()
    if (!meta.width || !meta.height) continue
    const name = f.replace(IMG_EXT, '').toLowerCase().replace(/[^a-z0-9-]+/g, '-')
    // desktop: landscape app screens · mobile: phone-shaped (≈9:19.5) · document: PDF pages, long emails
    const ratio = meta.height / meta.width
    const kind = ratio <= 1.1 ? 'desktop' : ratio >= 1.9 && ratio <= 2.4 && meta.width <= 1400 ? 'mobile' : 'document'
    const widths = kind === 'mobile' ? [420, 840] : kind === 'document' ? [700, 1400] : [960, 1920]
    const made = await encode(input, path.join(outDir, name), widths, meta.width)
    made.forEach((m) => keep.add(m))
    images.push({
      base: `/img/work/${slug}/${name}`,
      widths,
      w: meta.width,
      h: meta.height,
      kind,
      caption: captions[f] ?? '',
      lqip: await lqip(input),
    })
  }
  for (const f of fs.readdirSync(outDir)) if (!keep.has(f)) fs.rmSync(path.join(outDir, f))
  return { images }
}

/**
 * Both headshots are cropped to 4:5 with the eyes on the same line and the same inter-ocular distance,
 * so the hero can wipe between them (hoodie = engineer, suit = seller) without the face jumping.
 */
const HEADSHOT_CROPS = {
  casual: { left: 80, top: 70, width: 984, height: 1230 },
  suit: { left: 92, top: 2, width: 984, height: 1230 },
}

async function syncHeadshots() {
  const out = {}
  for (const variant of ['casual', 'suit']) {
    const src = path.join(CAREER, 'assets', `headshot-${variant}.png`)
    if (!fs.existsSync(src)) continue
    const cropped = path.join(SITE, '.tmp', `headshot-${variant}.png`)
    mkdirp(path.dirname(cropped))
    if (!isFresh(cropped, src)) await sharp(src).extract(HEADSHOT_CROPS[variant]).resize(1000, 1250).png().toFile(cropped)
    await encode(cropped, path.join(OUT_IMG, `headshot-${variant}`), [480, 960], 1000)
    out[variant] = { base: `/img/headshot-${variant}`, widths: [480, 960], w: 1000, h: 1250, lqip: await lqip(cropped) }
  }
  return out
}

/** Minimal valid one-page PDF, used only until the real résumé lands. */
function placeholderPdf() {
  const lines = [
    ['F2', 22, 'Joseph A. Morrison'],
    ['F1', 12, 'Resume PDF is being finalized.'],
    ['F1', 12, 'Email josephmorrison702@gmail.com for the current copy.'],
    ['F1', 12, 'linkedin.com/in/joseph-a-morrison  |  github.com/pixelate-solutions'],
  ]
  let y = 700
  const content = lines
    .map(([f, s, t], i) => {
      const cmd = `BT /${f} ${s} Tf 72 ${y} Td (${t.replace(/[()\\]/g, '\\$&')}) Tj ET`
      y -= i === 0 ? 40 : 22
      return cmd
    })
    .join('\n')
  const objs = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>',
    `<< /Length ${Buffer.byteLength(content)} >>\nstream\n${content}\nendstream`,
  ]
  let pdf = '%PDF-1.4\n'
  const offsets = []
  objs.forEach((o, i) => {
    offsets.push(Buffer.byteLength(pdf))
    pdf += `${i + 1} 0 obj\n${o}\nendobj\n`
  })
  const xref = Buffer.byteLength(pdf)
  pdf += `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n${offsets.map((o) => `${String(o).padStart(10, '0')} 00000 n \n`).join('')}`
  pdf += `trailer\n<< /Size ${objs.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF\n`
  return pdf
}

function syncResume() {
  const dest = path.join(SITE, 'public', 'Joseph_Morrison_Resume.pdf')
  const src = [path.join(CAREER, 'Joseph_Morrison_Resume.pdf'), path.join(CAREER, 'resume', 'Joseph_Morrison_Resume.pdf')].find((p) => fs.existsSync(p))
  if (src) {
    fs.copyFileSync(src, dest)
    return 'real'
  }
  fs.writeFileSync(dest, placeholderPdf())
  return 'placeholder'
}

async function main() {
  log(`career dir: ${CAREER}`)
  mkdirp(OUT_WORK)
  const projects = {}
  const present = []
  for (const slug of SLUGS) {
    projects[slug] = await syncProject(slug)
    const n = projects[slug].images.length
    if (n) present.push(slug)
    log(`${slug.padEnd(28)} ${n ? `${n} image(s)` : 'none -> generated placeholder'}`)
  }
  if (fs.existsSync(SHOTS)) {
    const extra = fs.readdirSync(SHOTS).filter((d) => !SLUGS.includes(d) && fs.statSync(path.join(SHOTS, d)).isDirectory())
    if (extra.length) log(`ignored folders (not in SLUGS): ${extra.join(', ')}`)
  }
  const headshots = await syncHeadshots()
  const resume = syncResume()
  log(`headshots: ${Object.keys(headshots).join(', ') || 'none'} · résumé: ${resume}`)
  fs.writeFileSync(MANIFEST, JSON.stringify({ generatedAt: new Date().toISOString(), present, resume, headshots, projects }, null, 2) + '\n')
  log(`wrote ${path.relative(SITE, MANIFEST)}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
