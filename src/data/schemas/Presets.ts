import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Presets.
 * Refactored from legacy Payload CMs.
 */
export const Presets: CollectionConfig = {
  slug: "presets",
  labels: {
    singular: { en: "Preset", zh: "预设" },
    plural: { en: "Presets", zh: "预设" }
  },
  admin: {
    useAsTitle: "name",
    group: { en: "Website Management", zh: "网站管理", hr: "Upravljanje web stranicom" }
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true
    },
    {
      name: "type",
      type: "select",
      required: true,
      options: [
        { label: "Layout", value: "layout" },
        { label: "Section", value: "section" },
        { label: "Module", value: "module" },
      ],
    },
    {
      name: "value",
      type: "json",
      required: true,
    },
  ]
};
