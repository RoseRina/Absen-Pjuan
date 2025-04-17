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
    console.log('Admin - URI MongoDB:', uri);
    
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    console.log('Admin - Mengambil data dari collection absensi...');
    const entries = await db.collection('absensi').find({}).toArray();
    console.log(`Admin - Berhasil mengambil ${entries.length} data:`, JSON.stringify(entries.slice(0, 2)));
    
    const response = NextResponse.json({ entries });

    // Tambahkan header CORS
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;
  } catch (error) {
    console.error('Admin - Error detail:', error);
    
    if (error instanceof Error) {
      console.error('Admin - Stack trace:', error.stack);
    }
    
    const errorResponse = NextResponse.json(
      { 
        error: 'Terjadi kesalahan pada server',
        detail: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );

    // Tambahkan header CORS ke response error
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  } finally {
    if (client) {
      console.log('Admin - Menutup koneksi MongoDB');
      await client.close();
    }
  }
}

// Handle preflight requests
export async function OPTIONS() {
  const response = new NextResponse(null, {
    status: 200,
  });
  
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
} 