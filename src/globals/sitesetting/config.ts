// import { checkUserPermission } from "@/access/roleBasedAccess";
// import { link } from "@/fields/link";
// import { revalidateGlobal } from "@/hooks/revalidateGlobal";
// import { Administrator } from "@/types/cms";

// import type { AccessArgs, GlobalConfig } from "payload";

// export const SiteSetting: GlobalConfig = {
//   slug: "sitesetting",
 
//   label: {
//     en: "Site Settings",
  
//   },
//   admin: {
//     group: {
//       en: "Page Settings",
//     },
//   },
//   fields: [
//     {
//       name: "attribution",
//       type: "richText",
//       label: "Attribution",
//       localized: true,
//     },
//     {
//       name: "navItems",
//       type: "array",
//       fields: [
//         link({
//           appearances: false,
//         }),
//       ],
//       maxRows: 6,
//       admin: {
//         initCollapsed: true,
//         components: {
//           RowLabel: "@/globals/Footer/RowLabel#RowLabel",
//         },
//       },
//     },
//      {
//       name: "createdBy",
//       type: "relationship",
//       relationTo: "administrators",
//       required: true,
//       defaultValue: ({ req: { user } }) => user?.id,
//       admin: {
//         readOnly: true,
//         position: "sidebar",
//       },
//     },
//   ],

// };


import { checkUserPermission } from "@/access/roleBasedAccess";
import { link } from "@/fields/link";
import { revalidateGlobal } from "@/hooks/revalidateGlobal";
import { Administrator } from "@/types/cms";

import type { AccessArgs, GlobalConfig } from "payload";

