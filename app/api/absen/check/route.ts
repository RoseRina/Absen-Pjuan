import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  let client;
  try {
    const { searchParams } = new URL(req.url);
    const whatsapp = searchParams.get('whatsapp');

    if (!whatsapp) {
      return NextResponse.json(
        { error: 'Parameter whatsapp diperlukan' },
        { status: 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      throw new Error('Konfigurasi database tidak ditemukan');
    }

    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;

    // Mendapatkan tanggal hari ini, reset ke jam 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cari absensi dengan nomor WhatsApp yang sama yang dibuat hari ini
    const absensi = await db.collection('absensi').findOne({
      whatsapp,
      created_at: { $gte: today }
    });

    return NextResponse.json({
      exists: !!absensi,
      absensi: absensi ? absensi : null
    });

  } catch (error: any) {
    console.error('Error detail:', error);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat memeriksa absensi',
        detail: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 