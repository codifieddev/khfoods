// import {
//   TwoEqualColumnsSection,
//   ThreeEqualColumnsSection,
//   FourEqualColumnsSection,
//   TwoThirdsOneThirdSection,
//   OneThirdTwoThirdsSection,
//   OneQuarterThreeQuartersSection,
//   ThreeQuartersOneQuarterSection,
//   TwoRowsTwoColumnsSection,
//   TwoRowsThreeColumnsSection,
//   ThreeRowsTwoColumnsSection,
//   ThreeRowsThreeColumnsSection,
//   SidebarMainLayoutSection,
//   MainSidebarLayoutSection,
//   HeaderTwoColumnsLayoutSection,
//   HeaderThreeColumnsLayoutSection,
//   MasonryLayoutSection,
// } from "@/section/blocks";

// import { hero } from "@/components/heros/config";
// import { slugField } from "@/fields/slug";
// import { populatePublishedAt } from "@/hooks/populatePublishedAt";
// import { generatePreviewPath } from "@/utilities/generatePreviewPath";
// import type {
//   Access,
//   AccessArgs,
//   AccessResult,
//   CollectionConfig,
// } from "payload";
// import type { Administrator } from "@/types/cms";
// import { checkUserPermission } from "@/access/roleBasedAccess";

// import { revalidateDelete, revalidatePage } from "./hooks/revalidatePage";
// import { AboutPage } from "@/blocks/About/config";
// import { TextBlock } from "@/blocks/Heading";
// import { LayoutBlock } from "@/blocks/Container";
// import { ButtonBlock } from "@/blocks/Button";
// import {
//   MetaDescriptionField,
//   MetaImageField,
//   MetaTitleField,
//   OverviewField,
//   PreviewField,
// } from "@payloadcms/plugin-seo/fields";
// import { SaveToLibrary } from "@/components/CustomeButton";

// // Helper functions that return AccessResult
// const createdByUserWhere = (userId: string): AccessResult => ({
//   createdBy: {
//     equals: userId,
//   },
// });

// const websitesInListWhere = (websiteIds: string[]): AccessResult => ({
//   website: {
//     in: websiteIds,
//   },
// });

// const publicAccessWhere = (): AccessResult => ({
//   _status: {
//     equals: "published",
//   },
// });

// // Define Module blocks (content components)
// const moduleBlocks = [
//   TextBlock,
//   ButtonBlock,
//   LayoutBlock,
//   AboutPage,
//   // Add more content modules here as needed
// ];

// const columnBlocks = [
//        TwoEqualColumnsSection,
//                 ThreeEqualColumnsSection,
//                 FourEqualColumnsSection,
//                 TwoThirdsOneThirdSection,
//                 OneThirdTwoThirdsSection,
//                 OneQuarterThreeQuartersSection,
//                 ThreeQuartersOneQuarterSection,
//                 TwoRowsTwoColumnsSection,
//                 TwoRowsThreeColumnsSection,
//                 ThreeRowsTwoColumnsSection,
//                 ThreeRowsThreeColumnsSection,
//                 SidebarMainLayoutSection,
//                 MainSidebarLayoutSection,
//                 HeaderTwoColumnsLayoutSection,
//                 HeaderThreeColumnsLayoutSection,
//                 MasonryLayoutSection,
// ]

