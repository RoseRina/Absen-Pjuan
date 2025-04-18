# Sistem Absensi Online

Aplikasi sistem absensi online berbasis web yang dibangun menggunakan Next.js 14, TypeScript, dan MongoDB.

## Teknologi yang Digunakan

- Next.js 14
- TypeScript
- MongoDB
- Tailwind CSS
- React Icons
- Axios

## Prasyarat

- Node.js versi 18 atau lebih tinggi
- MongoDB Atlas account atau MongoDB lokal
- NPM atau Yarn

## Instalasi

1. Clone repositori ini
```bash
git clone [url-repositori]
cd absen-pjuan
```

2. Install dependensi
```bash
npm install
# atau
yarn install
```

3. Salin file `.env.example` ke `.env.local` dan isi dengan konfigurasi yang sesuai
```bash
MONGODB_URI=your_mongodb_connection_string
```

4. Jalankan aplikasi dalam mode development
```bash
npm run dev
# atau
yarn dev
```

5. Buka [http://localhost:3000](http://localhost:3000) di browser Anda

## Fitur

- ✅ Sistem absensi real-time
- 🔐 Autentikasi admin
- 📊 Dashboard admin
- 📱 Responsive design
- 🌐 API endpoints untuk manajemen absensi
- 🔄 Status absensi yang dapat dikonfigurasi (buka/tutup)

## Struktur API

### Admin Status API
- `GET /api/admin/status` - Mendapatkan status absensi saat ini
- `POST /api/admin/status` - Mengubah status absensi (buka/tutup)

## Deployment

Aplikasi ini dikonfigurasi untuk deployment di Vercel. Untuk melakukan deployment:

1. Push kode ke repositori GitHub
2. Hubungkan repositori dengan Vercel
3. Vercel akan otomatis melakukan build dan deployment

## Environment Variables

Pastikan untuk mengatur environment variables berikut di Vercel:

- `MONGODB_URI`: URI koneksi MongoDB

## Lisensi

[MIT License](LICENSE) 