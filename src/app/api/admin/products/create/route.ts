import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

// Zod validation schema for Product Creation
const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  price: z.number().min(0, "Price cannot be negative"),
  stock: z.boolean().default(true),
  description: z.string().optional(),
  categoriesArr: z.array(z.object({
      category: z.string()
  })).optional(),
  images: z.array(z.object({
      image: z.string()
  })).optional()
});

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    // Auth Check
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    
    // 1. Validate Input with Zod
    const validation = productSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ 
          success: false, 
          message: validation.error.errors[0].message 
      }, { status: 400 });
    }

    const data = validation.data;
    const db = await getMongoDb();

    // Prepare new product data
    const newProduct: Record<string, any> = {
      ...data,
      categoriesArr: data.categoriesArr || [],
      images: data.images || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "published"
    };

    const result = await db.collection("products").insertOne(newProduct);

    return NextResponse.json({ 
        success: true, 
        id: result.insertedId.toString(),
        message: "Product created successfully" 
    }, { status: 201 });

  } catch (error) {
    console.error("Admin Product Create Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
