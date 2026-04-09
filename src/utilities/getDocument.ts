import { unstable_cache } from "next/cache";
import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument, type SupportedCollectionSlug } from "@/data/storefront/mongoPayload";
import { defaultLocale } from "@/i18n/config";
import type { AppCollectionsMap } from "@/types/cms";

type Collection = SupportedCollectionSlug;

async function getDocument(collection: Collection, slug: string, depth = 0) {
  void depth;
  const db = await getMongoDb();
  const candidates: (string | ObjectId)[] = [slug];

  if (ObjectId.isValid(slug)) {
    candidates.push(new ObjectId(slug));
  }

  const document = await db.collection(collection).findOne({
    $or: [{ _id: { $in: candidates } }, { id: { $in: candidates } }, { slug }],
  } as never);

  if (!document) {
    return null;
  }

  return normalizeCollectionDocument(collection as never, document as Record<string, unknown>, defaultLocale, 1);
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug
 */
export const getCachedDocument = (collection: Collection, slug: string): (() => Promise<AppCollectionsMap[Collection] | null>) =>
  unstable_cache(async () => (await getDocument(collection, slug)) as AppCollectionsMap[Collection] | null, [collection, slug], {
    tags: [`${collection}_${slug}`]
  });
