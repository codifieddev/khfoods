import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

async function verifyAdminAuth(req: Request) {
  const token = req.headers.get("cookie")?.split("; ").find(c => c.startsWith("admin_token="))?.split("=")[1];

  if (!token && process.env.NODE_ENV !== "development") {
    return { error: "Unauthorized", status: 401 };
  }

  if (token) {
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload }: any = await jwtVerify(token, secret);
      if (payload.role === "viewer") {
        return { error: "Forbidden: Read-only access", status: 403 };
      }
      return { payload };
    } catch (err) {
      return { error: "Invalid token", status: 401 };
    }
  }

  // Development bypass
  return { payload: { role: "admin" } };
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAuth(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await dbConnect();
    const body = await req.json();
    
    // Remove _id from body if present
    const { _id, ...updateData } = body;

    const product = await Product.findByIdAndUpdate(
      params.id,
      { ...updateData },
      { new: true, runValidators: true }
    );

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    console.log(`✅ Product Updated: ${product.name} (ID: ${params.id})`);

    return NextResponse.json({ data: product }, { status: 200 });
  } catch (error: any) {
    console.error("Product Update Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await verifyAdminAuth(req);
    if (auth.error) return NextResponse.json({ message: auth.error }, { status: auth.status });

    await dbConnect();
    
    const product = await Product.findByIdAndDelete(params.id);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    console.log(`✅ Product Deleted: ${product.name} (ID: ${params.id})`);

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
