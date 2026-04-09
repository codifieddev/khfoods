import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Product Categories.
 * Refactored from legacy Payload CMs.
 */
export const ProductCategories: CollectionConfig = {
  slug: "productCategories",
  admin: {
    useAsTitle: "title",
    group: { en: "Products", zh: "产品" }
  },
  labels: {
    singular: { en: "Product Category", zh: "产品分类" },
    plural: { en: "Product Categories", zh: "产品分类" }
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true
    },
    {
      name: "slug",
      type: "text",
    },
    {
       name: "image",
       type: "upload",
       relationTo: "media"
    },
    {
      name: "subcategories",
      type: "relationship",
      relationTo: "productSubCategories",
      hasMany: true
    },
  ]
};
