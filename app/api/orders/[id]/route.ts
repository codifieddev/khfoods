import { connectTenantDB } from "@/lib/db";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

async function verifyAdminAuth(req: Request) {
  const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

  if (!token && process.env.NODE_ENV !== "development") {
    return { error: "Unauthorized", status: 401 };
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return { authenticated: true };
    } catch (err) {
      return { error: "Invalid token", status: 401 };
    }
  }

  return { authenticated: true };
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAuth(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    const db = await connectTenantDB();
    const { status } = await req.json();

    if (!status) {
      return NextResponse.json({ message: "Status is required" }, { status: 400 });
    }

    const result = await db.collection("orders").findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    console.log(`✅ Order Status Updated: ${result.orderId} to ${status}`);

    return NextResponse.json({ data: result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await connectTenantDB();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(params.id) });
    
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data: order }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
