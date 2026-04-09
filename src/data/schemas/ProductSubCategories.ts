import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Product Subcategories.
 * Refactored from legacy Payload CMs.
 */
export const ProductSubCategories: CollectionConfig = {
  slug: "productSubCategories",
  admin: {
    useAsTitle: "title",
    group: { en: "Products", zh: "产品" }
  },
  labels: {
    singular: { en: "Product Subcategory", zh: "产品子分类" },
    plural: { en: "Product Subcategories", zh: "产品子分类" }
  },
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "productCategories",
      required: true
    },
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
  ]
};
