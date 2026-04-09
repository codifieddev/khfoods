import { NextResponse } from "next/server";
import { createAdministratorPasswordHash } from "@/data/storefront/adminAccounts";
import { getMongoDb } from "@/data/mongo/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const token = typeof body.token === "string" ? body.token : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!token || !password) {
      return NextResponse.json({ message: "Token and password are required." }, { status: 400 });
    }

    const db = await getMongoDb();
    const rawAdministrator = await db.collection("administrators").findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: new Date().toISOString() },
    } as any);

    if (!rawAdministrator) {
      return NextResponse.json({ message: "Invalid or expired reset token." }, { status: 400 });
    }

    const { hash, salt } = createAdministratorPasswordHash(password);

    await db.collection("administrators").updateOne(
      { _id: rawAdministrator._id },
      {
        $set: {
          hash,
          lockUntil: null,
          loginAttempts: 0,
          salt,
          sessions: [],
          updatedAt: new Date().toISOString(),
        } as any,
        $unset: {
          resetPasswordExpiration: "",
          resetPasswordToken: "",
        } as any,
      }
    );

    return NextResponse.json({ message: "Password reset successfully." }, { status: 200 });
  } catch (error) {
    console.error("Administrator reset password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
