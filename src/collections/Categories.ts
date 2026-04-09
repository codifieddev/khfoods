import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

import type { AccessArgs } from "payload";
import type { Administrator } from "@/types/cms";
import type { CollectionConfig } from "payload";
import { checkUserPermission } from "@/access/roleBasedAccess";

// const isReadAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "read", "productcatPermission");

// const isCreateAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "write", "productcatPermission");

// const isUpdateAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "update", "productcatPermission");

// const isDeleteAccess = (args: AccessArgs<Administrator>) =>
//   checkUserPermission(args, "delete", "productcatPermission");
export const Categories: CollectionConfig = {
  slug: "categories",
  labels: {
    plural: {
      en: "Posts Categories",
      zh: "文章分类",
      hr: "Kategorije objava", // Croatian
    },
    singular: {
      en: "Post Category",
      zh: "文章分类",
      hr: "Kategorija objave", // Croatian
    }
  },
  admin: {
    useAsTitle: "title",
    group: {
      en: "Page Settings",
      zh: "页面设置",
      hr: "Postavke stranice", // Croatian
    }
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
      localized: true
    },
  ]
};


