import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Product Attributes.
 * Refactored from legacy Payload CMs.
 */
export const Attributes: CollectionConfig = {
  slug: "attributes",
  labels: {
    singular: { en: "Attribute", zh: "产品", hr: "Proizvod" },
    plural: { en: "Attribute list", zh: "产品列表", hr: "Popis proizvoda" },
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "defaultvalues",
      type: "array",
      fields: [
        {
          name: "value",
          type: "text",
          required: true,
        },
      ],
    },
  ],
};
