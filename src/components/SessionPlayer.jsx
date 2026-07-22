// Pemutar sesi latihan — layar penuh. Menandai set selesai, timer istirahat
// dengan bip + getar, lalu ringkasan RPE & nyeri lutut sebelum menyimpan.
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useApp } from '../App.jsx'
import { Sheet, ProgressBar } from './ui.jsx'

// Jumlah "set" sebuah item (item berbasis waktu dihitung 1 set)
const setCount = (it) => (it.waktu ? 1 : (it.set || 1))
const pillKey = (bi, ii, si) => `${bi}-${ii}-${si}`

// Bunyi bip 2× singkat saat istirahat habis (aman bila Web Audio tak tersedia)
function bip() {
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return
    const ac = new Ctx()
    const nada = (mulai) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.frequency.value = 880
      gain.gain.value = 0.05
      osc.connect(gain)
      gain.connect(ac.destination)
      osc.start(mulai)
      osc.stop(mulai + 0.15)
    }
    nada(ac.currentTime)
    nada(ac.currentTime + 0.25)
    setTimeout(() => ac.close(), 800)
  } catch {
    // abaikan bila audio diblokir
  }
}

export default function SessionPlayer({ plan, onClose, onDone }) {
  const { today } = useApp()
  const template = plan.template || {}
  const blocks = plan.blocks || []

  const [done, setDone] = useState({})       // { 'bi-ii-si': true }
  const [buka, setBuka] = useState({})        // detail terbuka per item
  const [elapsed, setElapsed] = useState(0)   // detik berjalan
  const [rest, setRest] = useState(null)      // sisa detik istirahat, null = tidak aktif
  const [ringkasan, setRingkasan] = useState(false)
  const [rpe, setRpe] = useState(6)
  const [nyeri, setNyeri] = useState(0)
  const [catatan, setCatatan] = useState('')

  // Timer utama sejak mount
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(id)
  }, [])

  // Timer istirahat — hitung mundur, lalu bip + getar saat habis
  useEffect(() => {
    if (rest === null) return
    if (rest <= 0) {
      bip()
      navigator.vibrate?.(200)
      setRest(null)
      return
    }
    const id = setTimeout(() => setRest((r) => (r === null ? null : r - 1)), 1000)
    return () => clearTimeout(id)
  }, [rest])

  const toggleDetail = (bi, ii) => {
    const k = `${bi}-${ii}`
    setBuka((o) => ({ ...o, [k]: !o[k] }))
  }

  const togglePill = (bi, ii, si, it) => {
    const key = pillKey(bi, ii, si)
    const sudah = !!done[key]
    const next = { ...done, [key]: !sudah }
    setDone(next)
    // Mulai istirahat bila set (bukan waktu) baru selesai & masih ada sisa set
    if (!sudah && !it.waktu) {
      const total = setCount(it)
      let n = 0
      for (let s = 0; s < total; s++) if (next[pillKey(bi, ii, s)]) n++
      if (n < total) setRest(it.istirahatDetik || 60)
    }
  }

  const itemSelesai = (bi, ii, it) => {
    const c = setCount(it)
    for (let si = 0; si < c; si++) if (!done[pillKey(bi, ii, si)]) return false
    return c > 0
  }

  // Hitung progres set
  let totalSet = 0
  let selesaiSet = 0
  blocks.forEach((b, bi) => (b.items || []).forEach((it, ii) => {
    const c = setCount(it)
    totalSet += c
    for (let si = 0; si < c; si++) if (done[pillKey(bi, ii, si)]) selesaiSet++
  }))
  const persen = totalSet ? (selesaiSet / totalSet) * 100 : 0

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  const tutup = () => {
    if (selesaiSet > 0 && !window.confirm('Tutup sesi? Progres yang belum disimpan akan hilang.')) return
    onClose()
  }

  const simpan = () => {
    const selesai = []
    blocks.forEach((b, bi) => (b.items || []).forEach((it, ii) => {
      if (itemSelesai(bi, ii, it) && it.exercise) selesai.push(it.exercise.id)
    }))
    onDone({
      date: today,
      templateId: template.id,
      mode: template.id === 'darurat10' ? 'singkat' : 'penuh',
      selesai,
      rpe,
      nyeriLutut: nyeri,
      menit: Math.max(1, Math.round(elapsed / 60)),
      catatan: catatan.trim(),
    })
  }

  // Portal ke body agar layar sesi & bar istirahat (fixed) bebas dari
  // containing block milik layar di belakangnya
  return createPortal(
    <div className="session-screen">
      <div className="session-topbar">
        <button className="btn btn-ghost btn-small" onClick={tutup}>Tutup</button>
        <span className="strong">{template.nama || 'Sesi'}</span>
        <span className="strong" style={{ fontVariantNumeric: 'tabular-nums' }}>{mm}:{ss}</span>
      </div>

      <ProgressBar value={persen} />

      {blocks.length === 0 ? (
        <div className="card mt-2">
          <p className="small">Sesi ini belum punya detail gerakan. Bunda tetap bisa bergerak bebas, lalu tekan Selesai.</p>
        </div>
      ) : (
        blocks.map((block, bi) => (
          <div className="card mt-2" key={bi}>
            <div className="card-title mb-2">{block.title}</div>
            {(block.items || []).map((it, ii) => {
              const nomor = blocks.slice(0, bi).reduce((s, b) => s + (b.items?.length || 0), 0) + ii + 1
              const terbuka = !!buka[`${bi}-${ii}`]
              const ex = it.exercise || {}
              const sub = it.waktu
                ? it.waktu
                : `${it.set || 1}×${it.reps || ''}${it.beban ? ` · ${it.beban}` : ''}`
              return (
                <div key={ii}>
                  <div className="row">
                    <div className={'ex-num' + (itemSelesai(bi, ii, it) ? ' ex-done' : '')}>{nomor}</div>
                    <button className="row-main" style={{ textAlign: 'left', width: '100%' }} onClick={() => toggleDetail(bi, ii)}>
                      <div className="row-title">
                        {ex.nama}
                        {it.swapped && (
                          <span className="chip chip-lutut" style={{ marginLeft: 8, padding: '2px 8px', fontSize: '0.7rem' }}>diganti</span>
                        )}
                      </div>
                      <div className="row-sub">{sub}</div>
                    </button>
                  </div>

                  {terbuka && (
                    <div className="mb-2" style={{ paddingLeft: 46 }}>
                      {ex.cues?.length > 0 && (
                        <ul style={{ paddingLeft: 18, margin: '4px 0' }}>
                          {ex.cues.map((c, ci) => <li key={ci} className="small">{c}</li>)}
                        </ul>
                      )}
                      {ex.kneeNote && <div className="note rose mt-1">{ex.kneeNote}</div>}
                      {ex.diastasisNote && <div className="note mt-1">{ex.diastasisNote}</div>}
                      {it.catatan && <div className="small mt-1">{it.catatan}</div>}
                    </div>
                  )}

                  <div className="flex" style={{ flexWrap: 'wrap', gap: 8, paddingLeft: 46, paddingBottom: 12 }}>
                    {Array.from({ length: setCount(it) }).map((_, si) => {
                      const aktif = !!done[pillKey(bi, ii, si)]
                      return (
                        <button
                          key={si}
                          className={'set-pill' + (aktif ? ' done' : '')}
                          onClick={() => togglePill(bi, ii, si, it)}
                        >
                          {it.waktu ? it.waktu : si + 1}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        ))
      )}

      <button className="btn btn-primary btn-block mt-2" onClick={() => setRingkasan(true)}>Selesai &amp; Simpan</button>

      {/* Bar istirahat melayang di bawah */}
      {rest !== null && (
        <div style={{ position: 'fixed', left: '50%', transform: 'translateX(-50%)', bottom: 'calc(16px + env(safe-area-inset-bottom))', width: 'calc(100% - 28px)', maxWidth: 480, zIndex: 55 }}>
          <div className="card" style={{ marginBottom: 0, boxShadow: 'var(--shadow)' }}>
            <div className="flex-between">
              <span className="strong">Istirahat</span>
              <span className="timer-display" style={{ fontSize: '2rem' }}>{rest}</span>
              <button className="btn btn-small btn-ghost" onClick={() => setRest(null)}>Lewati</button>
            </div>
          </div>
        </div>
      )}

      {/* Ringkasan sesi */}
      <Sheet open={ringkasan} onClose={() => setRingkasan(false)}>
        <h2>Bagaimana sesi tadi?</h2>
        <div className="field">
          <label>Seberapa berat rasanya? (RPE {rpe})</label>
          <input type="range" min="1" max="10" value={rpe} onChange={(e) => setRpe(Number(e.target.value))} />
        </div>
        <div className="field">
          <label>Nyeri lutut ({nyeri})</label>
          <input type="range" min="0" max="10" value={nyeri} onChange={(e) => setNyeri(Number(e.target.value))} />
          {nyeri > 3 && (
            <div className="note rose mt-1">Besok kita kurangi beban atau ganti ke gerakan yang lebih ramah lutut, ya Bunda.</div>
          )}
        </div>
        <div className="field">
          <input className="input" placeholder="Catatan (opsional)" value={catatan} onChange={(e) => setCatatan(e.target.value)} />
        </div>
        <button className="btn btn-accent btn-block" onClick={simpan}>Simpan Sesi</button>
      </Sheet>
    </div>,
    document.body
  )
}
