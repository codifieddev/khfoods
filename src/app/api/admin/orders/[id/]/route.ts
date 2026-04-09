import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ObjectId } from "mongodb";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

// GET Order Details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    // Auth Check
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const db = await getMongoDb();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ 
        order: { ...order, id: order._id.toString() } 
    }, { status: 200 });

  } catch (error) {
    console.error("Admin Order Detail Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT Order Status Update
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

    const { status } = await req.json();
    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const db = await getMongoDb();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          status, 
          updatedAt: new Date().toISOString() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Status updated to ${status}` }, { status: 200 });

  } catch (error) {
    console.error("Admin Order Update Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
