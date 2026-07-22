// Pengujian src/lib/* murni dengan node:assert — jalankan: node scripts/test-lib.mjs
import assert from 'node:assert/strict'
import { diffDays, addDays, weekdayIndex, formatLong, formatShort, toISO } from '../src/lib/dates.js'
import { defaultState, loadState, saveState, exportJSON, importJSON } from '../src/lib/storage.js'
import { avgCycleLength, phaseForDay, cycleInfo, predictedPeriods } from '../src/lib/cycle.js'
import {
  tierForWeek,
  weekNumber,
  resolveTemplate,
  logSession,
  sessionForDate,
  streak,
  totalSessions,
  weekSessions,
} from '../src/lib/engine.js'
import { TEMPLATES } from '../src/data/program.js'

let passed = 0
const ok = (cond, msg) => { assert.ok(cond, msg); passed++ }
const eq = (a, b, msg) => { assert.equal(a, b, msg); passed++ }
const deq = (a, b, msg) => { assert.deepEqual(a, b, msg); passed++ }

// ---------- dates.js ----------

eq(diffDays('2026-07-01', '2026-07-10'), 9, 'diffDays maju')
eq(diffDays('2026-07-10', '2026-07-01'), -9, 'diffDays mundur')
eq(diffDays('2026-07-01', '2026-07-01'), 0, 'diffDays sama')

eq(addDays('2026-07-01', 9), '2026-07-10', 'addDays maju')
eq(addDays('2026-07-31', 1), '2026-08-01', 'addDays lintas bulan')
eq(addDays('2026-01-01', -1), '2025-12-31', 'addDays lintas tahun (mundur)')
eq(addDays('2026-12-31', 1), '2027-01-01', 'addDays lintas tahun (maju)')

// weekdayIndex: 0=Senin..6=Minggu, verifikasi konversi dari JS getDay() (0=Minggu)
for (const iso of ['2026-07-20', '2026-07-21', '2026-07-25', '2026-07-26']) {
  const [y, m, d] = iso.split('-').map(Number)
  const jsDay = new Date(y, m - 1, d).getDay()
  eq(weekdayIndex(iso), (jsDay + 6) % 7, `weekdayIndex konsisten utk ${iso}`)
}

// toISO / format tetap string wajar tanpa melempar error
ok(/^\d{4}-\d{2}-\d{2}$/.test(toISO(new Date(2026, 6, 21))), 'toISO format YYYY-MM-DD')
ok(typeof formatLong('2026-07-21') === 'string' && formatLong('2026-07-21').length > 0, 'formatLong tidak error')
ok(typeof formatShort('2026-07-21') === 'string' && formatShort('2026-07-21').length > 0, 'formatShort tidak error')

// ---------- storage.js (harus jalan tanpa localStorage, di Node) ----------

ok(typeof localStorage === 'undefined', 'sanity: tidak ada localStorage di Node')

const def = defaultState()
deq(def.periods, [], 'defaultState.periods kosong')
deq(def.weights, [], 'defaultState.weights kosong')
deq(def.sessions, [], 'defaultState.sessions kosong')
eq(def.kneeToday, null, 'defaultState.kneeToday null')
eq(def.settings.cycleLen, 28, 'defaultState.settings.cycleLen')
eq(def.settings.periodLen, 5, 'defaultState.settings.periodLen')
ok(/^\d{4}-\d{2}-\d{2}$/.test(def.settings.programStartISO), 'defaultState.programStartISO ber-ISO')

const loaded = loadState()
deq(loaded.profile, def.profile, 'loadState tanpa localStorage = defaultState (profile)')
eq(loaded.version, def.version, 'loadState tanpa localStorage = defaultState (version)')

// saveState harus no-op tanpa error saat localStorage tak ada
saveState(def)
ok(true, 'saveState tanpa localStorage tidak melempar error')

assert.throws(() => importJSON('bukan json {{{'), Error, 'importJSON tolak JSON korup')
assert.throws(() => importJSON('[1,2,3]'), Error, 'importJSON tolak non-objek (array)')
assert.throws(() => importJSON('"halo"'), Error, 'importJSON tolak non-objek (string)')
passed += 3

const partial = { version: 1, periods: ['2026-01-05'] }
const merged = importJSON(JSON.stringify(partial))
deq(merged.periods, ['2026-01-05'], 'importJSON pakai field yang ada')
deq(merged.weights, [], 'importJSON isi field hilang dari default (weights)')
deq(merged.profile, def.profile, 'importJSON isi field hilang dari default (profile)')

