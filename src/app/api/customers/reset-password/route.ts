import { NextResponse } from "next/server";
import { getMongoDb } from "@/data/mongo/client";
import { hashPayloadPassword } from "@/utilities/auth";

export async function POST(req: Request) {
  try {
    const { token, password, collection = "customers" } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const db = await getMongoDb();
    const targetCollection = collection === "administrators" ? "administrators" : "customers";
    
    // Find user with this token and ensure it's not expired
    const user = await db.collection(targetCollection).findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: new Date().toISOString() }
    });

    if (!user) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 401 });
    }

    // Hash the new password using our Payload-compatible utility
    const { hash, salt } = hashPayloadPassword(password);

    // Update the record and remove reset fields
    await db.collection(targetCollection).updateOne(
      { _id: user._id },
      { 
        $set: { 
          hash, 
          salt,
          updatedAt: new Date().toISOString() 
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordExpiration: ""
        }
      }
    );

    return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
