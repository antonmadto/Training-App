# BundaFit — Arsitektur & Kontrak API

PWA React (Vite) satu halaman, data di `localStorage`, UI Bahasa Indonesia, mobile-first (maks 480px).
Pengguna tunggal: "Bunda" — 37 th, 159 cm, mulai 72 kg, menyusui, riwayat dislokasi patella (lutut), 15 bulan pasca melahirkan, punya treadmill + kettlebell 12/16/24 kg, waktu 30 menit/hari.

## Struktur file & kepemilikan

| Path | Pemilik |
|---|---|
| `src/App.jsx`, `src/components/ui.jsx`, `src/styles/app.css`, `src/data/*` | Arsitek (JANGAN diubah koder) |
| `src/lib/{storage,dates,cycle,engine}.js`, `scripts/test-lib.mjs` | Agen LIB |
| `src/components/{TodayScreen,SessionPlayer}.jsx` | Agen SESI |
| `src/components/{CycleScreen,ProgressScreen,ProgramScreen}.jsx` | Agen LAYAR |

## State (localStorage `bundafit.v1`)

```js
{
  version: 1,
  profile: { nama: 'Bunda', tinggiCm: 159, beratAwalKg: 72, menyusui: true },
  settings: { cycleLen: 28, periodLen: 5, programStartISO: '<todayISO saat pertama buka>' },
  periods: ['2026-07-10'],            // tanggal MULAI haid (ISO, urut naik, unik)
  weights: [{ date, kg }],            // urut naik by date, maks 1 entri/tanggal
  waists: [{ date, cm }],
  sessions: [{ date, templateId, mode: 'penuh'|'singkat', selesai: [exId], rpe, nyeriLutut, menit, catatan }],
  kneeToday: null | { date, status: 'aman'|'nyeri' },
}
```

Akses state di komponen: `const { state, update, setTab, today } = useApp()` (dari `../App.jsx`).
`update(draft => { ...mutasi draft... })` — mutasi langsung pada draft, auto-save.

## Kontrak `src/lib/`

### `dates.js`
- `todayISO()` → `'2026-07-21'` **zona waktu LOKAL** (bukan UTC).
- `toISO(date)`, `addDays(iso, n)` → iso, `diffDays(aIso, bIso)` → hari (b − a).
- `weekdayIndex(iso)` → 0=Senin … 6=Minggu.
- `formatLong(iso)` → `'Senin, 21 Juli 2026'`; `formatShort(iso)` → `'21 Jul'` (id-ID, tanpa Intl error di Node).
- `WEEKDAYS_ID = ['Senin',...,'Minggu']`.

### `storage.js`
- `defaultState()`, `loadState()` (merge per key top-level dengan default; tahan JSON korup), `saveState(state)`.
- `exportJSON(state)` → string rapi; `importJSON(text)` → state (validasi minimal, lempar Error bila bukan objek).

### `cycle.js`
- `avgCycleLength(state)` → rata-rata jarak antar `periods` (maks 6 jarak terakhir, hanya jarak 21–45 hari yang dihitung), fallback `settings.cycleLen`, dibulatkan.
- `phaseForDay(day, cycleLen, periodLen)` → `'haid' | 'folikular' | 'ovulasi' | 'luteal'`.
  Aturan: `day ≤ periodLen` → haid; `ovDay = cycleLen − 14`; `ovDay−1 ≤ day ≤ ovDay+1` → ovulasi; `day < ovDay−1` → folikular; selain itu luteal.
- `cycleInfo(state, dateISO)` → `null` bila `periods` kosong, atau:
  `{ day, cycleLen, fase, ovulasiDay, hariMenujuHaid, mulaiTerakhir }`
  — pakai period start terakhir yang ≤ dateISO; `day = diffDays(start, date) + 1`; bila `day > cycleLen + 7` kembalikan fase `'folikular'`? TIDAK — bila `day > cycleLen + 10` (haid terlambat jauh/ belum dicatat), kembalikan objek dengan `fase: 'luteal'` dan `telat: true`. Untuk tanggal SEBELUM period pertama → `null`.
- `phaseForDate(state, dateISO)` → fase utk kalender, termasuk PREDIKSI masa depan: proyeksikan period start berikutnya tiap `avgCycleLength` hari.
- `addPeriodStart(draft, iso)` (unik + sort; abaikan bila ada entri < 15 hari sebelumnya), `removePeriodStart(draft, iso)`.
- `predictedPeriods(state, fromISO, count)` → `[iso...]`.

### `engine.js`
- `tierForWeek(week)` → 1 (minggu ≤4), 2 (≤8), 3 (>8).
- `weekNumber(state, dateISO)` → `Math.floor(diffDays(programStartISO, date) / 7) + 1`, min 1.
- `templateForDate(dateISO)` → `TEMPLATES[WEEKLY_SCHEDULE[weekdayIndex(date)]]`.
- `resolveTemplate(template, { tier, kneeMode })` → blocks ter-resolve:
  `[{ title, items: [{ exercise, set, reps, waktu, istirahatDetik, beban, catatan, swapped }] }]`
  — `exercise` = objek dari `getExercise` (sudah ditukar `kneeAlt` bila `kneeMode` dan `!kneeSafe` dan `kneeAlt` ada, tandai `swapped: true`); `beban` = string utk `tier` (fallback tier di bawahnya); `istirahatDetik` default 60.
- `planForDate(state, dateISO)` → `{ week, tier, template, blocks, fase, phaseAdjust, kneeMode, done }`
  — `fase` dari `cycleInfo` (bisa null), `phaseAdjust` = `PHASE_ADJUST[fase]` (bisa null), `kneeMode` = `kneeToday` utk tanggal itu berstatus `'nyeri'`, `done` = sesi tercatat utk tanggal itu, `blocks` = hasil `resolveTemplate`.
- `fallbackPlan(state, dateISO)` → sama tapi dari `FALLBACK_TEMPLATE`.
- `logSession(draft, entry)` — tambah/replace sesi utk `(date)`.
- `sessionForDate(state, iso)` → sesi | null.
- `streak(state, todayIso)` → hari beruntun berakhir di hari ini ATAU kemarin (hari ini belum latihan tidak memutus streak).
- `totalSessions(state)`, `weekSessions(state, todayIso)` → jumlah sesi minggu berjalan (Senin–Minggu).

Semua fungsi murni (kecuali mutasi draft yang eksplisit), tanpa dependensi React.

## Komponen layar (kelas CSS sudah tersedia di `app.css` — pakai itu, jangan tulis CSS baru kecuali inline kecil)

Kelas penting: `.screen .screen-header .kicker .card .card-title .hero .chip .chip-haid/.chip-folikular/.chip-ovulasi/.chip-luteal .btn .btn-primary/.btn-accent/.btn-ghost/.btn-light/.btn-small/.btn-block .row .ex-num .set-pill .stat-grid .timer-display .field .input .sheet (via komponen Sheet) .session-screen .cal-strip .cal-day .p-<fase> .note .progress-bar (via ProgressBar) .divider .small .flex .flex-between .grow .mt-2 .mb-2` dll.
Komponen bersama dari `./ui.jsx`: `Sheet, ProgressBar, Stat, Sparkline, Icons`.

Detail perilaku tiap layar ada di prompt masing-masing agen.
