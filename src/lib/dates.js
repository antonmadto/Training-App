// Utilitas tanggal — semua berbasis zona waktu LOKAL, format ISO 'YYYY-MM-DD'

export const WEEKDAYS_ID = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const MONTHS_ID = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const MONTHS_SHORT_ID = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
]

const pad2 = (n) => String(n).padStart(2, '0')

// Ubah objek Date (lokal) jadi string ISO 'YYYY-MM-DD'
export function toISO(date) {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

// Parse 'YYYY-MM-DD' jadi Date lokal (jam 00:00 lokal)
function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Tanggal hari ini dalam zona waktu LOKAL (bukan UTC seperti toISOString())
export function todayISO() {
  return toISO(new Date())
}

export function addDays(iso, n) {
  const d = parseISO(iso)
  d.setDate(d.getDate() + n)
  return toISO(d)
}

// Selisih hari (b - a)
export function diffDays(aIso, bIso) {
  const a = parseISO(aIso)
  const b = parseISO(bIso)
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((b.getTime() - a.getTime()) / msPerDay)
}

// 0=Senin ... 6=Minggu (JS getDay(): 0=Minggu -> konversi)
export function weekdayIndex(iso) {
  const d = parseISO(iso)
  return (d.getDay() + 6) % 7
}

export function formatLong(iso) {
  const d = parseISO(iso)
  try {
    const s = new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(d)
    // Kapitalisasi awal kata jaga-jaga (Intl id-ID biasanya sudah benar)
    return s
  } catch {
    const nama = WEEKDAYS_ID[weekdayIndex(iso)]
    return `${nama}, ${d.getDate()} ${MONTHS_ID[d.getMonth()]} ${d.getFullYear()}`
  }
}

export function formatShort(iso) {
  const d = parseISO(iso)
  try {
    return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(d)
  } catch {
    return `${d.getDate()} ${MONTHS_SHORT_ID[d.getMonth()]}`
  }
}
