import { useState } from 'react'
import { useApp } from '../App.jsx'
import { Icons } from './ui.jsx'
import { cycleInfo, phaseForDate, addPeriodStart, removePeriodStart } from '../lib/cycle.js'
import { formatLong, addDays, weekdayIndex } from '../lib/dates.js'
import { PHASE_ADJUST } from '../data/program.js'

const PHASE_BG = {
  haid: 'var(--rose-soft)',
  folikular: 'var(--sage-soft)',
  ovulasi: 'var(--gold-soft)',
  luteal: 'var(--plum-soft)',
}

const PHASE_ORDER = ['haid', 'folikular', 'ovulasi', 'luteal']
const WEEKDAY_ABBR = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

export default function CycleScreen() {
  const { state, update, today } = useApp()
  const info = cycleInfo(state, today)
  const [dateInput, setDateInput] = useState(today)
  const [openPhase, setOpenPhase] = useState(() => (info ? info.fase : null))

  const catatMulaiHaid = () => {
    if (!dateInput) return
    update((d) => addPeriodStart(d, dateInput))
  }

  const monday = addDays(today, -weekdayIndex(today))
  const calDays = Array.from({ length: 35 }, (_, i) => addDays(monday, i))
  const recentPeriods = [...state.periods].slice(-6).reverse()

  return (
    <div className="screen">
      <div className="screen-header">
        <p className="kicker">SIKLUS</p>
        <h1>Siklus &amp; Fase</h1>
        <p className="sub">Latihan Bunda menyesuaikan diri dengan fase tubuh, bukan sebaliknya.</p>
      </div>

      {state.periods.length === 0 && (
        <div className="card">
          <p className="card-title">Mulai Catat Siklus</p>
          <p className="small mb-2">
            Dengan mencatat hari pertama haid, BundaFit bisa menyesuaikan intensitas latihan otomatis dengan fase tubuh Bunda setiap harinya.
          </p>
          <div className="field">
            <label>Hari pertama haid terakhir</label>
            <input
              type="date"
              className="input"
              value={dateInput}
              max={today}
              onChange={(e) => setDateInput(e.target.value)}
            />
          </div>
          <button type="button" className="btn btn-accent btn-block" onClick={catatMulaiHaid}>
            Catat Hari Pertama Haid
          </button>
        </div>
      )}

      {info && (
        <div className="card" style={{ background: PHASE_BG[info.fase] }}>
          <span className={`chip ${PHASE_ADJUST[info.fase].chipClass}`}>{PHASE_ADJUST[info.fase].label}</span>
          <h2 className="mt-1">Hari ke-{info.day}</h2>
          <p className="small mb-2">
            dari siklus ±{info.cycleLen} hari · perkiraan haid berikutnya {info.hariMenujuHaid} hari lagi
          </p>
          <p className="small mb-1">{PHASE_ADJUST[info.fase].tubuh}</p>
          <p className="small mb-1">
            <span className="strong">Latihan: </span>
            {PHASE_ADJUST[info.fase].latihan}
          </p>
          {PHASE_ADJUST[info.fase].catatanLutut && (
            <p className="note rose mt-1">{PHASE_ADJUST[info.fase].catatanLutut}</p>
          )}
          {info.telat && (
            <p className="note mt-1">
              Siklus tampaknya lebih panjang dari biasanya. Tidak apa, Bunda — catat saja di bawah begitu haid mulai.
            </p>
          )}
        </div>
      )}

      <div className="card">
        <p className="card-title mb-2">Catat Haid</p>
        <div className="input-row mb-2">
          <input
            type="date"
            className="input"
            value={dateInput}
            max={today}
            onChange={(e) => setDateInput(e.target.value)}
          />
          <button type="button" className="btn btn-accent btn-small" onClick={catatMulaiHaid}>
            Catat mulai haid
          </button>
        </div>
        <div className="list">
          {recentPeriods.map((iso) => (
            <div className="row" key={iso}>
              <div className="row-main grow">{formatLong(iso)}</div>
              <button
                type="button"
                className="btn btn-ghost btn-small"
                aria-label="Hapus catatan haid ini"
                onClick={() => update((d) => removePeriodStart(d, iso))}
              >
                {Icons.close}
              </button>
            </div>
          ))}
          {recentPeriods.length === 0 && <p className="small">Belum ada catatan haid.</p>}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Kalender Fase — 5 Minggu</p>
        <div className="cal-strip mb-1">
          {WEEKDAY_ABBR.map((d) => (
            <div className="small center" key={d}>{d}</div>
          ))}
        </div>
        <div className="cal-strip">
          {calDays.map((iso) => {
            const fase = phaseForDate(state, iso)
            const cls = ['cal-day', fase ? `p-${fase}` : '', iso === today ? 'today' : ''].filter(Boolean).join(' ')
            return (
              <div className={cls} key={iso}>
                <span className="cal-num">{Number(iso.slice(8, 10))}</span>
              </div>
            )
          })}
        </div>
        <div className="flex mt-2" style={{ flexWrap: 'wrap', gap: 6 }}>
          {PHASE_ORDER.map((f) => (
            <span key={f} className={`chip ${PHASE_ADJUST[f].chipClass}`} style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
              {PHASE_ADJUST[f].label}
            </span>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Panduan Fase</p>
        <div className="list">
          {PHASE_ORDER.map((f) => {
            const adjust = PHASE_ADJUST[f]
            const isOpen = openPhase === f
            return (
              <div key={f}>
                <button
                  type="button"
                  className="row"
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => setOpenPhase(isOpen ? null : f)}
                >
                  <span className={`chip ${adjust.chipClass}`}>{adjust.label}</span>
                  <span className="row-main small">{adjust.hariRange}</span>
                  {Icons.chevron}
                </button>
                {isOpen && (
                  <div className="mb-2" style={{ padding: '0 2px 12px' }}>
                    <p className="small mb-1">{adjust.tubuh}</p>
                    <p className="small mb-1">
                      <span className="strong">Latihan: </span>
                      {adjust.latihan}
                    </p>
                    {adjust.catatanLutut && <p className="note rose mb-1">{adjust.catatanLutut}</p>}
                    <p className="small">{adjust.volumeNote}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
