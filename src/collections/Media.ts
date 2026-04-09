import path from "path";
import { fileURLToPath } from "url";

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";

import { anyone } from "@/access/anyone";
import { authenticated } from "@/access/authenticated";

import type { AccessArgs } from "payload";
import type { Administrator } from "@/types/cms";
import type { CollectionConfig } from "payload";
import { checkUserPermission } from "@/access/roleBasedAccess";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const isReadAccess = async (args: AccessArgs<Administrator>) => {
  const base = await checkUserPermission(args, "read", "mediaPermission");
  if (
    base === true &&
    args.req?.user?.collection === "administrators" &&
    args.req?.user?.id
  ) {
    return {
      and: [base, { createdBy: { equals: args.req.user.id } }],
    };
  }
  return base;
};

const isCreateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "create", "mediaPermission");

const isUpdateAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "update", "mediaPermission");

const isDeleteAccess = (args: AccessArgs<Administrator>) =>
  checkUserPermission(args, "delete", "mediaPermission");

export const Media: CollectionConfig = {
  slug: "media",

  labels: {
    singular: {
      en: "Media",
      zh: "媒体",
    },
    plural: {
      en: "Media",
      zh: "媒体",
    },
  },
  admin: {
    group: {
      en: "Page Settings",
    },
  },
  access: {
    read: () => true,
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
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ];
        },
      }),
      localized: true,
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
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, "../../public/media"),
    adminThumbnail: "thumbnail",
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
      },
      {
        name: "square",
        width: 500,
        height: 500,
      },
      {
        name: "small",
        width: 600,
      },
      {
        name: "medium",
        width: 900,
      },
      {
        name: "large",
        width: 1400,
      },
      {
        name: "xlarge",
        width: 1920,
      },
      {
        name: "og",
        width: 1200,
        height: 630,
        crop: "center",
      },
    ],
  },
};


