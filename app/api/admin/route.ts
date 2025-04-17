import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

// Pastikan gunakan connection string yang benar
const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
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
    console.log('Admin - Memulai pengambilan data...', new Date().toISOString());
    console.log('Admin - URI MongoDB tersedia:', !!uri);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('Admin - Mengambil data dari collection absensi...');
    const entries = await db.collection('absensi').find({}).toArray();
    console.log(`Admin - Berhasil mengambil ${entries.length} data:`, JSON.stringify(entries.slice(0, 2)));
    
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