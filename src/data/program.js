// ============================================================
// Program latihan BundaFit — 30 menit/hari, 7 hari/minggu.
// Disusun dari sintesis riset (lihat docs/PROGRAM.md):
// - 3 hari kekuatan kettlebell (dominan pinggul, ramah patella)
// - 3 hari jalan treadmill + core ramah diastasis
// - 1 hari pemulihan (napas, peregangan, dasar panggul)
// - Autoregulasi RPE > kalender; fase siklus = penyesuaian lembut
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

export const TEMPLATES = {
  kb_a: {
    id: 'kb_a',
    nama: 'Kekuatan A — Pondasi Bawah',
    fokus: 'Bokong & paha, pola engsel pinggul',
    tipe: 'kekuatan',
    warna: 'primary',
    durasi: 30,
    blocks: [
      {
        title: 'Pemanasan · 5 menit',
        items: [
          { ex: 'napas_360', waktu: '2 menit' },
          { ex: 'jalan_ditempat', waktu: '2 menit' },
          { ex: 'hip_hinge_dinding', waktu: '1 menit' },
        ],
      },
      {
        title: 'Inti · 20 menit',
        items: [
          {
            ex: 'kb_deadlift', set: 3, reps: '8–10', istirahatDetik: 75,
            beban: { 1: 'Tanpa beban → 12 kg', 2: '16 kg', 3: '16–24 kg' },
            catatan: 'Turunkan pelan 3 detik. Ini gerakan terpenting Bunda.',
          },
          {
            ex: 'goblet_box_squat', set: 3, reps: '8', istirahatDetik: 75,
            beban: { 1: 'Tanpa beban', 2: '12 kg', 3: '12–16 kg' },
            catatan: 'Kursi tinggi — duduk-sentuh-berdiri.',
          },
          {
            ex: 'glute_bridge', set: 3, reps: '10–12', istirahatDetik: 60,
            beban: { 1: 'Berat tubuh', 2: 'Berat tubuh', 3: '12 kg di pinggul' },
          },
          { ex: 'clamshell', set: 2, reps: '12–15 / sisi', istirahatDetik: 45 },
        ],
      },
      {
        title: 'Penutup · 5 menit',
        items: [
          { ex: 'peregangan_paha', waktu: '3 menit' },
          { ex: 'relaksasi_pelvic', waktu: '2 menit' },
        ],
      },
    ],
  },

  jalan_core: {
    id: 'jalan_core',
    nama: 'Jalan + Core',
    fokus: 'Jantung-paru & perut dalam',
    tipe: 'jalan',
    warna: 'sage',
    durasi: 30,
    blocks: [
      {
        title: 'Jalan Treadmill · 18 menit',
        items: [
          {
            ex: 'jalan_treadmill', waktu: '18 menit',
            catatan: 'Datar–1% dulu; kecepatan "masih bisa bicara". Tier 2–3: boleh 2–3% bila lutut tenang.',
          },
        ],
      },
      {
        title: 'Core Ramah Diastasis · 10 menit',
        items: [
          { ex: 'heel_slide', set: 2, reps: '8 / sisi', istirahatDetik: 30 },
          { ex: 'dead_bug', set: 2, reps: '6–8 / sisi', istirahatDetik: 45, catatan: 'Mulai lengan saja bila perut menonjol.' },
          { ex: 'side_hip_lift', set: 2, reps: '8–10 / sisi', istirahatDetik: 45 },
        ],
      },
      {
        title: 'Penutup · 2 menit',
        items: [{ ex: 'napas_360', waktu: '2 menit' }],
      },
    ],
  },

  kb_b: {
    id: 'kb_b',
    nama: 'Kekuatan B — Atas & Carry',
    fokus: 'Punggung, dada, bahu, core anti-miring',
    tipe: 'kekuatan',
    warna: 'primary',
    durasi: 30,
    blocks: [
      {
        title: 'Pemanasan · 5 menit',
        items: [
          { ex: 'napas_360', waktu: '2 menit' },
          { ex: 'ayun_lengan', waktu: '1 menit' },
          { ex: 'jalan_ditempat', waktu: '2 menit' },
        ],
      },
      {
        title: 'Inti · 20 menit',
        items: [
          {
            ex: 'kb_row', set: 3, reps: '8–10 / sisi', istirahatDetik: 60,
            beban: { 1: '12 kg', 2: '12–16 kg', 3: '16 kg' },
          },
          {
            ex: 'kb_floor_press', set: 3, reps: '8–10 / sisi', istirahatDetik: 60,
            beban: { 1: '12 kg', 2: '12 kg', 3: '12–16 kg' },
          },
          {
            ex: 'kb_press', set: 2, reps: '6–8 / sisi', istirahatDetik: 75,
            beban: { 1: 'Tanpa beban dulu', 2: '12 kg', 3: '12 kg' },
            catatan: 'Bila pinggang melengkung, press sambil duduk.',
          },
          {
            ex: 'suitcase_carry', set: 3, reps: '30–40 detik / sisi', istirahatDetik: 60,
            beban: { 1: '12 kg', 2: '12–16 kg', 3: '16–24 kg' },
            catatan: 'Pengganti Pallof press — badan jangan miring.',
          },
        ],
      },
      {
        title: 'Penutup · 5 menit',
        items: [
          { ex: 'peregangan_dada', waktu: '3 menit' },
          { ex: 'napas_360', waktu: '2 menit' },
        ],
      },
    ],
  },

  jalan_mobilitas: {
    id: 'jalan_mobilitas',
    nama: 'Jalan + Perawatan Lutut',
    fokus: 'Jantung-paru & penguatan penopang lutut',
    tipe: 'jalan',
    warna: 'sage',
    durasi: 30,
    blocks: [
      {
        title: 'Jalan Treadmill · 18 menit',
        items: [
          { ex: 'jalan_treadmill', waktu: '18 menit', catatan: 'Datar atau tanjakan ringan; dengarkan lututnya.' },
        ],
      },
      {
        title: 'Perawatan Lutut · 9 menit',
        items: [
          { ex: 'wall_sit', set: 3, reps: '20–30 detik', istirahatDetik: 45, catatan: 'Tekukan dangkal — meredakan sekaligus menguatkan.' },
          { ex: 'slr', set: 2, reps: '8 / sisi', istirahatDetik: 30 },
          { ex: 'calf_raise', set: 2, reps: '12–15', istirahatDetik: 30 },
        ],
      },
      {
        title: 'Penutup · 3 menit',
        items: [{ ex: 'peregangan_pinggul', waktu: '3 menit' }],
      },
    ],
  },

  kb_c: {
    id: 'kb_c',
    nama: 'Kekuatan C — Seluruh Tubuh',
    fokus: 'Paha belakang, bokong, bahu, keseimbangan',
    tipe: 'kekuatan',
    warna: 'primary',
    durasi: 30,
    blocks: [
      {
        title: 'Pemanasan · 5 menit',
        items: [
          { ex: 'napas_360', waktu: '2 menit' },
          { ex: 'jalan_ditempat', waktu: '2 menit' },
          { ex: 'hip_hinge_dinding', waktu: '1 menit' },
        ],
      },
      {
        title: 'Inti · 20 menit',
        items: [
          {
            ex: 'kb_rdl', set: 3, reps: '8–10', istirahatDetik: 75,
            beban: { 1: '12 kg', 2: '16 kg', 3: '16–24 kg' },
          },
          {
            ex: 'hip_thrust', set: 3, reps: '10–12', istirahatDetik: 60,
            beban: { 1: 'Berat tubuh (bridge)', 2: '16 kg', 3: '16–24 kg' },
          },
          {
            ex: 'step_up', set: 2, reps: '8 / sisi', istirahatDetik: 60,
            beban: { 1: 'Tanpa beban, undakan rendah', 2: 'Tanpa beban', 3: 'Tanpa beban / 12 kg' },
            catatan: 'Hanya bila lutut tenang 2 minggu; mulai sangat rendah.',
          },
          {
            ex: 'kb_halo', set: 2, reps: '8 lingkaran', istirahatDetik: 45,
            beban: { 1: '12 kg', 2: '12 kg', 3: '12 kg' },
          },
        ],
      },
      {
        title: 'Penutup · 5 menit',
        items: [
          { ex: 'peregangan_paha', waktu: '3 menit' },
          { ex: 'relaksasi_pelvic', waktu: '2 menit' },
        ],
      },
    ],
  },

  jalan_panjang: {
    id: 'jalan_panjang',
    nama: 'Jalan Santai + Core',
    fokus: 'Nafas panjang akhir pekan, perut samping',
    tipe: 'jalan',
    warna: 'gold',
    durasi: 30,
    blocks: [
      {
        title: 'Jalan Treadmill · 20 menit',
        items: [
          {
            ex: 'jalan_interval', waktu: '20 menit',
            catatan: 'Tier 1: jalan santai biasa. Tier 2–3: interval 2 menit cepat / 2 menit santai.',
          },
        ],
      },
      {
        title: 'Core · 8 menit',
        items: [
          { ex: 'bird_dog', set: 2, reps: '6–8 / sisi', istirahatDetik: 45, catatan: 'Alasi lutut dengan handuk tebal.' },
          {
            ex: 'side_plank_lutut', set: 2, reps: '15–25 detik / sisi', istirahatDetik: 45,
            catatan: 'Minggu 1–4 cukup Angkat Pinggul Menyamping.',
          },
        ],
      },
      {
        title: 'Penutup · 2 menit',
        items: [{ ex: 'peregangan_dada', waktu: '2 menit' }],
      },
    ],
  },

  pemulihan: {
    id: 'pemulihan',
    nama: 'Pemulihan & Napas',
    fokus: 'Meresap, meregang, mengisi ulang tenaga',
    tipe: 'pemulihan',
    warna: 'plum',
    durasi: 25,
    blocks: [
      {
        title: 'Napas & Cek · 8 menit',
        items: [
          { ex: 'napas_360', waktu: '4 menit' },
          { ex: 'tes_diastasis', waktu: '4 menit', catatan: 'Cukup 1× per bulan — di hari Minggu awal bulan.' },
        ],
      },
      {
        title: 'Core Lembut · 7 menit',
        items: [
          { ex: 'heel_slide', set: 2, reps: '8 / sisi', istirahatDetik: 30 },
          { ex: 'dead_bug', set: 2, reps: '6 / sisi', istirahatDetik: 30 },
        ],
      },
      {
        title: 'Peregangan · 10 menit',
        items: [
          { ex: 'peregangan_paha', waktu: '3 menit' },
          { ex: 'peregangan_pinggul', waktu: '3 menit' },
          { ex: 'peregangan_dada', waktu: '2 menit' },
          { ex: 'relaksasi_pelvic', waktu: '2 menit' },
        ],
      },
    ],
  },
}

