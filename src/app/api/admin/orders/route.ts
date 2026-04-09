import { NextResponse } from "next/server";
import { AdminRepository } from "@/lib/admin-repository";

export async function GET() {
  try {
    const orders = await AdminRepository.find("orders", {}, { sort: { createdAt: -1 } });
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error("Admin orders fetch error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
