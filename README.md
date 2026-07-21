# BundaFit — 30 Menit untuk Bunda

Aplikasi pelatih pribadi (PWA) yang dirancang khusus untuk satu orang istimewa:
seorang Bunda 37 tahun, ibu 3 anak (terakhir lahir April 2025), masih menyusui,
dengan riwayat cedera lutut (dislokasi patella 2012, kambuh Juni 2026), alat
seadanya di rumah — treadmill jalan + kettlebell 12/16/24 kg — dan waktu yang
sangat terbatas: **30 menit sehari, setiap hari**.

## Fitur

- **Sesi harian 30 menit** — 3 hari kekuatan kettlebell, 3 hari jalan treadmill
  (+ core/mobilitas), 1 hari pemulihan. Ada **Sesi Kilat 10 menit** untuk hari
  yang kacau, karena konsistensi mengalahkan intensitas.
- **Ramah lutut** — setiap pagi aplikasi menanyakan kondisi lutut; saat nyeri,
  gerakan berisiko otomatis ditukar versi aman patella (Mode Lutut Aman).
- **Sadar siklus haid** — catat tanggal mulai haid; aplikasi menghitung fase
  (haid / folikular / masa subur / luteal), menyesuaikan saran intensitas, dan
  mengingatkan menjaga lutut saat sendi lebih lentur di masa subur.
- **Aman pasca melahirkan** — core dimulai dari latihan ramah diastasis recti
  ("perut gantung"), dengan panduan napas di tiap gerakan.
- **Ramah ibu menyusui** — target penurunan berat lembut (0,25–0,5 kg/minggu),
  pengingat protein & cairan, tanpa diet ekstrem.
- **Progres yang menyemangati** — grafik berat & lingkar pinggang, hari
  beruntun (streak), dan pencapaian.
- **Privasi penuh** — semua data tersimpan di HP (localStorage), tanpa akun,
  tanpa server, bisa dipakai offline (PWA).

## Menjalankan

```bash
npm install
npm run dev      # buka http://localhost:5173
npm run build    # hasil produksi di dist/
node scripts/test-lib.mjs   # uji logika (siklus, program, streak)
```

## Memasang di HP

1. Deploy folder `dist/` ke hosting statis mana pun — repo ini sudah berisi
   workflow GitHub Pages (`.github/workflows/deploy.yml`): aktifkan
   **Settings → Pages → Source: GitHub Actions**, lalu push ke `main`.
2. Buka alamatnya di browser HP (Chrome/Safari).
3. Pilih **Add to Home Screen / Tambahkan ke Layar Utama** — BundaFit akan
   terpasang seperti aplikasi biasa dan bisa dibuka tanpa internet.

## Struktur

```
src/
  App.jsx               kerangka + navigasi
  styles/app.css        sistem desain (krem–terakota, serif hangat)
  lib/                  logika murni: tanggal, penyimpanan, siklus, mesin program
  data/                 pustaka gerakan & program 12 minggu (Bahasa Indonesia)
  components/           layar: Hari Ini, Sesi, Program, Siklus, Bunda
docs/
  ARCHITECTURE.md       kontrak arsitektur
  PROGRAM.md            dasar ilmiah & desain program latihan
```

> ⚠️ Aplikasi ini bukan pengganti nasihat medis. Untuk "perut gantung" yang
> tidak membaik atau lutut yang sering nyeri, temui fisioterapis (idealnya
> fisioterapis kesehatan wanita).
