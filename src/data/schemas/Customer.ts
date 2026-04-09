import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Customers.
 * Refactored from legacy Payload CMs.
 */
export const Customers: CollectionConfig = {
  slug: "customers",
  labels: {
    singular: { en: "Customer", zh: "客户", hr: "Kupac" },
    plural: { en: "Customers list", zh: "客户列表", hr: "Popis kupaca" }
  },
  admin: {
    useAsTitle: "fullName",
    group: { en: "Customer Management", zh: "客户管理", hr: "Upravljanje kupcima" }
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "firstName",
      type: "text"
    },
    {
      name: "lastName",
      type: "text"
    },
    {
      name: "fullName",
      type: "text",
    },
    {
      name: "birthDate",
      type: "date",
    },
    {
      name: "lastBuyerType",
      type: "select",
      options: [
        { value: "individual", label: "Individual" },
        { value: "company", label: "Company" },
      ]
    },
    {
      name: "shippings",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "address", type: "text", required: true },
        { name: "city", type: "text", required: true },
        { name: "country", type: "text", required: true },
        { name: "region", type: "text", required: true },
        { name: "postalCode", type: "text", required: true },
        { name: "phone", type: "text", required: true },
        { name: "email", type: "text" },
        { name: "default", type: "checkbox", defaultValue: false },
      ]
    },
    {
      name: "cart",
      type: "json",
    },
    {
      name: "wishlist",
      type: "json",
    },
  ]
};
