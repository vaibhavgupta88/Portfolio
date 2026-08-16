import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { env } from './env';

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', false);
    // Attempt standard connection with 3-second timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[Database] Connected successfully to MongoDB at ${env.MONGODB_URI}`);
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB (${env.MONGODB_URI}). Booting MongoDB Memory Server fallback...`);
    try {
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Successfully connected to In-Memory MongoDB at ${uri}`);
    } catch (memErr) {
      console.error('[Database] Failed to initialize fallback in-memory database:', memErr);
      process.exit(1);
    }
  }
}
