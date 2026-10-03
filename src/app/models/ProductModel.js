const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", index: true },
  director: { type: String, trim: true, default: "" },
  actors: [{ type: String, trim: true }],
  releaseYear: Number,
  duration: Number,
  language: String,
    price: { type: Number, required: true, min: 0 },
  discountPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: { type: String, default: "" },
  gallery: [String],
    description: { type: String, default: "" },
    soldCount: { type: Number, default: 0, min: 0 },
    viewCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

productSchema.index({ name: "text" });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);
