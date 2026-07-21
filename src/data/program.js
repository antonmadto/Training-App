// ============================================================
// Program latihan — SKEMA FINAL (konten lengkap diisi oleh arsitek
// setelah sintesis riset; koder: jangan mengubah file ini).
// ============================================================

// Jadwal mingguan: index 0 = Senin ... 6 = Minggu. Nilai = id template.
export const WEEKLY_SCHEDULE = [
  'kb_a',
  'jalan_core',
  'kb_b',
  'jalan_mobilitas',
  'kb_c',
  'jalan_panjang',
  'pemulihan',
]

// Skema template:
// {
//   id, nama, fokus,                  // string
//   tipe: 'kekuatan' | 'jalan' | 'pemulihan',
//   warna: 'primary' | 'sage' | 'gold' | 'plum',   // aksen kartu
//   durasi: number,                   // menit total
//   blocks: [{
//     title: string,                  // mis. 'Pemanasan · 5 menit'
//     items: [{
//       ex: string,                   // id dari EXERCISES
//       // SALAH SATU dari dua bentuk:
//       waktu?: string,               // mis. '2 menit' (berbasis durasi)
//       set?: number, reps?: string,  // mis. set: 3, reps: '8–10'
//       istirahatDetik?: number,      // istirahat antar set (default 60)
//       beban?: { 1: string, 2: string, 3: string }, // per tier beban
//       catatan?: string,             // catatan khusus item
//     }]
//   }]
// }
export const TEMPLATES = {
  kb_a: {
    id: 'kb_a',
    nama: 'Kekuatan A',
    fokus: 'Tubuh bawah (contoh — akan diisi)',
    tipe: 'kekuatan',
    warna: 'primary',
    durasi: 30,
    blocks: [
      {
        title: 'Inti · 20 menit',
        items: [
          { ex: 'contoh_kb_deadlift', set: 3, reps: '8–10', istirahatDetik: 75, beban: { 1: '12 kg', 2: '16 kg', 3: '16–24 kg' } },
        ],
      },
    ],
  },
  jalan_core: { id: 'jalan_core', nama: 'Jalan + Core', fokus: '(akan diisi)', tipe: 'jalan', warna: 'sage', durasi: 30, blocks: [] },
  kb_b: { id: 'kb_b', nama: 'Kekuatan B', fokus: '(akan diisi)', tipe: 'kekuatan', warna: 'primary', durasi: 30, blocks: [] },
  jalan_mobilitas: { id: 'jalan_mobilitas', nama: 'Jalan + Mobilitas', fokus: '(akan diisi)', tipe: 'jalan', warna: 'sage', durasi: 30, blocks: [] },
  kb_c: { id: 'kb_c', nama: 'Kekuatan C', fokus: '(akan diisi)', tipe: 'kekuatan', warna: 'primary', durasi: 30, blocks: [] },
  jalan_panjang: { id: 'jalan_panjang', nama: 'Jalan Santai Panjang', fokus: '(akan diisi)', tipe: 'jalan', warna: 'gold', durasi: 30, blocks: [] },
  pemulihan: { id: 'pemulihan', nama: 'Pemulihan & Peregangan', fokus: '(akan diisi)', tipe: 'pemulihan', warna: 'plum', durasi: 25, blocks: [] },
}

// Sesi darurat 10 menit untuk hari yang kacau (skema sama dengan template)
export const FALLBACK_TEMPLATE = {
  id: 'darurat10',
  nama: 'Sesi Kilat 10 Menit',
  fokus: 'Tetap bergerak di hari sibuk',
  tipe: 'kekuatan',
  warna: 'gold',
  durasi: 10,
  blocks: [],
}

// Penyesuaian per fase siklus. chipClass dipakai untuk styling.
// { label, hariRange, tubuh, latihan, catatanLutut, volumeNote, chipClass }
export const PHASE_ADJUST = {
  haid: {
    label: 'Fase Haid',
    hariRange: '(akan diisi)',
    tubuh: '(akan diisi)',
    latihan: '(akan diisi)',
    catatanLutut: null,
    volumeNote: '(akan diisi)',
    chipClass: 'chip-haid',
  },
  folikular: { label: 'Fase Folikular', hariRange: '', tubuh: '', latihan: '', catatanLutut: null, volumeNote: '', chipClass: 'chip-folikular' },
  ovulasi: { label: 'Masa Subur', hariRange: '', tubuh: '', latihan: '', catatanLutut: null, volumeNote: '', chipClass: 'chip-ovulasi' },
  luteal: { label: 'Fase Luteal', hariRange: '', tubuh: '', latihan: '', catatanLutut: null, volumeNote: '', chipClass: 'chip-luteal' },
}

// Aturan nyeri & napas (ditampilkan di layar Program) — string[]
export const PAIN_RULES = ['(akan diisi dari hasil riset)']

// Tips nutrisi & menyusui (layar Bunda) — [{ judul, isi }]
export const NUTRITION_TIPS = [{ judul: '(akan diisi)', isi: '(akan diisi dari hasil riset)' }]

// Keterangan tier beban per rentang minggu (dipakai layar Program)
export const TIER_INFO = {
  1: { minggu: '1–4', judul: 'Belajar Gerakan', deskripsi: 'Kuasai teknik dengan beban ringan (dominan 12 kg).' },
  2: { minggu: '5–8', judul: 'Membangun', deskripsi: 'Volume naik, mulai lebih sering memakai 16 kg.' },
  3: { minggu: '9+', judul: 'Menguat', deskripsi: 'Beban menantang (16–24 kg) pada gerakan yang sudah dikuasai.' },
}
