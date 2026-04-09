import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  buildCustomerIdCandidates,
  clearCustomerAuthCookie,
  payloadTokenCookieName,
  verifyCustomerSessionToken,
} from "@/data/storefront/customerAccounts";
import { getMongoDb } from "@/data/mongo/client";

export async function POST() {
  const response = NextResponse.json({ message: "Success" }, { status: 200 });
  clearCustomerAuthCookie(response);

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(payloadTokenCookieName)?.value;

    if (!token) {
      return response;
    }

    const decodedToken = verifyCustomerSessionToken(token);

    if (!decodedToken) {
      return response;
    }

    const db = await getMongoDb();
    await db.collection("customers").updateOne(
      {
        _id: { $in: buildCustomerIdCandidates(decodedToken.id) },
      } as never,
      {
        $pull: { sessions: { id: decodedToken.sid } },
        $set: { updatedAt: new Date().toISOString() },
      } as never,
    );
  } catch (error) {
    console.error("Customer logout error:", error);
  }

  return response;
}
