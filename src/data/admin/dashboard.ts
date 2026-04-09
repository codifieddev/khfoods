import "server-only";

import { getMongoDb } from "@/data/mongo/client";
import { getShopSettingsData } from "@/data/storefront/globals";

type RawOrder = {
  _id?: { toString?: () => string } | string;
  createdAt?: string;
  id?: string;
  orderDetails?: {
    currency?: string;
    status?: string;
    totalWithShipping?: number;
  };
  shippingAddress?: {
    email?: string;
    name?: string;
  };
};

const defaultDateCutoff = () => {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
};

const normalizeOrderTotal = ({
  currency,
  currencyValues,
  defaultCurrency,
  totalWithShipping,
}: {
  currency?: string;
  currencyValues?: { currency: string; value: number; id?: string | null }[] | null;
  defaultCurrency: string;
  totalWithShipping?: number;
}) => {
  const amount = typeof totalWithShipping === "number" ? totalWithShipping : 0;

  if (!currency || currency === defaultCurrency) {
    return amount;
  }

  const conversionRate = currencyValues?.find((entry) => entry.currency === currency)?.value ?? 1;
  return amount / conversionRate;
};

export const getAdminDashboardSnapshot = async () => {
  const db = await getMongoDb();
  const shopSettings = await getShopSettingsData("en");
  const defaultCurrency = shopSettings.availableCurrencies?.[0] ?? "USD";
  const cutoff = defaultDateCutoff();

  const [orders, ordersLast30Days, customers, products, pendingOrders, recentOrders] = await Promise.all([
    db.collection("orders").find({}, { projection: { orderDetails: 1 } }).toArray() as Promise<RawOrder[]>,
    db.collection("orders").countDocuments({ createdAt: { $gte: cutoff } }),
    db.collection("customers").countDocuments(),
    db.collection("products").countDocuments(),
    db.collection("orders").countDocuments({ "orderDetails.status": "pending" }),
    db
      .collection("orders")
      .find(
        {},
        {
          projection: {
            createdAt: 1,
            id: 1,
            orderDetails: 1,
            shippingAddress: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(6)
      .toArray() as Promise<RawOrder[]>,
  ]);

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum +
      normalizeOrderTotal({
        currency: order.orderDetails?.currency,
        currencyValues: shopSettings.currencyValues,
        defaultCurrency,
        totalWithShipping: order.orderDetails?.totalWithShipping,
      }),
    0,
  );

  return {
    currency: defaultCurrency,
    customers,
    orders: orders.length,
    ordersLast30Days,
    pendingOrders,
    products,
    recentOrders: recentOrders.map((order) => ({
      createdAt: order.createdAt ?? null,
      email: order.shippingAddress?.email ?? "No email",
      id:
        (typeof order.id === "string" && order.id) ||
        (typeof order._id === "string" ? order._id : order._id?.toString?.() ?? ""),
      name: order.shippingAddress?.name ?? "Unknown customer",
      status: order.orderDetails?.status ?? "pending",
      totalWithShipping: typeof order.orderDetails?.totalWithShipping === "number" ? order.orderDetails.totalWithShipping : 0,
    })),
    totalRevenue,
  };
};
