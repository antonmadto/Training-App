// Komponen UI bersama — jangan diubah oleh agen layar; dipelihara oleh arsitek.
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/* ---------- Ikon navigasi & umum (stroke 1.8) ---------- */
const I = (path, extra = null) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {path}
    {extra}
  </svg>
)

export const Icons = {
  sun: I(<circle cx="12" cy="12" r="4" />, <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />),
  dumbbell: I(<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11" />),
  moon: I(<path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5z" />),
  heart: I(<path d="M12 20.5c-.4-.3-7.5-4.8-7.5-9.8A4.3 4.3 0 0 1 8.8 6.3c1.4 0 2.6.7 3.2 1.9.6-1.2 1.8-1.9 3.2-1.9a4.3 4.3 0 0 1 4.3 4.4c0 5-7.1 9.5-7.5 9.8z" />),
  check: I(<path d="M4 12.5l5 5L20 6.5" />),
  chevron: I(<path d="M9 6l6 6-6 6" />),
  close: I(<path d="M6 6l12 12M18 6L6 18" />),
  plus: I(<path d="M12 5v14M5 12h14" />),
}

/* ---------- Sheet (modal dari bawah) ---------- */
export function Sheet({ open, onClose, children }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  // Portal ke body: elemen fixed tidak boleh terperangkap containing block layar
  return createPortal(
    <div className="sheet-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet" role="dialog" aria-modal="true">
        <div className="sheet-handle" />
        {children}
      </div>
    </div>,
    document.body
  )
}

/* ---------- Progress bar ---------- */
export function ProgressBar({ value }) {
  return (
    <div className="progress-bar">
      <div className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  )
}

/* ---------- Stat kecil ---------- */
export function Stat({ num, label }) {
  return (
    <div className="stat">
      <div className="stat-num">{num}</div>
      <div className="stat-label">{label}</div>
    </div>
  )
}

/* ---------- Sparkline (grafik garis kecil) ----------
   data: [{ label: '21 Jul', value: 71.4 }]  — urut lama → baru */
export function Sparkline({ data, unit = '', width = 320, height = 120 }) {
  if (!data || data.length === 0) {
    return <p className="small center" style={{ padding: '14px 0' }}>Belum ada data — mulai catat ya, Bunda.</p>
  }
  const pad = { t: 14, r: 14, b: 22, l: 14 }
  const w = width - pad.l - pad.r
  const h = height - pad.t - pad.b
  const vals = data.map((d) => d.value)
  const min = Math.min(...vals)
  const max = Math.max(...vals)
  const range = max - min || 1
  const x = (i) => pad.l + (data.length === 1 ? w / 2 : (i / (data.length - 1)) * w)
  const y = (v) => pad.t + h - ((v - min) / range) * h
  const line = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(' ')
  const area = `${line} L${x(data.length - 1).toFixed(1)},${(pad.t + h).toFixed(1)} L${x(0).toFixed(1)},${(pad.t + h).toFixed(1)} Z`
  const last = data[data.length - 1]

  return (
    <div className="chart-wrap">
      <svg className="sparkline" viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }} role="img"
        aria-label={`Grafik, terakhir ${last.value}${unit}`}>
        <path className="area" d={area} />
        <path className="line" d={line} />
        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r={i === data.length - 1 ? 4 : 2.5} />
        ))}
        <text x={x(0)} y={height - 6}>{data[0].label}</text>
        <text x={x(data.length - 1)} y={height - 6} textAnchor="end">{last.label}</text>
        <text x={x(data.length - 1)} y={y(last.value) - 8} textAnchor="end" fontWeight="700">
          {last.value}{unit}
        </text>
      </svg>
    </div>
  )
}
