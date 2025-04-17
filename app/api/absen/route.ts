import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://[your-connection-string]";
const dbName = "absensi-db";

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db(dbName);
    return { client, db };
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Tidak dapat terhubung ke database');
  }
}

export async function POST(req: Request) {
  let client;
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

    // Koneksi ke MongoDB
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('Menyimpan data ke MongoDB...');
    await db.collection('absensi').insertOne(newEntry);
    
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
  } finally {
    if (client) {
      await client.close();
    }
  }
} 