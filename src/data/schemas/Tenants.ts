import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Websites (Tenants).
 * Refactored from legacy Payload CMs.
 */
export const Websites: CollectionConfig = {
  slug: "websites",
  labels: {
    singular: { en: "Website", zh: "网站" },
    plural: { en: "Websites", zh: "网站" }
  },
  admin: {
    useAsTitle: "name",
    group: { en: "Website Management", zh: "网站管理" },
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "domains",
      type: "array",
      fields: [
        {
          name: "domain",
          type: "text",
          required: true,
        },
      ]
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
    },
  ]
};
