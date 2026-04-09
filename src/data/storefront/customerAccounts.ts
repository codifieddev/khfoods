import "server-only";

import { pbkdf2Sync, randomBytes } from "crypto";

import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { type NextResponse } from "next/server";

import { getMongoDb } from "@/data/mongo/client";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import type { Customer, CustomerSession, CustomerShipping } from "@/types/cms";

export const authTokenCookieName = "auth-token";
export const customerSessionLifetimeSeconds = 60 * 60 * 2;
const customerSessionLifetimeMs = customerSessionLifetimeSeconds * 1000;
const customerMaxLoginAttempts = 30;
const customerLockTimeMs = 30 * 1000;

export type CustomerSessionPayload = {
  collection: "customers";
  email: string;
  id: string;
  sid: string;
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const normalizeCustomerEmail = (email: string) => email.trim().toLowerCase();

export const buildCustomerIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

export const sanitizeCustomer = (rawCustomer: Record<string, unknown>, sid?: string) => {
  const customer: Record<string, unknown> = {
    ...rawCustomer,
    id:
      typeof rawCustomer.id === "string"
        ? rawCustomer.id
        : rawCustomer._id instanceof ObjectId
          ? rawCustomer._id.toString()
          : typeof rawCustomer._id === "string"
            ? rawCustomer._id
            : "",
    collection: "customers" as const,
    _strategy: "local-jwt" as const,
    ...(sid ? { _sid: sid } : {}),
  };

  delete customer._id;
  delete customer.__v;
  delete customer.hash;
  delete customer.salt;
  delete customer.resetPasswordToken;
  delete customer.resetPasswordExpiration;
  delete customer._verificationToken;

  return customer as unknown as Customer & {
    _sid?: string;
    _strategy: "local-jwt";
    collection: "customers";
  };
};

export const buildCustomerFullName = (firstName?: string | null, lastName?: string | null) => {
  const fullName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(" ").trim();
  return fullName || null;
};

export const createCustomerPasswordHash = (password: string) => {
  const salt = randomBytes(32).toString("hex");
  const hash = pbkdf2Sync(password, salt, 25000, 512, "sha256").toString("hex");

  return { hash, salt };
};

export const isCustomerPasswordValid = ({
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
  return derivedHash === hash;
};

export const buildCustomerSession = (): CustomerSession => {
  const createdAt = new Date();

  return {
    id: randomBytes(24).toString("hex"),
    createdAt: createdAt.toISOString(),
    expiresAt: new Date(createdAt.getTime() + customerSessionLifetimeMs).toISOString(),
  };
};

export const pruneExpiredCustomerSessions = (sessions: Customer["sessions"]) => {
  if (!Array.isArray(sessions)) {
    return [] as CustomerSession[];
  }

  const now = Date.now();

  return sessions.filter((session): session is CustomerSession => {
    if (!session?.id || !session.expiresAt) {
      return false;
    }

    return new Date(session.expiresAt).getTime() > now;
  });
};

export const signCustomerSessionToken = ({
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
    throw new Error("PAYLOAD_SECRET is required to create customer sessions.");
  }

  return jwt.sign(
    {
      collection: "customers",
      email,
      id,
      sid,
    } satisfies CustomerSessionPayload,
    secret,
    { expiresIn: customerSessionLifetimeSeconds },
  );
};

export const verifyCustomerSessionToken = (token: string) => {
  const secret = process.env.AUTH_SECRET || process.env.PAYLOAD_SECRET;

  if (!secret) {
    return null;
  }

  const decodedPayload = jwt.verify(token, secret) as Partial<CustomerSessionPayload>;

  if (
    decodedPayload.collection !== "customers" ||
    typeof decodedPayload.id !== "string" ||
    typeof decodedPayload.sid !== "string" ||
    typeof decodedPayload.email !== "string"
  ) {
    return null;
  }

  return decodedPayload as CustomerSessionPayload;
};

export const setCustomerAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set({
    name: authTokenCookieName,
    value: token,
    httpOnly: true,
    maxAge: customerSessionLifetimeSeconds,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const clearCustomerAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    name: authTokenCookieName,
    value: "",
    expires: new Date(0),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
};

export const findCustomerById = async (id: string) => {
  const db = await getMongoDb();

  return db.collection("customers").findOne({
    _id: { $in: buildCustomerIdCandidates(id) },
  } as never);
};

export const findCustomerByEmail = async (email: string) => {
  const db = await getMongoDb();

  return db.collection("customers").findOne({
    email: {
      $regex: `^${escapeRegex(normalizeCustomerEmail(email))}$`,
      $options: "i",
    },
  } as never);
};

export const normalizeCustomerShippings = (value: unknown): CustomerShipping[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .filter((shipping): shipping is Record<string, unknown> => Boolean(shipping) && typeof shipping === "object")
    .map((shipping) => ({
      ...shipping,
      email: typeof shipping.email === "string" ? shipping.email : "",
      id:
        typeof shipping.id === "string" && shipping.id.trim().length > 0
          ? shipping.id
          : randomBytes(12).toString("hex"),
      default: Boolean(shipping.default),
    })) as CustomerShipping[];

  let hasDefault = false;

  const withSingleDefault = normalized.map((shipping) => {
    if (shipping.default && !hasDefault) {
      hasDefault = true;
      return shipping;
    }

    if (shipping.default && hasDefault) {
      return { ...shipping, default: false };
    }

    return shipping;
  });

  if (!hasDefault && withSingleDefault.length > 0) {
    return withSingleDefault.map((shipping, index) =>
      index === 0 ? { ...shipping, default: true } : shipping,
    );
  }

  return withSingleDefault;
};

export const getLocaleFromRequest = (request: Request): Locale => {
  const locale = request.headers.get("x-locale")?.trim();

  if (locale && locales.includes(locale as Locale)) {
    return locale as Locale;
  }

  return defaultLocale;
};

export const isCustomerLocked = (rawCustomer: Record<string, unknown>) => {
  if (typeof rawCustomer.lockUntil !== "string") {
    return false;
  }

  return new Date(rawCustomer.lockUntil).getTime() > Date.now();
};

export const buildFailedCustomerLoginUpdate = (rawCustomer: Record<string, unknown>) => {
  const currentAttempts =
    typeof rawCustomer.loginAttempts === "number" && Number.isFinite(rawCustomer.loginAttempts)
      ? rawCustomer.loginAttempts
      : 0;
  const nextAttempts = currentAttempts + 1;
  const shouldLock = nextAttempts >= customerMaxLoginAttempts;

  return {
    loginAttempts: shouldLock ? 0 : nextAttempts,
    lockUntil: shouldLock ? new Date(Date.now() + customerLockTimeMs).toISOString() : null,
    updatedAt: new Date().toISOString(),
  };
};
