import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Posts.
 * Refactored from legacy Payload CMs.
 */
export const Post: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: { en: "Post", zh: "文章" },
    plural: { en: "Posts", zh: "文章" }
  },
  admin: {
    useAsTitle: "title",
    group: { en: "Page Settings" }
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
    },
    {
      name: "heroImage",
      type: "relationship",
      relationTo: "media"
    },
    {
      name: "content",
      type: "richText",
      localized: true,
      required: true
    },
    {
      name: "relatedPosts",
      type: "relationship",
      hasMany: true,
      relationTo: "posts"
    },
    {
      name: "categories",
      type: "relationship",
      hasMany: true,
      relationTo: "categories"
    },
    {
      name: "meta",
      type: "group",
      fields: [
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "image", type: "relationship", relationTo: "media" },
      ]
    },
    {
      name: "publishedAt",
      type: "date",
    },
    {
      name: "authors",
      type: "relationship",
      hasMany: true,
      relationTo: "administrators"
    }
  ]
};
