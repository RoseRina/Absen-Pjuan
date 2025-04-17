import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function POST(req: Request) {
  let client;
  try {
    const body = await req.json();
    console.log('Menerima data absensi:', body);
    
    const { nama, whatsapp, grup } = body;

    if (!nama || !whatsapp || !grup) {
      console.log('Data tidak lengkap:', { nama, whatsapp, grup });
      return NextResponse.json(
        { error: 'Semua field harus diisi' },
        { status: 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI tidak ditemukan di environment variables');
      throw new Error('Konfigurasi database tidak ditemukan');
    }

    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const newEntry = {
      timestamp,
      nama,
      whatsapp,
      grup,
      created_at: new Date()
    };

    console.log('Mencoba menyimpan data:', newEntry);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('Menyimpan ke collection absensi...');
    const result = await db.collection('absensi').insertOne(newEntry);
    console.log('Data berhasil disimpan dengan ID:', result.insertedId);

    return NextResponse.json({ 
      success: true,
      message: 'Data absensi berhasil disimpan',
      data: {
        id: result.insertedId,
        ...newEntry
      }
    });

  } catch (error: any) {
    console.error('Error detail:', error);
    
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }

    console.log('MongoDB URI tersedia:', !!process.env.MONGODB_URI);
    
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
      console.log('Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 