import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      dbName: process.env.TENANT_DB_NAME || "kalp_tenant_surplus",
    };

    console.log("Attempting to connect to MongoDB...");
    cached.promise = mongoose.connect(MONGO_URI!, opts).then((mongoose) => {
      console.log("✅ MongoDB Connected Successfully");
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    console.error("❌ MongoDB Connection Error:", e);
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
