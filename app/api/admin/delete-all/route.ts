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

export async function DELETE(req: Request) {
  let client;
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    // Hapus semua data di collection absensi
    const result = await db.collection('absensi').deleteMany({});

    return NextResponse.json({ 
      success: true,
      message: `Berhasil menghapus semua data absensi`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Error deleting all entries:', error);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menghapus semua data absensi',
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