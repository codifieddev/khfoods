import { NextResponse } from "next/server";
import { AdminRepository } from "@/lib/admin-repository";

export async function GET() {
  try {
    const media = await AdminRepository.find("media", {}, { sort: { createdAt: -1 } });
    return NextResponse.json({ media }, { status: 200 });
  } catch (error) {
    console.error("Admin media fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Basic implementation for database registration
    // Real file upload logic would store to S3/Cloudinary then call this
    const data = await request.json();
    
    if (!data.url) {
       return NextResponse.json({ message: "URL is required" }, { status: 400 });
    }

    const media = await AdminRepository.create("media", data);
    return NextResponse.json({ media }, { status: 201 });
  } catch (error) {
    console.error("Admin media create error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
