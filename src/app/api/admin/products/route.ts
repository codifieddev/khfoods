import { NextResponse } from "next/server";
import { AdminRepository } from "@/lib/admin-repository";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ? { title: new RegExp(searchParams.get("q")!, "i") } : {};
    const limit = Number(searchParams.get("limit") || 50);
    const skip = Number(searchParams.get("skip") || 0);

    const products = await AdminRepository.find("products", query, { limit, skip, sort: { updatedAt: -1 } });
    const total = await AdminRepository.count("products", query);

    return NextResponse.json({ products, total }, { status: 200 });
  } catch (error) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.title) {
       return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const product = await AdminRepository.create("products", data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Admin product create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
