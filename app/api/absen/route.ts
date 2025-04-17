import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

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
    const absenEntry = `${timestamp} | ${nama} | ${whatsapp} | ${grup}\n`;
    
    const filePath = path.join(process.cwd(), 'data', 'absensi.txt');
    
    // Buat direktori data jika belum ada
    const dirPath = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Append data ke file
    fs.appendFileSync(filePath, absenEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 