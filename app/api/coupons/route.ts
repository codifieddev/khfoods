import { getCouponModel } from "@/models";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const Coupon = await getCouponModel();
    const coupons = await Coupon.find({}).sort({ expiryDate: 1 }).toArray();
    return NextResponse.json({ data: coupons });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const auth = await authenticateAdmin();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const Coupon = await getCouponModel();
    
    if (!body.code) {
      return NextResponse.json({ message: "Coupon code is required" }, { status: 400 });
    }

    const couponDoc = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await Coupon.insertOne(couponDoc);
    
    return NextResponse.json({ 
      data: { ...couponDoc, _id: result.insertedId },
      message: "Promotion coupon deployed" 
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
