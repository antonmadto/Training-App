// Harness pratinjau ilustrasi (khusus dev; tidak ikut ke aplikasi utama).
import { createRoot } from 'react-dom/client'
import ExerciseFigure from './components/ExerciseFigure.jsx'
import { EXERCISES } from './data/exercises.js'
import { hasIllustration } from './data/illustrations-index.js'

const params = new URLSearchParams(location.search)
let ids = (params.get('ids') || '').split(',').filter(Boolean)
if (ids.length === 0) ids = Object.keys(EXERCISES)

const grid = document.getElementById('grid')
const root = createRoot(grid)
root.render(
  <>
    {ids.map((id) => (
      <div className="cell" key={id}>
        <ExerciseFigure id={id} />
        <div className="id">{id}{hasIllustration(id) ? '' : ' — (belum ada)'}</div>
      </div>
    ))}
  </>
)
