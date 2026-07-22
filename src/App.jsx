import { createContext, useContext, useState } from 'react'
import { loadState, saveState } from './lib/storage.js'
import { todayISO } from './lib/dates.js'
import { Icons } from './components/ui.jsx'
import TodayScreen from './components/TodayScreen.jsx'
import ProgramScreen from './components/ProgramScreen.jsx'
import CycleScreen from './components/CycleScreen.jsx'
import ProgressScreen from './components/ProgressScreen.jsx'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

const TABS = [
  { id: 'hari', label: 'Hari Ini', icon: 'sun' },
  { id: 'program', label: 'Program', icon: 'dumbbell' },
  { id: 'siklus', label: 'Siklus', icon: 'moon' },
  { id: 'bunda', label: 'Bunda', icon: 'heart' },
]

export default function App() {
  const [state, setState] = useState(loadState)
  const [tab, setTab] = useState('hari')

  // update menerima fungsi produser: mutasi draft, atau kembalikan state baru
  const update = (producer) => {
    setState((prev) => {
      const draft = structuredClone(prev)
      const result = producer(draft)
      const next = result === undefined ? draft : result
      saveState(next)
      return next
    })
  }

  const ctx = { state, update, tab, setTab, today: todayISO() }

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app-shell">
        {tab === 'hari' && <TodayScreen />}
        {tab === 'program' && <ProgramScreen />}
        {tab === 'siklus' && <CycleScreen />}
        {tab === 'bunda' && <ProgressScreen />}
      </div>
      <nav className="navbar" aria-label="Navigasi utama">
        <div className="navbar-inner">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={'nav-item' + (tab === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
              aria-current={tab === t.id ? 'page' : undefined}
            >
              {Icons[t.icon]}
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </AppCtx.Provider>
  )
}
