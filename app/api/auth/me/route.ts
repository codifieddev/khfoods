import { connectMasterDB } from "@/lib/db";
import { jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function GET(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    const db = await connectMasterDB();
    const user = await db.collection("users").findOne({ _id: new ObjectId(payload.userId as string) });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;
    return NextResponse.json({ user: userWithoutPassword });
  } catch (error) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
}
