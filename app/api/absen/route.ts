import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Absen - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Absen - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Absen - Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  let client;
  try {
    const body = await req.json();
    console.log('Absen - Menerima data absensi:', body);
    
    const { nama, whatsapp, grup } = body;

    if (!nama || !whatsapp || !grup) {
      console.log('Absen - Data tidak lengkap:', { nama, whatsapp, grup });
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    console.log('Absen - URI MongoDB tersedia:', !!uri);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;

    // Cek apakah nomor WhatsApp sudah terdaftar hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    console.log('Absen - Memeriksa data duplikat untuk WhatsApp:', whatsapp);
    
    const existingEntry = await db.collection('absensi').findOne({
      whatsapp,
      created_at: { $gte: today }
    });

    if (existingEntry) {
      console.log('Absen - Ditemukan entri duplikat:', existingEntry);
      
      const absensiDate = new Date(existingEntry.created_at).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return NextResponse.json(
        { 
          error: `Nomor WhatsApp ini sudah melakukan absensi pada ${absensiDate}. Cukup sekali absen saja.`,
          duplicate: true,
          existingEntry
        },
        { status: 409 } // 409 Conflict - resource sudah ada
      );
    }

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const newEntry = {
      timestamp,
      nama,
      whatsapp,
      grup,
      created_at: new Date()
    };

    console.log('Absen - Mencoba menyimpan data:', newEntry);
    
    console.log('Absen - Menyimpan ke collection absensi...');
    const result = await db.collection('absensi').insertOne(newEntry);
    console.log('Absen - Data berhasil disimpan dengan ID:', result.insertedId);

    return NextResponse.json({ 
      success: true,
      message: 'Data absensi berhasil disimpan',
      data: {
        id: result.insertedId,
        ...newEntry
      }
    });

  } catch (error: any) {
    console.error('Absen - Error detail:', error);
    
    if (error.stack) {
      console.error('Absen - Stack trace:', error.stack);
    }

    console.log('Absen - MongoDB URI tersedia:', !!uri);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menyimpan absensi',
        detail: error.message,
        type: error.name
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Absen - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 