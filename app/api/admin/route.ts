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

export async function GET() {
  let client;
  try {
    const { client: mongoClient, db } = await connectToDatabase();
    client = mongoClient;
    
    const entries = await db.collection('absensi').find({}).toArray();
    return NextResponse.json({ entries });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.close();
    }
  }
} 