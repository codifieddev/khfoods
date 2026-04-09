import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for User Roles (Simplified).
 * Refactored from legacy Payload CMs.
 */
export const Roles: CollectionConfig = {
  slug: "roles",
  labels: {
    singular: { en: "User Role", zh: "用户角色" },
    plural: { en: "User Roles", zh: "用户角色" }
  },
  admin: {
    useAsTitle: "roleTitle",
    group: { en: "Administration", zh: "管理" },
  },
  fields: [
    {
      name: "roleTitle",
      type: "text",
      required: true,
    },
    {
      name: "roleDescription",
      type: "textarea",
    },
    {
      name: "selectedAdministrators",
      type: "relationship",
      relationTo: "administrators",
    },
    { name: "adminPermission", type: "text", hasMany: true },
    { name: "pagesPermission", type: "text", hasMany: true },
    { name: "productsPermission", type: "text", hasMany: true },
    { name: "mediaPermission", type: "text", hasMany: true },
    { name: "postPermission", type: "text", hasMany: true },
    { name: "websitePermission", type: "text", hasMany: true },
    { name: "orderPermission", type: "text", hasMany: true },
    { name: "shopPermission", type: "text", hasMany: true },
    { name: "courierPermission", type: "text", hasMany: true },
  ]
};
