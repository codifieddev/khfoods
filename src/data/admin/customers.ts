import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { getStorefrontCustomerOrders } from "@/data/storefront/commerce";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import {
  buildCustomerFullName,
  findCustomerByEmail,
  normalizeCustomerEmail,
  sanitizeCustomer,
} from "@/data/storefront/customerAccounts";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Customer } from "@/types/cms";

type RawCustomer = Record<string, unknown> & {
  _id?: ObjectId | string;
  _verified?: boolean | null;
  birthDate?: string | null;
  createdAt?: string;
  email?: string;
  firstName?: string | null;
  fullName?: string | null;
  id?: string;
  lastBuyerType?: Customer["lastBuyerType"];
  lastName?: string | null;
  lockUntil?: string | null;
  shippings?: Customer["shippings"];
  updatedAt?: string;
};

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const toDocumentId = (document: { id?: string; _id?: string | ObjectId }) =>
  document.id || (typeof document._id === "string" ? document._id : document._id?.toString?.() ?? "");

const isCustomerLocked = (customer: RawCustomer) =>
  typeof customer.lockUntil === "string" && new Date(customer.lockUntil).getTime() > Date.now();

const toCustomerSummary = (customer: RawCustomer, orderCount = 0) => ({
  createdAt: customer.createdAt ?? null,
  email: customer.email ?? "",
  firstName: customer.firstName ?? null,
  fullName: customer.fullName || [customer.firstName, customer.lastName].filter(Boolean).join(" ").trim() || "Unnamed customer",
  id: toDocumentId(customer),
  isLocked: isCustomerLocked(customer),
  isVerified: customer._verified !== false,
  lastBuyerType: customer.lastBuyerType ?? null,
  lastName: customer.lastName ?? null,
  orderCount,
  updatedAt: customer.updatedAt ?? null,
});

const getRawCustomerById = async (id: string) => {
  const db = await getMongoDb();

  for (const candidate of buildIdCandidates(id)) {
    const customer = await db.collection("customers").findOne({
      $or: [{ _id: candidate as never }, { id: candidate as never }],
    });

    if (customer) {
      return customer as RawCustomer;
    }
  }

  return null;
};

export const getAdminCustomers = async ({
  limit = 30,
  query,
  status,
}: {
  limit?: number;
  query?: string;
  status?: string;
}) => {
  const db = await getMongoDb();
  const filters: Record<string, unknown>[] = [];
  const normalizedQuery = query?.trim();

  if (status === "verified") {
    filters.push({ _verified: { $ne: false } });
  } else if (status === "unverified") {
    filters.push({ _verified: false });
  } else if (status === "locked") {
    filters.push({ lockUntil: { $gt: new Date().toISOString() } });
  }

  if (normalizedQuery) {
    const regex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    filters.push({
      $or: [{ email: regex }, { fullName: regex }, { firstName: regex }, { lastName: regex }],
    });
  }

  const where = filters.length ? { $and: filters } : {};
  const rawCustomers = (await db
    .collection("customers")
    .find(where)
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray()) as RawCustomer[];

  const customerIds = rawCustomers.map((customer) => toDocumentId(customer)).filter(Boolean);
  const orderCounts =
    customerIds.length > 0
      ? await db
          .collection("orders")
          .aggregate<{ _id: string; count: number }>([
            {
              $match: {
                customer: { $in: customerIds.flatMap((id) => buildIdCandidates(id)) },
              },
            },
            {
              $group: {
                _id: { $toString: "$customer" },
                count: { $sum: 1 },
              },
            },
          ])
          .toArray()
      : [];

  const orderCountByCustomerId = new Map(orderCounts.map((entry) => [entry._id, entry.count]));

  return rawCustomers.map((customer) => toCustomerSummary(customer, orderCountByCustomerId.get(toDocumentId(customer)) ?? 0));
};

export const getAdminCustomerById = async ({
  id,
  locale = defaultLocale,
}: {
  id: string;
  locale?: Locale;
}) => {
  const rawCustomer = await getRawCustomerById(id);

  if (!rawCustomer) {
    return null;
  }

  const customer = sanitizeCustomer(rawCustomer) as Customer;
  const orders = await getStorefrontCustomerOrders({
    customerId: customer.id,
    locale,
  });

  return {
    customer,
    orders: orders.map((order) => ({
      createdAt: order.createdAt,
      currency: order.orderDetails?.currency ?? "USD",
      id: order.id,
      status: order.orderDetails?.status ?? "pending",
      totalWithShipping: order.orderDetails?.totalWithShipping ?? 0,
      trackingNumber: order.orderDetails?.trackingNumber ?? null,
    })),
    summary: {
      defaultShipping:
        customer.shippings?.find((shipping) => shipping.default) ?? customer.shippings?.[0] ?? null,
      orderCount: orders.length,
    },
  };
};

export const updateAdminCustomer = async ({
  birthDate,
  email,
  firstName,
  id,
  isVerified,
  lastBuyerType,
  lastName,
  unlockAccount,
}: {
  birthDate?: string | null;
  email?: string;
  firstName?: string;
  id: string;
  isVerified?: boolean;
  lastBuyerType?: Customer["lastBuyerType"];
  lastName?: string;
  unlockAccount?: boolean;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    throw new Error("Unauthorized");
  }

  const rawCustomer = await getRawCustomerById(id);

  if (!rawCustomer) {
    throw new Error("Customer not found");
  }

  const updateFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  const nextFirstName = firstName !== undefined ? firstName.trim() : (rawCustomer.firstName ?? null);
  const nextLastName = lastName !== undefined ? lastName.trim() : (rawCustomer.lastName ?? null);

  if (firstName !== undefined) {
    updateFields.firstName = nextFirstName;
  }

  if (lastName !== undefined) {
    updateFields.lastName = nextLastName;
  }

  if (firstName !== undefined || lastName !== undefined) {
    updateFields.fullName = buildCustomerFullName(nextFirstName, nextLastName);
  }

  if (email !== undefined) {
    const nextEmail = normalizeCustomerEmail(email);

    if (!nextEmail) {
      throw new Error("Email is required");
    }

    if (nextEmail !== normalizeCustomerEmail(rawCustomer.email ?? "")) {
      const existingCustomer = await findCustomerByEmail(nextEmail);

      if (existingCustomer && existingCustomer._id.toString() !== rawCustomer._id?.toString?.()) {
        throw new Error("Email already in use");
      }
    }

    updateFields.email = nextEmail;
  }

  if (birthDate !== undefined) {
    updateFields.birthDate = birthDate;
  }

  if (lastBuyerType !== undefined) {
    updateFields.lastBuyerType = lastBuyerType;
  }

  if (isVerified !== undefined) {
    updateFields._verified = isVerified;
  }

  if (unlockAccount) {
    updateFields.lockUntil = null;
    updateFields.loginAttempts = 0;
  }

  const db = await getMongoDb();
  await db.collection("customers").updateOne(
    { _id: rawCustomer._id as never },
    {
      $set: updateFields,
    },
  );

  return getAdminCustomerById({ id, locale: defaultLocale });
};