// Sesi darurat 10 menit untuk hari yang kacau — tetap menghitung streak.
export const FALLBACK_TEMPLATE = {
  id: 'darurat10',
  nama: 'Sesi Kilat 10 Menit',
  fokus: 'Hari kacau? Ini tetap kemenangan.',
  tipe: 'kekuatan',
  warna: 'gold',
  durasi: 10,
  blocks: [
    {
      title: 'Langsung Gerak · 10 menit',
      items: [
        { ex: 'napas_360', waktu: '1 menit' },
        {
          ex: 'kb_deadlift', set: 2, reps: '10', istirahatDetik: 45,
          beban: { 1: '12 kg', 2: '16 kg', 3: '16 kg' },
        },
        { ex: 'glute_bridge', set: 2, reps: '12', istirahatDetik: 30 },
        {
          ex: 'suitcase_carry', set: 2, reps: '30 detik / sisi', istirahatDetik: 30,
          beban: { 1: '12 kg', 2: '12–16 kg', 3: '16 kg' },
        },
      ],
    },
  ],
}

// Penyesuaian per fase siklus — lembut, bukan aturan kaku.
// Riset: performa kekuatan tidak berubah bermakna antar fase; yang utama
// adalah autoregulasi RPE. Fase dipakai sebagai panduan halus + edukasi.
export const PHASE_ADJUST = {
  haid: {
    label: 'Fase Haid',
    hariRange: 'Hari 1–5 (saat haid)',
    tubuh: 'Energi bisa lebih rendah dan ada kram, tapi latihan tetap aman — bahkan sering meredakan kram. Haid bukan halangan.',
    latihan: 'Latihan seperti biasa sesuai rasa. Di hari deras/kram berat, boleh ganti jalan santai 20–25 menit + peregangan — itu tetap dihitung sesi.',
    catatanLutut: null,
    volumeNote: 'Boleh kurangi 1 set bila lelah — yang penting tetap datang.',
    chipClass: 'chip-haid',
  },
  folikular: {
    label: 'Fase Folikular',
    hariRange: 'Selesai haid → menjelang masa subur',
    tubuh: 'Energi biasanya paling baik di fase ini. Tubuh siap diajak bekerja.',
    latihan: 'Jendela terbaik untuk progres: tambah rep, set, atau naikkan beban — bila sesi terakhir terasa RPE ≤ 6 (masih sisa 4 rep di tangki).',
    catatanLutut: null,
    volumeNote: 'Waktu yang pas untuk menambah tantangan.',
    chipClass: 'chip-folikular',
  },
  ovulasi: {
    label: 'Masa Subur',
    hariRange: '± 5 hari di tengah siklus (perkiraan kasar)',
    tubuh: 'Perkiraan dari tanggal saja bisa meleset beberapa hari. Sebagian wanita merasa sendinya sedikit lebih "lentur" di masa ini.',
    latihan: 'Tetap latihan seperti biasa. Pilih gerakan dua kaki yang stabil dengan tempo terkontrol; kejar kualitas, bukan rekor.',
    catatanLutut: 'Bila lutut terasa "longgar" minggu ini, tunda gerakan satu kaki (step-up) dan pakai versi aman lutut.',
    volumeNote: 'Utamakan stabilitas dan teknik.',
    chipClass: 'chip-ovulasi',
  },
  luteal: {
    label: 'Fase Luteal',
    hariRange: '± 12–14 hari sebelum haid berikutnya',
    tubuh: 'Suhu tubuh sedikit naik, tidur bisa terganggu, dan menjelang haid badan terasa lebih cepat lelah. Itu nyata, bukan malas.',
    latihan: 'Pertahankan rutinitas — kurangi set bila terasa berat, jangan skip. Sesi sedang di fase ini justru memperbaiki tidur malam.',
    catatanLutut: null,
    volumeNote: 'Kurangi 1 set bila RPE terasa tinggi. Datang tetap juara.',
    chipClass: 'chip-luteal',
  },
}

