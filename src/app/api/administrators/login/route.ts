import { NextResponse } from "next/server";

import {
  adminSessionLifetimeSeconds,
  buildAdministratorSession,
  buildFailedAdministratorLoginUpdate,
  findAdministratorByEmail,
  isAdministratorLocked,
  isAdministratorPasswordValid,
  normalizeAdministratorEmail,
  pruneExpiredAdministratorSessions,
  sanitizeAdministrator,
  setAdministratorAuthCookie,
  signAdministratorSessionToken,
} from "@/data/storefront/adminAccounts";
import { getMongoDb } from "@/data/mongo/client";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = typeof body.email === "string" ? normalizeAdministratorEmail(body.email) : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!email || !password) {
      return NextResponse.json({ errors: [{ message: "Email and password are required." }] }, { status: 400 });
    }

    const rawAdministrator = await findAdministratorByEmail(email);

    if (!rawAdministrator) {
      return NextResponse.json({ errors: [{ message: "Invalid credentials." }] }, { status: 401 });
    }

    const db = await getMongoDb();

    if (isAdministratorLocked(rawAdministrator as Record<string, unknown>)) {
      return NextResponse.json({ errors: [{ message: "Account is locked." }] }, { status: 403 });
    }

    const passwordIsValid = isAdministratorPasswordValid({
      hash: typeof rawAdministrator.hash === "string" ? rawAdministrator.hash : null,
      password,
      salt: typeof rawAdministrator.salt === "string" ? rawAdministrator.salt : null,
    });

    if (!passwordIsValid) {
      await db.collection("administrators").updateOne(
        { _id: rawAdministrator._id },
        { $set: buildFailedAdministratorLoginUpdate(rawAdministrator as Record<string, unknown>) } as never,
      );

      return NextResponse.json({ errors: [{ message: "Invalid credentials." }] }, { status: 401 });
    }

    const session = buildAdministratorSession();
    const activeSessions = pruneExpiredAdministratorSessions(rawAdministrator.sessions);
    const updatedAdministrator = await db.collection("administrators").findOneAndUpdate(
      { _id: rawAdministrator._id },
      {
        $set: {
          lockUntil: null,
          loginAttempts: 0,
          sessions: [...activeSessions, session],
          updatedAt: new Date().toISOString(),
        },
      } as never,
      { returnDocument: "after" },
    );

    if (!updatedAdministrator) {
      return NextResponse.json({ errors: [{ message: "Unable to create session." }] }, { status: 500 });
    }

    const token = signAdministratorSessionToken({
      email,
      id: updatedAdministrator._id.toString(),
      sid: session.id,
    });
    const exp = Math.floor(Date.now() / 1000) + adminSessionLifetimeSeconds;
    const response = NextResponse.json(
      {
        exp,
        token,
        user: sanitizeAdministrator(updatedAdministrator as Record<string, unknown>, session.id),
      },
      { status: 200 },
    );

    setAdministratorAuthCookie(response, token);

    return response;
  } catch (error) {
    console.error("Administrator login error:", error);
    return NextResponse.json({ errors: [{ message: "Internal server error" }] }, { status: 500 });
  }
}
