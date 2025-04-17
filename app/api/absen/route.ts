import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = 'public/data/absensi.json';

// Fungsi untuk membaca data
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      // Buat direktori jika belum ada
      const dir = path.dirname(DATA_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Buat file dengan array kosong
      fs.writeFileSync(DATA_FILE, '[]');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

// Fungsi untuk menulis data
function writeData(data: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data:', error);
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nama, whatsapp, grup } = data;

    if (!nama || !whatsapp || !grup) {
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    const timestamp = new Date().toLocaleString('id-ID');
    const newEntry = {
      timestamp,
      nama,
      whatsapp,
      grup
    };

    // Baca data yang ada
    const existingData = readData();
    
    // Tambahkan data baru
    existingData.push(newEntry);

    // Simpan kembali ke file
    if (writeData(existingData)) {
      return NextResponse.json({ success: true });
    } else {
      throw new Error('Gagal menyimpan data');
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 