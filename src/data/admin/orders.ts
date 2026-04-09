import "server-only";

import { ObjectId } from "mongodb";

import { getMongoDb } from "@/data/mongo/client";
import { getStorefrontOrderByNumber, getStorefrontProductsByIds, updateStorefrontOrderStatus } from "@/data/storefront/commerce";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import type { Order, Product } from "@/types/cms";

type RawOrder = Record<string, unknown> & {
  _id?: ObjectId | string;
  id?: string;
  createdAt?: string;
  customer?: string | { id?: string } | null;
  orderDetails?: {
    amountPaid?: number | null;
    currency?: string;
    shippingDate?: string | null;
    status?: Order["orderDetails"]["status"];
    totalWithShipping?: number;
    trackingNumber?: string | null;
  };
  printLabel?: {
    labelurl?: string | null;
    packageNumber?: string | null;
  };
  shippingAddress?: {
    email?: string;
    name?: string;
  };
};

const mapDocumentId = <T extends Record<string, unknown>>(document: T) => {
  const mappedDocument: Record<string, unknown> = {
    ...document,
  };

  if (!mappedDocument.id && mappedDocument._id instanceof ObjectId) {
    mappedDocument.id = mappedDocument._id.toString();
  }

  if (!mappedDocument.id && typeof mappedDocument._id === "string") {
    mappedDocument.id = mappedDocument._id;
  }

  return mappedDocument;
};

const buildIdCandidates = (value: string) => {
  const candidates: (string | ObjectId)[] = [value];

  if (ObjectId.isValid(value)) {
    candidates.push(new ObjectId(value));
  }

  return candidates;
};

const toOrderSummary = (order: RawOrder) => ({
  amountPaid: typeof order.orderDetails?.amountPaid === "number" ? order.orderDetails.amountPaid : 0,
  createdAt: order.createdAt ?? null,
  currency: order.orderDetails?.currency ?? "USD",
  customerId:
    typeof order.customer === "string"
      ? order.customer
      : order.customer && typeof order.customer === "object" && typeof order.customer.id === "string"
        ? order.customer.id
        : null,
  email: order.shippingAddress?.email ?? "No email",
  id:
    (typeof order.id === "string" && order.id) ||
    (typeof order._id === "string" ? order._id : order._id?.toString?.() ?? ""),
  labelUrl: order.printLabel?.labelurl ?? null,
  name: order.shippingAddress?.name ?? "Unknown customer",
  packageNumber: order.printLabel?.packageNumber ?? null,
  shippingDate: order.orderDetails?.shippingDate ?? null,
  status: order.orderDetails?.status ?? "pending",
  totalWithShipping: typeof order.orderDetails?.totalWithShipping === "number" ? order.orderDetails.totalWithShipping : 0,
  trackingNumber: order.orderDetails?.trackingNumber ?? null,
});

export const getAdminOrders = async ({
  limit = 20,
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

  if (status && status !== "all") {
    filters.push({ "orderDetails.status": status });
  }

  if (normalizedQuery) {
    const regex = new RegExp(normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    filters.push({
      $or: [
        { id: regex },
        { "shippingAddress.email": regex },
        { "shippingAddress.name": regex },
        { "orderDetails.transactionID": regex },
        { "orderDetails.trackingNumber": regex },
      ],
    });
  }

  const where = filters.length > 0 ? { $and: filters } : {};
  const rawOrders = (await db
    .collection("orders")
    .find(where)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray()) as RawOrder[];

  return rawOrders.map((order) => toOrderSummary(order));
};

export const getAdminOrderById = async ({
  id,
  locale = defaultLocale,
}: {
  id: string;
  locale?: Locale;
}) => {
  const order = await getStorefrontOrderByNumber(id);

  if (!order) {
    return null;
  }

  const productIds = Array.from(
    new Set(
      (order.products ?? [])
        .map((product) =>
          typeof product.product === "string"
            ? product.product
            : typeof product.product?.id === "string"
              ? product.product.id
              : product.id ?? null,
        )
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const filledProducts = productIds.length
    ? await getStorefrontProductsByIds({
        ids: productIds,
        locale,
      })
    : [];

  const productsById = new Map<string, Product>(filledProducts.map((product) => [product.id, product]));

  const hydratedProducts = (order.products ?? []).map((product) => {
    const productId =
      typeof product.product === "string"
        ? product.product
        : typeof product.product?.id === "string"
          ? product.product.id
          : product.id ?? "";

    return {
      ...product,
      productDoc: productId ? productsById.get(productId) ?? null : null,
    };
  });

  return {
    order,
    products: hydratedProducts,
  };
};

export const updateAdminOrder = async ({
  id,
  orderNote,
  shippingDate,
  status,
  trackingNumber,
}: {
  id: string;
  orderNote?: string;
  shippingDate?: string | null;
  status?: Order["orderDetails"]["status"];
  trackingNumber?: string | null;
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    throw new Error("Unauthorized");
  }

  const db = await getMongoDb();
  const existingOrder = await getStorefrontOrderByNumber(id);

  if (!existingOrder) {
    throw new Error("Order not found");
  }

  let updatedOrder = existingOrder;

  if (status && status !== existingOrder.orderDetails.status) {
    const orderWithStatus = await updateStorefrontOrderStatus({
      locale: defaultLocale,
      orderNumber: id,
      status,
      trackingNumber: trackingNumber ?? existingOrder.orderDetails.trackingNumber ?? undefined,
    });

    if (!orderWithStatus) {
      throw new Error("Unable to update status");
    }

    updatedOrder = orderWithStatus;
  }

  const updateFields: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (orderNote !== undefined) {
    updateFields["orderDetails.orderNote"] = orderNote;
  }

  if (trackingNumber !== undefined) {
    updateFields["orderDetails.trackingNumber"] = trackingNumber;
  }

  if (shippingDate !== undefined) {
    updateFields["orderDetails.shippingDate"] = shippingDate;
  }

  if (Object.keys(updateFields).length > 1) {
    await db.collection("orders").updateOne(
      { id },
      {
        $set: updateFields,
      },
    );
  }

  return getStorefrontOrderByNumber(id);
};
