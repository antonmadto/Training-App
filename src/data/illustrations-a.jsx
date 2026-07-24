// ============================================================
// Ilustrasi gerakan — kelompok A (gaya garis faceless BundaFit).
// Meniru gaya & proporsi ILLUSTRATIONS_BASE di ./illustrations.jsx.
// Kanvas viewBox 0 0 200 140. Lantai y=124 & marker panah disediakan
// wrapper ExerciseFigure — tidak digambar ulang di sini.
// ============================================================

import { Head, Kettlebell, Arrow, Mat, limb, ghostLimb, INK, ACCENT, GHOST, SOFT } from './illustrations.jsx'

export const ILLUSTRATIONS_A = {
  // 1. Jalan di tempat — satu lutut terangkat tinggi, lengan berlawanan mengayun
  jalan_ditempat: (
    <g>
      <Head cx={100} cy={36} />
      <path {...limb} d="M100 45 L100 82" />
      <path {...limb} d="M100 52 L112 64 L110 74" />
      <path {...limb} d="M100 52 L88 62 L88 72" />
      <path {...limb} d="M100 82 L95 124" />
      <path {...limb} d="M100 82 L117 92 L112 108" />
      <Arrow d="M126 100 C 130 94 130 88 126 84" />
    </g>
  ),

  // 2. Ayun/lingkar lengan — kedua lengan terentang membuka dada ke belakang
  ayun_lengan: (
    <g>
      <Head cx={100} cy={36} />
      <path {...limb} d="M100 45 L100 88" />
      <path {...limb} d="M100 52 L80 44" />
      <path {...limb} d="M100 52 L120 44" />
      <path {...limb} d="M100 88 L92 124" />
      <path {...limb} d="M100 88 L108 124" />
      <Arrow d="M78 42 C 72 40 70 44 72 48" />
      <Arrow d="M122 42 C 128 40 130 44 128 48" />
    </g>
  ),

  // 3. Hinge ke dinding — bokong menyentuh dinding, punggung lurus condong depan
  hip_hinge_dinding: (
    <g>
      <line x1="150" y1="40" x2="150" y2="124" stroke={SOFT} strokeWidth="6" strokeLinecap="round" />
      <Head cx={102} cy={62} />
      <path {...limb} d="M142 84 L112 68" />
      <path {...limb} d="M112 68 L122 80 L136 82" />
      <path {...limb} d="M142 84 L133 104 L127 124" />
      <path {...limb} d="M142 86 L139 104 L135 124" />
      <Arrow d="M132 90 C 138 89 143 90 147 91" />
    </g>
  ),

  // 4. KB RDL — sedikit membungkuk dari pinggul, dua tangan pegang KB di depan kering
  kb_rdl: (
    <g>
      <path {...ghostLimb} d="M90 50 L90 86 L86 124" />
      <Head cx={90} cy={40} ghost />
      <Head cx={116} cy={58} />
      <path {...limb} d="M88 84 L108 66" />
      <path {...limb} d="M106 68 L98 98" />
      <path {...limb} d="M88 84 L92 104 L88 124" />
      <path {...limb} d="M90 86 L98 104 L94 124" />
      <Kettlebell x={96} y={106} />
      <Arrow d="M122 90 C 124 98 124 106 122 114" />
    </g>
  ),

  // 5. Hip thrust — punggung atas di tepi sofa, pinggul terangkat, KB di pangkal paha
  hip_thrust: (
    <g>
      <rect x="28" y="86" width="42" height="24" rx="4" fill={SOFT} />
      <Head cx={50} cy={86} />
      <path {...limb} d="M62 92 L108 98" />
      <path {...limb} d="M64 94 L92 102" />
      <path {...limb} d="M108 98 L130 100 L130 124" />
      <path {...limb} d="M110 100 L134 102 L136 124" />
      <Kettlebell x={104} y={92} />
      <Arrow d="M104 80 C 104 74 104 69 104 64" />
    </g>
  ),

  // 6. Bridge march — glute bridge dengan satu kaki lurus terangkat dari lantai
  bridge_march: (
    <g>
      <Mat />
      <Head cx={42} cy={106} />
      <path {...limb} d="M52 108 L96 92" />
      <path {...limb} d="M96 92 L118 100 L124 121" />
      <path {...limb} d="M98 92 L128 78" />
      <path {...limb} d="M58 110 L84 118" />
      <Arrow d="M132 72 C 133 66 134 62 134 58" />
    </g>
  ),

  // 7. Goblet box squat — setengah jongkok menyentuh kursi, memeluk KB di dada
  goblet_box_squat: (
    <g>
      <rect x="116" y="96" width="46" height="28" rx="3" fill={SOFT} />
      <Head cx={96} cy={44} />
      <path {...limb} d="M96 52 L106 90" />
      <path {...limb} d="M96 54 L86 62 L96 68" />
      <path {...limb} d="M106 90 L94 106 L90 124" />
      <path {...limb} d="M108 90 L100 106 L98 124" />
      <Kettlebell x={90} y={66} s={0.9} />
      <Arrow d="M120 82 C 121 88 121 92 120 96" />
    </g>
  ),

  // 8. Step up — melangkah naik ke undakan rendah, satu kaki di atas undakan
  step_up: (
    <g>
      <rect x="112" y="112" width="52" height="12" rx="2" fill={SOFT} />
      <Head cx={96} cy={36} />
      <path {...limb} d="M96 45 L98 82" />
      <path {...limb} d="M96 50 L110 60" />
      <path {...limb} d="M96 50 L84 60 L84 70" />
      <path {...limb} d="M98 82 L120 98 L132 112" />
      <path {...limb} d="M98 82 L92 104 L88 124" />
      <Arrow d="M118 92 C 119 86 120 82 120 78" />
    </g>
  ),

  // 9. Wall sit — bersandar dinding, lutut menekuk dangkal (paha agak turun)
  wall_sit: (
    <g>
      <line x1="150" y1="30" x2="150" y2="124" stroke={SOFT} strokeWidth="6" strokeLinecap="round" />
      <Head cx={146} cy={40} />
      <path {...limb} d="M146 48 L144 84" />
      <path {...limb} d="M146 52 L120 90" />
      <path {...limb} d="M144 84 L116 98 L112 124" />
      <path {...limb} d="M144 86 L122 98 L118 124" />
      <Arrow d="M130 78 C 130 82 130 85 130 88" />
    </g>
  ),

  // 10. Quad set — kaki lurus di matras, handuk gulung di bawah lutut, paha mengencang
  quad_set: (
    <g>
      <Mat />
      <Head cx={40} cy={104} />
      <path {...limb} d="M50 106 L94 108" />
      <path {...limb} d="M94 108 L152 109" />
      <path {...limb} d="M52 108 L80 115" />
      <circle cx="122" cy="115" r="5" fill={SOFT} />
      <Arrow d="M122 96 C 122 100 122 103 122 107" />
    </g>
  ),

  // 11. SLR — berbaring, satu lutut menekuk menapak, kaki lain lurus terangkat
  slr: (
    <g>
      <Mat />
      <Head cx={40} cy={104} />
      <path {...limb} d="M50 106 L88 108" />
      <path {...limb} d="M88 108 L104 96 L112 118" />
      <path {...limb} d="M90 108 L128 88" />
      <path {...limb} d="M52 108 L78 116" />
      <Arrow d="M132 84 C 133 78 134 74 134 70" />
    </g>
  ),

  // 12. Clamshell — berbaring miring, lutut tumpuk, lutut atas membuka seperti kerang
  clamshell: (
    <g>
      <Mat />
      <Head cx={40} cy={106} />
      <path {...limb} d="M50 106 L86 106" />
      <path {...limb} d="M52 104 L74 112" />
      <path {...limb} d="M86 106 L110 112 L100 122" />
      <path {...limb} d="M86 104 L108 98 L100 120" />
      <Arrow d="M112 90 C 113 85 114 82 114 78" />
    </g>
  ),

  // 13. Abduksi samping — berbaring miring badan lurus, kaki atas lurus terangkat
  abduksi_samping: (
    <g>
      <Mat />
      <Head cx={40} cy={106} />
      <path {...limb} d="M50 106 L90 108" />
      <path {...limb} d="M52 106 L74 112" />
      <path {...limb} d="M90 108 L140 116" />
      <path {...limb} d="M92 106 L138 92" />
      <Arrow d="M142 88 C 143 82 144 78 144 74" />
    </g>
  ),

  // 14. Calf raise — berdiri jinjit tinggi, tangan berpegangan pada pegangan treadmill
  calf_raise: (
    <g>
      <line x1="66" y1="58" x2="66" y2="124" stroke={SOFT} strokeWidth="6" strokeLinecap="round" />
      <Head cx={104} cy={36} />
      <path {...limb} d="M104 45 L104 84" />
      <path {...limb} d="M104 50 L82 56 L68 58" />
      <path {...limb} d="M104 84 L101 116" />
      <path {...limb} d="M101 116 L107 123" />
      <path {...limb} d="M104 86 L108 116" />
      <path {...limb} d="M108 116 L114 123" />
      <Arrow d="M120 100 C 121 94 122 90 122 86" />
    </g>
  ),

  // 15. KB row — membungkuk dari pinggul, satu tangan menumpu di kursi, tangan lain menarik KB
  kb_row: (
    <g>
      <rect x="24" y="92" width="34" height="20" rx="3" fill={SOFT} />
      <Head cx={64} cy={68} />
      <path {...limb} d="M110 86 L76 74" />
      <path {...limb} d="M76 74 L58 84 L44 92" />
      <path {...limb} d="M78 76 L86 90 L100 94" />
      <path {...limb} d="M110 86 L114 104 L110 124" />
      <path {...limb} d="M112 88 L120 104 L118 124" />
      <Kettlebell x={101} y={100} />
      <Arrow d="M114 114 C 113 108 112 103 110 99" />
    </g>
  ),
}
