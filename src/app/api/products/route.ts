import { NextResponse } from "next/server";
import { getMongoDb } from "@/data/mongo/client";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = await getMongoDb();
    const products = await db.collection("products")
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ 
        docs: products.map(p => ({
            ...p,
            id: p._id.toString()
        }))
    }, { status: 200 });

  } catch (error) {
    console.error("Public Product API Error:", error);
    return NextResponse.json({ docs: [], message: "Internal server error" }, { status: 500 });
  }
}
