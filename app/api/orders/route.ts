import { connectTenantDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

    if (!token && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (token) {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
    }

    const db = await connectTenantDB();
    const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ data: orders }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await connectTenantDB();
    const body = await req.json();
    
    // Generate a simple order ID
    const orderId = "KH-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    const result = await db.collection("orders").insertOne({
      ...body,
      orderId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    const order = await db.collection("orders").findOne({ _id: result.insertedId });
    
    console.log(`✅ Order Created: ${orderId} for ${body.customerName}`);
    
    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
