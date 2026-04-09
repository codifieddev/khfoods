import type { CollectionConfig } from "@/types/cms";

/**
 * Native schema definition for Orders.
 * Refactored from legacy Payload CMs.
 */
export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "id",
    group: { en: "Orders", zh: "订单", hr: "Narudžbe" }
  },
  labels: {
    singular: { en: "Order", zh: "订单", hr: "Narudžba" },
    plural: { en: "Orders", zh: "订单", hr: "Narudžbe" }
  },
  fields: [
    {
      name: "id",
      type: "text",
      required: true,
      unique: true
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "General",
          fields: [
            {
              name: "customer",
              type: "relationship",
              relationTo: "customers",
            },
            {
              name: "date",
              type: "date",
            },
            {
              name: "products",
              type: "array",
              fields: [
                {
                  name: "product",
                  type: "relationship",
                  relationTo: "products"
                },
                {
                  name: "variantSlug",
                  type: "text",
                },
                {
                  name: "quantity",
                  type: "number",
                  required: true
                },
                {
                  name: "price",
                  type: "number",
                },
                {
                  name: "priceTotal",
                  type: "number",
                  required: true
                },
              ]
            },
          ]
        },
        {
          label: "Invoice",
          fields: [
            {
              name: "invoice",
              type: "group",
              fields: [
                { name: "isCompany", type: "checkbox" },
                { name: "name", type: "text" },
                { name: "tin", type: "text" },
                { name: "address", type: "text" },
                { name: "city", type: "text" },
                { name: "country", type: "text" },
                { name: "region", type: "text" },
                { name: "postalCode", type: "text" },
              ]
            },
          ]
        },
        {
          label: "Shipping",
          fields: [
            {
              name: "shippingAddress",
              type: "group",
              fields: [
                { name: "name", type: "text", required: true },
                { name: "address", type: "text", required: true },
                { name: "pickupPointID", type: "text" },
                { name: "pickupPointAddress", type: "text" },
                { name: "city", type: "text", required: true },
                { name: "country", type: "text", required: true },
                { name: "region", type: "text", required: true },
                { name: "postalCode", type: "text", required: true },
                { name: "email", type: "text", required: true },
                { name: "phone", type: "text", required: true },
              ]
            },
          ]
        },
      ]
    },
    {
      name: "orderDetails",
      type: "group",
      fields: [
        { name: "website", type: "relationship", relationTo: "websites" },
        { name: "total", type: "number", required: true },
        { name: "shippingCost", type: "number", required: true },
        { name: "totalWithShipping", type: "number", required: true },
        { name: "currency", type: "text" },
        { name: "amountPaid", type: "number", defaultValue: 0 },
        { name: "shipping", type: "text" },
        { name: "transactionID", type: "text" },
        {
          name: "status",
          type: "select",
          options: [
            { value: "pending", label: "Pending" },
            { value: "paid", label: "Paid" },
            { value: "unpaid", label: "Unpaid" },
            { value: "processing", label: "Processing" },
            { value: "shipped", label: "Shipped" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "returned", label: "Returned" },
          ],
          required: true,
          defaultValue: "pending"
        },
        { name: "shippingDate", type: "date" },
        { name: "trackingNumber", type: "text" },
        { name: "orderNote", type: "textarea" },
      ]
    },
  ]
};
