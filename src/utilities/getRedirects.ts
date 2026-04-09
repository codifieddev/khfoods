import { unstable_cache } from "next/cache";
import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import type { Redirect } from "@/types/cms";

export async function getRedirects(depth = 1) {
  void depth;
  const db = await getMongoDb();
  const redirects = await db.collection("redirects").find({}).toArray();

  return redirects.map((redirect) => ({
    ...(redirect as Record<string, unknown>),
    id:
      typeof (redirect as { id?: unknown }).id === "string"
        ? (redirect as unknown as { id: string }).id
        : redirect._id instanceof ObjectId
          ? redirect._id.toString()
          : typeof redirect._id === "string"
            ? redirect._id
            : "",
  })) as Redirect[];
}

/**
 * Returns a unstable_cache function mapped with the cache tag for 'redirects'.
 *
 * Cache all redirects together to avoid multiple fetches.
 */
export const getCachedRedirects = () =>
  unstable_cache(async () => getRedirects(), ["redirects"], {
    tags: ["redirects"]
  });
