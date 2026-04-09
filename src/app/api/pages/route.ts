import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";
import { defaultLocale, type Locale } from "@/i18n/config";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Support both Payload format (?where[slug][equals]=home) and direct (?slug=home)
    const slug = searchParams.get("where[slug][equals]") || searchParams.get("slug");
    const locale = (searchParams.get("locale") as Locale) || defaultLocale;
    const depth = parseInt(searchParams.get("depth") || "2", 10);

    const db = await getMongoDb();
    
    const query: any = { _status: "published" };
    if (slug) {
      query.slug = slug;
    }

    const rawPages = await db
      .collection("pages")
      .find(query)
      .toArray();

    if (rawPages.length === 0) {
      console.log(`[API] No pages found matching query: ${JSON.stringify(query)}`);
      return NextResponse.json({ docs: [], totalDocs: 0 }, { status: 200 });
    }

    const pages = await Promise.all(
      rawPages.map(async (page) => {
        try {
          return await normalizeCollectionDocument("pages", page as any, locale, depth);
        } catch (normError: any) {
          console.error(`[API] Normalization failed for page ${page.slug || page._id}:`, normError.message);
          return null;
        }
      })
    );

    const validPages = pages.filter(Boolean);

    return NextResponse.json({
      docs: validPages,
      totalDocs: validPages.length,
    }, { status: 200 });

  } catch (error: any) {
    console.error("[API ERROR] Pages fetch failed:", error.message);
    return NextResponse.json(
      { 
        error: "Internal server error", 
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        docs: [] 
      },
      { status: 500 }
    );
  }
}
