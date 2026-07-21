// Mesin rencana latihan — menggabungkan jadwal program, siklus, dan status lutut

import { diffDays, weekdayIndex, addDays } from './dates.js'
import { cycleInfo } from './cycle.js'
import { TEMPLATES, WEEKLY_SCHEDULE, FALLBACK_TEMPLATE, PHASE_ADJUST } from '../data/program.js'
import { getExercise } from '../data/exercises.js'

export function tierForWeek(week) {
  if (week <= 4) return 1
  if (week <= 8) return 2
  return 3
}

export function weekNumber(state, dateISO) {
  const n = Math.floor(diffDays(state.settings.programStartISO, dateISO) / 7) + 1
  return Math.max(1, n)
}

export function templateForDate(dateISO) {
  const templateId = WEEKLY_SCHEDULE[weekdayIndex(dateISO)]
  return TEMPLATES[templateId]
}

// Cari beban untuk tier ini; bila tidak ada, turun ke tier di bawahnya
function resolveBeban(bebanMap, tier) {
  if (!bebanMap) return undefined
  for (let t = tier; t >= 1; t--) {
    if (bebanMap[t] !== undefined) return bebanMap[t]
  }
  return undefined
}

// Resolusi template jadi blocks siap-pakai (beban per tier, swap kneeAlt)
export function resolveTemplate(template, { tier, kneeMode } = {}, getEx = getExercise) {
  const blocks = (template.blocks || []).map((block) => ({
    title: block.title,
    items: block.items.map((item) => {
      let exercise = getEx(item.ex)
      let swapped = false
      if (kneeMode && !exercise.kneeSafe && exercise.kneeAlt) {
        exercise = getEx(exercise.kneeAlt)
        swapped = true
      }
      return {
        exercise,
        set: item.set,
        reps: item.reps,
        waktu: item.waktu,
        istirahatDetik: item.istirahatDetik ?? 60,
        beban: resolveBeban(item.beban, tier),
        catatan: item.catatan,
        swapped,
      }
    }),
  }))
  return blocks
}

function isKneeModeFor(state, dateISO) {
  const k = state.kneeToday
  return !!(k && k.date === dateISO && k.status === 'nyeri')
}

export function planForDate(state, dateISO) {
  const week = weekNumber(state, dateISO)
  const tier = tierForWeek(week)
  const template = templateForDate(dateISO)
  const info = cycleInfo(state, dateISO)
  const fase = info ? info.fase : null
  const phaseAdjust = fase ? PHASE_ADJUST[fase] ?? null : null
  const kneeMode = isKneeModeFor(state, dateISO)
  const done = sessionForDate(state, dateISO)
  const blocks = resolveTemplate(template, { tier, kneeMode })
  return { week, tier, template, blocks, fase, phaseAdjust, kneeMode, done }
}

export function fallbackPlan(state, dateISO) {
  const week = weekNumber(state, dateISO)
  const tier = tierForWeek(week)
  const template = FALLBACK_TEMPLATE
  const info = cycleInfo(state, dateISO)
  const fase = info ? info.fase : null
  const phaseAdjust = fase ? PHASE_ADJUST[fase] ?? null : null
  const kneeMode = isKneeModeFor(state, dateISO)
  const done = sessionForDate(state, dateISO)
  const blocks = resolveTemplate(template, { tier, kneeMode })
  return { week, tier, template, blocks, fase, phaseAdjust, kneeMode, done }
}

// Tambah/replace sesi untuk tanggal entry.date
export function logSession(draft, entry) {
  const sessions = draft.sessions || (draft.sessions = [])
  const idx = sessions.findIndex((s) => s.date === entry.date)
  if (idx >= 0) sessions[idx] = entry
  else sessions.push(entry)
  sessions.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
}

export function sessionForDate(state, iso) {
  return (state.sessions || []).find((s) => s.date === iso) || null
}

// Hari beruntun berakhir di hari ini atau kemarin — belum latihan hari ini
// tidak memutus streak (belum tentu gagal, harinya belum selesai)
export function streak(state, todayIso) {
  const dates = new Set((state.sessions || []).map((s) => s.date))
  let cursor = dates.has(todayIso) ? todayIso : addDays(todayIso, -1)
  if (!dates.has(cursor)) return 0
  let count = 0
  while (dates.has(cursor)) {
    count++
    cursor = addDays(cursor, -1)
  }
  return count
}

export function totalSessions(state) {
  return (state.sessions || []).length
}

// Jumlah sesi minggu berjalan (Senin-Minggu) yang memuat todayIso
export function weekSessions(state, todayIso) {
  const idx = weekdayIndex(todayIso)
  const monday = addDays(todayIso, -idx)
  const sunday = addDays(monday, 6)
  return (state.sessions || []).filter((s) => s.date >= monday && s.date <= sunday).length
}