// Aturan emas — ditampilkan di layar Program.
export const PAIN_RULES = [
  'Aturan lutut 24 jam: nyeri 0–3/10 saat latihan yang kembali normal esok pagi = aman, lanjutkan. Nyeri 4–6/10, memburuk keesokan hari, atau bengkak/hangat = terlalu banyak, turunkan beban di sesi berikutnya.',
  'Nyeri tajam, rasa tempurung "mau geser", atau lutut goyang = hentikan gerakan itu sekarang dan nyalakan Mode Lutut Aman di layar Hari Ini.',
  'Tiup napas saat bagian berat ("tiup sebelum angkat"), tarik napas saat kembali. Jangan pernah menahan napas sambil mengejan.',
  'Awasi perut: bila muncul tonjolan memanjang di garis tengah (doming), napas tertahan, atau ada rasa menekan ke bawah — beban terlalu berat, ringankan atau perkecil gerakan.',
  'Naikkan hanya SATU hal per minggu: beban ATAU jumlah set ATAU durasi jalan. Jangan sekaligus.',
  'Target usaha set kekuatan: RPE 6–7 (masih sisa 3–4 rep di tangki). Tidak perlu sampai gagal — Bunda pemula, konsistensi yang membangun.',
  'Jalan jauh sekaligus adalah pemicu kambuh (seperti saat umrah) — pecah jadi beberapa sesi pendek dan tambah durasi maksimal 2–3 menit per minggu.',
  'Segera konsultasi (fisioterapis/dokter): bocor urine saat batuk/angkat, rasa berat atau menonjol di jalan lahir, celah perut > 2,5 jari yang dalam/lembek, atau nyeri panggul menetap.',
]

