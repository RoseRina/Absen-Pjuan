import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('DeleteAll - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('DeleteAll - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('DeleteAll - Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function DELETE(req: Request) {
  let client;
  try {
    console.log('DeleteAll - Memulai proses penghapusan data...', new Date().toISOString());
    console.log('DeleteAll - URI MongoDB tersedia:', !!uri);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('DeleteAll - Menghapus semua data di collection absensi...');
    // Hapus semua data di collection absensi
    const result = await db.collection('absensi').deleteMany({});
    console.log(`DeleteAll - Berhasil menghapus ${result.deletedCount} data`);

    return NextResponse.json({ 
      success: true,
      message: `Berhasil menghapus semua data absensi`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('DeleteAll - Error detail:', error);
    
    if (error instanceof Error) {
      console.error('DeleteAll - Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menghapus semua data absensi',
        detail: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('DeleteAll - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 