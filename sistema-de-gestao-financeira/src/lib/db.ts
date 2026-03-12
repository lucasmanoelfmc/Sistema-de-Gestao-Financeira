import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Defina a variável MONGODB_URI no ambiente.');
}

let cached = (global as typeof globalThis & {
  mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}).mongoose;

if (!cached) {
  cached = (global as typeof globalThis & {
    mongoose?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
  }).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
