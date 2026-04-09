import { NextResponse } from "next/server";

import { getShopSettingsData } from "@/data/storefront/globals";

export async function GET() {
  try {
    const settings = await getShopSettingsData("en");
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error("Shop settings GET error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
