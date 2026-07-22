// Membuat ikon PNG BundaFit tanpa dependensi (encoder PNG manual + zlib bawaan Node)
import { deflateSync } from 'node:zlib'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'icons')
mkdirSync(OUT, { recursive: true })

// ---------- Encoder PNG ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()
function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([len, body, crc])
}
function encodePng(size, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(size, 0)
  ihdr.writeUInt32BE(size, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  const raw = Buffer.alloc(size * (size * 4 + 1))
  for (let y = 0; y < size; y++) {
    raw[y * (size * 4 + 1)] = 0 // filter none
    rgba.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4)
  }
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// ---------- Warna & bentuk ----------
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const BG_TOP = hex('#E89A7D')
const BG_BOT = hex('#C05F53')
const CREAM = hex('#FDF8F2')
const HEART = hex('#A94E43')

const lerp = (a, b, t) => a + (b - a) * t

function inHeart(px, py, hx, hy, hr) {
  const x = (px - hx) / hr
  const y = (hy - py) / hr + 0.25
  const a = x * x + y * y - 1
  return a * a * a - x * x * y * y * y < 0
}

// Sampel warna 1 titik (u,v dalam koordinat 512 "desain") → [r,g,b,a]
function sample(u, v, { rounded, pad }) {
  const S = 512
  // padding untuk maskable: perkecil gambar kettlebell ke tengah
  const cu = (u - 256) / (1 - pad) + 256
  const cv = (v - 256) / (1 - pad) + 256

  // background
  let r, g, b, a
  if (rounded) {
    const rad = 115
    const qx = Math.max(Math.abs(u - 256) - (256 - rad), 0)
    const qy = Math.max(Math.abs(v - 256) - (256 - rad), 0)
    if (Math.hypot(qx, qy) > rad) return [0, 0, 0, 0]
  }
  const t = v / S
  r = lerp(BG_TOP[0], BG_BOT[0], t)
  g = lerp(BG_TOP[1], BG_BOT[1], t)
  b = lerp(BG_TOP[2], BG_BOT[2], t)
  a = 255

  // pegangan (cincin)
  const dh = Math.hypot(cu - 256, cv - 196)
  if (dh >= 76 && dh <= 118) [r, g, b] = CREAM
  // badan
  if (Math.hypot(cu - 256, cv - 316) <= 140) [r, g, b] = CREAM
  // hati
  if (inHeart(cu, cv, 256, 322, 66)) [r, g, b] = HEART

  return [r, g, b, a]
}

function render(size, opts) {
  const rgba = Buffer.alloc(size * size * 4)
  const scale = 512 / size
  const SS = 3 // supersampling 3x3
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let r = 0, g = 0, b = 0, a = 0
      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const u = (x + (sx + 0.5) / SS) * scale
          const v = (y + (sy + 0.5) / SS) * scale
          const c = sample(u, v, opts)
          r += c[0] * (c[3] / 255)
          g += c[1] * (c[3] / 255)
          b += c[2] * (c[3] / 255)
          a += c[3]
        }
      }
      const n = SS * SS
      const i = (y * size + x) * 4
      const alpha = a / n
      rgba[i] = alpha > 0 ? Math.round(r / n / (alpha / 255)) : 0
      rgba[i + 1] = alpha > 0 ? Math.round(g / n / (alpha / 255)) : 0
      rgba[i + 2] = alpha > 0 ? Math.round(b / n / (alpha / 255)) : 0
      rgba[i + 3] = Math.round(alpha)
    }
  }
  return encodePng(size, rgba)
}

writeFileSync(join(OUT, 'icon-192.png'), render(192, { rounded: true, pad: 0 }))
writeFileSync(join(OUT, 'icon-512.png'), render(512, { rounded: true, pad: 0 }))
writeFileSync(join(OUT, 'icon-512-maskable.png'), render(512, { rounded: false, pad: 0.18 }))
writeFileSync(join(OUT, 'apple-touch-icon.png'), render(180, { rounded: false, pad: 0 }))
console.log('Ikon dibuat di', OUT)
