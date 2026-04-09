import { getAttributeModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const Attr = await getAttributeModel();
    const attributes = await Attr.find({}).sort({ name: 1 }).toArray();
    return NextResponse.json({ data: attributes });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Attr = await getAttributeModel();
    
    if (!body.name) {
      return NextResponse.json({ message: "Attribute name is required" }, { status: 400 });
    }

    // Check for duplicates
    const existing = await Attr.findOne({ name: { $regex: new RegExp(`^${body.name}$`, "i") } });
    if (existing) {
      return NextResponse.json({ message: "Attribute signature already exists in archives" }, { status: 409 });
    }

    const attributeDoc = {
      name: body.name,
      slug: body.slug || body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      values: Array.isArray(body.values) ? body.values : [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Attr.insertOne(attributeDoc);
    console.log("✅ Attribute Created:", body.name);
    
    return NextResponse.json({ 
      data: { ...attributeDoc, _id: result.insertedId },
      message: "Attribute property established" 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
