import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    // Auth Check
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getMongoDb();
    
    // Fetch both collections in parallel
    const [categories, attributes] = await Promise.all([
      db.collection("productCategories").find().toArray(),
      db.collection("attributes").find().toArray()
    ]);

    return NextResponse.json({ 
        categories: categories.map(c => ({ ...c, id: c._id.toString() })),
        attributes: attributes.map(a => ({ ...a, id: a._id.toString() }))
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Taxonomy List Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
