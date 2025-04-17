import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = 'public/data/absensi.json';

// Fungsi untuk membaca data
function readData() {
  try {
    // Pastikan direktori ada
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      console.log('Membuat direktori:', dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    // Cek dan buat file jika belum ada
    if (!fs.existsSync(DATA_FILE)) {
      console.log('File tidak ditemukan, membuat file baru:', DATA_FILE);
      fs.writeFileSync(DATA_FILE, '[]', 'utf-8');
      return [];
    }

    console.log('Membaca file:', DATA_FILE);
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error detail pada readData:', error);
    throw new Error(`Gagal membaca data: ${error.message}`);
  }
}

// Fungsi untuk menulis data
function writeData(data: any[]) {
  try {
    // Pastikan direktori ada
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      console.log('Membuat direktori untuk writeData:', dir);
      fs.mkdirSync(dir, { recursive: true });
    }

    console.log('Menulis data ke file:', DATA_FILE);
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    
    // Verifikasi bahwa data berhasil ditulis
    const verifyData = fs.readFileSync(DATA_FILE, 'utf-8');
    JSON.parse(verifyData); // Memastikan data valid JSON
    
    return true;
  } catch (error) {
    console.error('Error detail pada writeData:', error);
    throw new Error(`Gagal menulis data: ${error.message}`);
  }
}

export async function POST(req: Request) {
  try {
    console.log('Menerima request POST absensi');
    const data = await req.json();
    const { nama, whatsapp, grup } = data;

    if (!nama || !whatsapp || !grup) {
      console.log('Data tidak lengkap:', { nama, whatsapp, grup });
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

    console.log('Membaca data existing...');
    const existingData = readData();
    
    console.log('Menambahkan entry baru:', newEntry);
    existingData.push(newEntry);

    console.log('Menyimpan data...');
    writeData(existingData);
    
    console.log('Data berhasil disimpan');
    return NextResponse.json({ 
      success: true,
      message: 'Data absensi berhasil disimpan'
    });

  } catch (error) {
    console.error('Error pada POST handler:', error);
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menyimpan absensi',
        detail: error.message 
      },
      { status: 500 }
    );
  }
} 