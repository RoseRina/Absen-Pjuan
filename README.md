# Sistem Absensi Pejuang Cuan

Aplikasi web untuk sistem absensi anggota grup Pejuang Cuan.

## Fitur

- Form absensi dengan input:
  - Nama
  - Nomor WhatsApp
  - Pilihan Grup (Pejuang Cuan / Pejuang Cuan 2 / Keduanya)
- Dashboard admin untuk melihat data absensi
- Penyimpanan data menggunakan file txt
- Responsive design untuk desktop dan mobile

## Teknologi yang Digunakan

- Next.js 13+ dengan App Router
- TypeScript
- Tailwind CSS
- Vercel untuk deployment

## Cara Menjalankan Proyek

1. Clone repository
```bash
git clone https://github.com/RoseRina/Absen-Pjuan.git
cd Absen-Pjuan
```

2. Install dependencies
```bash
npm install
```

3. Jalankan development server
```bash
npm run dev
```

4. Buka [http://localhost:3000](http://localhost:3000) di browser

## Deployment

Proyek ini dapat di-deploy ke Vercel dengan mudah:

1. Fork repository ini ke akun GitHub Anda
2. Buat akun di [Vercel](https://vercel.com)
3. Import repository dari GitHub ke Vercel
4. Vercel akan otomatis men-deploy aplikasi

## Struktur Direktori

```
.
├── app/
│   ├── api/
│   │   ├── absen/
│   │   └── admin/
│   ├── admin/
│   ├── components/
│   └── page.tsx
├── data/
├── public/
└── README.md
```

## Lisensi

MIT License 