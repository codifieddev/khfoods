import mongoose, { Schema, model, models } from "mongoose";

const AttributeSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ["text", "select", "color"], default: "text" },
    values: [{ type: String }],
  },
  { timestamps: true }
);

const Attribute = models.Attribute || model("Attribute", AttributeSchema);
export default Attribute;
