import mongoose, { Schema, model, models } from "mongoose";

const VariantSchema = new Schema({
  title: { type: String, required: true },
  sku: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
});

const AttributeValueSchema = new Schema({
  name: { type: String, required: true },
  value: { type: String, required: true },
});

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["active", "draft"],
      default: "draft",
    },
    type: {
      type: String,
      enum: ["physical", "digital"],
      default: "physical",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    categoryIds: [{
      type: Schema.Types.ObjectId,
      ref: "Category",
    }],
    primaryCategoryId: {
      type: Schema.Types.Mixed,
    },
    attributeSetIds: [{
      type: Schema.Types.Mixed,
    }],
    attributes: [AttributeValueSchema],
    variants: [VariantSchema],
    gallery: [{
      type: String,
    }],
    primaryImageId: {
      type: String,
    },
    relatedProductIds: [{
      type: Schema.Types.ObjectId,
      ref: "Product",
    }],
    // Legacy support
    title: { type: String },
    image: { type: String },
    stock: { type: Number },
    category: { type: String },
    isFeatured: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Auto-generate title from name if not provided
ProductSchema.pre("save", function (this: any, next: () => void) {
  if (this.name && !this.title) this.title = this.name;
  if (this.gallery && this.gallery.length > 0 && !this.image) this.image = this.gallery[0];
  next();
});

const Product = models.Product || model("Product", ProductSchema);

export default Product;
