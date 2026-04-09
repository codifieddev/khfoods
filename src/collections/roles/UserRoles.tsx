/**
 */

import { CollectionConfig } from "payload";
import type { AccessArgs } from "payload";
import type { Administrator } from "@/types/cms";
import { authenticated } from "@/access/authenticated";
import { checkUserPermission } from "@/access/roleBasedAccess";

// Custom function called when checkbox is clicked
const handleCheckboxClick = async (
  fieldName: string,
  newValue: any,
  oldValue?: any
) => {
  const booleanNewValue = Boolean(newValue);
  const booleanOldValue = Boolean(oldValue);

  console.log(`🔄 Checkbox Event Triggered:`);
  console.log(`  Field: ${fieldName}`);
  console.log(`  Old Value: ${booleanOldValue}`);
  console.log(`  New Value: ${booleanNewValue}`);
  console.log(`  Changed: ${booleanOldValue !== booleanNewValue}`);

  // Add your custom logic here
  if (fieldName.includes("delete") && booleanNewValue) {
    console.log(`⚠️  WARNING: Delete permission granted for ${fieldName}`);
  }

  if (fieldName.includes("admin_") && booleanNewValue) {
    console.log(`🔐 Admin permission changed: ${fieldName}`);
  }

  // You can add more custom business logic here
  // For example: validation, dependent field updates, notifications, etc.

  return booleanNewValue;
};

// Enhanced access control for role-based management
// Individual access functions using the optimized checker
const isReadAccess = async (args: AccessArgs<Administrator>) => {
  const base = await checkUserPermission(args, "read", "adminPermission");
  if ( base === true &&args.req?.user?.id) {
    return {
      and: [base, { selectedAdministrators: { equals: args.req.user.id } }]
    };
  }
  return base;
};

const isCreateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "create", "adminPermission");

const isUpdateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "update", "adminPermission");

const isDeleteAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "delete", "adminPermission");
export const Roles: CollectionConfig = {
  slug: "roles",
  labels: {
    singular: {
      en: "User Role",
      zh: "用户角色"
    },
    plural: {
      en: "User Roles",
      zh: "用户角色"
    }
  },
  admin: {
    useAsTitle: "roleTitle",
    defaultColumns: ["roleTitle", "selectedAdministrators", "createdAt"],
    group: {
      en: "Administration",
      zh: "管理"
    },
    description: "Manage user roles and permissions across the system"
  },
  access: {
    // admin: () => true,
    // create: () => true,
    // delete: () => true,
    // read: ({ req }) => {
    //   if (req.user?.id) {
    //     return {
    //       selectedAdministrators: {
    //         equals: req.user.id
    //       }
    //     };
    //   }
    //   return false;
    // },
    // update: () => true,
    read: isReadAccess,
    create: isCreateAccess,
    update: isUpdateAccess,
    delete: isDeleteAccess,
    admin: () => true
  },
  hooks: {
    beforeValidate: [
      async ({ data, req }) => {
        // Validate role title uniqueness within organization
        if (data?.roleTitle && data?.createdFor) {
          try {
            const existing = await req.payload.find({
              collection: "roles" as any,
              where: {
                and: [
                  { roleTitle: { equals: data.roleTitle } },
                  { createdFor: { equals: data.createdFor } },
                  ...(data.id ? [{ id: { not_equals: data.id } }] : []),
                ]
              },
              limit: 1
            });
            // console.log("Existing Roles Check:", existing);
            if (existing.docs.length > 0) {
              throw new Error(
                `Role title "${data.roleTitle}" already exists for this organization`
              );
            }
          } catch (error) {
            console.warn("Role validation error:", error);
          }
        }
      },
    ],
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (!data) return data;

        // Define the mapping between checkbox fields and their target array

        // Define the mapping between checkbox fields and their target array
        const permissionGroups = {
          admin: ["admin_create", "admin_read", "admin_update", "admin_delete"],
          pages: ["pages_create", "pages_read", "pages_update", "pages_delete"],
          products: [
            "products_create",
            "products_read",
            "products_update",
            "products_delete",
          ],
          media: ["media_create", "media_read", "media_update", "media_delete"],
          post: ["post_create", "post_read", "post_update", "post_delete"],
          website: [
            "website_create",
            "website_read",
            "website_update",
            "website_delete",
          ],
          order: ["order_create", "order_read", "order_update", "order_delete"],
          shop: ["shop_create", "shop_read", "shop_update", "shop_delete"],
          courier: [
            "courier_create",
            "courier_read",
            "courier_update",
            "courier_delete",
          ]
        };

        // Loop through each group to create its corresponding permission array
        for (const [key, fields] of Object.entries(permissionGroups)) {
          const permissions: string[] = [];

          if (data[`${key}_create`]) permissions.push("create");
          if (data[`${key}_read`]) permissions.push("read");
          if (data[`${key}_update`]) permissions.push("update");
          if (data[`${key}_delete`]) permissions.push("delete");

          // Store the compact array in a new field like "adminPermission"
          (data as any)[`${key}Permission`] = permissions;

          // Remove the individual checkbox fields from the saved document
          fields.forEach((field) => {
            delete (data as any)[field];
          });
        }

        // Ensure all checkbox fields are completely removed
        const allCheckboxFields = [
          "admin_create",
          "admin_read",
          "admin_update",
          "admin_delete",
          "pages_create",
          "pages_read",
          "pages_update",
          "pages_delete",
          "products_create",
          "products_read",
          "products_update",
          "products_delete",
          "media_create",
          "media_read",
          "media_update",
          "media_delete",
          "post_create",
          "post_read",
          "post_update",
          "post_delete",
          "website_create",
          "website_read",
          "website_update",
          "website_delete",
          "order_create",
          "order_read",
          "order_update",
          "order_delete",
          "shop_create",
          "shop_read",
          "shop_update",
          "shop_delete",
          "courier_create",
          "courier_read",
          "courier_update",
          "courier_delete",
        ];

        // Force delete all checkbox fields
        allCheckboxFields.forEach((field) => {
          if (field in data) {
            delete (data as any)[field];
          }
        });

        // Auto-assign creator if missing, and always save as string
        if (
          operation === "create" &&
          !data.selectedAdministrators &&
          req.user?.id
        ) {
          data.selectedAdministrators = req.user.id;
        }
        // If selectedAdministrators is an array, convert to string
        if (Array.isArray(data.selectedAdministrators)) {
          data.selectedAdministrators = data.selectedAdministrators[0] || null;
        }

        console.log("✅ Transformed Permissions:", {
          adminPermission: data.adminPermission,
          pagesPermission: data.pagesPermission,
          productsPermission: data.productsPermission,
          mediaPermission: data.mediaPermission,
          postPermission: data.postPermission,
          websitePermission: data.websitePermission,
          orderPermission: data.orderPermission,
          shopPermission: data.shopPermission,
          courierPermission: data.courierPermission
        });

        // Debug: Check what fields remain in data
        // console.log("📋 All remaining fields in data:", Object.keys(data));

        // Debug: Check for any checkbox fields that might still exist
        const remainingCheckboxes = allCheckboxFields.filter(
          (field) => field in data
        );
        if (remainingCheckboxes.length > 0) {
          console.log(
            "⚠️ WARNING: Some checkbox fields still exist:",
            remainingCheckboxes
          );
        } else {
          console.log("✅ All checkbox fields successfully removed");
        }

        return data;
      },
    ],

    afterChange: [
      async ({ doc, req, operation }) => {
        // Log role changes for audit purposes
        const roleTitle = doc.roleTitle || "Untitled Role";
        // console.log(`Role ${operation}: ${roleTitle} by user ${req.user?.id}`);

        // If role is deactivated, log it
        if (operation === "update" && !doc.isActive) {
          // console.log(`Role "${roleTitle}" has been deactivated`);
        }
      },
    ],
    afterRead: [
      async ({ doc, req }) => {
        // Convert saved permission arrays back to checkbox format for the UI
        const permissionGroups = {
          admin: "adminPermission",
          pages: "pagesPermission",
          products: "productsPermission",
          media: "mediaPermission",
          post: "postPermission",
          website: "websitePermission",
          order: "orderPermission",
          shop: "shopPermission",
          courier: "courierPermission"
        };

        // Loop through each group and restore checkbox states
        for (const [key, permissionField] of Object.entries(permissionGroups)) {
          const permissions = doc[permissionField] || [];

          // Set individual checkbox fields based on the permission array
          doc[`${key}_create`] = permissions.includes("create");
          doc[`${key}_read`] = permissions.includes("read");
          doc[`${key}_update`] = permissions.includes("update");
          doc[`${key}_delete`] = permissions.includes("delete");
        }

        // for (const key of Object.keys(permissionGroups)) {
        //   doc[`${key}_create`] = true;
        //   doc[`${key}_read`] = true;
        //   doc[`${key}_update`] = true;
        //   doc[`${key}_delete`] = true;
        // }

        console.log("🔄 Restored checkbox states from saved permissions", doc);
        return doc;
      },
    ]
  },

  fields: [
    // Role Definition Section
    {
      type: "row",
      fields: [
        {
          name: "roleTitle",
          label: {
            en: "Role Title",
            hr: "Naziv uloge"

          },
          type: "text",
          required: true,
          admin: {
            width: "50%",
            description:
              "A descriptive title for this role (e.g., 'Content Manager', 'Product Admin')"
          },
          hooks: {
            beforeChange: [
              async ({ value }) => {
                if (typeof value === "string") {
                  return value.toLowerCase();
                }
                return value;
              },
            ]
          }
        },
      ]
    },

    {
      name: "roleDescription",
      label: {
        en: "Role Description",
        hr: "Opis uloge"

      },
      type: "textarea",
      admin: {
        description: "Describe what this role is intended for and its scope"
      }
    },
    /// administration collection
    {
      type: "collapsible",
      label: "Administration Collection",
      fields: [
        {
          type: "row",

          fields: [
            {
              name: "admin_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true,
              hooks: {
                beforeChange: [
                  async ({ value, originalDoc }) => {
                    return await handleCheckboxClick(
                      "admin_create",
                      value,
                      originalDoc?.admin_create
                    );
                  },
                ]
              }
            },
            {
              name: "admin_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true,
              hooks: {
                beforeChange: [
                  async ({ value, originalDoc }) => {
                    return await handleCheckboxClick(
                      "admin_read",
                      value,
                      originalDoc?.admin_read
                    );
                  },
                ]
              }
            },
            {
              name: "admin_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true,
              hooks: {
                beforeChange: [
                  async ({ value, originalDoc }) => {
                    return await handleCheckboxClick(
                      "admin_update",
                      value,
                      originalDoc?.admin_update
                    );
                  },
                ]
              }
            },
            {
              name: "admin_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true,
              hooks: {
                beforeChange: [
                  async ({ value, originalDoc }) => {
                    return await handleCheckboxClick(
                      "admin_delete",
                      value,
                      originalDoc?.admin_delete
                    );
                  },
                ]
              }
            },
          ]
        },
      ]
    },
    // Pages Collection Permissions
    {
      type: "collapsible",
      label: "Pages Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "pages_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "pages_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "pages_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "pages_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // Products Collection Permissions
    {
      type: "collapsible",
      label: "Products Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "products_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "products_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "products_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "products_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // Media Collection Permissions
    {
      type: "collapsible",
      label: "Media Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "media_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "media_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "media_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "media_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // PostCollection Permissions
    {
      type: "collapsible",
      label: "Post Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "post_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "post_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "post_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "post_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // website Collection Permissions
    {
      type: "collapsible",
      label: "Website Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "website_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "website_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "website_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "website_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // order Collection Permissions
    {
      type: "collapsible",
      label: "Order Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "order_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "order_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "order_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "order_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // Shop Collection Permissions
    {
      type: "collapsible",
      label: "Shop Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "shop_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "shop_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "shop_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "shop_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // Courier Collection Permissions
    {
      type: "collapsible",
      label: "Courier Collection",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "courier_create",
              type: "checkbox",
              label: {
                en: "Create",
                hr: "Kreiraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "courier_read",
              type: "checkbox",
              label: {
                en: "Read",
                hr: "Čitaj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "courier_update",
              type: "checkbox",
              label: {
                en: "Update",
                hr: "Ažuriraj"

              },
              defaultValue: false,
              virtual: true
            },
            {
              name: "courier_delete",
              type: "checkbox",
              label: {
                en: "Delete",
                hr: "Obriši"

              },
              defaultValue: false,
              virtual: true
            },
          ]
        },
      ]
    },

    // User Assignment Section
    {
      name: "selectedAdministrators",
      label: "created by",
      type: "relationship",
      relationTo: "administrators",
      // hasMany removed to ensure single value (string)
      defaultValue: ({ req }) => (req.user?.id ? req.user.id : undefined),
      admin: {
        description: "Select administrators to assign this role",
        position: "sidebar"
      }
    },

    // Hidden permission array fields for database storage
    // These fields store the transformed checkbox data as arrays
    {
      name: "adminPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "pagesPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "productsPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "mediaPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "postPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "websitePermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "orderPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "shopPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
    {
      name: "courierPermission",
      type: "text",
      hasMany: true,
      admin: {
        hidden: true
      }
    },
  ],
  timestamps: true
};


