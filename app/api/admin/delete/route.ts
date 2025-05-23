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
    
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      console.log('Delete - Tidak ada ID valid yang diberikan');
      return NextResponse.json(
        { error: 'Tidak ada ID yang valid untuk dihapus' },
        { status: 400 }
      );
    }

    console.log('Delete - Menghapus data dengan IDs:', ids);
    
    // Konversi string ID ke ObjectId
    const objectIds = ids.map(id => new ObjectId(id));

    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const result = await db.collection('absensi').deleteMany({
      _id: { $in: objectIds }
    });
    
    console.log(`Delete - Berhasil menghapus ${result.deletedCount} data`);

    return NextResponse.json({ 
      success: true,
      message: `Berhasil menghapus ${result.deletedCount} data absensi`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Delete - Error detail:', error);
    
    if (error instanceof Error) {
      console.error('Delete - Stack trace:', error.stack);
    }
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menghapus data absensi',
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