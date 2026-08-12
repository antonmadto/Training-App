// ============================================================
// Ilustrasi gerakan tambahan — gaya GARIS FACELESS BundaFit.
// Mengikuti aturan gaya & proporsi ILLUSTRATIONS_BASE di ./illustrations.jsx.
// Kanvas viewBox 0 0 200 140. Lantai y=124 & marker panah disediakan wrapper.
// ============================================================

import { Head, Kettlebell, Arrow, Mat, limb, ghostLimb, SOFT } from './illustrations.jsx'

export const ILLUSTRATIONS_B = {
  // 1. Floor press: berbaring telentang, lutut menekuk, satu tangan
  //    mendorong KB lurus ke atas dada; panah KB naik.
  kb_floor_press: (
    <g>
      <Mat />
      <Head cx={42} cy={106} />
      <path {...limb} d="M52 107 L98 107" />
      <path {...limb} d="M98 107 L114 90 L122 118" />
      <path {...limb} d="M100 107 L118 92 L126 118" />
      <path {...limb} d="M60 107 L78 115" />
      <path {...limb} d="M56 106 L58 82" />
      <Kettlebell x={58} y={76} />
      <Arrow d="M58 66 C 58 60 58 56 58 50" />
    </g>
  ),

  // 2. Press bahu: berdiri tegak, satu tangan menekan KB ke atas kepala
  //    (lengan hampir lurus), tangan lain di sisi; panah KB naik.
  kb_press: (
    <g>
      <Head cx={100} cy={40} />
      <path {...limb} d="M100 49 L100 90" />
      <path {...limb} d="M100 55 L106 30" />
      <path {...limb} d="M100 55 L89 80" />
      <path {...limb} d="M100 90 L92 124" />
      <path {...limb} d="M100 90 L108 124" />
      <Kettlebell x={107} y={22} />
      <Arrow d="M120 34 C 120 27 120 22 120 16" />
    </g>
  ),

  // 3. Halo: berdiri tegak, dua tangan memegang KB di dekat kepala;
  //    panah melingkar mengelilingi kepala menunjukkan putaran.
  kb_halo: (
    <g>
      <Head cx={100} cy={42} />
      <path {...limb} d="M100 51 L100 90" />
      <path {...limb} d="M100 57 L114 46 L120 42" />
      <path {...limb} d="M100 57 L110 40 L118 42" />
      <path {...limb} d="M100 90 L92 124" />
      <path {...limb} d="M100 90 L108 124" />
      <Kettlebell x={122} y={42} s={0.8} />
      <Arrow d="M120 30 C 100 22 82 30 80 46" />
    </g>
  ),

  // 4. Suitcase carry: berdiri sangat lurus, satu tangan menjinjing KB di
  //    sisi (lengan lurus ke bawah); garis tegak lurus SOFT + panah "tetap tegak".
  suitcase_carry: (
    <g>
      <path d="M76 36 L76 122" stroke={SOFT} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Head cx={100} cy={40} />
      <path {...limb} d="M100 49 L100 90" />
      <path {...limb} d="M100 55 L90 88" />
      <path {...limb} d="M100 55 L110 90" />
      <path {...limb} d="M100 90 L94 124" />
      <path {...limb} d="M100 90 L106 124" />
      <Kettlebell x={112} y={102} s={0.9} />
      <Arrow d="M100 30 C 100 24 100 20 100 16" />
    </g>
  ),

  // 5. Heel slide: berbaring telentang, satu lutut menekuk lalu tumit
  //    menggeser menjauh (kaki hampir lurus); ghost posisi tertekuk; panah horizontal.
  heel_slide: (
    <g>
      <Mat />
      <Head cx={40} cy={107} />
      <path {...limb} d="M48 108 L92 108" />
      <path {...limb} d="M92 108 L100 88 L110 120" />
      <path {...ghostLimb} d="M94 108 L112 92 L120 118" />
      <path {...limb} d="M94 108 L138 116" />
      <Arrow d="M142 117 C 149 117 153 117 159 117" />
    </g>
  ),

  // 6. Dead bug: berbaring, lengan lurus ke atas & lutut di atas pinggul;
  //    satu lengan + kaki BERLAWANAN turun memanjang (diagonal); panah turun.
  dead_bug: (
    <g>
      <Mat />
      <Head cx={40} cy={107} />
      <path {...limb} d="M48 108 L92 108" />
      <path {...limb} d="M56 107 L60 82" />
      <path {...limb} d="M56 108 L32 98" />
      <path {...limb} d="M92 108 L96 84 L114 88" />
      <path {...limb} d="M92 108 L128 114" />
      <Arrow d="M30 100 C 26 104 24 108 22 112" />
      <Arrow d="M132 115 C 137 118 140 120 144 123" />
    </g>
  ),

  // 7. Bird dog: merangkak (tangan & lutut di matras), lengan satu + kaki
  //    berlawanan terentang horizontal; handuk SOFT di bawah lutut tumpu; panah kecil.
  bird_dog: (
    <g>
      <Mat />
      <rect x="110" y="116" width="18" height="6" rx="3" fill={SOFT} />
      <Head cx={66} cy={90} />
      <path {...limb} d="M80 88 L116 88" />
      <path {...limb} d="M80 88 L78 120" />
      <path {...limb} d="M116 88 L119 116" />
      <path {...limb} d="M80 88 L46 78" />
      <path {...limb} d="M116 88 L152 80" />
      <Arrow d="M42 77 C 36 76 32 75 27 74" />
      <Arrow d="M156 79 C 162 78 166 77 171 76" />
    </g>
  ),

  // 8. Side hip lift: berbaring miring bertumpu siku, lutut menekuk, pinggul
  //    terangkat (garis kepala-lutut); panah pinggul naik. Kepala kiri.
  side_hip_lift: (
    <g>
      <Mat />
      <Head cx={42} cy={92} />
      <path {...limb} d="M50 95 L56 100" />
      <path {...limb} d="M56 100 L52 118" />
      <path {...limb} d="M56 100 L98 110" />
      <path {...limb} d="M98 110 L110 118" />
      <path {...limb} d="M110 118 L98 123" />
      <Arrow d="M98 102 C 99 96 100 92 100 87" />
    </g>
  ),

  // 9. Side plank dari lutut: bertumpu siku + lutut, badan lurus diagonal
  //    kepala->lutut, pinggul terangkat penuh; panah kecil tahan.
  side_plank_lutut: (
    <g>
      <Mat />
      <Head cx={40} cy={80} />
      <path {...limb} d="M48 84 L56 92" />
      <path {...limb} d="M56 92 L52 118" />
      <path {...limb} d="M56 92 L104 116" />
      <path {...limb} d="M104 116 L92 123" />
      <Arrow d="M80 100 C 80 95 80 92 80 88" />
    </g>
  ),

  // 10. Tes diastasis: berbaring, kepala sedikit terangkat (dagu ke dada),
  //     dua jari menekan garis tengah perut; panah kecil menunjuk ke perut.
  tes_diastasis: (
    <g>
      <Mat />
      <Head cx={50} cy={98} />
      <path {...limb} d="M54 103 L58 106" />
      <path {...limb} d="M58 106 L100 106" />
      <path {...limb} d="M100 106 L114 92 L122 118" />
      <path {...limb} d="M102 106 L118 94 L126 118" />
      <path {...limb} d="M60 106 L84 103" />
      <Arrow d="M84 94 C 84 97 84 99 84 101" />
    </g>
  ),

  // 11. Jalan interval: berjalan cepat di treadmill (sabuk SOFT + tiang miring),
  //     langkah lebih lebar, ayunan lengan tegas; DUA panah maju (cepat).
  jalan_interval: (
    <g>
      <rect x="40" y="116" width="120" height="7" rx="3.5" fill={SOFT} />
      <path d="M40 119 L28 96" stroke={SOFT} strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="28" cy="92" r="4" fill={SOFT} />
      <Head cx={106} cy={33} />
      <path {...limb} d="M104 42 L98 80" />
      <path {...limb} d="M104 50 L118 58 L128 48" />
      <path {...limb} d="M104 50 L90 60 L80 72" />
      <path {...limb} d="M98 80 L116 96 L122 115" />
      <path {...limb} d="M98 80 L82 100 L72 115" />
      <Arrow d="M132 78 C 138 76 142 75 148 73" />
      <Arrow d="M130 92 C 136 90 140 89 146 87" />
    </g>
  ),

  // 12. Peregangan paha depan: berdiri satu kaki, tangan menarik punggung
  //     kaki lain ke bokong; tangan lain berpegangan pada garis SOFT; panah ke bokong.
  peregangan_paha: (
    <g>
      <path d="M74 34 L74 122" stroke={SOFT} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Head cx={100} cy={38} />
      <path {...limb} d="M100 47 L100 88" />
      <path {...limb} d="M100 88 L98 124" />
      <path {...limb} d="M100 88 L106 106 L98 92" />
      <path {...limb} d="M100 55 L99 90" />
      <path {...limb} d="M100 55 L80 64" />
      <Arrow d="M110 100 C 108 96 105 93 100 90" />
    </g>
  ),

  // 13. Peregangan pinggul (figure-4): berbaring, pergelangan kaki disilang di
  //     atas lutut kaki lain, dua tangan menarik paha ke dada; panah ke dada.
  peregangan_pinggul: (
    <g>
      <Mat />
      <Head cx={40} cy={110} />
      <path {...limb} d="M48 111 L72 106" />
      <path {...limb} d="M72 106 L90 78" />
      <path {...limb} d="M90 78 L78 96" />
      <path {...limb} d="M72 106 L104 96" />
      <path {...limb} d="M104 96 L84 86" />
      <path {...limb} d="M52 109 L74 92" />
      <Arrow d="M92 72 C 88 68 85 66 81 63" />
    </g>
  ),

  // 14. Peregangan dada: berdiri di ambang pintu (dua garis SOFT sebagai kusen),
  //     kedua lengan di kusen setinggi bahu, badan sedikit maju; panah dada terbuka.
  peregangan_dada: (
    <g>
      <path d="M60 18 L60 124" stroke={SOFT} strokeWidth={5} strokeLinecap="round" fill="none" />
      <path d="M140 18 L140 124" stroke={SOFT} strokeWidth={5} strokeLinecap="round" fill="none" />
      <Head cx={100} cy={40} />
      <path {...limb} d="M100 49 L100 88" />
      <path {...limb} d="M100 56 L78 54 L62 55" />
      <path {...limb} d="M100 56 L122 54 L138 55" />
      <path {...limb} d="M100 88 L92 124" />
      <path {...limb} d="M100 88 L108 124" />
      <Arrow d="M88 62 C 84 65 82 68 80 72" />
      <Arrow d="M112 62 C 116 65 118 68 120 72" />
    </g>
  ),

  // 15. Relaksasi pelvic: berbaring tenang, lutut menekuk kaki menapak, satu
  //     tangan di perut; panah napas lembut (gelombang) di atas dada.
  relaksasi_pelvic: (
    <g>
      <Mat />
      <Head cx={42} cy={106} />
      <path {...limb} d="M52 107 L98 107" />
      <path {...limb} d="M98 107 L114 92 L122 118" />
      <path {...limb} d="M100 107 L118 94 L126 118" />
      <path {...limb} d="M56 108 L70 116" />
      <path {...limb} d="M56 106 L80 103" />
      <Arrow d="M72 95 C 70 89 78 89 76 83 C 74 79 80 78 80 74" />
    </g>
  ),
}