// // Define Column configuration
// const columnConfig:any = {
//   name: "columns",
//   type: "blocks",
//   label: "Columns",
//   blocks: [
//     {
//       slug: "column",
//       labels: {
//         singular: "Column",
//         plural: "Columns",
//       },
//       fields: [
//         {
//           type: "tabs",
//           tabs: [
//             {
//               label: "Content",
//               fields: [
//                 {
//                   name: "modules",
//                   type: "blocks",
//                   label: "Modules",
//                   blocks: moduleBlocks,
//                   required: false,
//                 },
//               ],
//             },
//             {
//               label: "Column Styling",
//               fields: [
//                 {
//                   type: "collapsible",
//                   label: "Column Settings",
//                   fields: [
//                     {
//                       type: "row",
//                       fields: [
//                         {
//                           name: "width",
//                           type: "select",
//                           label: "Column Width",
//                           options: [
//                             { label: "Auto", value: "auto" },
//                             { label: "1/12", value: "1" },
//                             { label: "2/12", value: "2" },
//                             { label: "3/12 (1/4)", value: "3" },
//                             { label: "4/12 (1/3)", value: "4" },
//                             { label: "5/12", value: "5" },
//                             { label: "6/12 (1/2)", value: "6" },
//                             { label: "7/12", value: "7" },
//                             { label: "8/12 (2/3)", value: "8" },
//                             { label: "9/12 (3/4)", value: "9" },
//                             { label: "10/12", value: "10" },
//                             { label: "11/12", value: "11" },
//                             { label: "12/12 (Full)", value: "12" },
//                           ],
//                           defaultValue: "auto",
//                           admin: { width: "50%" },
//                         },
//                         {
//                           name: "verticalAlign",
//                           type: "select",
//                           label: "Vertical Alignment",
//                           options: [
//                             { label: "Top", value: "top" },
//                             { label: "Center", value: "center" },
//                             { label: "Bottom", value: "bottom" },
//                             { label: "Stretch", value: "stretch" },
//                           ],
//                           admin: { width: "50%" },
//                         },
//                       ],
//                     },
//                     {
//                       type: "row",
//                       fields: [
//                         {
//                           name: "padding",
//                           type: "select",
//                           label: "Padding",
//                           options: [
//                             { label: "None", value: "none" },
//                             { label: "Small", value: "small" },
//                             { label: "Medium", value: "medium" },
//                             { label: "Large", value: "large" },
//                           ],
//                           defaultValue: "medium",
//                           admin: { width: "50%" },
//                         },
//                         {
//                           name: "backgroundColor",
//                           type: "text",
//                           label: "Background Color",
//                           admin: {
//                             width: "50%",
//                             description: "Hex, RGB, or named color",
//                           },
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// // Define Row configuration
// const rowConfig:any = {
//   name: "rows",
//   type: "blocks",
//   label: "Rows",
//   blocks: [
//     {
//       slug: "row",
//       labels: {
//         singular: "Row",
//         plural: "Rows",
//       },
//       fields: [
//         {
//           type: "tabs",
//           tabs: [
//             {
//               label: "Content",
//               fields: [
//                 {
//                   name: "Columns",
//                   type: "blocks",
//                   blocks: columnBlocks
//                 }
//               ]
//             },
//             {
//               label: "Row Styling",
//               fields: [
//                 {
//                   type: "collapsible",
//                   label: "Row Settings",
//                   fields: [
//                     {
//                       type: "row",
//                       fields: [
//                         {
//                           name: "layout",
//                           type: "select",
//                           label: "Row Layout",
//                           options: [
//                             { label: "Flex", value: "flex" },
//                             { label: "Grid", value: "grid" },
//                           ],
//                           defaultValue: "flex",
//                           admin: { width: "33%" },
//                         },
//                         {
//                           name: "gap",
//                           type: "select",
//                           label: "Gap Between Columns",
//                           options: [
//                             { label: "None", value: "none" },
//                             { label: "Small", value: "small" },
//                             { label: "Medium", value: "medium" },
//                             { label: "Large", value: "large" },
//                           ],
//                           defaultValue: "medium",
//                           admin: { width: "33%" },
//                         },
//                         {
//                           name: "align",
//                           type: "select",
//                           label: "Horizontal Alignment",
//                           options: [
//                             { label: "Start", value: "start" },
//                             { label: "Center", value: "center" },
//                             { label: "End", value: "end" },
//                             { label: "Space Between", value: "space-between" },
//                             { label: "Space Around", value: "space-around" },
//                           ],
//                           defaultValue: "start",
//                           admin: { width: "34%" },
//                         },
//                       ],
//                     },
//                     {
//                       type: "row",
//                       fields: [
//                         {
//                           name: "wrap",
//                           type: "checkbox",
//                           label: "Wrap Columns",
//                           defaultValue: true,
//                           admin: { width: "50%" },
//                         },
//                         {
//                           name: "reverse",
//                           type: "checkbox",
//                           label: "Reverse Column Order",
//                           defaultValue: false,
//                           admin: { width: "50%" },
//                         },
//                       ],
//                     },
//                     {
//                       name: "customCSS",
//                       type: "textarea",
//                       label: "Custom CSS Classes",
//                       admin: {
//                         description: "Add custom CSS classes (space-separated)",
//                       },
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// export const Pages: CollectionConfig<"pages"> = {
//   slug: "pages",
//   access: {
   
//     read: async ({ req }) => {
//       const user = req.user;
//       const payload = req.payload;

//       // Allow unauthenticated read access (for public pages)
//       if (!user) {
//         return publicAccessWhere();
//       }

//       // Super admin can see everything
//       if (user.collection === "administrators" && user.role === "admin") {
//         return true;
//       }

//       try {
//         // Fetch user's permission set
//         const permissions = await payload.find({
//           collection: "permission",
//           where: {
//             "assignedTo.id": {
//               equals: user.id,
//             },
//           },
//           limit: 1,
//         });

//       //  console.log("User Permissions for Pages:", permissions);
//         // No permissions found - deny access
//         if (!permissions.docs.length) {
//           return false;
//         }

