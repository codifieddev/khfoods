import "server-only";

import { MongoClient } from "mongodb";

const databaseUri = process.env.DATABASE_URI ?? process.env.MONGODB_URI;

const globalForMongo = globalThis as typeof globalThis & {
  __khfoodsMongoClientPromise?: Promise<MongoClient>;
};

export const mongoClientPromise =
  globalForMongo.__khfoodsMongoClientPromise ??
  (databaseUri ? new MongoClient(databaseUri).connect() : undefined);

if (process.env.NODE_ENV !== "production" && mongoClientPromise) {
  globalForMongo.__khfoodsMongoClientPromise = mongoClientPromise;
}

export const getMongoDb = async () => {
  if (!mongoClientPromise) {
    console.error("MongoDB Client Promise is missing!");
    throw new Error("DATABASE_URI or MONGODB_URI must be defined to connect to MongoDB.");
  }

  try {
    const client = await mongoClientPromise;
    const dbName = process.env.MONGODB_DB_NAME || "khfoods";
    console.log(`[DB] Using database name: ${dbName}`);
    
    const db = client.db(dbName);
    const ping = await db.command({ ping: 1 });
    console.log("[DB] MongoDB connected and pinged successfully:", ping);
    
    return db;
  } catch (error: any) {
    console.error("[DB] Failed to connect or ping MongoDB:", error.message);
    throw error;
  }
};
