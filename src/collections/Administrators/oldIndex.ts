
// import { authenticated } from "@/access/authenticated";
// // import { readAccess } from "@/Access/readaccess";
// import type { AccessArgs } from "payload";
// import type { Administrator } from "@/types/cms";
// import type { CollectionConfig } from "payload";
// import { checkUserPermission } from "@/access/roleBasedAccess";
// import { permission } from "process";
// import { readAccessAdmin } from "@/access/readaccess";
// // import DynamicRoleSelector from "@/components/roleSelection";

// // Individual access functions using the optimized checker
// const isReadAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "read", "adminstrationPermission");

// const isCreateAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "write", "adminstrationPermission");

// const isUpdateAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "update", "adminstrationPermission");

// const isDeleteAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "delete", "adminstrationPermission");
// export const Administrators: CollectionConfig = {
//   slug: "administrators",
//   labels: {
//     singular: {
//       en: "Administrator",
//       pl: "Administrator",
//     },
//     plural: {
//       en: "Administrators",
//       pl: "Administratorzy",
//     },
//   },

//   admin: {
//     defaultColumns: ["name", "email", "roles"],
//     useAsTitle: "name",
//     group: {
//       en: "Administration",
//       pl: "Administracja",
//     },
//   },
//   auth: {
//     loginWithUsername: false,
//     maxLoginAttempts: 5,
//     lockTime: 600000, // 10 minutes
//   },
//   // access: {
//   //   read:()=>true,
//   //   create: ()=>true,
//   //   update: ()=>true,
//   //   delete: ()=>true,
  
//   // },
//   hooks: {
//     beforeValidate: [
//       async ({ data, req, operation, originalDoc }) => {
//         console.log("before validate ", data)
        
//         return data;
//       },
//     ],
//     beforeChange: [
//       async ({ data, req, operation }) => {
//         if (operation === "create" && data?.roles && req?.payload) {
//           try {
//             const roleDocArr = await req.payload.find({
//               collection: "roles",
//               where: { roleTitle: { equals: data.roles } },
//               limit: 1,
//             });
//             if (roleDocArr && Array.isArray(roleDocArr.docs) && roleDocArr.docs.length) {
//               const roleDoc = roleDocArr.docs[0];
//               console.log(`✅ Role found for ${data.roles}`);
//             } else {
//               console.warn(`⚠️ No role found for ${data.roles}`);
//             }
//           } catch (error) {
//             console.error("❌ Error setting admin permissions:", error);
//           }
//         }
//         return data;
//       },
//     ],
//     afterChange: [
//       async ({ doc, req, operation }) => {
//         if (operation === 'create' && doc?.roles && req?.payload) {
//           // Find one administrator with the same roleTitle
//           const adminsWithRole = await req.payload.find({
//             collection: 'administrators',
//             where: { roles: { equals: doc.roles } },
//             limit: 1,
//           });
//           let adminValue: string | undefined = undefined;
//           if (adminsWithRole && Array.isArray(adminsWithRole.docs) && adminsWithRole.docs.length) {
//             adminValue = adminsWithRole.docs[0].id;
//           }

//           // Upsert the permission document for this roleTitle
//           const existingPerm = await req.payload.find({
//             collection: 'permission',
//             where: { roleTitle: { equals: doc.roles } },
//             limit: 1,
//           });
//           if (existingPerm && Array.isArray(existingPerm.docs) && existingPerm.docs.length) {
//             // Update existing
//             // await req.payload.update({
//             //   collection: 'permission',
//             //   id: existingPerm.docs[0].id,
//             //   data: adminValue ? { administrators: adminValue } : {},
//             // });
//           } else {
//             // Create new
//             const data: any = { roleTitle: doc.roles };
//             if (adminValue) data.administrators = adminValue;
//             await req.payload.create({
//               collection: 'permission',
//               data,
//             });
//           }
//         }
//       },
//     ],
//     // afterLogin: [
//     //   async ({ req, user }) => {
//     //     console.log("After login hook triggered for user:", user?.id);
//     //     console.log("After login hook triggered for user:", user?.email);
//     //     console.log("user detail", req.user)
//     //   },
//     // ],
//     // afterLogout: [
//     //   async ({ req }) => {
//     //     if (typeof window !== "undefined") {
//     //       try {
//     //         localStorage.removeItem("admin-auth-storage");
//     //       } catch (error) {
//     //         console.error("Failed to clear auth state:", error);
//     //       }
//     //     }
//     //   },
//     // ],
//     // afterForgotPassword: [async ({ args }) => {}],
//   },
//   fields: [
//     {
//       name: "name",
//       type: "text",
//       required: true,
//     },
//     {
//       name: "email",
//       type: "email",
//       required: true,
   
//     },
//      {
//       name: "role",
//       type: "select",
//       required: true,
//       options: [
//         {
//           label: "Admin",
//           value: "admin",
//         },
//         {
//           label: "Guest",
//           value: "guest",
//         },
//         {
//           label: "Client",
//           value: "client",
//         },
//         {
//           label: "Business",
//           value: "business",
//         },
//         {
//           label: "Designer",
//           value: "designer",
//         },
//         {
//           label: "Franchise",
//           value: "franchise",
//         },
//         {
//           label: "Editor",
//           value: "editor",
//         },
//       ],
//       // admin: {
//       //   position: "sidebar",
//       // },
//     },

//   //   {
//   //     name: "roles",
//   //     type: "text",
//   //     admin:{
//   //  hidden:true
//   //     }
//   //   },

//   //  {
//   //     name: "select_role",
//   //     type: "ui",
     
//   //     admin: {
//   //       components: {
//   //         Field: "@/components/roleSelection#DynamicRoleSelector",
//   //       },
       
//   //     },
//   //   },
   
    
 
//     {
//       name: "createdBy",
//       type: "relationship",
//       relationTo: "administrators",
//       defaultValue:(req)=>req.user!.id,
//       admin: {
//         position: "sidebar",
//       },
//     },
//   ],
//   timestamps: true,
// };