//         const userPermission = permissions.docs[0];
//         const hasReadPermission = userPermission.pages_read;
//         // console.log("User Permission Set:", userPermission);
//         // console.log("Pages Read Permission:", hasReadPermission);

//         // If user doesn't have read permission, deny access
//         if (!hasReadPermission) {
//           return false;
//         }

//         const parentOrganization = userPermission.parentOrganization;

//         // If no parent organization is set, user can only see their own pages
//         if (!parentOrganization) {
//           return createdByUserWhere(String(user.id));
//         }

//         // Get the parent organization ID
//         const parentOrgId =
//           typeof parentOrganization === "object"
//             ? parentOrganization.id
//             : parentOrganization;

//         // Find websites belonging to this parent organization
//         const websites = await payload.find({
//           collection: "websites",
//           where: {
//             "tenantID.id": {
//               equals: parentOrgId,
//             },
//           },
//         });

//         // Get all website IDs
//         const websiteIds = websites.docs.map((website) => website.id);

//         // If no websites found, user can see their own pages
//         if (!websiteIds.length) {
//           return createdByUserWhere(String(user.id));
//         }

//         // Return query to show pages linked to parent organization's websites
//         return websitesInListWhere(websiteIds.map((id) => String(id)));
//       } catch (error) {
//         console.error("Error in pages read access:", error);
//         return false;
//       }
//     },
//   },
//   labels: {
//     singular: {
//       en: "Page",
//       pl: "Strona",
//     },
//     plural: {
//       en: "Pages",
//       pl: "Strony",
//     },
//   },
//   defaultPopulate: {
//     title: true,
//     slug: true,
//   },
//   admin: {
//     defaultColumns: ["title", "slug", "updatedAt"],
//     useAsTitle: "title",
//     group: {
//       en: "Page Settings",
//       pl: "Ustawienia strony",
//     },
//   },
//   fields: [
//     {
//       name: "title",
//       type: "text",
//       required: true,
//       localized: true,
//     },
//     {
//       type: "tabs",
//       tabs: [
//         {
//           label: "Hero",
//           fields: [hero],
//         },
//         {
//           label: "Content",
//           fields: [
//             {
//               name: "sections",
//               type: "blocks",
//               label: "Sections",
//               blocks: [
//                 {
//                   slug: "section",
//                   labels: {
//                     singular: "Section",
//                     plural: "Sections",
//                   },
//                   fields: [
//                     {
//                       type: "tabs",
//                       tabs: [
//                         {
//                           label: "Content",
//                           fields: [rowConfig],
//                         },
//                         {
//                           label: "Section Styling",
//                           fields: [
//                             {
//                               type: "collapsible",
//                               label: "Section Settings",
//                               fields: [
//                                 {
//                                   type: "row",
//                                   fields: [
//                                     {
//                                       name: "backgroundColor",
//                                       type: "text",
//                                       label: "Background Color",
//                                       admin: {
//                                         width: "50%",
//                                         description:
//                                           "Hex, RGB, or named color (e.g., #ffffff, rgb(255,255,255), white)",
//                                       },
//                                     },
//                                     {
//                                       name: "backgroundImage",
//                                       type: "upload",
//                                       relationTo: "media",
//                                       label: "Background Image",
//                                       admin: {
//                                         width: "50%",
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 {
//                                   type: "row",
//                                   fields: [
//                                     {
//                                       name: "paddingTop",
//                                       type: "select",
//                                       label: "Padding Top",
//                                       defaultValue: "medium",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "25%",
//                                       },
//                                     },
//                                     {
//                                       name: "paddingBottom",
//                                       type: "select",
//                                       label: "Padding Bottom",
//                                       defaultValue: "medium",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "25%",
//                                       },
//                                     },
//                                     {
//                                       name: "paddingLeft",
//                                       type: "select",
//                                       label: "Padding Left",
//                                       defaultValue: "medium",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "25%",
//                                       },
//                                     },
//                                     {
//                                       name: "paddingRight",
//                                       type: "select",
//                                       label: "Padding Right",
//                                       defaultValue: "medium",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "25%",
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 {
//                                   type: "row",
//                                   fields: [
//                                     {
//                                       name: "marginTop",
//                                       type: "select",
//                                       label: "Margin Top",
//                                       defaultValue: "none",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "50%",
//                                       },
//                                     },
//                                     {
//                                       name: "marginBottom",
//                                       type: "select",
//                                       label: "Margin Bottom",
//                                       defaultValue: "none",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Small", value: "small" },
//                                         { label: "Medium", value: "medium" },
//                                         { label: "Large", value: "large" },
//                                         { label: "XLarge", value: "xlarge" },
//                                       ],
//                                       admin: {
//                                         width: "50%",
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 {
//                                   type: "row",
//                                   fields: [
//                                     {
//                                       name: "maxWidth",
//                                       type: "select",
//                                       label: "Max Width",
//                                       defaultValue: "container",
//                                       options: [
//                                         { label: "Full Width", value: "full" },
//                                         {
//                                           label: "Container (1280px)",
//                                           value: "container",
//                                         },
//                                         {
//                                           label: "Medium (960px)",
//                                           value: "medium",
//                                         },
//                                         {
//                                           label: "Small (640px)",
//                                           value: "small",
//                                         },
//                                       ],
//                                       admin: {
//                                         width: "50%",
//                                       },
//                                     },
//                                     {
//                                       name: "textAlign",
//                                       type: "select",
//                                       label: "Text Alignment",
//                                       options: [
//                                         { label: "Left", value: "left" },
//                                         { label: "Center", value: "center" },
//                                         { label: "Right", value: "right" },
//                                       ],
//                                       admin: {
//                                         width: "50%",
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 {
//                                   type: "row",
//                                   fields: [
//                                     {
//                                       name: "borderWidth",
//                                       type: "select",
//                                       label: "Border Width",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         { label: "Thin (1px)", value: "thin" },
//                                         {
//                                           label: "Medium (2px)",
//                                           value: "medium",
//                                         },
//                                         {
//                                           label: "Thick (4px)",
//                                           value: "thick",
//                                         },
//                                       ],
//                                       admin: {
//                                         width: "33%",
//                                       },
//                                     },
//                                     {
//                                       name: "borderColor",
//                                       type: "text",
//                                       label: "Border Color",
//                                       admin: {
//                                         width: "33%",
//                                         description: "Hex, RGB, or named color",
//                                       },
//                                     },
//                                     {
//                                       name: "borderRadius",
//                                       type: "select",
//                                       label: "Border Radius",
//                                       options: [
//                                         { label: "None", value: "none" },
//                                         {
//                                           label: "Small (4px)",
//                                           value: "small",
//                                         },
//                                         {
//                                           label: "Medium (8px)",
//                                           value: "medium",
//                                         },
//                                         {
//                                           label: "Large (16px)",
//                                           value: "large",
//                                         },
//                                         { label: "Full", value: "full" },
//                                       ],
//                                       admin: {
//                                         width: "34%",
//                                       },
//                                     },
//                                   ],
//                                 },
//                                 {
//                                   name: "customCSS",
//                                   type: "textarea",
//                                   label: "Custom CSS Classes",
//                                   admin: {
//                                     description:
//                                       "Add custom CSS classes (space-separated)",
//                                   },
//                                 },
//                                 {
//                                   name: "customStyles",
//                                   type: "code",
//                                   label: "Custom Inline Styles",
//                                   admin: {
//                                     language: "css",
//                                     description:
//                                       "Add custom inline styles (CSS properties)",
//                                   },
//                                 },
//                               ],
//                             },
//                           ],
//                         },
//                         {
//                           label: "Save to Library",
//                           fields: [
//                             {
//                               type: "ui",
//                               name: "saveToLibraryButton",
//                               admin: {
//                                 components: {
//                                   Field:
//                                     "@/components/CustomeButton#SaveToLibrary",
//                                 },
//                               },
//                             },
//                           ],
//                         },
//                       ],
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//         {
//           label: "SEO",
//           name: "meta",
//           localized: true,
//           fields: [
//             OverviewField({
//               titlePath: "meta.title",
//               descriptionPath: "meta.description",
//               imagePath: "meta.image",
//             }),
//             MetaTitleField({
//               hasGenerateFn: true,
//             }),
//             MetaImageField({
//               relationTo: "media",
//             }),
//             MetaDescriptionField({}),
//             PreviewField({
//               hasGenerateFn: true,
//               titlePath: "meta.title",
//               descriptionPath: "meta.description",
//             }),
//           ],
//         },
//       ],
//     },
//     {
//       name: "publishedAt",
//       type: "date",
//       admin: {
//         position: "sidebar",
//       },
//     },
//     {
//       name: "website",
//       type: "relationship",
//       relationTo: "websites",
//       required: true,
//       admin: { position: "sidebar" },
//     },
//     {
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
//     ...slugField(),
//   ],
//   hooks: {
//     afterChange: [revalidatePage],
//     beforeChange: [populatePublishedAt],
//     beforeDelete: [revalidateDelete],
//   },
//   versions: {
//     drafts: {
//       autosave: {
//         interval: 100,
//       },
//       schedulePublish: true,
//     },
//     maxPerDoc: 50,
//   },
// };


