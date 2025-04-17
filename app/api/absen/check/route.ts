import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Check - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Check - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Check - Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function GET(req: Request) {
  let client;
  try {
    console.log('Check - Memulai pengecekan absensi...', new Date().toISOString());
    
    const { searchParams } = new URL(req.url);
    const whatsapp = searchParams.get('whatsapp');

    if (!whatsapp) {
      console.log('Check - Parameter whatsapp tidak ditemukan');
      return NextResponse.json(
        { error: 'Parameter whatsapp diperlukan' },
        { status: 400 }
      );
    }

    console.log('Check - Memeriksa nomor WhatsApp:', whatsapp);
    console.log('Check - URI MongoDB tersedia:', !!process.env.MONGODB_URI);

    if (!process.env.MONGODB_URI) {
      throw new Error('Konfigurasi database tidak ditemukan');
    }

    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;

    // Mendapatkan tanggal hari ini, reset ke jam 00:00:00
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Check - Mencari data absensi untuk hari ini:', today.toISOString());

    // Cari absensi dengan nomor WhatsApp yang sama yang dibuat hari ini
    const absensi = await db.collection('absensi').findOne({
      whatsapp,
      created_at: { $gte: today }
    });

    if (absensi) {
      console.log('Check - Data absensi ditemukan:', absensi);
      const absensiDate = new Date(absensi.created_at).toLocaleString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
      });

      return NextResponse.json({
        exists: true,
        message: `Anda sudah melakukan absensi hari ini pada ${absensiDate}`,
        absensi: {
          ...absensi,
          formatted_date: absensiDate
        }
      });
    }

    console.log('Check - Tidak ditemukan data absensi untuk hari ini');
    return NextResponse.json({
      exists: false,
      message: 'Anda belum melakukan absensi hari ini',
      absensi: null
    });

  } catch (error: any) {
    console.error('Check - Error detail:', error);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat memeriksa absensi',
        detail: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Check - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 