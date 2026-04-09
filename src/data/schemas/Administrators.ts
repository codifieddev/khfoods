import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Administrators.
 * Refactored from legacy Payload CMs.
 */
export const Administrators: CollectionConfig = {
  slug: "administrators",
  labels: {
    singular: { en: "Administrator", zh: "管理员" },
    plural: { en: "Administrators", zh: "管理员" }
  },
  admin: {
    useAsTitle: "name",
    group: { en: "Administration", zh: "管理" }
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "name",
      type: "text",
    },
    {
      name: "language",
      type: "select",
      options: [
        { label: "English", value: "en" },
        { label: "Hrvatski", value: "hr" },
        { label: "Polski", value: "pl" },
      ],
      defaultValue: "en",
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
    },
  ]
};
