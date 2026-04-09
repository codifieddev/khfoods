import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
  adminPayloadTokenCookieName,
  buildAdministratorIdCandidates,
  clearAdministratorAuthCookie,
  verifyAdministratorSessionToken,
} from "@/data/storefront/adminAccounts";
import { getMongoDb } from "@/data/mongo/client";

export async function POST(request: Request) {
  const response = NextResponse.json(true, { status: 200 });
  clearAdministratorAuthCookie(response);

  try {
    const body = (await request.json().catch(() => ({}))) as { allSessions?: boolean };
    const allSessions = body?.allSessions === true;
    const cookieStore = await cookies();
    const token = cookieStore.get(adminPayloadTokenCookieName)?.value;

    if (!token) {
      return response;
    }

    const decodedToken = verifyAdministratorSessionToken(token);

    if (!decodedToken) {
      return response;
    }

    const db = await getMongoDb();
    await db.collection("administrators").updateOne(
      {
        _id: { $in: buildAdministratorIdCandidates(decodedToken.id) },
      } as never,
      allSessions
        ? ({
            $set: {
              sessions: [],
              updatedAt: new Date().toISOString(),
            },
          } as never)
        : ({
            $pull: { sessions: { id: decodedToken.sid } },
            $set: { updatedAt: new Date().toISOString() },
          } as never),
    );
  } catch (error) {
    console.error("Administrator logout error:", error);
  }

  return response;
}
