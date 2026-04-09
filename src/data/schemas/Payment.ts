import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Payment configurations.
 * Refactored from legacy Payload CMs.
 */
export const Payment: CollectionConfig = {
  slug: "payment",
  admin: {
    group: { en: "Payments settings", zh: "支付设置" },
    useAsTitle: "website"
  },
  fields: [
    {
      name: "paywall",
      type: "select",
      options: [
        { label: "Stripe", value: "stripe" },
        { label: "Autopay", value: "autopay" },
        { label: "Przelewy24", value: "p24" },
      ],
      defaultValue: "stripe",
      required: true
    },
    {
      name: "stripe",
      type: "group",
      fields: [
        { name: "secret", type: "text", required: true },
        { name: "webhookSecret", type: "text", required: true },
        { name: "public", type: "text" },
      ]
    },
    {
      name: "autopay",
      type: "group",
      fields: [
        { name: "serviceID", type: "text", required: true },
        { name: "hashKey", type: "text", required: true },
        { name: "endpoint", type: "text", required: true },
      ]
    },
    {
      name: "p24",
      type: "group",
      fields: [
        { name: "posId", type: "text", required: true },
        { name: "crc", type: "text", required: true },
        { name: "secretId", type: "text", required: true },
        { name: "endpoint", type: "text", required: true },
      ]
    },
    {
      name: "website",
      type: "relationship",
      relationTo: "websites",
    },
  ]
};
