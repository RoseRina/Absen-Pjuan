import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const DATA_FILE = 'public/data/absensi.json';

function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return [];
  }
}

export async function GET() {
  try {
    const entries = readData();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
} 