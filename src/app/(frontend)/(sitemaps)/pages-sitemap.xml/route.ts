import { unstable_cache } from "next/cache";
import { getServerSideSitemap } from "next-sitemap";
import { getMongoDb } from "@/data/mongo/client";

const getPagesSitemap = unstable_cache(
  async () => {
    const db = await getMongoDb();
    const SITE_URL =
      process.env.NEXT_PUBLIC_SERVER_URL ||
      process.env.VERCEL_PROJECT_PRODUCTION_URL ||
      "https://example.com";

    const results = await db
      .collection("pages")
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

    const defaultSitemap = [
      {
        loc: `${SITE_URL}/search`,
        lastmod: dateFallback
      },
      {
        loc: `${SITE_URL}/posts`,
        lastmod: dateFallback
      },
    ];

    const sitemap = results
      .filter((page) => Boolean(page?.slug))
      .map((page) => {
        return {
          loc: page?.slug === "home" ? `${SITE_URL}/` : `${SITE_URL}/${page?.slug}`,
          lastmod: page.updatedAt || dateFallback,
        };
      });

    return [...defaultSitemap, ...sitemap];
  },
  ["pages-sitemap"],
  {
    tags: ["pages-sitemap"]
  },
);

export async function GET() {
  const sitemap = await getPagesSitemap();

  return getServerSideSitemap(sitemap);
}
