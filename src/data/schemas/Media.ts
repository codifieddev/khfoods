import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Media.
 * Refactored from legacy Payload CMs.
 */
export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: { en: "Media", zh: "媒体" },
    plural: { en: "Media", zh: "媒体" }
  },
  admin: {
    group: { en: "Page Settings" }
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "caption",
      type: "richText",
      localized: true,
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
    },
    {
      name: "url",
      type: "text",
    },
    {
      name: "filename",
      type: "text",
    },
    {
      name: "mimeType",
      type: "text",
    },
    {
      name: "filesize",
      type: "number",
    },
    {
      name: "width",
      type: "number",
    },
    {
      name: "height",
      type: "number",
    },
    {
      name: "sizes",
      type: "json",
    }
  ]
};
