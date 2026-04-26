import { Resvg } from '@resvg/resvg-js'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PUBLIC = resolve(__dirname, '../public')

const svg = readFileSync(resolve(PUBLIC, 'logo.svg'), 'utf8')

const VARIANTS = [
  { name: 'logo-512.png', width: 512 },
  { name: 'logo-192.png', width: 192 },
  { name: 'apple-touch-icon.png', width: 180 },
  { name: 'favicon-32.png', width: 32 },
]

for (const v of VARIANTS) {
  const png = new Resvg(svg, {
    fitTo: { mode: 'width', value: v.width },
    background: 'rgba(0,0,0,0)',
    font: { loadSystemFonts: false },
  })
    .render()
    .asPng()
  writeFileSync(resolve(PUBLIC, v.name), png)
  console.log(`✓ ${v.name} (${png.length} bytes)`)
}
