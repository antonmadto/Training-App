// Layar "Hari Ini" — sapaan, status siklus/lutut, kartu sesi hari ini,
// rencana ringkas, dan statistik. Membuka SessionPlayer saat Bunda mulai sesi.
import { useState } from 'react'
import { useApp } from '../App.jsx'
import { Stat } from './ui.jsx'
import {
  planForDate,
  fallbackPlan,
  logSession,
  streak,
  totalSessions,
  weekSessions,
} from '../lib/engine.js'
import { cycleInfo } from '../lib/cycle.js'
import { formatLong } from '../lib/dates.js'
import { PHASE_ADJUST } from '../data/program.js'
import SessionPlayer from './SessionPlayer.jsx'

// Sapaan sesuai jam lokal (tanpa emoji)
function sapaan() {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat pagi, Bunda'
  if (h < 15) return 'Selamat siang, Bunda'
  if (h < 19) return 'Selamat sore, Bunda'
  return 'Selamat malam, Bunda'
}

export default function TodayScreen() {
  const { state, update, setTab, today } = useApp()
  const [active, setActive] = useState(null) // { plan } — sesi yang sedang berjalan

  const plan = planForDate(state, today)
  const ci = cycleInfo(state, today)
  const faseAdjust = ci ? PHASE_ADJUST[ci.fase] : null
  const sesi = plan.done // objek sesi bila hari ini sudah tercatat, selain itu null
  const belumPilihLutut = state.kneeToday?.date !== today
  const periodeKosong = (state.periods || []).length === 0

  const pilihLutut = (status) => update((d) => { d.kneeToday = { date: today, status } })

  const selesaiSesi = (entry) => {
    update((d) => logSession(d, entry))
    setActive(null)
  }

  // Nomor urut gerakan berjalan lintas block
  const nomorAwal = (bi) => plan.blocks.slice(0, bi).reduce((s, b) => s + b.items.length, 0)

  return (
    <div className="screen">
      <header className="screen-header">
        <div className="kicker">BUNDAFIT</div>
        <h1>{sapaan()}</h1>
        <div className="sub">{formatLong(today)}</div>
      </header>

      {(faseAdjust || plan.kneeMode) && (
        <div className="flex mb-2" style={{ flexWrap: 'wrap' }}>
          {faseAdjust && (
            <button className={'chip ' + faseAdjust.chipClass} onClick={() => setTab('siklus')}>
              {faseAdjust.label} · Hari ke-{ci.day}
            </button>
          )}
          {plan.kneeMode && <span className="chip chip-lutut">Mode Lutut Aman</span>}
        </div>
      )}

      {belumPilihLutut ? (
        <div className="card">
          <div className="card-title">Bagaimana lutut Bunda hari ini?</div>
          <p className="small mb-2">Kami sesuaikan gerakan supaya tetap nyaman.</p>
          <div className="flex">
            <button className="btn btn-ghost grow" onClick={() => pilihLutut('aman')}>Aman</button>
            <button className="btn btn-ghost grow" onClick={() => pilihLutut('nyeri')}>Agak nyeri</button>
          </div>
        </div>
      ) : plan.kneeMode ? (
        <div className="note rose mb-2">
          Mode Lutut Aman aktif — gerakan berat untuk lutut otomatis diganti versi yang lebih ramah. Tetap boleh bergerak pelan, ya Bunda.
        </div>
      ) : null}

      {periodeKosong && (
        <div className="card tinted">
          <div className="card-title">Aktifkan panduan fase</div>
          <p className="small mb-2">Catat tanggal haid terakhir Bunda supaya latihan menyesuaikan fase siklus.</p>
          <button className="btn btn-ghost btn-small" onClick={() => setTab('siklus')}>Catat di Siklus</button>
        </div>
      )}

      {/* Kartu hero — sesi hari ini atau ucapan selamat bila sudah selesai */}
      <div className="hero">
        {plan.done ? (
          <>
            <div className="hero-kicker">SESI SELESAI</div>
            <h2>Alhamdulillah, hebat Bunda!</h2>
            <div className="hero-meta">{sesi.menit} menit · RPE {sesi.rpe}</div>
            <div className="hero-meta">{streak(state, today)} hari beruntun</div>
            <button className="btn btn-light btn-small mt-2" onClick={() => setActive({ plan })}>Ulangi sesi</button>
          </>
        ) : (
          <>
            <div className="hero-kicker">MINGGU {plan.week} · TIER {plan.tier}</div>
            <h2>{plan.template.nama}</h2>
            <div className="hero-meta">{plan.template.fokus} · {plan.template.durasi} menit</div>
            {plan.phaseAdjust?.volumeNote && <div className="hero-meta">{plan.phaseAdjust.volumeNote}</div>}
            <button className="btn btn-light btn-block mt-2" onClick={() => setActive({ plan })}>Mulai Sesi</button>
            <button
              className="btn btn-small btn-light btn-block mt-1"
              style={{ background: 'transparent', color: '#FFF9F4', opacity: 0.85 }}
              onClick={() => setActive({ plan: fallbackPlan(state, today) })}
            >
              Hari sibuk? Sesi kilat 10 menit
            </button>
          </>
        )}
      </div>

      {/* Rencana hari ini */}
      <div className="card">
        <div className="card-title mb-2">Rencana hari ini</div>
        {plan.blocks.length === 0 ? (
          <p className="small">Detail sesi akan tampil di sini.</p>
        ) : (
          plan.blocks.map((block, bi) => (
            <div key={bi} className={bi > 0 ? 'mt-2' : ''}>
              <div className="small strong">{block.title}</div>
              <div className="list">
                {block.items.map((it, ii) => (
                  <div className="row" key={ii}>
                    <div className="ex-num">{nomorAwal(bi) + ii + 1}</div>
                    <div className="row-main">
                      <div className="row-title">{it.exercise.nama}</div>
                      <div className="row-sub">{it.exercise.target || it.catatan || ''}</div>
                    </div>
                    <div className="row-end">
                      {it.waktu ? it.waktu : `${it.set || 1}×${it.reps || ''}`}
                      {it.beban && <div className="small">{it.beban}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistik */}
      <div className="stat-grid">
        <Stat num={streak(state, today)} label="Hari Beruntun" />
        <Stat num={weekSessions(state, today)} label="Sesi Minggu Ini" />
        <Stat num={totalSessions(state)} label="Total Sesi" />
      </div>

      {active && (
        <SessionPlayer plan={active.plan} onClose={() => setActive(null)} onDone={selesaiSesi} />
      )}
    </div>
  )
}
