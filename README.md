# Aplikasi Absensi Pejuang Cuan

Aplikasi web untuk mengelola absensi peserta Pejuang Cuan. Dibangun menggunakan Next.js 14 dan MongoDB.

## Fitur

- Form absensi dengan validasi
- Dashboard admin untuk melihat dan mengelola data absensi
- Pengelompokan peserta berdasarkan grup ([1] Pejuang Cuan, [2] Pejuang Cuan, atau keduanya)
- Validasi nomor WhatsApp untuk mencegah duplikasi absensi dalam satu hari
- Export nomor WhatsApp peserta untuk broadcast
- Pengelolaan data (hapus data terpilih atau semua data)

## Teknologi yang Digunakan

- Next.js 14 (App Router)
- MongoDB Atlas
- Tailwind CSS
- TypeScript

## Persyaratan Sistem

- Node.js 18.17 atau yang lebih baru
- MongoDB Atlas account
- NPM atau Yarn

## Instalasi

1. Clone repository
```bash
git clone https://github.com/RoseRina/Absen-Pjuan.git
cd Absen-Pjuan
```

2. Install dependencies
```bash
npm install
# atau
yarn install
```

3. Konfigurasi environment variables
Buat file `.env` di root project dan isi dengan:
```env
MONGODB_URI=mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
```

4. Jalankan aplikasi dalam mode development
```bash
npm run dev
# atau
yarn dev
```

5. Buka browser dan akses `http://localhost:3000`

## Deployment

Aplikasi ini dapat di-deploy ke Vercel dengan langkah berikut:

1. Push kode ke GitHub repository
2. Hubungkan repository dengan Vercel
3. Tambahkan environment variable `MONGODB_URI` di dashboard Vercel
4. Deploy aplikasi

## Struktur Project

```
Absen-Pjuan/
├── app/
│   ├── api/            # API endpoints
│   ├── admin/          # Admin dashboard
│   └── components/     # React components
├── public/            # Static files
├── styles/           # CSS files
├── .env             # Environment variables
└── package.json     # Project dependencies
```

## API Endpoints

- `POST /api/absen` - Submit absensi baru
- `GET /api/admin` - Ambil semua data absensi
- `DELETE /api/admin/delete` - Hapus data terpilih
- `DELETE /api/admin/delete-all` - Hapus semua data
- `GET /api/absen/check` - Cek status absensi

## Kontribusi

Jika Anda ingin berkontribusi pada project ini:

1. Fork repository
2. Buat branch baru (`git checkout -b fitur-baru`)
3. Commit perubahan (`git commit -am 'Menambah fitur baru'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request

## Lisensi

Project ini dilisensikan di bawah [MIT License](LICENSE). 