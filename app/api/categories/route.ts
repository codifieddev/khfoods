import { getCategoryModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const Category = await getCategoryModel();
    const categories = await Category.find({}).sort({ name: 1 }).toArray();
    return NextResponse.json({ data: categories });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Category = await getCategoryModel();
    
    if (!body.name) {
      return NextResponse.json({ message: "Category name is required" }, { status: 400 });
    }

    const categoryDoc = {
      ...body,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Category.insertOne(categoryDoc);
    
    return NextResponse.json({ 
      data: { ...categoryDoc, _id: result.insertedId },
      message: "Category localized successfully" 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
