import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Post Categories.
 * Refactored from legacy Payload CMs.
 */
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    plural: { en: "Posts Categories", zh: "文章分类", hr: "Kategorije objava" },
    singular: { en: "Post Category", zh: "文章分类", hr: "Kategorija objave" }
  },
  admin: {
    useAsTitle: "title",
    group: { en: "Page Settings", zh: "页面设置", hr: "Postavke stranice" }
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
      required: true,
      unique: true,
    }
  ]
};
