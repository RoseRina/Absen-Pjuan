import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "absensi-db";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Delete - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Delete - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Delete - Error koneksi MongoDB:', error);
    throw error;
  }
}

export async function DELETE(req: Request) {
  let client;
  try {
    console.log('Delete - Memulai proses penghapusan data...', new Date().toISOString());
    console.log('Delete - URI MongoDB tersedia:', !!uri);
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Parameter ID diperlukan' },
        { status: 400 }
      );
    }
    
    console.log('Delete - Menghapus data dengan ID:', id);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const result = await db.collection('absensi').deleteOne({
      _id: new ObjectId(id)
    });
    
    console.log(`Delete - Hasil penghapusan:`, result);
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Data tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Data berhasil dihapus',
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete - Error detail:', error);
    
    if (error instanceof Error) {
      console.error('Delete - Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menghapus data',
        detail: error.message
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Delete - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 