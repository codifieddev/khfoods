import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Pages.
 * Refactored from legacy Payload CMs.
 * Supports dynamic layout sections, rows, and columns.
 */
export const Pages: CollectionConfig = {
  slug: "pages",
  labels: {
    singular: { en: "Page", zh: "页面", hr: "Stranica" },
    plural: { en: "Pages", zh: "页面", hr: "Stranice" },
  },
  admin: {
    useAsTitle: "title",
    group: { en: "Page Settings", hr: "Postavke stranice" },
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "slug",
      type: "text",
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            { name: "type", type: "select", options: ["none", "highImpact", "mediumImpact", "lowImpact"] },
            { name: "richText", type: "richText", localized: true },
            { name: "links", type: "array", fields: [{ name: "link", type: "group", fields: [{ name: "label", type: "text" }, { name: "url", type: "text" }] }] },
            { name: "media", type: "upload", relationTo: "media" },
          ],
        },
        {
          label: "Content",
          fields: [
            {
              name: "sections",
              type: "blocks",
              blocks: [
                {
                  slug: "section",
                  fields: [
                    {
                      name: "rows",
                      type: "blocks",
                      blocks: [
                        {
                          slug: "row",
                          fields: [
                            {
                              name: "Columns",
                              type: "blocks",
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "backgroundColor",
                      type: "text",
                    },
                    {
                      name: "backgroundImage",
                      type: "upload",
                      relationTo: "media",
                    },
                  ]
                }
              ]
            }
          ]
        },
        {
          label: "SEO",
          name: "meta",
          localized: true,
          fields: [
            { name: "title", type: "text" },
            { name: "description", type: "textarea" },
            { name: "image", type: "upload", relationTo: "media" },
          ],
        },
      ]
    },
    {
      name: "website",
      type: "relationship",
      relationTo: "websites",
      required: true,
    },
  ],
};
