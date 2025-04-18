import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "absensi-db";
const collectionName = "absensi-status";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Status - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Status - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Status - Error koneksi MongoDB:', error);
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
    
    // Periksa status absensi
    const statusDoc = await db.collection('absensi-status').findOne({ type: 'absensi' });
    console.log('Check - Status absensi saat ini:', statusDoc);
    
    // Jika status absensi ditutup, beri tahu bahwa absensi sedang ditutup
    if (statusDoc && statusDoc.isOpen === false) {
      console.log('Check - Absensi ditutup');
      return NextResponse.json({
        exists: false,
        absensiClosed: true,
        message: statusDoc.message || 'Maaf, absensi sedang ditutup. Silakan coba lagi nanti.'
      });
    }

    // Cari absensi dengan nomor WhatsApp yang sama (tanpa batasan hari)
    const absensi = await db.collection('absensi').findOne({
      whatsapp
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
        message: `Anda sudah melakukan absensi pada ${absensiDate}. Untuk absen lagi, tunggu periode berikutnya. Per periode cukup absen 1x saja.`,
        absensi: {
          ...absensi,
          formatted_date: absensiDate
        }
      });
    }

    console.log('Check - Tidak ditemukan data absensi untuk nomor ini');
    return NextResponse.json({
      exists: false,
      message: 'Anda belum melakukan absensi',
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