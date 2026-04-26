import { Resvg } from '@resvg/resvg-js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../public/og-image.jpg')

const W = 1200
const H = 630

const CREAM = '#FAF7F2'
const SOIL = '#7A5A3F'
const SOIL_DARK = '#5A3F2A'
const INK = '#1F1A14'
const MUTE = '#807469'

const svg = `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#FAF7F2"/>
      <stop offset="1" stop-color="#F2EBDF"/>
    </linearGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <g transform="translate(80, 110)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="22" font-weight="600"
          fill="${SOIL}" letter-spacing="6">MADE BY SOIL</text>
  </g>

  <g transform="translate(80, 210)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="78" font-weight="800"
          fill="${INK}" letter-spacing="-2">국내산 A2 저지 우유</text>
    <text x="0" y="90" font-family="Pretendard, system-ui, sans-serif" font-size="76" font-weight="800"
          fill="${SOIL_DARK}" letter-spacing="-2">송영신목장</text>
    <text x="0" y="160" font-family="Pretendard, system-ui, sans-serif" font-size="46" font-weight="700"
          fill="${INK}" letter-spacing="-1">A2 Jersey Hay Milk</text>
  </g>

  <g transform="translate(80, 525)">
    <rect x="0" y="0" rx="22" ry="22" width="320" height="44" fill="${SOIL}"/>
    <text x="160" y="30" font-family="Pretendard, system-ui, sans-serif" font-size="20" font-weight="700"
          fill="${CREAM}" text-anchor="middle">2026.06.01 정기구독 오픈</text>
  </g>

  <g transform="translate(420, 533)">
    <text font-family="Pretendard, system-ui, sans-serif" font-size="20" font-weight="500"
          fill="${MUTE}">경기도 안성 · 저지방 우유와 다른 품종</text>
  </g>
</svg>
`.trim()

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: W },
  font: {
    loadSystemFonts: true,
    defaultFontFamily: 'Pretendard',
  },
  background: CREAM,
})

const png = resvg.render().asPng()
mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, png)
console.log(`OG image written to ${OUT} (${png.length} bytes)`)
