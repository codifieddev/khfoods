import "server-only";

import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";

import { getMongoDb } from "@/data/mongo/client";
import type { Customer } from "@/types/cms";

const payloadCookiePrefix = "payload";
const payloadTokenCookieName = `${payloadCookiePrefix}-token`;

type CustomerSessionPayload = {
  collection?: string;
  email?: string;
  id?: string;
  sid?: string;
};

type AuthenticatedCustomer = Customer & {
  _sid?: string;
  _strategy: "local-jwt";
  collection: "customers";
};

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const sanitizeCustomer = (rawCustomer: Record<string, unknown>, sid?: string) => {
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

  return customer as unknown as AuthenticatedCustomer;
};

const getVerifiedCustomerFromToken = async (token: string) => {
  const secret = process.env.PAYLOAD_SECRET;

  if (!secret) {
    return null;
  }

  const decodedPayload = jwt.verify(token, secret) as CustomerSessionPayload;

  if (decodedPayload.collection !== "customers" || !decodedPayload.id) {
    return null;
  }

  const db = await getMongoDb();
  const rawCustomer = await db.collection("customers").findOne({
    _id: { $in: buildIdCandidates(decodedPayload.id) },
  } as any);

  if (!rawCustomer) {
    return null;
  }

  if (rawCustomer._verified === false) {
    return null;
  }

  const sessions = Array.isArray(rawCustomer.sessions) ? rawCustomer.sessions : [];

  if (!decodedPayload.sid) {
    return null;
  }

  const activeSession = sessions.find((session) => {
    if (!session || typeof session !== "object") {
      return false;
    }

    const typedSession = session as { expiresAt?: string; id?: string };

    if (typedSession.id !== decodedPayload.sid) {
      return false;
    }

    if (!typedSession.expiresAt) {
      return false;
    }

    return new Date(typedSession.expiresAt).getTime() > Date.now();
  });

  if (!activeSession) {
    return null;
  }

  return sanitizeCustomer(rawCustomer as Record<string, unknown>, decodedPayload.sid);
};

export const getAuthenticatedCustomer = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(payloadTokenCookieName)?.value;

  if (!token) {
    return null;
  }

  try {
    return await getVerifiedCustomerFromToken(token);
  } catch (error) {
    console.error("Customer auth error:", error);
    return null;
  }
};
