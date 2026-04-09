import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

import {
  getAdministratorTokenFromRequest,
  getAuthenticatedAdministratorFromToken,
  findAdministratorById,
  sanitizeAdministrator,
} from "@/data/storefront/adminAccounts";
import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";

export async function GET(request: Request) {
  try {
    const administrator = await getAuthenticatedAdministrator();

    if (!administrator) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user: administrator }, { status: 200 });
  } catch (error) {
    console.error("Administrator me error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const authenticatedAdministrator = await getAuthenticatedAdministrator();

    if (!authenticatedAdministrator) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rawAdministrator = await findAdministratorById(authenticatedAdministrator.id);

    if (!rawAdministrator) {
      return NextResponse.json({ message: "Administrator not found" }, { status: 404 });
    }

    const body = (await request.json()) as Record<string, unknown>;
    const updateData: Record<string, unknown> = {
      updatedAt: new Date().toISOString(),
    };

    if (body.language === "en" || body.language === "hr" || body.language === "pl" || body.language === null) {
      updateData.language = body.language;
    }

    if (typeof body.name === "string") {
      updateData.name = body.name.trim();
    }

    const db = await getMongoDb();
    const updatedAdministrator = await db.collection("administrators").findOneAndUpdate(
      { _id: rawAdministrator._id },
      { $set: updateData } as any,
      { returnDocument: "after" },
    );

    if (!updatedAdministrator) {
      return NextResponse.json({ message: "Unable to update administrator" }, { status: 500 });
    }

    return NextResponse.json(
      {
        user: sanitizeAdministrator(
          updatedAdministrator as Record<string, unknown>,
          authenticatedAdministrator._sid,
        ),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Administrator me PATCH error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
