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
    
    // Fetch posts
    const posts = await db.collection("posts")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
        docs: posts.map(p => ({
            ...p,
            id: p._id.toString()
        }))
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Posts List Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
