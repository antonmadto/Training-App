import { useState } from 'react'
import { useApp } from '../App.jsx'
import { Sheet } from './ui.jsx'
import { weekNumber, tierForWeek, templateForDate, resolveTemplate } from '../lib/engine.js'
import { WEEKDAYS_ID, addDays, weekdayIndex } from '../lib/dates.js'
import { TIER_INFO, PAIN_RULES } from '../data/program.js'
import { EXERCISES, getExercise } from '../data/exercises.js'
import ExerciseFigure from './ExerciseFigure.jsx'
import { hasIllustration } from '../data/illustrations-index.js'

const CATEGORY_ORDER = ['pemanasan', 'kekuatan', 'core', 'jalan', 'pendinginan']
const CATEGORY_LABEL = { pemanasan: 'Pemanasan', kekuatan: 'Kekuatan', core: 'Core', jalan: 'Jalan', pendinginan: 'Pendinginan' }
const EQUIPMENT_LABEL = { kb: 'KB', tubuh: 'Tubuh', treadmill: 'Treadmill' }

export default function ProgramScreen() {
  const { state, today } = useApp()
  const [openDateIso, setOpenDateIso] = useState(null)
  const [openExerciseId, setOpenExerciseId] = useState(null)

  const week = weekNumber(state, today)
  const tier = tierForWeek(week)

  const monday = addDays(today, -weekdayIndex(today))
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(monday, i))

  const selectedTemplate = openDateIso ? templateForDate(openDateIso) : null
  const selectedBlocks = selectedTemplate ? resolveTemplate(selectedTemplate, { tier, kneeMode: false }) : []

  const selectedExercise = openExerciseId ? getExercise(openExerciseId) : null

  const groupedExercises = CATEGORY_ORDER
    .map((cat) => ({ cat, items: Object.values(EXERCISES).filter((ex) => ex.kategori === cat) }))
    .filter((g) => g.items.length > 0)

  return (
    <div className="screen">
      <div className="screen-header">
        <p className="kicker">PROGRAM</p>
        <h1>Program Bunda</h1>
        <p className="sub">Minggu ke-{week} · Tier {tier}: {TIER_INFO[tier].judul}</p>
      </div>

      <div className="card">
        <p className="card-title mb-2">Tahapan Beban</p>
        <div className="list">
          {[1, 2, 3].map((t) => (
            <div className="row" key={t}>
              <div className={t === tier ? 'ex-num ex-done' : 'ex-num'}>{t}</div>
              <div className="row-main">
                <div className="row-title">Minggu {TIER_INFO[t].minggu} — {TIER_INFO[t].judul}</div>
                <div className="row-sub">{TIER_INFO[t].deskripsi}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Jadwal Seminggu</p>
        <div className="list">
          {weekDates.map((iso, i) => {
            const tpl = templateForDate(iso)
            const isToday = iso === today
            return (
              <button
                type="button"
                className="row"
                key={iso}
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => setOpenDateIso(iso)}
              >
                <div className="row-main">
                  <div className="row-title">
                    {WEEKDAYS_ID[i]}
                    {isToday && <span className="badge" style={{ marginLeft: 8 }}>Hari ini</span>}
                  </div>
                  <div className="row-sub">{tpl.nama} · {tpl.fokus}</div>
                </div>
                <div className="row-end">{tpl.durasi} mnt</div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Aturan Emas</p>
        <div className="list">
          {PAIN_RULES.map((rule, i) => (
            <div className="row" key={i}>
              <div className="ex-num">{i + 1}</div>
              <div className="row-main small">{rule}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <p className="card-title mb-2">Pustaka Gerakan</p>
        {groupedExercises.map((g) => (
          <div className="mb-2" key={g.cat}>
            <p className="small strong mb-1">{CATEGORY_LABEL[g.cat]}</p>
            <div className="list">
              {g.items.map((ex) => (
                <button
                  type="button"
                  className="row"
                  key={ex.id}
                  style={{ width: '100%', textAlign: 'left' }}
                  onClick={() => setOpenExerciseId(ex.id)}
                >
                  {hasIllustration(ex.id) && <ExerciseFigure id={ex.id} className="ex-thumb" />}
                  <div className="row-main">
                    <div className="row-title">{ex.nama}</div>
                    <div className="row-sub">{ex.target}</div>
                  </div>
                  <span className="chip" style={{ fontSize: '0.72rem', padding: '3px 10px' }}>
                    {EQUIPMENT_LABEL[ex.equipment]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Sheet open={openDateIso !== null} onClose={() => setOpenDateIso(null)}>
        {selectedTemplate && (
          <>
            <h2>{selectedTemplate.nama}</h2>
            <p className="small mb-2">{selectedTemplate.fokus}</p>
            {selectedBlocks.length === 0 && <p className="small">(detail menyusul)</p>}
            {selectedBlocks.map((block, bi) => (
              <div className="mb-2" key={bi}>
                <p className="small strong mb-1">{block.title}</p>
                <div className="list">
                  {block.items.map((item, ii) => (
                    <div className="row" key={ii}>
                      <div className="ex-num">{ii + 1}</div>
                      <div className="row-main">
                        <div className="row-title">{item.exercise.nama}</div>
                      </div>
                      <div className="row-end">
                        {item.set ? `${item.set}×${item.reps}` : item.waktu}
                        {item.beban ? ` · ${item.beban}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
      </Sheet>

      <Sheet open={openExerciseId !== null} onClose={() => setOpenExerciseId(null)}>
        {selectedExercise && (
          <>
            <h2>{selectedExercise.nama}</h2>
            {hasIllustration(selectedExercise.id) && (
              <ExerciseFigure id={selectedExercise.id} className="mb-2" style={{ maxWidth: 220, margin: '0 auto 12px' }} />
            )}
            <div className="flex mb-2" style={{ flexWrap: 'wrap', gap: 6 }}>
              <span className="chip">{EQUIPMENT_LABEL[selectedExercise.equipment]}</span>
              <span className="chip">{CATEGORY_LABEL[selectedExercise.kategori]}</span>
            </div>
            <p className="small mb-2">{selectedExercise.target}</p>
            <ul className="mb-2" style={{ paddingLeft: 18 }}>
              {selectedExercise.cues.map((c, i) => (
                <li className="small mb-1" key={i}>{c}</li>
              ))}
            </ul>
            {selectedExercise.kneeNote && <p className="note rose mb-1">{selectedExercise.kneeNote}</p>}
            {selectedExercise.diastasisNote && <p className="note mb-1">{selectedExercise.diastasisNote}</p>}
            {selectedExercise.kneeAlt && (
              <p className="small">Saat lutut nyeri, ganti dengan: {getExercise(selectedExercise.kneeAlt).nama}</p>
            )}
          </>
        )}
      </Sheet>
    </div>
  )
}
