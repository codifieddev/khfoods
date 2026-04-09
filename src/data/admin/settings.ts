import "server-only";

import { getMongoDb } from "@/data/mongo/client";
import { getAuthenticatedAdministrator } from "@/data/storefront/adminAuth";
import {
  getEmailMessagesData,
  getFulfilmentData,
  getShopSettingsData,
  getSiteSettingsData,
  getStorefrontGlobal,
} from "@/data/storefront/globals";
import { defaultLocale } from "@/i18n/config";
import type { Payment } from "@/types/cms";

type SettingsSnapshot = {
  couriers: {
    cod: Awaited<ReturnType<typeof getStorefrontGlobal<"inpost-courier-cod">>>;
    standard: Awaited<ReturnType<typeof getStorefrontGlobal<"inpost-courier">>>;
  };
  emailMessages: Awaited<ReturnType<typeof getEmailMessagesData>>;
  fulfilment: Awaited<ReturnType<typeof getFulfilmentData>>;
  payment: Payment | null;
  shopSettings: Awaited<ReturnType<typeof getShopSettingsData>>;
  siteSettings: Awaited<ReturnType<typeof getSiteSettingsData>>;
};

const getPaymentSettings = async () => {
  const db = await getMongoDb();
  const payment = await db.collection("payment").findOne({}, { sort: { createdAt: 1 } });

  if (!payment) {
    return null;
  }

  return {
    ...(payment as Record<string, unknown>),
    id:
      typeof (payment as { id?: unknown }).id === "string"
        ? ((payment as unknown as { id: string }).id ?? "")
        : payment._id?.toString?.() ?? "",
  } as Payment;
};

export const getAdminSettingsSnapshot = async (): Promise<SettingsSnapshot> => {
  const [shopSettings, emailMessages, siteSettings, fulfilment, standardCourier, codCourier, payment] = await Promise.all([
    getShopSettingsData(defaultLocale),
    getEmailMessagesData(defaultLocale),
    getSiteSettingsData(defaultLocale),
    getFulfilmentData(defaultLocale),
    getStorefrontGlobal("inpost-courier", defaultLocale),
    getStorefrontGlobal("inpost-courier-cod", defaultLocale),
    getPaymentSettings(),
  ]);

  return {
    couriers: {
      cod: codCourier,
      standard: standardCourier,
    },
    emailMessages,
    fulfilment,
    payment,
    shopSettings,
    siteSettings,
  };
};

export const updateAdminSettings = async (payload: {
  additionalText?: string;
  availableCurrencies?: string[];
  currencyValues?: { currency: string; value: number }[];
  enableOAuth?: boolean;
  fulfilmentAddress?: {
    address: string;
    city: string;
    country: string;
    email: string;
    name: string;
    phone: string;
    postalCode: string;
    region: string;
  };
  paywall?: Payment["paywall"];
  primaryColor?: string;
  shopTagline?: string;
  shopTitle?: string;
  smtp?: {
    fromEmail: string;
    host: string;
    password: string;
    port: number;
    secure: boolean;
    user: string;
  };
  p24?: NonNullable<Payment["p24"]>;
  stripe?: NonNullable<Payment["stripe"]>;
  autopay?: NonNullable<Payment["autopay"]>;
  template?: "default" | "template 1";
}) => {
  const administrator = await getAuthenticatedAdministrator();

  if (!administrator) {
    throw new Error("Unauthorized");
  }

  const db = await getMongoDb();
  const now = new Date().toISOString();

  await db.collection("globals").updateOne(
    { globalType: "shopSettings" },
    {
      $set: {
        availableCurrencies: payload.availableCurrencies ?? ["USD"],
        currencyValues: payload.currencyValues ?? [],
        enableOAuth: Boolean(payload.enableOAuth),
        globalType: "shopSettings",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await db.collection("globals").updateOne(
    { globalType: "emailMessages" },
    {
      $set: {
        "messages.additionalText": payload.additionalText ?? "",
        "messages.template": payload.template ?? "default",
        globalType: "emailMessages",
        smtp: payload.smtp,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  await db.collection("globals").updateOne(
    { globalType: "sitesetting" },
    {
      $set: {
        globalType: "sitesetting",
        primaryColor: payload.primaryColor ?? "#0070f3",
        sitetitle: payload.shopTitle ?? "",
        tagline: payload.shopTagline ?? "",
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  if (payload.fulfilmentAddress) {
    await db.collection("globals").updateOne(
      { globalType: "fulfilment" },
      {
        $set: {
          globalType: "fulfilment",
          shopAddress: payload.fulfilmentAddress,
          updatedAt: now,
        },
        $setOnInsert: {
          createdAt: now,
        },
      },
      { upsert: true },
    );
  }

  const existingPayment = await getPaymentSettings();

  await db.collection("payment").updateOne(
    {},
    {
      $set: {
        autopay: payload.autopay ?? existingPayment?.autopay ?? null,
        paywall: payload.paywall ?? existingPayment?.paywall ?? "stripe",
        p24: payload.p24 ?? existingPayment?.p24 ?? null,
        stripe: payload.stripe ?? existingPayment?.stripe ?? null,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  );

  return getAdminSettingsSnapshot();
};
