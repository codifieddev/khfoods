import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Couriers.
 * Refactored from legacy Payload CMs.
 */
export const Courier: CollectionConfig = {
  slug: "courier",
  admin: {
    group: { en: "Courier integrations", zh: "快递集成" },
    useAsTitle: "website"
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "InPost Courier",
          fields: [],
        },
        {
          label: "API Keys",
          fields: [
            { name: "clientId", type: "text", required: true },
            { name: "accountnumber", type: "text" },
            {
              name: "APIUrl",
              type: "select",
              required: true,
              defaultValue: "https://apis-sandbox.fedex.com",
              options: [
                { label: "Production", value: "https://api-shipx-pl.easypack24.net" },
                { label: "Sandbox", value: "https://apis-sandbox.fedex.com" },
              ],
            },
            { name: "shipXAPIKey", type: "text", required: true },
            { name: "shipSecretKey", type: "text", required: true },
          ]
        },
      ]
    },
    {
      name: "website",
      type: "relationship",
      relationTo: "websites",
    },
  ]
};
