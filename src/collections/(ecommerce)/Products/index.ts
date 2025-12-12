import { type CollectionConfig } from "payload";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";
import { superAdminOnlyAdmin, superAdminOnly } from "@/access/roleBasedAccess";
// import { authenticatedOrPublished } from "@/access/authenticatedOrPublished";
import { currencyField } from "@/fields/currencyField";
import { defaultLexical } from "@/fields/defaultLexical";
import { slugField } from "@/fields/slug";
import { generatePreviewPath } from "@/utilities/generatePreviewPath";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  labels: {
    singular: {
      en: "Product",
      zh: "产品",
      hr: "Proizvod", // Croatian
    },
    plural: {
      en: "Products list",
      zh: "产品列表",
      hr: "Popis proizvoda", // Croatian
    }
  },
  admin: {
    defaultColumns: ["title"],
    useAsTitle: "title",
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          path: `/product/${typeof data?.slug === "string" ? data.slug : ""}`,
          locale: req.locale
        });
        return `${process.env.NEXT_PUBLIC_SERVER_URL}${path}`;
      }
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        path: `/product/${typeof data?.slug === "string" ? data.slug : ""}`,
        locale: req.locale
      }),
    group: {
      en: "Products",
      zh: "产品",
      hr: "Proizvodi", // Croatian
    }
  },
  fields: [
    {
      name: "title",
      label: {
        en: "Product name",

        hr: "Naziv proizvoda", // Croatian
      },
      type: "text",
      localized: true,
      required: true
    },
    ...slugField(),
    {
      type: "tabs",
      tabs: [
        {
          label: {
            en: "Content"

          },
          fields: [
            {
              name: "description",
              label: {
                en: "Product description",

                hr: "Opis proizvoda", // Croatian
              },
              localized: true,
              type: "richText",
              editor: defaultLexical
            },
            {
              name: "images",
              label: {
                en: "Product images",

                hr: "Slike proizvoda", // Croatian
              },
              type: "upload",
              relationTo: "media",
              hasMany: true,
              maxRows: 10,
              minRows: 1,
              required: true,
              admin: {
                description: {
                  en: "If you have variants, first image will be variant image.",

                  hr: "Ako imate varijante, prva slika će biti slika varijante.", // Croatian
                }
              }
            },
            {
              name: "details",
              type: "array",
              label: {
                en: "Details",

                hr: "Detalji", // Croatian
              },
              labels: {
                singular: {
                  en: "Detail",

                  hr: "Detalj", // Croatian
                },
                plural: {
                  en: "Details",

                  hr: "Detalji", // Croatian
                }
              },
              admin: {
                components: {
                  RowLabel: "@/collections/(ecommerce)/Products/components/RowLabels/DetailLabel#DetailLabel"
                }
              },
              fields: [
                {
                  name: "title",
                  label: {
                    en: "Title",

                    hr: "Naslov", // Croatian
                  },
                  localized: true,
                  type: "text",
                  required: true
                },
                {
                  name: "content",
                  label: {
                    en: "Content",

                    hr: "Sadržaj", // Croatian
                  },
                  localized: true,
                  required: true,
                  type: "richText",
                  editor: defaultLexical
                },
              ]
            },
            {
              name: "Highlight",
              label: {
                en: "Highlight",
                zh: "包装",
              
              },
              localized: true,
              type: "text",
              
            }
          ]
        },
        {
          label: {
            en: "Variants options",

            hr: "Opcije varijanti", // Croatian
          },
          fields: [
            {
              type: "row",
              fields: [
                {
                  name: "enableVariants",
                  label: {
                    en: "Enable variants",

                    hr: "Omogući varijante", // Croatian
                  },
                  type: "checkbox",
                  admin: {
                    width: "fit-content"
                  }
                },
                {
                  name: "enableVariantPrices",
                  label: {
                    en: "Variants have different prices",

                    hr: "Varijante imaju različite cijene", // Croatian
                  },

                  type: "checkbox",
                  admin: {
                    description: {
                      en: "If false, price is in Product Details",

                      hr: "Ako je netočno, cijena je u detaljima proizvoda.", // Croatian
                    },
                    width: "fit-content",
                    style: {
                      marginLeft: "2rem"
                    }
                  }
                },
                {
                  name: "enableVariantWeights",
                  label: {
                    en: "Variants have different weights",

                    hr: "Varijante imaju različite težine", // Croatian
                  },

                  type: "checkbox",
                  admin: {
                    description: {
                      en: "If false, weight is in Product Details",

                      hr: "Ako je netočno, težina je u detaljima proizvoda.", // Croatian
                    },
                    width: "fit-content",
                    style: {
                      marginLeft: "2rem"
                    }
                  }
                },
              ]
            },
            {
              type: "radio",
              name: "variantsType",
              label: {
                en: "Variants type"

              },
              admin: {
                condition: (data) => Boolean(data.enableVariants)
              },
              defaultValue: "sizes",
              options: [
                {
                  value: "sizes",
                  label: {
                    en: "Only sizes"

                  }
                },
                {
                  value: "colors",
                  label: {
                    en: "Only colors"

                  }
                },
                {
                  value: "colorsAndSizes",
                  label: {
                    en: "Colors and sizes"

                  }
                },
              ]
            },
            {
              name: "colors",
              labels: {
                singular: {
                  en: "Color"

                },
                plural: {
                  en: "Colors"

                }
              },
              type: "array",
              admin: {
                components: {
                  RowLabel: "@/collections/(ecommerce)/Products/components/RowLabels/OptionLabel#OptionLabel"
                },
                condition: (_, siblingData) =>
                  Boolean(siblingData.enableVariants && siblingData.variantsType !== "sizes"),
                initCollapsed: true
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      label: {
                        en: "Color name"

                      },
                      type: "text",
                      localized: true,
                      required: true
                    },
                    {
                      name: "slug",
                      type: "text",
                      required: true,
                      label: {
                        en: "Color slug"

                      }
                    },
                  ]
                },
                {
                  name: "colorValue",
                  label: {
                    en: "Color"

                  },
                  type: "text",
                  admin: {
                    components: {
                      Field: "@/components/AdminColorPicker#AdminColorPicker"
                    }
                  }
                },
              ],
              label: {
                en: "Color options"

              },
              minRows: 1
            },
            {
              name: "sizes",
              labels: {
                singular: {
                  en: "Size"

                },
                plural: {
                  en: "Sizes"

                }
              },
              type: "array",
              admin: {
                components: {
                  RowLabel: "@/collections/(ecommerce)/Products/components/RowLabels/OptionLabel#OptionLabel"
                },
                condition: (_, siblingData) =>
                  Boolean(siblingData.enableVariants && siblingData.variantsType !== "colors"),
                initCollapsed: true
              },
              fields: [
                {
                  name: "label",
                  label: {
                    en: "Size label"

                  },
                  type: "text",
                  localized: true,
                  required: true
                },
                {
                  name: "slug",
                  type: "text",
                  required: true,
                  label: {
                    en: "Size slug"

                  }
                },
              ],
              label: {
                en: "Size options"

              },
              minRows: 1
            },
            {
              name: "variants",
              type: "array",
              admin: {
                components: {
                  RowLabel:
                    "@/collections/(ecommerce)/Products/components/RowLabels/VariantLabel#VariantLabel"
                },
                condition: (_, siblingData) => {
                  return Boolean(siblingData.enableVariants);
                }
              },
              validate: (value) => {
                if (!value) return true;

                const groupedByVariantSlug = value.reduce((acc: Record<string, any[]>, item: any) => {
                  if (!acc[item.variantSlug]) {
                    acc[item.variantSlug] = [];
                  }

                  acc[item.variantSlug].push(item);
                  return acc;
                }, {}) as any[];

                const duplicateSlugs = Object.keys(groupedByVariantSlug).filter(
                  (slug) => groupedByVariantSlug[slug].length > 1,
                );
                if (duplicateSlugs.length > 0) {
                  return `Duplicated variant slugs: ${duplicateSlugs.join(", ")}`;
                }
                return true;
              },
              fields: [
                {
                  type: "row",
                  admin: {
                    className: "variant-gap-row"
                  },
                  fields: [
                    {
                      name: "size",
                      type: "text",
                      index: true,
                      label: {
                        en: "Size"

                      },
                      admin: {
                        components: {
                          Field: "@/collections/(ecommerce)/Products/components/SizeSelect#SizeSelect"
                        },
                        condition: (_, siblingData) => siblingData.variantsType !== "colors"
                      }
                    },
                    {
                      name: "color",
                      index: true,
                      type: "text",
                      label: {
                        en: "Color"

                      },
                      admin: {
                        components: {
                          Field: "@/collections/(ecommerce)/Products/components/ColorSelect#ColorSelect"
                        },
                        condition: (_, siblingData) => siblingData.variantsType !== "sizes"
                      }
                    },
                  ]
                },
                {
                  name: "variantSlug",
                  type: "text",
                  admin: {
                    readOnly: true
                  }
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media"
                },
                {
                  name: "stock",
                  type: "number",
                  admin: {
                    description: {
                      en: "Define stock for this variant. A stock of 0 disables checkout for this variant."

                    }
                  },
                  defaultValue: 0,
                  required: true
                },
                {
                  name: "weight",
                  label: {
                    en: "Weight (g)"

                  },
                  type: "number",
                  admin: {
                    condition: (data) => Boolean(data.enableVariantWeights),
                    description: {
                      en: "Define weight for this variant."

                    }
                  },
                  defaultValue: 0,
                  required: true
                },
                {
                  name: "pricing",
                  type: "array",
                  label: {
                    en: "Pricing"

                  },
                  minRows: 1,
                  required: true,
                  labels: {
                    singular: {
                      en: "Price"

                    },
                    plural: {
                      en: "Prices"

                    }
                  },
                  admin: {
                    condition: (data) => Boolean(data.enableVariantPrices),
                    components: {
                      RowLabel: "@/components/(ecommerce)/RowLabels/PriceRowLabel#PriceRowLabel"
                    }
                  },
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "value",
                          index: true,
                          type: "number",
                          label: {
                            en: "Price"

                          },
                          required: true
                        },
                        currencyField,
                      ]
                    },
                  ]
                },
              ],
              minRows: 1
            },
          ]
        },
        {
          label: {
            en: "Product details"

          },
          admin: {
            // todo: not working condition, waiting for payload team to fix conditional tabs.
            // condition: (data) => {
            //   return !data.enableVariants && !data.enableVariantPrices;
            // }
          },
          fields: [
            {
              name: "categoriesArr",
              label: {
                en: "Product categories"

              },
              labels: {
                singular: {
                  en: "Category"

                },
                plural: {
                  en: "Categories"

                }
              },
              type: "array",
              fields: [
                {
                  name: "category",
                  label: {
                    en: "Category"

                  },
                  type: "relationship",
                  index: true,
                  relationTo: "productCategories",
                  required: true
                },
                {
                  name: "subcategories",
                  index: true,
                  type: "relationship",
                  label: {
                    en: "Subcategories"

                  },
                  relationTo: "productSubCategories",
                  filterOptions: ({ siblingData }) => {
                    const siblingDataTyped: {
                      category: string;
                    } = siblingData as any;
                    return {
                      category: {
                        equals: siblingDataTyped.category
                      }
                    };
                  },
                  hasMany: true
                },
              ]
            },
            {
              name: "stock",
              label: {
                en: "Stock"

              },
              type: "number",
              admin: {
                condition: (data) => !data.enableVariants,
                description: {
                  en: "Define stock for whole product. A stock of 0 disables checkout for this product."

                }
              },
              defaultValue: 0,
              required: true
            },
            {
              name: "weight",
              label: {
                en: "Weight (g)"

              },
              type: "number",
              admin: {
                condition: (data) => !data.enableVariantWeights,
                description: {
                  en: "Define weight for whole product."

                }
              },
              defaultValue: 0,
              required: true
            },
            {
              name: "pricing",
              type: "array",
              label: {
                en: "Pricing"

              },
              minRows: 1,
              required: true,
              labels: {
                singular: {
                  en: "Price"

                },
                plural: {
                  en: "Prices"

                }
              },
              admin: {
                condition: (data) => !data.enableVariantPrices,
                components: {
                  RowLabel: "@/components/(ecommerce)/RowLabels/PriceRowLabel#PriceRowLabel"
                }
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "number",
                      index: true,
                      label: {
                        en: "Price"

                      },
                      required: true
                    },
                    currencyField,
                  ]
                },
              ]
            },
            {
              name: "bought",
              index: true,
              label: {
                en: "Bought"

              },
              type: "number",
              defaultValue: 0
            },
          ]
        },
      ]
    },
  ],
  versions: {
    drafts: {
      autosave: {
        interval: 100
      },
      schedulePublish: true
    },
    maxPerDoc: 50
  }
};
