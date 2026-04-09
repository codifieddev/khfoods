import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export const dynamic = "force-dynamic";

// GET current settings
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
    
    // Single document with _id: "site_settings"
    const settings = await db.collection("settings").findOne({ _id: "site_settings" as any });

    return NextResponse.json({ 
        success: true,
        data: settings || {
            sitetitle: "KH Foods",
            tagline: "Quality Indian Spices",
            logo: null
        }
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Settings GET Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// POST update settings
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const db = await getMongoDb();

    const result = await db.collection("settings").updateOne(
        { _id: "site_settings" as any },
        { 
            $set: { 
                ...body,
                updatedAt: new Date().toISOString()
            } 
        },
        { upsert: true }
    );

    return NextResponse.json({ 
        success: true,
        message: "Configurations updated successfully",
        result
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Settings POST Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