export const SiteSetting: GlobalConfig = {
  slug: "sitesetting",
  label: {
    en: "Site Settings",
  },
  admin: {
    group: {
      en: "Page Settings",
    },
  },
  fields: [
    // Logo Tab
    {
      type: "tabs",
      tabs: [
        {
          label: "Logo",
          fields: [
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              label: "Primary Logo",
              required: false,
            },
            {
              name: "logoLight",
              type: "upload",
              relationTo: "media",
              label: "Logo Light (for dark backgrounds)",
              required: false,
            },
            {
              name: "logoDark",
              type: "upload",
              relationTo: "media",
              label: "Logo Dark (for light backgrounds)",
              required: false,
            },
            {
              name: "favicon",
              type: "upload",
              relationTo: "media",
              label: "Favicon",
              required: false,
            },
            {
              name: "logoWidth",
              type: "number",
              label: "Logo Width (px)",
              defaultValue: 150,
            },
            {
              name: "logoHeight",
              type: "number",
              label: "Logo Height (px)",
              defaultValue: 50,
            },
          ],
        },
         {
          label: "Site Identity",
          fields: [
            {
              name: "siteicon",
              type: "upload",
              relationTo: "media",
              label: "Site Icon",
              required: false,
            },
            {
              name: "sitetitle",
              type: "text",
              label: "Site Title",
            },
            {
              name: "tagline",
              type: "text",
              label: "Tagline",
            },
          ],
        },
        // Colors Tab
        {
          label: "Colors",
          fields: [
            {
              type: "collapsible",
              label: "Primary Colors",
              fields: [
                {
                  name: "primaryColor",
                  type: "text",
                  label: "Primary Color",
                  defaultValue: "#0070f3",
                  admin: {
                    description: "Main brand color",
                  },
                },
                {
                  name: "primaryHover",
                  type: "text",
                  label: "Primary Hover",
                  defaultValue: "#0051cc",
                },
                {
                  name: "primaryLight",
                  type: "text",
                  label: "Primary Light",
                  defaultValue: "#e6f2ff",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Secondary Colors",
              fields: [
                {
                  name: "secondaryColor",
                  type: "text",
                  label: "Secondary Color",
                  defaultValue: "#6c757d",
                },
                {
                  name: "secondaryHover",
                  type: "text",
                  label: "Secondary Hover",
                  defaultValue: "#545b62",
                },
                {
                  name: "secondaryLight",
                  type: "text",
                  label: "Secondary Light",
                  defaultValue: "#f8f9fa",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Tertiary Colors",
              fields: [
                {
                  name: "tertiaryColor",
                  type: "text",
                  label: "Tertiary Color",
                  defaultValue: "#17a2b8",
                },
                {
                  name: "tertiaryHover",
                  type: "text",
                  label: "Tertiary Hover",
                  defaultValue: "#117a8b",
                },
                {
                  name: "tertiaryLight",
                  type: "text",
                  label: "Tertiary Light",
                  defaultValue: "#d1ecf1",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Background Colors",
              fields: [
                {
                  name: "backgroundColor",
                  type: "text",
                  label: "Main Background",
                  defaultValue: "#ffffff",
                },
                {
                  name: "backgroundSecondary",
                  type: "text",
                  label: "Secondary Background",
                  defaultValue: "#f8f9fa",
                },
                {
                  name: "backgroundTertiary",
                  type: "text",
                  label: "Tertiary Background",
                  defaultValue: "#e9ecef",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Text Colors",
              fields: [
                {
                  name: "textPrimary",
                  type: "text",
                  label: "Primary Text",
                  defaultValue: "#212529",
                },
                {
                  name: "textSecondary",
                  type: "text",
                  label: "Secondary Text",
                  defaultValue: "#6c757d",
                },
                {
                  name: "textMuted",
                  type: "text",
                  label: "Muted Text",
                  defaultValue: "#adb5bd",
                },
                {
                  name: "textLink",
                  type: "text",
                  label: "Link Text",
                  defaultValue: "#0070f3",
                },
                {
                  name: "textLinkHover",
                  type: "text",
                  label: "Link Hover",
                  defaultValue: "#0051cc",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Semantic Colors",
              fields: [
                {
                  name: "successColor",
                  type: "text",
                  label: "Success",
                  defaultValue: "#28a745",
                },
                {
                  name: "warningColor",
                  type: "text",
                  label: "Warning",
                  defaultValue: "#ffc107",
                },
                {
                  name: "errorColor",
                  type: "text",
                  label: "Error",
                  defaultValue: "#dc3545",
                },
                {
                  name: "infoColor",
                  type: "text",
                  label: "Info",
                  defaultValue: "#17a2b8",
                },
              ],
            },
            {
              type: "collapsible",
              label: "Custom Colors",
              fields: [
                {
                  name: "customColors",
                  type: "array",
                  label: "Additional Custom Colors",
                  fields: [
                    {
                      name: "name",
                      type: "text",
                      label: "Color Name",
                      required: true,
                    },
                    {
                      name: "value",
                      type: "text",
                      label: "Color Value (Hex)",
                      required: true,
                    },
                    {
                      name: "description",
                      type: "textarea",
                      label: "Usage Description",
                    },
                  ],
                  admin: {
                    initCollapsed: true,
                  },
                },
              ],
            },
            {
              type: "collapsible",
              label: "Border & Shadow",
              fields: [
                {
                  name: "borderColor",
                  type: "text",
                  label: "Border Color",
                  defaultValue: "#dee2e6",
                },
                {
                  name: "shadowColor",
                  type: "text",
                  label: "Shadow Color",
                  defaultValue: "rgba(0, 0, 0, 0.1)",
                },
              ],
            },
          ],
        },
        // Typography Tab
        {
          label: "Typography",
          fields: [
            {
              type: "collapsible",
              label: "Font Families",
              fields: [
                {
                  name: "fontPrimary",
                  type: "text",
                  label: "Primary Font",
                  defaultValue: "Inter, sans-serif",
                  admin: {
                    description: "Main font for body text",
                  },
                },
                {
                  name: "fontSecondary",
                  type: "text",
                  label: "Secondary Font",
                  defaultValue: "Georgia, serif",
                  admin: {
                    description: "Font for headings or special text",
                  },
                },
                {
                  name: "fontMonospace",
                  type: "text",
                  label: "Monospace Font",
                  defaultValue: "Monaco, monospace",
                  admin: {
                    description: "Font for code blocks",
                  },
                },
              ],
            },
            {
              type: "collapsible",
              label: "Font Sizes",
              fields: [
                {
                  name: "fontSizeBase",
                  type: "number",
                  label: "Base Font Size (px)",
                  defaultValue: 16,
                },
                {
                  name: "fontSizeH1",
                  type: "number",
                  label: "H1 Size (px)",
                  defaultValue: 48,
                },
                {
                  name: "fontSizeH2",
                  type: "number",
                  label: "H2 Size (px)",
                  defaultValue: 40,
                },
                {
                  name: "fontSizeH3",
                  type: "number",
                  label: "H3 Size (px)",
                  defaultValue: 32,
                },
                {
                  name: "fontSizeH4",
                  type: "number",
                  label: "H4 Size (px)",
                  defaultValue: 24,
                },
                {
                  name: "fontSizeH5",
                  type: "number",
                  label: "H5 Size (px)",
                  defaultValue: 20,
                },
                {
                  name: "fontSizeH6",
                  type: "number",
                  label: "H6 Size (px)",
                  defaultValue: 18,
                },
                {
                  name: "fontSizeSmall",
                  type: "number",
                  label: "Small Text (px)",
                  defaultValue: 14,
                },
                {
                  name: "fontSizeLarge",
                  type: "number",
                  label: "Large Text (px)",
                  defaultValue: 20,
                },
              ],
            },
            {
              type: "collapsible",
              label: "Font Weights",
              fields: [
                {
                  name: "fontWeightLight",
                  type: "number",
                  label: "Light Weight",
                  defaultValue: 300,
                },
                {
                  name: "fontWeightNormal",
                  type: "number",
                  label: "Normal Weight",
                  defaultValue: 400,
                },
                {
                  name: "fontWeightMedium",
                  type: "number",
                  label: "Medium Weight",
                  defaultValue: 500,
                },
                {
                  name: "fontWeightSemibold",
                  type: "number",
                  label: "Semibold Weight",
                  defaultValue: 600,
                },
                {
                  name: "fontWeightBold",
                  type: "number",
                  label: "Bold Weight",
                  defaultValue: 700,
                },
              ],
            },
            {
              type: "collapsible",
              label: "Line Heights & Spacing",
              fields: [
                {
                  name: "lineHeightBase",
                  type: "number",
                  label: "Base Line Height",
                  defaultValue: 1.5,
                  admin: {
                    step: 0.1,
                  },
                },
                {
                  name: "lineHeightHeading",
                  type: "number",
                  label: "Heading Line Height",
                  defaultValue: 1.2,
                  admin: {
                    step: 0.1,
                  },
                },
                {
                  name: "letterSpacingNormal",
                  type: "text",
                  label: "Normal Letter Spacing",
                  defaultValue: "0",
                },
                {
                  name: "letterSpacingWide",
                  type: "text",
                  label: "Wide Letter Spacing",
                  defaultValue: "0.05em",
                },
              ],
            },
          ],
        },
        // Navigation Tab (existing content)
        {
          label: "Navigation",
          fields: [
            {
              name: "attribution",
              type: "richText",
              label: "Attribution",
              localized: true,
            },
            {
              name: "navItems",
              type: "array",
              fields: [
                link({
                  appearances: false,
                }),
              ],
              maxRows: 6,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: "@/globals/Footer/RowLabel#RowLabel",
                },
              },
            },
          ],
        },
      ],
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
      required: true,
      defaultValue: ({ req: { user } }) => user?.id,
      admin: {
        readOnly: true,
        position: "sidebar",
      },
    },
  ],
};

