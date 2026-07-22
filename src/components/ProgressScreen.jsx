import { useState } from 'react'
import { useApp } from '../App.jsx'
import { Stat, Sparkline } from './ui.jsx'
import { streak, weekSessions, totalSessions } from '../lib/engine.js'
import { formatShort } from '../lib/dates.js'
import { defaultState, exportJSON } from '../lib/storage.js'
import { NUTRITION_TIPS } from '../data/program.js'

const STREAK_GOALS = [3, 7, 14, 30, 60]
const SESSION_GOALS = [5, 10, 25, 50, 100]

const idNum = (n) => n.toFixed(1).replace('.', ',')

export default function ProgressScreen() {
  const { state, update, today } = useApp()
  const [weightInput, setWeightInput] = useState('')
  const [waistInput, setWaistInput] = useState('')
  const [copyLabel, setCopyLabel] = useState('Salin Data (Cadangan)')
  const [settingsForm, setSettingsForm] = useState({
    cycleLen: state.settings.cycleLen,
    periodLen: state.settings.periodLen,
    programStartISO: state.settings.programStartISO,
  })

  const streakCount = streak(state, today)
  const weekCount = weekSessions(state, today)
  const totalCount = totalSessions(state)

  const lastWeight = state.weights.length ? state.weights[state.weights.length - 1] : null
  const weightDelta = lastWeight ? lastWeight.kg - state.profile.beratAwalKg : 0
  const weightData = state.weights.slice(-12).map((w) => ({ label: formatShort(w.date), value: w.kg }))
  const heightM = (state.profile.tinggiCm || 159) / 100
  const bmi = lastWeight ? lastWeight.kg / (heightM * heightM) : null
  const bmiCategory = bmi == null ? null : bmi < 18.5 ? 'kurang' : bmi < 25 ? 'sehat' : bmi < 30 ? 'berlebih' : 'obesitas'
  const BMI_LABEL = { kurang: 'kurang berat badan', sehat: 'berat badan sehat', berlebih: 'berat badan berlebih', obesitas: 'obesitas' }

  const lastWaist = state.waists.length ? state.waists[state.waists.length - 1] : null
  const waistData = state.waists.slice(-12).map((w) => ({ label: formatShort(w.date), value: w.cm }))

  const saveWeight = () => {
    const kg = parseFloat(weightInput)
    if (!kg || kg < 35 || kg > 150) return
    update((d) => {
      const idx = d.weights.findIndex((w) => w.date === today)
      if (idx >= 0) d.weights[idx] = { date: today, kg }
      else {
        d.weights.push({ date: today, kg })
        d.weights.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      }
    })
    setWeightInput('')
  }

  const saveWaist = () => {
    const cm = parseFloat(waistInput)
    if (!cm || cm < 40 || cm > 200) return
    update((d) => {
      const idx = d.waists.findIndex((w) => w.date === today)
      if (idx >= 0) d.waists[idx] = { date: today, cm }
      else {
        d.waists.push({ date: today, cm })
        d.waists.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      }
    })
    setWaistInput('')
  }

  const saveSettings = () => {
    const cycleLen = Math.min(40, Math.max(21, parseInt(settingsForm.cycleLen, 10) || state.settings.cycleLen))
    const periodLen = Math.min(8, Math.max(2, parseInt(settingsForm.periodLen, 10) || state.settings.periodLen))
    const programStartISO = settingsForm.programStartISO || state.settings.programStartISO
    setSettingsForm({ cycleLen, periodLen, programStartISO })
    update((d) => {
      d.settings.cycleLen = cycleLen
      d.settings.periodLen = periodLen
      d.settings.programStartISO = programStartISO
    })
  }

  const salinData = async () => {
    try {
      await navigator.clipboard.writeText(exportJSON(state))
      setCopyLabel('Tersalin ✓')
      setTimeout(() => setCopyLabel('Salin Data (Cadangan)'), 2000)
    } catch {
      alert('Gagal menyalin otomatis. Berikut datanya untuk disalin manual:\n\n' + exportJSON(state))
    }
  }

  const hapusSemua = () => {
    if (!window.confirm('Yakin ingin menghapus SEMUA data BundaFit? Tindakan ini tidak bisa dibatalkan.')) return
    if (!window.confirm('Sungguh-sungguh, Bunda? Semua catatan berat, siklus, dan sesi latihan akan hilang selamanya.')) return
    update(() => defaultState())
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <p className="kicker">BUNDA</p>
        <h1>Perjalanan Bunda</h1>
        <p className="sub">Setiap langkah kecil hari ini adalah investasi untuk tubuh yang lebih kuat, Bunda.</p>
      </div>

      <div className="stat-grid mb-2">
        <Stat num={streakCount} label="Hari Beruntun" />
        <Stat num={weekCount} label="Minggu Ini" />
        <Stat num={totalCount} label="Total Sesi" />
      </div>

      <div className="card">
        <p className="card-title mb-2">Berat Badan</p>
        <div className="flex-between mb-1">
          <h2>{lastWeight ? `${lastWeight.kg} kg` : '— kg'}</h2>
          {lastWeight && weightDelta < 0 && (
            <span className="small" style={{ color: 'var(--ok)' }}>
              &#9660; {idNum(Math.abs(weightDelta))} kg dari awal
            </span>
          )}
        </div>
        <div className="input-row mb-2">
          <input
            type="number"
            step="0.1"
            min="35"
            max="150"
            className="input"
            placeholder={lastWeight ? String(lastWeight.kg) : 'Berat (kg)'}
            value={weightInput}
            onChange={(e) => setWeightInput(e.target.value)}
          />
          <button type="button" className="btn btn-accent btn-small" onClick={saveWeight}>Catat</button>
        </div>
        <Sparkline data={weightData} unit=" kg" />
        {bmi != null && (
          <p className="small mt-1">IMT {idNum(bmi)} · {BMI_LABEL[bmiCategory]}</p>
        )}
        <p className="note sage mt-2">
          Saat menyusui, cukup timbang 1× seminggu ya, Bunda — turun 0,25–0,5 kg per minggu sudah bagus. Berat naik-turun harian karena cairan tubuh itu normal, jangan cemas. Rentang berat sehat untuk tinggi 159 cm ≈ 46,8–63,2 kg.
        </p>
      </div>

      <div className="card">
        <p className="card-title mb-2">Lingkar Pinggang</p>
        <div className="flex-between mb-1">
          <h2>{lastWaist ? `${lastWaist.cm} cm` : '— cm'}</h2>
        </div>
        <div className="input-row mb-2">
          <input
            type="number"
            step="0.5"
            min="40"
            max="200"
            className="input"
            placeholder={lastWaist ? String(lastWaist.cm) : 'Lingkar (cm)'}
            value={waistInput}
            onChange={(e) => setWaistInput(e.target.value)}
          />
          <button type="button" className="btn btn-accent btn-small" onClick={saveWaist}>Catat</button>
        </div>
        <Sparkline data={waistData} unit=" cm" />
        <p className="small mt-1">
          Ukur pagi hari, sejajar pusar, sebelum makan. Untuk "perut gantung" pasca melahirkan, lingkar pinggang sering lebih jujur menunjukkan progres daripada angka di timbangan.
        </p>
      </div>

      <div className="card">
        <p className="card-title mb-2">Pencapaian</p>
        <p className="small strong mb-1">Hari beruntun</p>
        <div className="flex mb-2" style={{ flexWrap: 'wrap', gap: 6 }}>
          {STREAK_GOALS.map((n) => {
            const reached = streakCount >= n
            return (
              <span key={n} className={reached ? 'chip chip-folikular' : 'chip'} style={reached ? undefined : { opacity: 0.55 }}>
                {reached ? '✓ ' : ''}{n} hari
              </span>
            )
          })}
        </div>
        <p className="small strong mb-1">Total sesi</p>
        <div className="flex" style={{ flexWrap: 'wrap', gap: 6 }}>
          {SESSION_GOALS.map((n) => {
            const reached = totalCount >= n
            return (
              <span key={n} className={reached ? 'chip chip-folikular' : 'chip'} style={reached ? undefined : { opacity: 0.55 }}>
                {reached ? '✓ ' : ''}{n} sesi
              </span>
            )
          })}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Nutrisi Ibu Menyusui</p>
        {NUTRITION_TIPS.map((t, i) => (
          <div className="mb-2" key={i}>
            <p className="strong mb-1">{t.judul}</p>
            <p className="small">{t.isi}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <p className="card-title mb-2">Pengaturan</p>
        <div className="field">
          <label>Panjang siklus (hari)</label>
          <input
            type="number"
            min="21"
            max="40"
            className="input"
            value={settingsForm.cycleLen}
            onChange={(e) => setSettingsForm((s) => ({ ...s, cycleLen: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Panjang haid (hari)</label>
          <input
            type="number"
            min="2"
            max="8"
            className="input"
            value={settingsForm.periodLen}
            onChange={(e) => setSettingsForm((s) => ({ ...s, periodLen: e.target.value }))}
          />
        </div>
        <div className="field">
          <label>Tanggal mulai program</label>
          <input
            type="date"
            className="input"
            value={settingsForm.programStartISO}
            onChange={(e) => setSettingsForm((s) => ({ ...s, programStartISO: e.target.value }))}
          />
        </div>
        <button type="button" className="btn btn-ghost btn-small" onClick={saveSettings}>Simpan Pengaturan</button>
        <div className="divider" />
        <button type="button" className="btn btn-ghost btn-block" onClick={salinData}>{copyLabel}</button>
        <button type="button" className="btn btn-danger btn-block mt-1" onClick={hapusSemua}>Hapus Semua Data</button>
      </div>
    </div>
  )
}
