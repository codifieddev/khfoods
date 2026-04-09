import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let query: any = {};
    if (category) {
      query.$or = [
        { category: category },
        { categoryId: category },
        { categoryIds: category }
      ];
    }
    if (featured === "true") query.isFeatured = true;

    const products = await Product.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

    if (!token && process.env.NODE_ENV !== "development") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (token) {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload }: any = await jwtVerify(token, secret);
      if (payload.role === "viewer") {
        return NextResponse.json({ message: "Forbidden: Read-only access" }, { status: 403 });
      }
    }

    await dbConnect();
    const body = await req.json();
    
    // Auto-create collections is handled by mongoose when models are registered
    const product = await Product.create(body);
    
    console.log(`✅ Product Created: ${product.name}`);
    
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
