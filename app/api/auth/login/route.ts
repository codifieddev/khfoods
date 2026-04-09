import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectTenantDB } from "@/lib/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_change_me_in_prod";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    const db = await connectTenantDB();
    const userColl = await db.collection("users");
    let user = await userColl.findOne({ email });

    if (!user) {
      console.log(`❌ Login Failed: User not found (${email})`);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValid = await bcrypt.compare(password, user.password).catch((err) => {
      console.error("Bcrypt error:", err);
      return false;
    });

    if (!isValid && password !== user.password) {
      console.log(`❌ Login Failed: Invalid password for ${email}`);
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role || "admin",
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    console.log(`✅ Login Success: ${email}`);

    const response = NextResponse.json({
      success: true,
      message: "Authentication successful. Entry permitted.",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role || "admin",
      },
    });

    // Use admin_token to match middleware and requirements
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    // Also clear the old auth_token if it exists to prevent confusion
    response.cookies.delete("auth_token");

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Central Processing Error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No authentication token found" },
      { status: 401 },
    );
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return NextResponse.json({
      success: true,
      user: decodedToken,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Invalid token" },
      { status: 401 },
    );
  }
}
