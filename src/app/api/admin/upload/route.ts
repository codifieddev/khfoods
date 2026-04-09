import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministratorFromToken, adminPayloadTokenCookieName } from "@/data/storefront/adminAccounts";

export const runtime = "nodejs";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;
    
    // Auth Check
    const admin = token ? await getAuthenticatedAdministratorFromToken(token) : null;
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename") || "unnamed-file";

    if (!request.body) {
      return NextResponse.json({ message: "No file provided" }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(filename, request.body, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    // Save metadata to MongoDB "media" collection
    const db = await getMongoDb();
    const mediaEntry = {
      filename: filename,
      url: blob.url,
      mimeType: blob.contentType || "application/octet-stream",
      filesize: 0, // blob doesn't provide size directly here easily, but we can store it from headers if needed
      width: 0,
      height: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      alt: filename,
    };

    const result = await db.collection("media").insertOne(mediaEntry);

    return NextResponse.json({
        success: true,
        url: blob.url,
        id: result.insertedId.toString(),
        message: "Asset uploaded successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Native Upload Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
