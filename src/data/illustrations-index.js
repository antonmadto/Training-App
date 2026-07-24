// Gabungan semua ilustrasi gerakan → getIllustration(id)
import { ILLUSTRATIONS_BASE } from './illustrations.jsx'
import { ILLUSTRATIONS_A } from './illustrations-a.jsx'
import { ILLUSTRATIONS_B } from './illustrations-b.jsx'

const ALL = { ...ILLUSTRATIONS_BASE, ...ILLUSTRATIONS_A, ...ILLUSTRATIONS_B }

export function getIllustration(id) {
  return ALL[id] || null
}

export function hasIllustration(id) {
  return !!ALL[id]
}
