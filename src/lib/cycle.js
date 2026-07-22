// Perhitungan siklus haid — murni, tanpa dependensi data/*

import { diffDays, addDays } from './dates.js'

// Rata-rata jarak antar tanggal mulai haid (maks 6 jarak terakhir,
// hanya jarak 21-45 hari yang dihitung). Fallback ke settings.cycleLen.
export function avgCycleLength(state) {
  const periods = state.periods || []
  const fallback = state.settings.cycleLen
  if (periods.length < 2) return fallback
  const diffs = []
  for (let i = 1; i < periods.length; i++) {
    diffs.push(diffDays(periods[i - 1], periods[i]))
  }
  const last6 = diffs.slice(-6)
  const valid = last6.filter((d) => d >= 21 && d <= 45)
  if (valid.length === 0) return fallback
  const avg = valid.reduce((a, b) => a + b, 0) / valid.length
  return Math.round(avg)
}

export function phaseForDay(day, cycleLen, periodLen) {
  const ovDay = cycleLen - 14
  if (day <= periodLen) return 'haid'
  if (day >= ovDay - 1 && day <= ovDay + 1) return 'ovulasi'
  if (day < ovDay - 1) return 'folikular'
  return 'luteal'
}

// Info siklus lengkap untuk satu tanggal (berdasar riwayat periods tercatat)
export function cycleInfo(state, dateISO) {
  const periods = state.periods || []
  if (periods.length === 0) return null

  let start = null
  for (let i = periods.length - 1; i >= 0; i--) {
    if (periods[i] <= dateISO) {
      start = periods[i]
      break
    }
  }
  if (start === null) return null // tanggal sebelum period pertama tercatat

  const cycleLen = avgCycleLength(state)
  const periodLen = state.settings.periodLen
  const day = diffDays(start, dateISO) + 1
  const ovulasiDay = cycleLen - 14
  const hariMenujuHaid = cycleLen + 1 - day
  const mulaiTerakhir = start

  if (day > cycleLen + 10) {
    // haid terlambat jauh / belum dicatat
    return { day, cycleLen, fase: 'luteal', ovulasiDay, hariMenujuHaid, mulaiTerakhir, telat: true }
  }

  const fase = phaseForDay(day, cycleLen, periodLen)
  return { day, cycleLen, fase, ovulasiDay, hariMenujuHaid, mulaiTerakhir, telat: false }
}

// Fase untuk kalender — mencakup prediksi masa depan (proyeksi period start
// berikutnya tiap avgCycleLength hari, melewati riwayat yang tercatat).
export function phaseForDate(state, dateISO) {
  const periods = state.periods || []
  if (periods.length === 0) return null
  if (dateISO < periods[0]) return null

  const periodLen = state.settings.periodLen
  const avgLen = avgCycleLength(state)

  let start = null
  let nextKnown = null
  for (let i = 0; i < periods.length; i++) {
    if (periods[i] <= dateISO) {
      start = periods[i]
      nextKnown = periods[i + 1] || null
    }
  }

  // tanggal masih dalam rentang dua period yang tercatat -> pakai jarak nyata
  if (nextKnown && dateISO < nextKnown) {
    const day = diffDays(start, dateISO) + 1
    const cycleLen = diffDays(start, nextKnown)
    return phaseForDay(day, cycleLen, periodLen)
  }

  // di luar riwayat -> proyeksikan mulai haid berikutnya tiap avgLen hari
  if (avgLen <= 0) return null
  while (addDays(start, avgLen) <= dateISO) {
    start = addDays(start, avgLen)
  }
  const day = diffDays(start, dateISO) + 1
  return phaseForDay(day, avgLen, periodLen)
}

// Tambah tanggal mulai haid: unik + urut naik; abaikan bila ada entri
// kurang dari 15 hari sebelum tanggal ini (kemungkinan salah catat/duplikat)
export function addPeriodStart(draft, iso) {
  const periods = draft.periods || (draft.periods = [])
  if (periods.includes(iso)) return
  const tooClose = periods.some((p) => {
    const d = diffDays(p, iso)
    return d >= 0 && d < 15
  })
  if (tooClose) return
  periods.push(iso)
  periods.sort()
}

export function removePeriodStart(draft, iso) {
  draft.periods = (draft.periods || []).filter((p) => p !== iso)
}

// Prediksi tanggal mulai haid berikutnya, `count` tanggal mulai dari fromISO
export function predictedPeriods(state, fromISO, count) {
  const periods = state.periods || []
  if (periods.length === 0 || count <= 0) return []
  const avgLen = avgCycleLength(state)
  if (avgLen <= 0) return []

  let cursor = periods[periods.length - 1]
  const result = []
  while (result.length < count) {
    cursor = addDays(cursor, avgLen)
    if (cursor >= fromISO) result.push(cursor)
  }
  return result
}
