import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

import { getMongoDb } from "@/data/mongo/client";
import { verifyPayloadPassword } from "@/utilities/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const db = await getMongoDb();
    const rawCustomer = await db.collection("customers").findOne({
      email: email.toLowerCase(),
    } as any);

    if (!rawCustomer) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    /**
     * Verify password using native utility
     * Transitioned from Payload-specific verification
     */
    const isValid = verifyPayloadPassword(password, rawCustomer.hash, rawCustomer.salt);

    if (!isValid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    if (rawCustomer._verified === false) {
       return NextResponse.json({ message: "Account not verified. Please check your email." }, { status: 403 });
    }

    /**
     * Auth is successful. Create a native JWT session.
     * Use AUTH_SECRET with fallback to PAYLOAD_SECRET during migration.
     */
    const secret = process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET;
    if (!secret) {
      throw new Error("AUTH_SECRET is not configured");
    }

    const sid = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 days

    const token = jwt.sign(
      {
        id: rawCustomer._id.toString(),
        email: rawCustomer.email,
        collection: "customers",
        sid: sid
      },
      secret,
      { expiresIn: "7d" }
    );

    // Update sessions in MongoDB to maintain compatibility with existing auth system
    await db.collection("customers").updateOne(
      { _id: rawCustomer._id },
      { 
        $push: { 
          sessions: {
            id: sid,
            expiresAt: expiresAt.toISOString(),
            createdAt: new Date().toISOString()
          }
        } as any,
        $set: {
            updatedAt: new Date().toISOString()
        }
      }
    );

    /**
     * Set the auth cookie using the native Next.js' naming convention 'auth-token'
     */
    const cookieStore = await cookies();
    cookieStore.set("auth-token", token, {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: expiresAt,
      sameSite: "lax",
    });

    return NextResponse.json({ 
      user: {
        id: rawCustomer._id.toString(),
        email: rawCustomer.email,
        firstName: rawCustomer.firstName,
        lastName: rawCustomer.lastName
      }
    }, { status: 200 });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
