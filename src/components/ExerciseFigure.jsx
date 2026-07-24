// Bingkai ilustrasi gerakan — menyediakan viewBox, garis lantai, dan
// definisi mata panah. Isi ilustrasi diambil dari registry per id.
import { getIllustration } from '../data/illustrations-index.js'
import { SOFT } from '../data/illustrations.jsx'

export default function ExerciseFigure({ id, className = '', style }) {
  const art = getIllustration(id)
  if (!art) return null
  return (
    <svg
      className={'ex-figure ' + className}
      viewBox="0 0 200 140"
      style={style}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <marker id="bf-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#C05F53" />
        </marker>
      </defs>
      {/* garis lantai */}
      <line x1="16" y1="124" x2="184" y2="124" stroke={SOFT} strokeWidth="3" strokeLinecap="round" />
      {art}
    </svg>
  )
}