// Tips nutrisi & menyusui — layar Bunda.
export const NUTRITION_TIPS = [
  {
    judul: 'Defisit lembut, bukan diet ketat',
    isi: 'Target ±1800–2000 kkal/hari dan jangan di bawah 1800 selama menyusui. Turun 0,25–0,5 kg per minggu itu justru ideal — ASI aman, badan tidak tumbang, dan berat tidak balik lagi.',
  },
  {
    judul: 'Protein di setiap makan',
    isi: 'Total ±115–130 g/hari: telur, ayam, ikan, tahu/tempe, susu/yogurt — kira-kira 25–35 g tiap makan. Protein bikin kenyang lebih lama dan menjaga otot saat berat turun.',
  },
  {
    judul: 'Minum cukup, bukan berlebihan',
    isi: 'Sekitar 2,5–3 liter/hari di iklim panas: segelas tiap makan dan tiap menyusui. Patokan paling mudah: urine kuning muda.',
  },
  {
    judul: 'Zat besi itu penting',
    isi: 'Daging merah, hati, telur, sayur hijau + sumber vitamin C. Bila haid deras dan sering lelah/berkunang, minta cek Hb/feritin ke dokter — sangat umum setelah 3 kehamilan.',
  },
  {
    judul: 'Tidur adalah alat diet',
    isi: 'Kurang tidur menaikkan hormon lapar dan menahan lemak perut. Tidur siang singkat saat si kecil tidur pun berharga — itu bagian dari program, bukan kemalasan.',
  },
  {
    judul: 'Soal timbangan',
    isi: 'Timbang cukup 1× per minggu, pagi hari di hari yang sama. Berat harian naik-turun sampai 1 kg karena cairan (menyusui + siklus) — itu bukan lemak.',
  },
  {
    judul: 'Jujur soal "perut gantung"',
    isi: 'Perut mengecil lewat: (1) core dalam yang menguat, (2) lemak yang turun perlahan lewat defisit + latihan. Kulit kendur setelah 3 kehamilan butuh 6–12 bulan menyesuaikan, dan sebagian bisa menetap — itu jejak perjuangan, bukan kegagalan Bunda.',
  },
  {
    judul: 'ASI aman saat latihan',
    isi: 'Latihan tidak mengurangi produksi ASI dan tidak mengubah rasanya secara berarti. Supaya nyaman: menyusui/pompa dulu sebelum sesi dan pakai bra olahraga yang menopang baik.',
  },
]

// Keterangan tier beban per rentang minggu.
export const TIER_INFO = {
  1: {
    minggu: '1–4',
    judul: 'Belajar Gerakan',
    deskripsi: 'Kuasai pola tanpa beban → 12 kg. Deadlift boleh 16 kg mulai minggu ke-3 bila teknik rapi. Fokus: napas, teknik, kebiasaan harian.',
  },
  2: {
    minggu: '5–8',
    judul: 'Membangun',
    deskripsi: 'Beban naik: deadlift menuju 24 kg, goblet squat 12 kg, hip thrust 16 kg, carry 16 kg. Satu kenaikan per minggu.',
  },
  3: {
    minggu: '9+',
    judul: 'Menguat',
    deskripsi: 'Beban menantang di pola yang sudah dikuasai: hinge & carry 16–24 kg. Squat cukup 12–16 kg. Swing kettlebell menyusul bila lutut tenang beberapa minggu.',
  },
}
