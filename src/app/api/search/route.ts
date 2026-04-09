import { NextResponse } from "next/server";

import { getMongoDb } from "@/data/mongo/client";
import { normalizeCollectionDocument } from "@/data/storefront/mongoPayload";
import { type Locale } from "@/i18n/config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() ?? "";
    const locale = (searchParams.get("locale") ?? "en") as Locale;

    if (!query) {
      return NextResponse.json({ categories: [], products: [] }, { status: 200 });
    }

    const db = await getMongoDb();
    const searchRegex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const [rawProducts, rawCategories] = await Promise.all([
      db
        .collection("products")
        .find({
          $or: [{ slug: searchRegex }, { "title.en": searchRegex }, { "title.zh": searchRegex }],
        })
        .limit(5)
        .toArray(),
      db
        .collection("productCategories")
        .find({
          $or: [{ slug: searchRegex }, { "title.en": searchRegex }, { "title.zh": searchRegex }],
        })
        .limit(5)
        .toArray(),
    ]);

    const [products, categories] = await Promise.all([
      Promise.all(
        rawProducts.map((product) => normalizeCollectionDocument("products", product as Record<string, unknown>, locale, 2)),
      ),
      Promise.all(
        rawCategories.map((category) =>
          normalizeCollectionDocument("productCategories", category as Record<string, unknown>, locale, 1),
        ),
      ),
    ]);

    return NextResponse.json(
      {
        categories: categories.filter(Boolean),
        products: products.filter(Boolean),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Storefront search results error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
