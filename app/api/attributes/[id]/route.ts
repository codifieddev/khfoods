import { getAttributeModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Attr = await getAttributeModel();
    
    const updateDoc = {
      ...body,
      updatedAt: new Date()
    };
    delete updateDoc._id;

    const result = await Attr.findOneAndUpdate(
      { _id: new ObjectId(params.id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    console.log("✅ Attribute Updated:", params.id);
    
    return NextResponse.json({ 
      data: result,
      message: "Attribute property refined" 
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const Attr = await getAttributeModel();
    await Attr.deleteOne({ _id: new ObjectId(params.id) });
    
    return NextResponse.json({ message: "Attribute property purged" });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
