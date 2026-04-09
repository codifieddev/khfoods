
import { authenticated } from "@/access/authenticated";
// import { readAccess } from "@/Access/readaccess";
import type { AccessArgs } from "payload";
import type { Administrator } from "@/types/cms";
import type { CollectionConfig } from "payload";
import { checkUserPermission } from "@/access/roleBasedAccess";
import { permission } from "process";
import { readAccessAdmin } from "@/access/readaccess";
// import DynamicRoleSelector from "@/components/roleSelection";

// Individual access functions using the optimized checker
const isReadAccess = async (args: AccessArgs<Administrator>) => {
  const base = await checkUserPermission(args, "read", "adminPermission");
  if (base === true && args.req?.user?.id) {
    return {
      and: [
        base,
        { createdBy: { equals: args.req.user.id } }
      ]
    };
  }
  return base;
};

const isCreateAccess = (args: AccessArgs<Administrator>) => {
  const user = args.req?.user;
 
  return checkUserPermission(args, "create", "adminPermission");
};

const isUpdateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "update", "adminPermission");

const isDeleteAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "delete", "adminPermission");

export const Administrators: CollectionConfig = {
  slug: "administrators",
  labels: {
    singular: {
      en: "Administrator",
      zh: "管理员"
    },
    plural: {
      en: "Administrators",
      zh: "管理员"
    }
  },

  admin: {
    defaultColumns: ["name", "email", "roles"],
    useAsTitle: "name",
    group: {
      en: "Administration",
      zh: "管理"
    }
  },
  auth: {
    loginWithUsername: false,
    maxLoginAttempts: 5,
    lockTime: 600000, // 10 minutes
  },
  access: {
    read: isReadAccess,
    create: isCreateAccess,
    update: isUpdateAccess,
    delete: isDeleteAccess,
    admin:()=>true
  },

  hooks: {
    beforeValidate: [
      async ({ data, req, operation, originalDoc }) => {
//         console.log('🔍 [beforeValidate] Hook triggered - operation:---------', operation);
// console.log('🔍 [beforeValidate] Hook triggered - operation:---------', data);
  if (data?.role && req?.payload) {
          try {
            // Fetch the selected role to auto-populate permissions
            const roleDocArr = await req.payload.find({
              collection: 'roles',
              where: { roleTitle: { equals: data.role } },
              limit: 1
            });
            const roleDoc = roleDocArr?.docs?.[0];
            // console.log("roleDoc-----", roleDoc);
            // console.log('🔍 [beforeValidate] Fetched role:', (roleDoc as any)?.roleTitle);
            
            if (roleDoc) {
              // Auto-check permission checkboxes based on role permissions
            //  console.log('✅ [beforeValidate] Auto-populating checkboxes from role permissions...');
              
              // Admin permissions
              const adminPerms = (roleDoc as any).adminPermission || [];
              data.admin_create = adminPerms.includes('create');
              data.admin_read = adminPerms.includes('read');
              data.admin_update = adminPerms.includes('update');
              data.admin_delete = adminPerms.includes('delete');
              
              // Pages permissions
              const pagesPerms = (roleDoc as any).pagesPermission || [];
              data.pages_create = pagesPerms.includes('create');
              data.pages_read = pagesPerms.includes('read');
              data.pages_update = pagesPerms.includes('update');
              data.pages_delete = pagesPerms.includes('delete');
              
              // Products permissions
              const productsPerms = (roleDoc as any).productsPermission || [];
              data.products_create = productsPerms.includes('create');
              data.products_read = productsPerms.includes('read');
              data.products_update = productsPerms.includes('update');
              data.products_delete = productsPerms.includes('delete');
              
              // Media permissions
              const mediaPerms = (roleDoc as any).mediaPermission || [];
              data.media_create = mediaPerms.includes('create');
              data.media_read = mediaPerms.includes('read');
              data.media_update = mediaPerms.includes('update');
              data.media_delete = mediaPerms.includes('delete');
              
              // Post permissions
              const postPerms = (roleDoc as any).postPermission || [];
              data.post_create = postPerms.includes('create');
              data.post_read = postPerms.includes('read');
              data.post_update = postPerms.includes('update');
              data.post_delete = postPerms.includes('delete');
              
              // Website permissions
              const websitePerms = (roleDoc as any).websitePermission || [];
              data.website_create = websitePerms.includes('create');
              data.website_read = websitePerms.includes('read');
              data.website_update = websitePerms.includes('update');
              data.website_delete = websitePerms.includes('delete');
              
              // Order permissions
              const orderPerms = (roleDoc as any).orderPermission || [];
              data.order_create = orderPerms.includes('create');
              data.order_read = orderPerms.includes('read');
              data.order_update = orderPerms.includes('update');
              data.order_delete = orderPerms.includes('delete');
              
              // Shop permissions
              const shopPerms = (roleDoc as any).shopPermission || [];
              data.shop_create = shopPerms.includes('create');
              data.shop_read = shopPerms.includes('read');
              data.shop_update = shopPerms.includes('update');
              data.shop_delete = shopPerms.includes('delete');
              
              // Courier permissions
              const courierPerms = (roleDoc as any).courierPermission || [];
              data.courier_create = courierPerms.includes('create');
              data.courier_read = courierPerms.includes('read');
              data.courier_update = courierPerms.includes('update');
              data.courier_delete = courierPerms.includes('delete');
          
            }
          } catch (error) {
            console.error('❌ [beforeValidate] Error fetching role permissions:', error);
          }
        } else {
          // console.log('⚠️ [beforeValidate] No roles selected or payload not available');
        }
        
        return data;
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
  if (data?.role && req?.payload) {
          try {
            // Fetch the selected role to get permissions
            const roleDocArr = await req.payload.find({
              collection: 'roles',
              where: { roleTitle: { equals: data.role } },
              limit: 1
            });
            const roleDoc = roleDocArr?.docs?.[0];
            // console.log('🔍 Set permissions based on role:', roleDoc);
            if (roleDoc) {
              // Populate permission checkbox fields based on role permissions
              const adminPerms = (roleDoc as any).adminPermission || [];
              data.admin_create = adminPerms.includes('create');
              data.admin_read = adminPerms.includes('read');
              data.admin_update = adminPerms.includes('update');
              data.admin_delete = adminPerms.includes('delete');
              
              // console.log('🔍 Admin Permission Array:', adminPerms);
              // console.log('✅ Setting admin_create:', data.admin_create, '(has create:', adminPerms.includes('create'), ')');
              // console.log('✅ Setting admin_read:', data.admin_read, '(has read:', adminPerms.includes('read'), ')');
              // console.log('✅ Setting admin_update:', data.admin_update, '(has update:', adminPerms.includes('update'), ')');
              // console.log('✅ Setting admin_delete:', data.admin_delete, '(has delete:', adminPerms.includes('delete'), ')');
              
              const pagesPerms = (roleDoc as any).pagesPermission || [];
              data.pages_create = pagesPerms.includes('create');
              data.pages_read = pagesPerms.includes('read');
              data.pages_update = pagesPerms.includes('update');
              data.pages_delete = pagesPerms.includes('delete');
              
              const productsPerms = (roleDoc as any).productsPermission || [];
              data.products_create = productsPerms.includes('create');
              data.products_read = productsPerms.includes('read');
              data.products_update = productsPerms.includes('update');
              data.products_delete = productsPerms.includes('delete');
              
              const mediaPerms = (roleDoc as any).mediaPermission || [];
              data.media_create = mediaPerms.includes('create');
              data.media_read = mediaPerms.includes('read');
              data.media_update = mediaPerms.includes('update');
              data.media_delete = mediaPerms.includes('delete');
              
              const postPerms = (roleDoc as any).postPermission || [];
              data.post_create = postPerms.includes('create');
              data.post_read = postPerms.includes('read');
              data.post_update = postPerms.includes('update');
              data.post_delete = postPerms.includes('delete');
              
              const websitePerms = (roleDoc as any).websitePermission || [];
              data.website_create = websitePerms.includes('create');
              data.website_read = websitePerms.includes('read');
              data.website_update = websitePerms.includes('update');
              data.website_delete = websitePerms.includes('delete');
              
              const orderPerms = (roleDoc as any).orderPermission || [];
              data.order_create = orderPerms.includes('create');
              data.order_read = orderPerms.includes('read');
              data.order_update = orderPerms.includes('update');
              data.order_delete = orderPerms.includes('delete');
              
              const shopPerms = (roleDoc as any).shopPermission || [];
              data.shop_create = shopPerms.includes('create');
              data.shop_read = shopPerms.includes('read');
              data.shop_update = shopPerms.includes('update');
              data.shop_delete = shopPerms.includes('delete');
              
              const courierPerms = (roleDoc as any).courierPermission || [];
              data.courier_create = courierPerms.includes('create');
              data.courier_read = courierPerms.includes('read');
              data.courier_update = courierPerms.includes('update');
              data.courier_delete = courierPerms.includes('delete');
              
              // console.log(`🔍 [Line ~120] Loaded permissions for role: ${(roleDoc as any).roleTitle}`);
              // console.log('📋 [Line ~121] Admin permissions:', adminPerms);
              // console.log('📄 [Line ~122] Pages permissions:', pagesPerms);
            }
          } catch (error) {
            console.error('Error fetching role permissions:', error);
          }
        }
        return data;
      },
    ],
afterChange: [
  async ({ doc, req, operation }) => {
    // Only run when a new Administrator is created
    if (operation === 'create' && doc?.role && req?.payload) {
      try {
        // 1. Fetch the selected role to get its permissions (always lowercase)
        const roleTitle = typeof doc.role === 'string' ? doc.role.toLowerCase() : doc.role;
   console.log("roleTitle",roleTitle)

        const roleDocArr = await req.payload.find({
          collection: 'roles',
          where: { roleTitle: { equals: roleTitle } },
          limit: 1
        });
  console.log("get role based permisiion",roleDocArr)
        const roleDoc = roleDocArr?.docs?.[0];
        if (!roleDoc) {
          console.warn(`⚠️ No matching role found for ${roleTitle}`);
          return;
        }

        // 2. Collect permission arrays from the role document
        const permissionFields = [
          'adminPermission',
          'pagesPermission',
          'productsPermission',
          'mediaPermission',
          'postPermission',
          'websitePermission',
          'orderPermission',
          'shopPermission',
          'courierPermission',
        ];

        const updateData: Record<string, any> = {};
        for (const field of permissionFields) {
          updateData[field] = Array.isArray(roleDoc[field]) ? roleDoc[field] : [];
          if (!updateData[field] || updateData[field].length === 0) {
            console.warn(`⚠️ Permission array '${field}' is empty for role '${roleTitle}'`);
          }
        }

        // 3. Always create a new permission document (no check for existing)
        const response = await req.payload.create({
          collection: 'permission',
          data: {
            roleTitle: roleTitle,
            administrators: req.user ? [req.user.id] : [],
            ...updateData
          }
        });

        console.log(`✅ New permission created for role "${roleTitle}"`);
        console.log('🆕 Permission document:', response);
      } catch (error) {
        console.error('❌ [afterChange] Error creating permission:', error);
      }
    }
  },
],

    afterLogin: [
      async ({ req, user }) => {
        // console.log("After login hook triggered for user:", user?.id);
        // console.log("After login hook triggered for user:", user?.email);
      },
    ],
    afterLogout: [
      async ({ req }) => {
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("admin-auth-storage");
          } catch (error) {
            console.error("Failed to clear auth state:", error);
          }
        }
      },
    ],
    afterForgotPassword: [async ({ args }) => {}]
  },
  fields: [
    {
      name: "name",
      type: "text",
      required:false
    },
    {
      name: "language",
      type: "select",
      options: [
        { label: "English", value: "en" },
        { label: "Hrvatski", value: "hr" },
        { label: "Polski", value: "pl" },
      ],
      required: false,
      admin: {
        position: "sidebar"
      }
    },
    {
      name: "role",
      type: "text",
      required: false,
     
      admin: {
        condition: ({ operation }) => operation === 'create'
      }
    },
    // {
    //   name: "roles",
    //   type: "text",
    //   defaultValue: "",
    //   admin: {
    //     hidden: true
    //   }
    // },
  {
      name: "select_role",
      type: "ui",
     admin: {
    components: {
      Field: "@/components/roleSelection#DynamicRoleSelector"
    }
  }
    },
   
    
 
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
      defaultValue:({req})=>req.user? req.user.id:"",
      admin: {
        position: "sidebar"
      }
    },
  ],
  timestamps: true
};  

