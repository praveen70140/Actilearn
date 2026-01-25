import mongoose from 'mongoose';

// Check for MongoDB URI
// if (!process.env.MONGODB_URI) {
//   throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
// }

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/actilearn';

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections from growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Establishes a connection to the MongoDB database using Mongoose.
 * It uses a cached connection in development to avoid creating multiple connections.
 *
 * IMPORTANT: This function should be awaited before any Mongoose database
 * operations are performed.
 *
 * Example:
 * import { connectDB } from '@/lib/mongoose';
 * import MyModel from '@/db/models/MyModel';
 *
 * export async function GET(request: Request) {
 *   await connectDB();
 *   const data = await MyModel.find({});
 *   return Response.json(data);
 * }
 */
async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;
