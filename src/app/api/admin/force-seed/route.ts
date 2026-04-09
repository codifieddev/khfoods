import { NextResponse } from "next/server";
import { getMongoDb } from "@/data/mongo/client";
import { createAdministratorPasswordHash } from "@/data/storefront/adminAccounts";

export async function GET() {
  try {
    console.log("Force Seed: Starting administrative password reset...");
    const db = await getMongoDb();
    
    const adminEmail = "admin@khfood.com";
    const { hash, salt } = createAdministratorPasswordHash("123456");

    const result = await db.collection("administrators").updateOne(
      { email: adminEmail },
      { 
        $set: { 
          hash, 
          salt, 
          roles: ["admin", "superadmin"],
          updatedAt: new Date().toISOString()
        } 
      },
      { upsert: true }
    );

    console.log(`Force Seed: Admin account ${adminEmail} has been updated with password '123456'`);
    console.log(`Force Seed: New Hash: ${hash.slice(0, 16)}...`);
    console.log(`Force Seed: New Salt: ${salt.slice(0, 8)}...`);

    return NextResponse.json({
      success: true,
      message: `Administrator ${adminEmail} forced to '123456'`,
      result: result.upsertedId ? "Account Created" : "Account Updated"
    }, { status: 200 });

  } catch (error) {
    console.error("Force Seed: FATAL ERROR:", error);
    return NextResponse.json({ 
        success: false, 
        message: "Failed to force seed administrator" 
    }, { status: 500 });
  }
}
