import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        title: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Order = models.Order || model("Order", OrderSchema);

export default Order;
