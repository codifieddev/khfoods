import mongoose, { Schema, model, models } from "mongoose";

const AttributeSetSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    attributeIds: [{ type: Schema.Types.ObjectId, ref: "Attribute" }],
  },
  { timestamps: true }
);

const AttributeSet = models.AttributeSet || model("AttributeSet", AttributeSetSchema);
export default AttributeSet;
