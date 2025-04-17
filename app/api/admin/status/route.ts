import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb+srv://absen_admin:vg3ML9hX0QxQfEeZ@cluster0.tqmtzm6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const dbName = "absensi-db";
const collectionName = "absensi-status";

async function connectToDatabase() {
  const client = new MongoClient(uri);
  try {
    console.log('Status - Mencoba koneksi ke MongoDB...');
    await client.connect();
    console.log('Status - Berhasil terhubung ke MongoDB');
    return { client, db: client.db(dbName) };
  } catch (error) {
    console.error('Status - Error koneksi MongoDB:', error);
    throw error;
  }
}

// GET: Dapatkan status absensi saat ini
export async function GET() {
  let client;
  try {
    console.log('Status - Mengambil status absensi...');
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    // Dapatkan status dari database, atau default ke tertutup jika belum ada
    const status = await db.collection(collectionName).findOne({ type: 'absensi' }) || { 
      type: 'absensi', 
      isOpen: false,
      updatedAt: new Date()
    };
    
    console.log('Status - Status absensi saat ini:', status);
    
    return NextResponse.json({ status });
    
  } catch (error) {
    console.error('Status - Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengambil status absensi' },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Status - Menutup koneksi MongoDB');
      await client.close();
    }
  }
}

// POST: Update status absensi
export async function POST(req: Request) {
  let client;
  try {
    const body = await req.json();
    console.log('Status - Menerima update status:', body);
    
    const { isOpen } = body;
    
    if (isOpen === undefined) {
      return NextResponse.json(
        { error: 'Parameter isOpen diperlukan' },
        { status: 400 }
      );
    }
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const updatedStatus = {
      type: 'absensi',
      isOpen: isOpen,
      updatedAt: new Date()
    };
    
    // Update status di database dengan upsert: true
    const result = await db.collection(collectionName).updateOne(
      { type: 'absensi' },
      { $set: updatedStatus },
      { upsert: true }
    );
    
    console.log('Status - Berhasil update status absensi:', result);
    
    return NextResponse.json({
      success: true,
      message: `Status absensi berhasil ${isOpen ? 'dibuka' : 'ditutup'}`,
      status: updatedStatus
    });
    
  } catch (error) {
    console.error('Status - Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat mengupdate status absensi' },
      { status: 500 }
    );
  } finally {
    if (client) {
      console.log('Status - Menutup koneksi MongoDB');
      await client.close();
    }
  }
} 