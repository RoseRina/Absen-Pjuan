import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Admin - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Admin - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Admin - Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function GET() {
  let client;
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI tidak ditemukan di environment variables');
      return NextResponse.json(
        { error: 'Konfigurasi database tidak ditemukan' },
        { status: 500 }
      );
    }

    console.log('Admin - Memulai pengambilan data...');
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('Admin - Mengambil data dari collection absensi...');
    const entries = await db.collection('absensi').find({}).toArray();
    console.log(`Admin - Berhasil mengambil ${entries.length} data`);
    
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Admin - Error detail:', error);
    
    if (error instanceof Error) {
      console.error('Admin - Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Admin - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 