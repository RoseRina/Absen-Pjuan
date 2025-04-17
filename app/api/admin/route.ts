import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'absensi.txt');
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ entries: [] });
    }

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const entries = fileContent.split('\n').filter(line => line.trim() !== '');

    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 