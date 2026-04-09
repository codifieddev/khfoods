import { unstable_cache } from "next/cache";
import { getServerSideSitemap } from "next-sitemap";
import { getMongoDb } from "@/data/mongo/client";

const getPostsSitemap = unstable_cache(
  async () => {
    const db = await getMongoDb();
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      "https://example.com";

    const results = await db
      .collection("posts")
      .find(
        {
          _status: "published",
        },
        {
          projection: {
            slug: 1,
            updatedAt: 1,
          },
        },
      )
      .limit(1000)
      .toArray();

    const dateFallback = new Date().toISOString();

    const sitemap = results
      .filter((post) => Boolean(post?.slug))
      .map((post) => ({
        loc: `${SITE_URL}/posts/${post?.slug}`,
        lastmod: post.updatedAt || dateFallback,
      }));

    return sitemap;
  },
  ["posts-sitemap"],
  {
    tags: ["posts-sitemap"]
  },
);

export async function GET() {
  const sitemap = await getPostsSitemap();

  return getServerSideSitemap(sitemap);
}
