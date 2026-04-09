import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    // Auth Check
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const db = await getMongoDb();

    // Prepare update data
    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.price !== undefined) updateData.price = parseFloat(body.price);
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.description !== undefined) updateData.description = body.description;

    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