const roundTrip = defaultState()
roundTrip.periods.push('2026-07-10')
const text = exportJSON(roundTrip)
ok(text.includes('\n'), 'exportJSON menghasilkan JSON rapi (multi-baris)')
const back = importJSON(text)
deq(back.periods, roundTrip.periods, 'export/import round-trip periods')
deq(back.profile, roundTrip.profile, 'export/import round-trip profile')

// ---------- cycle.js ----------

// phaseForDay — semua fase, cycleLen 28, periodLen 5 -> ovDay 14
{
  const cycleLen = 28
  const periodLen = 5
  eq(phaseForDay(1, cycleLen, periodLen), 'haid', 'hari 1 haid')
  eq(phaseForDay(5, cycleLen, periodLen), 'haid', 'hari 5 haid (batas)')
  eq(phaseForDay(6, cycleLen, periodLen), 'folikular', 'hari 6 folikular')
  eq(phaseForDay(12, cycleLen, periodLen), 'folikular', 'hari 12 folikular (batas)')
  eq(phaseForDay(13, cycleLen, periodLen), 'ovulasi', 'hari 13 ovulasi (ovDay-1)')
  eq(phaseForDay(14, cycleLen, periodLen), 'ovulasi', 'hari 14 ovulasi (ovDay)')
  eq(phaseForDay(15, cycleLen, periodLen), 'ovulasi', 'hari 15 ovulasi (ovDay+1)')
  eq(phaseForDay(16, cycleLen, periodLen), 'luteal', 'hari 16 luteal')
  eq(phaseForDay(28, cycleLen, periodLen), 'luteal', 'hari 28 luteal')
}

// avgCycleLength — fallback dan rata-rata
{
  const s1 = { settings: { cycleLen: 30, periodLen: 5 }, periods: [] }
  eq(avgCycleLength(s1), 30, 'avgCycleLength fallback (tanpa periods)')

  const s2 = { settings: { cycleLen: 30, periodLen: 5 }, periods: ['2026-01-01'] }
  eq(avgCycleLength(s2), 30, 'avgCycleLength fallback (1 periods)')

  const s3 = { settings: { cycleLen: 28, periodLen: 5 }, periods: ['2026-01-01', '2026-01-29', '2026-02-26'] }
  eq(avgCycleLength(s3), 28, 'avgCycleLength rata-rata jarak normal')

  // jarak 14 hari (di luar 21-45) harus diabaikan dari perhitungan
  const s4 = { settings: { cycleLen: 28, periodLen: 5 }, periods: ['2026-01-01', '2026-01-15', '2026-02-12'] }
  eq(avgCycleLength(s4), 28, 'avgCycleLength abaikan jarak di luar 21-45 hari')

  // lebih dari 6 jarak -> hanya 6 terakhir dipakai. 2 jarak tertua = 40 hari
  // (beda dari 28), bila implementasi salah pakai semua jarak, rata-rata akan
  // bergeser dari 28.
  const manyPeriods = ['2025-01-01']
  for (let i = 0; i < 2; i++) manyPeriods.push(addDays(manyPeriods[manyPeriods.length - 1], 40))
  for (let i = 0; i < 6; i++) manyPeriods.push(addDays(manyPeriods[manyPeriods.length - 1], 28))
  const s5 = { settings: { cycleLen: 28, periodLen: 5 }, periods: manyPeriods }
  eq(avgCycleLength(s5), 28, 'avgCycleLength pakai maks 6 jarak terakhir (mengabaikan jarak lebih tua)')
}

// cycleInfo dengan periods
{
  const state = {
    settings: { cycleLen: 28, periodLen: 5, programStartISO: '2026-06-01' },
    periods: ['2026-06-01', '2026-06-29'],
  }
  const info1 = cycleInfo(state, '2026-06-05')
  ok(info1 !== null, 'cycleInfo tidak null saat ada periods')
  eq(info1.day, 5, 'cycleInfo.day')
  eq(info1.cycleLen, 28, 'cycleInfo.cycleLen (rata-rata)')
  eq(info1.fase, 'haid', 'cycleInfo.fase haid di hari ke-5')
  eq(info1.ovulasiDay, 14, 'cycleInfo.ovulasiDay')
  eq(info1.mulaiTerakhir, '2026-06-01', 'cycleInfo.mulaiTerakhir pakai start terakhir <= tanggal')
  eq(info1.telat, false, 'cycleInfo.telat false pada kondisi normal')

  const info2 = cycleInfo(state, '2026-07-05')
  eq(info2.mulaiTerakhir, '2026-06-29', 'cycleInfo pakai period start terbaru yang <= tanggal')

  eq(cycleInfo({ settings: { cycleLen: 28, periodLen: 5 }, periods: [] }, '2026-06-05'), null, 'cycleInfo null bila periods kosong')
  eq(cycleInfo(state, '2026-05-01'), null, 'cycleInfo null utk tanggal sebelum period pertama')

  // terlambat jauh -> telat true, fase dipaksa luteal
  const lateState = { settings: { cycleLen: 28, periodLen: 5 }, periods: ['2026-06-01'] }
  const lateDate = addDays('2026-06-01', 40) // day 41, cycleLen(fallback 28)+10=38 < 41
  const infoLate = cycleInfo(lateState, lateDate)
  eq(infoLate.telat, true, 'cycleInfo telat true saat haid sangat terlambat')
  eq(infoLate.fase, 'luteal', 'cycleInfo fase dipaksa luteal saat telat')
}

