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
    
    // Fetch customers, extracting only necessary non-sensitive fields
    const customers = await db.collection("users") // Or "customers", depending on storefront logic
      .find({})
      .project({ 
          email: 1, 
          name: 1, 
          roles: 1, 
          createdAt: 1, 
          updatedAt: 1,
          orders: 1 
      })
      .sort({ createdAt: -1 })
      .toArray();

    // If 'users' collection is used for customers, you might filter by role: ["customer"] etc.

    return NextResponse.json({ 
        docs: customers.map(c => ({
            ...c,
            id: c._id.toString()
        }))
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Customers List Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
