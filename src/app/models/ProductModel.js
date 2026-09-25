const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      index: true,
    },
    director: { type: String, trim: true },
    actors: [{ type: String, trim: true }],
    releaseYear: Number,
    duration: Number,
    language: String,
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    image: String,
    gallery: [String],
    description: String,
    soldCount: { type: Number, default: 0, min: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "products" },
);

productSchema.index({ name: "text" });

module.exports = mongoose.model("Product", productSchema);
