import mongoose, { Schema, model, models } from "mongoose";

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    parentId: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    // for compatibility with some older parts
    title: { type: String },
  },
  { timestamps: true }
);

CategorySchema.pre("save", function (this: any, next: () => void) {
  if (this.name && !this.title) this.title = this.name;
  next();
});

const Category = models.Category || model("Category", CategorySchema);
export default Category;
