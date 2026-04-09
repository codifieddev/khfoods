import "server-only";

import { pbkdf2Sync, randomBytes } from "crypto";

import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { type NextResponse } from "next/server";

import { getMongoDb } from "@/data/mongo/client";
import type { Administrator, AdministratorSession } from "@/types/cms";

export const adminAuthTokenCookieName = "auth-token";
export const adminSessionLifetimeSeconds = 60 * 60 * 2;
const adminSessionLifetimeMs = adminSessionLifetimeSeconds * 1000;
const adminMaxLoginAttempts = 5;
const adminLockTimeMs = 10 * 60 * 1000;

export type AdministratorSessionPayload = {
  collection: "administrators";
  email: string;
  id: string;
  sid: string;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normalizeAdministratorEmail = (email: string) => email.trim().toLowerCase();

export const buildAdministratorIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

export const sanitizeAdministrator = (rawAdministrator: Record<string, unknown>, sid?: string) => {
  const administrator: Record<string, unknown> = {
    ...rawAdministrator,
    id:
      typeof rawAdministrator.id === "string"
        ? rawAdministrator.id
        : rawAdministrator._id instanceof ObjectId
          ? rawAdministrator._id.toString()
          : typeof rawAdministrator._id === "string"
            ? rawAdministrator._id
            : "",
    collection: "administrators" as const,
    _strategy: "local-jwt" as const,
    ...(sid ? { _sid: sid } : {}),
  };

  delete administrator._id;
  delete administrator.__v;
  delete administrator.hash;
  delete administrator.salt;
  delete administrator.resetPasswordToken;
  delete administrator.resetPasswordExpiration;

  return administrator as unknown as Administrator & {
    _sid?: string;
    _strategy: "local-jwt";
    collection: "administrators";
  };
};

export const createAdministratorPasswordHash = (password: string) => {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");

  return { hash, salt };
};

export const isAdministratorPasswordValid = ({
  hash,
  password,
  salt,
}: {
  hash?: string | null;
  password: string;
  salt?: string | null;
}) => {
  if (!hash || !salt) {
    return false;
  }

  const derivedHash = pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");
  const isValid = derivedHash === hash;
  
  return isValid;
};

export const buildAdministratorSession = (): AdministratorSession => {
  const createdAt = new Date();

  return {
    id: randomBytes(24).toString("hex"),
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + adminSessionLifetimeMs).toISOString(),
  };
};

export const pruneExpiredAdministratorSessions = (sessions: Administrator["sessions"]) => {
  if (!Array.isArray(sessions)) {
    return [] as AdministratorSession[];
  }

  const now = Date.now();

  return sessions.filter((session): session is AdministratorSession => {
    if (!session?.id || !session.expiresAt) {
      return false;
    }

    return new Date(session.expiresAt).getTime() > now;
  });
};

export const signAdministratorSessionToken = ({
  email,
  id,
  sid,
}: {
  email: string;
  id: string;
  sid: string;
}) => {
  const secret = process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is required to create administrator sessions.");
  }

  return jwt.sign(
    {
      collection: "administrators",
      email,
      id,
      sid,
    } satisfies AdministratorSessionPayload,
    secret,
    { expiresIn: adminSessionLifetimeSeconds },
  );
};

export const verifyAdministratorSessionToken = (token: string) => {
  const secret = process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET;

  if (!secret) {
    return null;
  }

  const decodedPayload = jwt.verify(token, secret) as Partial<AdministratorSessionPayload>;

  if (
    decodedPayload.collection !== "administrators" ||
    typeof decodedPayload.id !== "string" ||
    typeof decodedPayload.sid !== "string" ||
    typeof decodedPayload.email !== "string"
  ) {
    return null;
  }

  return decodedPayload as AdministratorSessionPayload;
};

export const getAdministratorTokenFromRequest = (request: Request) => {
  const authorization = request.headers.get("authorization")?.trim();

  if (authorization) {
    const [scheme, credentials] = authorization.split(/\s+/, 2);

    if ((scheme === "JWT" || scheme === "Bearer") && credentials) {
      return credentials;
    }
  }

  const cookieHeader = request.headers.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .find((entry) => entry.startsWith(`${adminAuthTokenCookieName}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.slice(adminAuthTokenCookieName.length + 1));
};

export const setAdministratorAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: adminAuthTokenCookieName,
    value: token,
    httpOnly: true,
    maxAge: adminSessionLifetimeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearAdministratorAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: adminAuthTokenCookieName,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const findAdministratorById = async (id: string) => {
  const db = await getMongoDb();

  return db.collection("administrators").findOne({
    _id: { $in: buildAdministratorIdCandidates(id) },
  } as never);
};

export const findAdministratorByEmail = async (email: string) => {
  const db = await getMongoDb();

  return db.collection("administrators").findOne({
    email: {
      $regex: `^${escapeRegex(normalizeAdministratorEmail(email))}$`,
      $options: "i",
    },
  } as never);
};

export const getAuthenticatedAdministratorFromToken = async (token: string) => {
  const decodedPayload = verifyAdministratorSessionToken(token);

  if (!decodedPayload) {
    return null;
  }

  const rawAdministrator = await findAdministratorById(decodedPayload.id);

  if (!rawAdministrator) {
    return null;
  }

  const sessions = Array.isArray(rawAdministrator.sessions) ? rawAdministrator.sessions : [];
  const activeSession = sessions.find((session) => {
    if (!session || typeof session !== "object") {
      return false;
    }

    const typedSession = session as { expiresAt?: string; id?: string };

    if (typedSession.id !== decodedPayload.sid || !typedSession.expiresAt) {
      return false;
    }

    return new Date(typedSession.expiresAt).getTime() > Date.now();
  });

  if (!activeSession) {
    return null;
  }

  return sanitizeAdministrator(rawAdministrator as Record<string, unknown>, decodedPayload.sid);
};

export const isAdministratorLocked = (rawAdministrator: Record<string, unknown>) => {
  if (typeof rawAdministrator.lockUntil !== "string") {
    return false;
  }

  return new Date(rawAdministrator.lockUntil).getTime() > Date.now();
};

export const buildFailedAdministratorLoginUpdate = (rawAdministrator: Record<string, unknown>) => {
  const currentAttempts =
    typeof rawAdministrator.loginAttempts === "number" && Number.isFinite(rawAdministrator.loginAttempts)
      ? rawAdministrator.loginAttempts
      : 0;
  const nextAttempts = currentAttempts + 1;
  const shouldLock = nextAttempts >= adminMaxLoginAttempts;

  return {
    loginAttempts: shouldLock ? 0 : nextAttempts,
    lockUntil: shouldLock ? new Date(Date.now() + adminLockTimeMs).toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
};
