// ============================================================
// Pustaka gerakan — SKEMA FINAL (konten lengkap diisi oleh arsitek
// setelah sintesis riset; koder: jangan mengubah file ini).
//
// Skema tiap entri:
// {
//   id: string,
//   nama: string,                 // nama Indonesia (istilah umum dalam kurung bila perlu)
//   kategori: 'pemanasan' | 'kekuatan' | 'core' | 'jalan' | 'pendinginan',
//   target: string,               // otot/target singkat
//   equipment: 'kb' | 'tubuh' | 'treadmill',
//   cues: string[],               // 3–5 petunjuk teknik, bahasa sederhana
//   kneeSafe: boolean,            // aman dilakukan saat lutut sedang sensitif
//   kneeAlt: string | null,       // id gerakan pengganti saat mode lutut aktif (bila kneeSafe=false)
//   kneeNote: string | null,      // catatan lutut (mis. batas tekukan)
//   diastasisNote: string | null, // catatan perut/diastasis (mis. jaga napas, hindari doming)
// }
// ============================================================

export const EXERCISES = {
  contoh_kb_deadlift: {
    id: 'contoh_kb_deadlift',
    nama: 'Deadlift Kettlebell',
    kategori: 'kekuatan',
    target: 'Bokong, paha belakang, punggung',
    equipment: 'kb',
    cues: ['Kaki selebar bahu, KB di antara kaki', 'Dorong pinggul ke belakang, punggung lurus', 'Hembuskan napas saat berdiri'],
    kneeSafe: true,
    kneeAlt: null,
    kneeNote: null,
    diastasisNote: 'Hembuskan napas saat mengangkat; jangan tahan napas.',
  },
}

// Ambil gerakan dengan aman (fallback bila id tidak ditemukan)
export function getExercise(id) {
  return (
    EXERCISES[id] || {
      id,
      nama: id,
      kategori: 'kekuatan',
      target: '',
      equipment: 'tubuh',
      cues: [],
      kneeSafe: true,
      kneeAlt: null,
      kneeNote: null,
      diastasisNote: null,
    }
  )
}
