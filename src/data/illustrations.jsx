// ============================================================
// Ilustrasi gerakan — gaya garis hangat BundaFit.
//
// ATURAN GAYA (wajib untuk semua ilustrasi):
// - viewBox 0 0 200 140 (disediakan wrapper ExerciseFigure); JANGAN
//   menggambar di luar area itu. Garis lantai y=124 digambar wrapper.
// - Sosok FACELESS: kepala lingkaran polos r=9 (stroke INK, fill none).
//   TANPA wajah, TANPA rambut, TANPA gelung — netral & sopan.
// - Anggota badan: path stroke INK, strokeWidth 7, strokeLinecap="round",
//   strokeLinejoin="round", fill="none". Badan proporsional, sederhana,
//   tanpa jari/wajah.
// - Kettlebell: pakai <Kettlebell x y /> (terakota). Panah arah gerakan:
//   <Arrow d="M..."/> (kurva pendek, terakota, ujung panah otomatis).
// - Posisi awal boleh digambar sebagai "bayangan" (stroke GHOST) di
//   belakang pose utama bila membantu memahami gerakan.
// - Matras (untuk gerakan lantai): <Mat /> — persegi panjang lembut.
// ============================================================

export const INK = '#43302E'
export const ACCENT = '#C05F53'
export const GHOST = '#DFCBBD'
export const SOFT = '#EFE2D7'

const limb = { stroke: INK, strokeWidth: 7, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' }
const ghostLimb = { ...limb, stroke: GHOST }

// Kepala faceless — lingkaran polos tanpa wajah/rambut.
// cx,cy = pusat kepala. (bunAngle diabaikan; dipertahankan agar pemanggilan lama aman.)
export function Head({ cx, cy, ghost = false }) {
  const c = ghost ? GHOST : INK
  return <circle cx={cx} cy={cy} r="9" stroke={c} strokeWidth="6" fill="none" />
}

// Kettlebell kecil; x,y = pusat badan bel. s = skala (1 = r 10)
export function Kettlebell({ x, y, s = 1, ghost = false }) {
  const c = ghost ? GHOST : ACCENT
  return (
    <g>
      <path
        d={`M ${x - 6 * s} ${y - 8 * s} A ${7.5 * s} ${7.5 * s} 0 1 1 ${x + 6 * s} ${y - 8 * s}`}
        stroke={c} strokeWidth={4.5 * s} fill="none" strokeLinecap="round"
      />
      <circle cx={x} cy={y} r={10 * s} fill={c} />
    </g>
  )
}

// Panah arah gerakan (kurva pendek terakota + mata panah)
export function Arrow({ d }) {
  return <path d={d} stroke={ACCENT} strokeWidth="3.5" fill="none" strokeLinecap="round" markerEnd="url(#bf-arrow)" />
}

// Matras untuk gerakan berbaring
export function Mat() {
  return <rect x="28" y="117" width="144" height="8" rx="4" fill={SOFT} />
}

export { limb, ghostLimb }

/* ============================================================
   Ilustrasi dasar (contoh acuan gaya — digambar arsitek)
   ============================================================ */

export const ILLUSTRATIONS_BASE = {
  // Berdiri tegak, tangan di rusuk, panah napas mengembang ke samping
  napas_360: (
    <g>
      <Head cx={100} cy={38} bunAngle={90} />
      <path {...limb} d="M100 47 L100 88" />
      <path {...limb} d="M100 54 L86 66 L96 72" />
      <path {...limb} d="M100 54 L114 66 L104 72" />
      <path {...limb} d="M100 88 L92 124" />
      <path {...limb} d="M100 88 L108 124" />
      <Arrow d="M78 66 C 72 66 70 66 66 66" />
      <Arrow d="M122 66 C 128 66 130 66 134 66" />
    </g>
  ),

  // Hinge: bayangan berdiri tegak + pose utama membungkuk pinggul, KB di lantai
  kb_deadlift: (
    <g>
      <path {...ghostLimb} d="M76 50 L76 86 L72 124" />
      <Head cx={76} cy={40} bunAngle={110} ghost />
      <Head cx={117} cy={53} bunAngle={150} />
      <path {...limb} d="M74 82 L98 60 L109 56" />
      <path {...limb} d="M74 82 L78 104 L84 124" />
      <path {...limb} d="M78 84 L84 106 L92 124" />
      <path {...limb} d="M104 60 L106 96" />
      <Kettlebell x={107} y={110} />
      <Arrow d="M132 88 C 138 78 140 70 138 60" />
    </g>
  ),

  // Glute bridge: berbaring, pinggul terangkat, panah ke atas
  glute_bridge: (
    <g>
      <Mat />
      <Head cx={42} cy={106} bunAngle={200} />
      <path {...limb} d="M52 108 L96 92" />
      <path {...limb} d="M96 92 L118 100 L124 121" />
      <path {...limb} d="M100 94 L124 104 L132 121" />
      <path {...limb} d="M58 110 L84 118" />
      <Arrow d="M96 76 C 97 70 98 64 98 58" />
    </g>
  ),

  // Jalan treadmill: sosok melangkah di atas sabuk treadmill
  jalan_treadmill: (
    <g>
      <rect x="40" y="116" width="120" height="7" rx="3.5" fill={SOFT} />
      <path d="M40 119 L28 96" stroke={SOFT} strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="92" r="4" fill={SOFT} />
      <Head cx={104} cy={34} bunAngle={150} />
      <path {...limb} d="M102 43 L98 80" />
      <path {...limb} d="M101 52 L112 66 L122 60" />
      <path {...limb} d="M101 52 L88 62 L96 72" />
      <path {...limb} d="M98 80 L112 98 L114 116" />
      <path {...limb} d="M98 80 L86 100 L78 114" />
      <Arrow d="M134 88 C 140 86 144 84 148 82" />
    </g>
  ),
}
