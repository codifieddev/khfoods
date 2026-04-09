import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Products.
 * Refactored from legacy Payload CMs.
 */
export const Products: CollectionConfig = {
  slug: "products",
  labels: {
    singular: { en: "Product", zh: "产品", hr: "Proizvod" },
    plural: { en: "Products list", zh: "产品列表", hr: "Popis proizvoda" }
  },
  admin: {
    useAsTitle: "title",
    group: { en: "Products", zh: "产品", hr: "Proizvodi" }
  },
  fields: [
    {
      name: "title",
      type: "text",
      localized: true,
      required: true
    },
    {
      name: "slug",
      type: "text",
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Content",
          fields: [
            {
              name: "description",
              localized: true,
              type: "richText",
            },
            {
              name: "images",
              type: "upload",
              relationTo: "media",
              hasMany: true,
              required: true,
            },
            {
              name: "details",
              type: "array",
              fields: [
                {
                  name: "title",
                  localized: true,
                  type: "text",
                  required: true
                },
                {
                  name: "content",
                  localized: true,
                  required: true,
                  type: "richText",
                },
              ]
            },
            {
              name: "Highlight",
              localized: true,
              type: "text",
            }
          ]
        },
        {
          label: "Variants options",
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "enableVariants",
                  type: "checkbox",
                },
                {
                  name: "enableVariantPrices",
                  type: "checkbox",
                },
                {
                  name: "enableVariantWeights",
                  type: "checkbox",
                },
              ]
            },
            {
              type: "radio",
              name: "variantsType",
              defaultValue: "sizes",
              options: [
                { value: "sizes", label: "Only sizes" },
                { value: "colors", label: "Only colors" },
                { value: "colorsAndSizes", label: "Colors and sizes" },
              ]
            },
            {
              name: "colors",
              type: "array",
              fields: [
                {
                  name: "label",
                  type: "text",
                  localized: true,
                  required: true
                },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                },
                {
                  name: "colorValue",
                  type: "text",
                },
              ],
            },
            {
              name: "sizes",
              type: "array",
              fields: [
                {
                  name: "label",
                  type: "text",
                  localized: true,
                  required: true
                },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "variants",
              type: "array",
              fields: [
                {
                  name: "size",
                  type: "text",
                },
                {
                  name: "color",
                  type: "text",
                },
                {
                  name: "variantSlug",
                  type: "text",
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media"
                },
                {
                  name: "stock",
                  type: "number",
                  defaultValue: 0,
                  required: true
                },
                {
                  name: "weight",
                  type: "number",
                  defaultValue: 0,
                  required: true
                },
                {
                  name: "pricing",
                  type: "array",
                  fields: [
                    {
                      name: "value",
                      type: "number",
                      required: true
                    },
                    {
                      name: "currency",
                      type: "text",
                    }
                  ]
                },
              ],
            },
          ]
        },
        {
          label: "Product details",
          fields: [
            {
              name: "categoriesArr",
              type: "array",
              fields: [
                {
                  name: "category",
                  type: "relationship",
                  relationTo: "productCategories",
                  required: true
                },
                {
                  name: "subcategories",
                  type: "relationship",
                  relationTo: "productSubCategories",
                  hasMany: true
                },
              ]
            },
            {
              name: "stock",
              type: "number",
              defaultValue: 0,
              required: true
            },
            {
              name: "weight",
              type: "number",
              defaultValue: 0,
              required: true
            },
            {
              name: "pricing",
              type: "array",
              fields: [
                {
                  name: "value",
                  type: "number",
                  required: true
                },
                {
                   name: "currency",
                   type: "text",
                }
              ]
            },
            {
              name: "bought",
              type: "number",
              defaultValue: 0
            },
          ]
        },
      ]
    },
  ],
};