// predictedPeriods
{
  const state = { settings: { cycleLen: 28, periodLen: 5 }, periods: ['2026-06-01', '2026-06-29'] }
  const preds = predictedPeriods(state, '2026-07-01', 3)
  deq(preds, ['2026-07-27', '2026-08-24', '2026-09-21'], 'predictedPeriods proyeksi 3 tanggal berikutnya')

  const preds2 = predictedPeriods(state, '2026-08-01', 2)
  deq(preds2, ['2026-08-24', '2026-09-21'], 'predictedPeriods lompat prediksi sebelum fromISO')

  eq(predictedPeriods({ settings: { cycleLen: 28, periodLen: 5 }, periods: [] }, '2026-07-01', 3).length, 0, 'predictedPeriods kosong bila tanpa periods')
}

// ---------- engine.js ----------

// tierForWeek batas 4/5/8/9
eq(tierForWeek(1), 1, 'tierForWeek minggu 1 -> tier 1')
eq(tierForWeek(4), 1, 'tierForWeek minggu 4 -> tier 1 (batas)')
eq(tierForWeek(5), 2, 'tierForWeek minggu 5 -> tier 2 (batas)')
eq(tierForWeek(8), 2, 'tierForWeek minggu 8 -> tier 2 (batas)')
eq(tierForWeek(9), 3, 'tierForWeek minggu 9 -> tier 3 (batas)')
eq(tierForWeek(20), 3, 'tierForWeek minggu jauh -> tier 3')

// weekNumber
{
  const state = { settings: { programStartISO: '2026-07-01' } }
  eq(weekNumber(state, '2026-07-01'), 1, 'weekNumber hari pertama program')
  eq(weekNumber(state, '2026-07-07'), 1, 'weekNumber akhir minggu 1')
  eq(weekNumber(state, '2026-07-08'), 2, 'weekNumber awal minggu 2')
  eq(weekNumber(state, '2026-06-25'), 1, 'weekNumber sebelum mulai program di-clamp minimal 1')
}

// streak — beruntun, putus, hari ini belum latihan tidak memutus
{
  const mkSession = (date) => ({ date, templateId: 'kb_a', mode: 'penuh', selesai: [], rpe: 5, nyeriLutut: false, menit: 30, catatan: '' })
  const today = '2026-07-21'

  const sBeruntun = { sessions: ['2026-07-19', '2026-07-20', '2026-07-21'].map(mkSession) }
  eq(streak(sBeruntun, today), 3, 'streak beruntun termasuk hari ini')

  const sBelumHariIni = { sessions: ['2026-07-18', '2026-07-19', '2026-07-20'].map(mkSession) }
  eq(streak(sBelumHariIni, today), 3, 'streak tidak putus walau hari ini belum latihan (kemarin latihan)')

  const sPutus = { sessions: ['2026-07-17', '2026-07-19', '2026-07-20'].map(mkSession) }
  eq(streak(sPutus, today), 2, 'streak putus di hari yang terlewat')

  const sKosong = { sessions: ['2026-07-15', '2026-07-16'].map(mkSession) }
  eq(streak(sKosong, today), 0, 'streak 0 bila kemarin & hari ini tidak latihan')
}

// totalSessions & weekSessions (bonus, di luar daftar minimal)
{
  const mkSession = (date) => ({ date, templateId: 'kb_a', mode: 'penuh', selesai: [], rpe: 5, nyeriLutut: false, menit: 30, catatan: '' })
  const state = { sessions: ['2026-07-20', '2026-07-21', '2026-06-01'].map(mkSession) }
  eq(totalSessions(state), 3, 'totalSessions menghitung semua sesi')
  // 2026-07-21 Selasa -> Senin minggu itu 2026-07-20
  eq(weekSessions(state, '2026-07-21'), 2, 'weekSessions hanya menghitung minggu berjalan (Senin-Minggu)')
}

