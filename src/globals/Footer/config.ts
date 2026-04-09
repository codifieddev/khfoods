import { checkUserPermission } from "@/access/roleBasedAccess";
import { link } from "@/fields/link";
import { revalidateGlobal } from "@/hooks/revalidateGlobal";
import { Administrator } from "@/types/cms";

import type { AccessArgs, GlobalConfig } from "payload";

// Individual access functions using the optimized checker
const isReadAccess = async (args: AccessArgs<Administrator>) => {
  const base = checkUserPermission(args, "read", "pagesPermission");
  if (args.req?.user?.id) {
    return {
      and: [base, { selectedAdministrators: { equals: args.req.user.id } }]
    };
  }
  return base;
};

const isCreateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "create", "pagesPermission");

const isUpdateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "update", "pagesPermission");

const isDeleteAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "delete", "pagesPermission");
export const Footer: GlobalConfig = {
  slug: "footer",
  access: {
    read: ()=>true,
    // create: isCreateAccess,
    // update: isUpdateAccess,
    // delete: isDeleteAccess
  },
  label: {
    en: "Footer",
    zh: "页脚"
  },
  admin: {
    group: {
      en: "Page Settings",
      zh: "页面设置"
    }
  },

  fields: [
    {
      name: "attribution",
      type: "richText",
      label: "Attribution",
      localized: true
    },
    {
      name: "navItems",
      type: "array",
      fields: [
        link({
          appearances: false
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: "@/globals/Footer/RowLabel#RowLabel"
        }
      }
    },
     {
      name: "createdBy",
      type: "relationship",
      relationTo: "administrators",
      required: true,
      defaultValue: ({ req: { user } }) => user?.id,
      admin: {
        readOnly: true,
        position: "sidebar"
      }
    },
  ],
  hooks: {
    afterChange: [revalidateGlobal]
  }
};


