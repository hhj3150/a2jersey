// Composes OG image (1200x630) with logo + brand copy.
// Uses rsvg-convert (librsvg) for accurate SVG rendering of the
// Adobe Illustrator-exported logo (resvg-js doesn't support feImage).
//
// Pipeline: write composite SVG → rsvg-convert → PNG → sips → JPG.
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync, mkdirSync, unlinkSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '../public')
const TMP = resolve(__dirname, '_tmp')
mkdirSync(TMP, { recursive: true })

const OUT_JPG = resolve(PUBLIC, 'og-image.jpg')
const TMP_PNG = resolve(TMP, 'og-image.png')
const TMP_SVG = resolve(TMP, 'og-image.svg')

// Use the pre-rendered 512px PNG (more reliable than SVG inline composition).
const LOGO_PNG_B64 = readFileSync(resolve(PUBLIC, 'logo-512.png')).toString('base64')

const W = 1200
const H = 630

const CREAM = '#FAF7F2'
const SOIL = '#7A5A3F'
const SOIL_DARK = '#5A3F2A'
const INK = '#1F1A14'
const MUTE = '#807469'

// logo-512.png aspect ratio is 512×414 (≈1.236:1, from symbol viewBox 134×108)
const LOGO_W = 360
const LOGO_H = Math.round((LOGO_W * 414) / 512)
const LOGO_X = W - LOGO_W - 60
const LOGO_Y = Math.round((H - LOGO_H) / 2)

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FAF7F2"/>
      <stop offset="1" stop-color="#F2EBDF"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <image x="${LOGO_X}" y="${LOGO_Y}" width="${LOGO_W}" height="${LOGO_H}" preserveAspectRatio="xMidYMid meet" xlink:href="data:image/png;base64,${LOGO_PNG_B64}"/>

  <g transform="translate(80, 130)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="22" font-weight="600" fill="${SOIL}" letter-spacing="6">MADE BY SOIL</text>
  </g>

  <g transform="translate(80, 220)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="64" font-weight="800" fill="${INK}" letter-spacing="-2">국내산 A2 저지 우유</text>
    <text x="0" y="80" font-family="Pretendard, system-ui, sans-serif" font-size="64" font-weight="800" fill="${SOIL_DARK}" letter-spacing="-2">송영신목장</text>
    <text x="0" y="140" font-family="Pretendard, system-ui, sans-serif" font-size="36" font-weight="700" fill="${INK}" letter-spacing="-1">A2 Jersey Hay Milk</text>
  </g>

  <g transform="translate(80, 525)">
    <rect x="0" y="0" rx="22" ry="22" width="320" height="44" fill="${SOIL}"/>
    <text x="160" y="30" font-family="Pretendard, system-ui, sans-serif" font-size="20" font-weight="700" fill="${CREAM}" text-anchor="middle">2026.06.01 정기구독 오픈</text>
  </g>

  <g transform="translate(420, 533)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="20" font-weight="500" fill="${MUTE}">경기도 안성 · 저지방 우유와 다른 품종</text>
  </g>
</svg>
`

writeFileSync(TMP_SVG, svg)

execFileSync('rsvg-convert', ['-w', String(W), '-h', String(H), '-o', TMP_PNG, TMP_SVG], {
  stdio: ['ignore', 'inherit', 'inherit'],
})

execFileSync(
  'sips',
  ['-s', 'format', 'jpeg', '-s', 'formatOptions', '90', TMP_PNG, '--out', OUT_JPG],
  { stdio: ['ignore', 'ignore', 'inherit'] },
)

try { unlinkSync(TMP_SVG); unlinkSync(TMP_PNG) } catch {}
console.log(`OG image written to ${OUT_JPG}`)
