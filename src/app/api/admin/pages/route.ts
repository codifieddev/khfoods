import { NextResponse } from "next/server";
import { AdminRepository } from "@/lib/admin-repository";

export async function GET() {
  try {
    const pages = await AdminRepository.find("pages", {}, { sort: { updatedAt: -1 } });
    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error("Admin pages fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.title) {
       return NextResponse.json({ message: "Title is required" }, { status: 400 });
    }

    const page = await AdminRepository.create("pages", data);
    return NextResponse.json({ page }, { status: 201 });
  } catch (error) {
    console.error("Admin page create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
