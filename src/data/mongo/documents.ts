import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";

import type { Document } from "mongodb";

export const buildMongoIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

export const findMongoDocumentById = async <T extends Document = Document>(
  collectionName: string,
  id: string,
) => {
  const db = await getMongoDb();
  const collection = db.collection<T>(collectionName);

  for (const candidate of buildMongoIdCandidates(id)) {
    const document = await collection.findOne({
      _id: candidate as T["_id"],
    });

    if (document) {
      return document;
    }
  }

  return null;
};

export const updateMongoDocumentById = async <T extends Document = Document>(
  collectionName: string,
  id: string,
  data: Record<string, unknown>,
) => {
  const db = await getMongoDb();
  const collection = db.collection<T>(collectionName);

  for (const candidate of buildMongoIdCandidates(id)) {
    const result = await collection.findOneAndUpdate(
      {
        _id: candidate as T["_id"],
      },
      {
        $set: data as Partial<T>,
      },
      {
        returnDocument: "after",
      },
    );

    if (result) {
      return result;
    }
  }

  return null;
};
