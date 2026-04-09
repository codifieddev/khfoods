import { getCustomerModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const Customer = await getCustomerModel();
    const customers = await Customer.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ data: customers });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Customer = await getCustomerModel();
    
    if (!body.email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    const customerDoc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Customer.insertOne(customerDoc);
    
    return NextResponse.json({ 
      data: { ...customerDoc, _id: result.insertedId },
      message: "Customer record established" 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
