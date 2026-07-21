// Penyimpanan state di localStorage — murni, tanpa dependensi data/*
// Tahan jalan di Node (tanpa localStorage) untuk kebutuhan test.

import { todayISO } from './dates.js'

const KEY = 'bundafit.v1'

export function defaultState() {
  return {
    version: 1,
    profile: { nama: 'Bunda', tinggiCm: 159, beratAwalKg: 72, menyusui: true },
    settings: { cycleLen: 28, periodLen: 5, programStartISO: todayISO() },
    periods: [],
    weights: [],
    waists: [],
    sessions: [],
    kneeToday: null,
  }
}

// Gabung state tersimpan dengan default, per key top-level saja.
// Field baru yang ditambahkan di masa depan otomatis terisi dari default.
function mergeWithDefault(parsed) {
  const def = defaultState()
  const merged = { ...def }
  for (const key of Object.keys(def)) {
    if (parsed[key] !== undefined) merged[key] = parsed[key]
  }
  return merged
}

export function loadState() {
  const def = defaultState()
  if (typeof localStorage === 'undefined') return def
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return def
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return def
    return mergeWithDefault(parsed)
  } catch {
    // JSON korup atau localStorage bermasalah -> pakai default
    return def
  }
}

export function saveState(state) {
  if (typeof localStorage === 'undefined') return
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // penyimpanan penuh/diblokir -> abaikan diam-diam
  }
}

export function exportJSON(state) {
  return JSON.stringify(state, null, 2)
}

export function importJSON(text) {
  let parsed
  try {
    parsed = JSON.parse(text)
  } catch {
    throw new Error('Teks bukan JSON yang valid')
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Data bukan objek state yang valid')
  }
  // isi field yang mungkin belum ada (mis. import dari versi lama)
  return mergeWithDefault(parsed)
}
