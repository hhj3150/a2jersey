// Renders public/logo.svg to PNG variants using rsvg-convert.
// rsvg-convert (librsvg) supports more SVG features than resvg-js
// (e.g. Adobe Illustrator's feImage-based raster compositing).
//
// Requires: brew install librsvg
import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '../public')
const SOURCE = resolve(PUBLIC, 'logo.svg')

if (!existsSync(SOURCE)) {
  console.error(`Missing source: ${SOURCE}`)
  process.exit(1)
}

const VARIANTS = [
  { name: 'logo-512.png', width: 512 },
  { name: 'logo-192.png', width: 192 },
  { name: 'apple-touch-icon.png', width: 180 },
  { name: 'favicon-32.png', width: 32 },
]

for (const v of VARIANTS) {
  const out = resolve(PUBLIC, v.name)
  execFileSync(
    'rsvg-convert',
    ['-w', String(v.width), '-o', out, SOURCE],
    { stdio: ['ignore', 'inherit', 'inherit'] },
  )
  const size = statSync(out).size
  console.log(`✓ ${v.name} (${size} bytes)`)
}
