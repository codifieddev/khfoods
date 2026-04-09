import { connectMasterDB } from "@/lib/db";
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
      const { payload }: any = await jwtVerify(token, secret);
      if (payload.role !== "admin") {
        return NextResponse.json({ message: "Forbidden: Admin access required" }, { status: 403 });
      }
    }

    const db = await connectMasterDB();
    const users = await db.collection("users").find({}).project({ password: 0 }).sort({ createdAt: -1 }).toArray();
    
    return NextResponse.json({ users }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
