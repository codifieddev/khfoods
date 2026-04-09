import "server-only";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/data/mongo/client";

export type EntitySlug = 
  | "products" 
  | "categories" 
  | "orders" 
  | "attributes" 
  | "attributeSets" 
  | "pages" 
  | "media";

export interface BaseEntity {
  id: string;
  _id?: ObjectId;
  createdAt: string;
  updatedAt: string;
}

export class AdminRepository {
  static async find<T extends BaseEntity>(
    slug: EntitySlug, 
    query: any = {}, 
    options: { sort?: any; limit?: number; skip?: number } = {}
  ): Promise<T[]> {
    const db = await getMongoDb();
    const cursor = db.collection(slug).find(query);
    
    if (options.sort) cursor.sort(options.sort);
    if (options.skip) cursor.skip(options.skip);
    if (options.limit) cursor.limit(options.limit);
    
    const results = await cursor.toArray();
    return results.map(doc => ({
      ...doc,
      id: doc.id || doc._id.toString(),
    })) as unknown as T[];
  }

  static async findById<T extends BaseEntity>(slug: EntitySlug, id: string): Promise<T | null> {
    const db = await getMongoDb();
    const query = ObjectId.isValid(id) 
      ? { $or: [{ _id: new ObjectId(id) }, { id }] } 
      : { id };
      
    const doc = await db.collection(slug).findOne(query);
    if (!doc) return null;
    
    return {
      ...doc,
      id: doc.id || doc._id.toString(),
    } as unknown as T;
  }

  static async create<T extends BaseEntity>(slug: EntitySlug, data: any): Promise<T> {
    const db = await getMongoDb();
    const now = new Date().toISOString();
    const payload = {
      ...data,
      createdAt: now,
      updatedAt: now,
    };
    
    const result = await db.collection(slug).insertOne(payload);
    return {
      ...payload,
      id: result.insertedId.toString(),
      _id: result.insertedId,
    } as unknown as T;
  }

  static async update(slug: EntitySlug, id: string, data: any): Promise<boolean> {
    const db = await getMongoDb();
    const now = new Date().toISOString();
    const query = ObjectId.isValid(id) 
      ? { $or: [{ _id: new ObjectId(id) }, { id }] } 
      : { id };

    const result = await db.collection(slug).updateOne(
      query,
      { $set: { ...data, updatedAt: now } }
    );
    
    return result.modifiedCount > 0;
  }

  static async delete(slug: EntitySlug, id: string): Promise<boolean> {
    const db = await getMongoDb();
    const query = ObjectId.isValid(id) 
      ? { $or: [{ _id: new ObjectId(id) }, { id }] } 
      : { id };

    const result = await db.collection(slug).deleteOne(query);
    return result.deletedCount > 0;
  }

  static async count(slug: EntitySlug, query: any = {}): Promise<number> {
    const db = await getMongoDb();
    return await db.collection(slug).countDocuments(query);
  }
}
