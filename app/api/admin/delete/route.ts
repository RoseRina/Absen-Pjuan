import { NextResponse } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

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
    const body = await req.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Tidak ada ID yang valid untuk dihapus' },
        { status: 400 }
      );
    }

    // Konversi string ID ke ObjectId
    const objectIds = ids.map(id => new ObjectId(id));

    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const result = await db.collection('absensi').deleteMany({
      _id: { $in: objectIds }
    });

    return NextResponse.json({ 
      success: true,
      message: `Berhasil menghapus ${result.deletedCount} data absensi`,
      deletedCount: result.deletedCount
    });
  } catch (error: any) {
    console.error('Error deleting entries:', error);
    
    return NextResponse.json(
      { 
        error: 'Terjadi kesalahan saat menghapus data absensi',
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