// logSession replace utk tanggal sama
{
  const draft = { sessions: [] }
  logSession(draft, { date: '2026-07-20', templateId: 'kb_a', mode: 'penuh', selesai: ['a'], rpe: 6, nyeriLutut: false, menit: 30, catatan: 'ok' })
  eq(draft.sessions.length, 1, 'logSession menambah sesi baru')
  logSession(draft, { date: '2026-07-20', templateId: 'kb_a', mode: 'singkat', selesai: ['a', 'b'], rpe: 7, nyeriLutut: true, menit: 15, catatan: 'ganti' })
  eq(draft.sessions.length, 1, 'logSession replace, bukan menambah, utk tanggal sama')
  eq(draft.sessions[0].mode, 'singkat', 'logSession replace memakai data terbaru')
  eq(sessionForDate({ sessions: draft.sessions }, '2026-07-20').catatan, 'ganti', 'sessionForDate mengembalikan sesi yang benar')
  eq(sessionForDate({ sessions: draft.sessions }, '2026-01-01'), null, 'sessionForDate null bila tak ada sesi')
}

// resolveTemplate — beban per tier (data program nyata) + fallback tier di bawahnya
{
  // blok "Inti" kb_a: item pertama = kb_deadlift (kneeSafe, istirahatDetik 75)
  const t1 = resolveTemplate(TEMPLATES.kb_a, { tier: 1, kneeMode: false })
  eq(t1[1].items[0].exercise.id, 'kb_deadlift', 'resolveTemplate pakai getExercise nyata')
  eq(t1[1].items[0].beban, 'Tanpa beban → 12 kg', 'resolveTemplate beban tier 1')
  eq(t1[1].items[0].istirahatDetik, 75, 'resolveTemplate pakai istirahatDetik dari template (bukan default)')
  eq(t1[1].items[0].swapped, false, 'resolveTemplate tidak menukar gerakan yang kneeSafe')

  const t3 = resolveTemplate(TEMPLATES.kb_a, { tier: 3, kneeMode: true })
  eq(t3[1].items[0].beban, '16–24 kg', 'resolveTemplate beban tier 3')
  eq(t3[1].items[0].swapped, false, 'gerakan kneeSafe=true tidak ditukar walau kneeMode aktif')
  // goblet_box_squat (kneeSafe=false, kneeAlt=glute_bridge) harus tertukar saat kneeMode
  eq(t3[1].items[1].exercise.id, 'glute_bridge', 'kneeMode menukar gerakan tidak aman lutut ke kneeAlt')
  eq(t3[1].items[1].swapped, true, 'item yang ditukar ditandai swapped')

  // template buatan sendiri untuk uji fallback tier & default istirahatDetik
  const tplFallback = {
    id: 'uji_fallback',
    blocks: [{ title: 'Uji', items: [{ ex: 'kb_deadlift', set: 3, reps: '10', beban: { 1: '12 kg' } }] }],
  }
  const rf = resolveTemplate(tplFallback, { tier: 3, kneeMode: false })
  eq(rf[0].items[0].beban, '12 kg', 'resolveTemplate fallback ke beban tier di bawahnya bila tier saat ini tak ada')
  eq(rf[0].items[0].istirahatDetik, 60, 'resolveTemplate istirahatDetik default 60 bila tak diset')

  // template + getEx mock untuk uji swap kneeAlt (kneeSafe=false)
  const mockGetEx = (id) => ({
    id,
    nama: id,
    kategori: 'kekuatan',
    target: '',
    equipment: 'kb',
    cues: [],
    kneeSafe: id !== 'gerakan_berisiko',
    kneeAlt: id === 'gerakan_berisiko' ? 'gerakan_aman' : null,
    kneeNote: null,
    diastasisNote: null,
  })
  const tplRisiko = {
    id: 'uji_knee',
    blocks: [{ title: 'Uji Lutut', items: [{ ex: 'gerakan_berisiko', set: 3, reps: '8-10', beban: { 1: '12 kg', 2: '16 kg', 3: '20 kg' } }] }],
  }

  const rNoKnee = resolveTemplate(tplRisiko, { tier: 2, kneeMode: false }, mockGetEx)
  eq(rNoKnee[0].items[0].exercise.id, 'gerakan_berisiko', 'tanpa kneeMode: gerakan tidak ditukar')
  eq(rNoKnee[0].items[0].swapped, false, 'tanpa kneeMode: swapped false')

  const rKnee = resolveTemplate(tplRisiko, { tier: 2, kneeMode: true }, mockGetEx)
  eq(rKnee[0].items[0].exercise.id, 'gerakan_aman', 'kneeMode aktif: gerakan kneeSafe=false ditukar ke kneeAlt')
  eq(rKnee[0].items[0].swapped, true, 'kneeMode aktif: swapped true')
  eq(rKnee[0].items[0].beban, '16 kg', 'beban tetap dari item asli walau gerakan ditukar')
}

console.log(`OK — ${passed} assertion lulus`)
