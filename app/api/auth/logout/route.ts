import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout successful. Connectivity terminated.",
    });

    // Clear both possible tokens to be safe during transition
    response.cookies.delete("admin_token");
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 },
    );
  }
}