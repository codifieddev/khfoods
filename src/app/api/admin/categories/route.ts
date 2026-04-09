import { NextResponse } from "next/server";
import { AdminRepository } from "@/lib/admin-repository";

export async function GET() {
  try {
    const categories = await AdminRepository.find("categories", {}, { sort: { name: 1 } });
    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("Admin categories fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.name) {
       return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const category = await AdminRepository.create("categories", data);
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Admin category create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
