import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Permissions (RBAC).
 * Refactored from legacy Payload CMs.
 */
export const Permission: CollectionConfig = {
  slug: "permission",
  labels: {
    singular: { en: "Permission", zh: "权限", hr: "Dozvola" },
    plural: { en: "Permissions", zh: "权限", hr: "Dozvole" }
  },
  admin: {
    useAsTitle: "roleTitle",
    group: { en: "Administration", zh: "管理", hr: "Administracija" }
  },
  fields: [
    {
      name: "roleTitle",
      type: "text",
      required: true
    },
    {
      name: "administrators",
      type: "relationship",
      relationTo: "administrators",
      hasMany: true,
      required: true,
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
