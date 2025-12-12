import { type CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { slugField } from "@/fields/slug";

export const ProductSubCategories: CollectionConfig = {
  slug: "productSubCategories",
  access: {
    read: anyone
  },
  admin: {
    useAsTitle: "title",
    group: {
      en: "Products",
      zh: "产品"
    }
  },
  labels: {
    singular: {
      en: "Product Subcategory",
      zh: "产品子分类"
    },
    plural: {
      en: "Product Subcategories",
      zh: "产品子分类"
    }
  },
  fields: [
    {
      name: "category",
      type: "relationship",
      relationTo: "productCategories",
      label: {
        en: "Parent category"

      },
      required: true
    },
    {
      name: "title",
      label: {
        en: "Subcategory name"

      },
      type: "text",
      required: true,
      localized: true
    },
    ...slugField(),
    {
      name: "products",
      label: {
        en: "Products in this category"

      },
      type: "join",
      collection: "products",
      on: "categoriesArr.subcategories"
    },
  ]
};
