const mongoose = require("mongoose");

const homeSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    title: { type: String, trim: true },
    slug: { type: String, unique: true, trim: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    director: { type: String, trim: true },
    actors: [{ type: String, trim: true }],
    releaseYear: Number,
    duration: Number,
    language: String,
    price: { type: Number, min: 0 },
    discountPrice: { type: Number, min: 0 },
    stock: { type: Number, min: 0 },
    image: String,
    description: String,
    soldCount: { type: Number, min: 0 },
    isFeatured: Boolean,
    isActive: Boolean,
  },
  { timestamps: true, collection: "products" },
);

module.exports = mongoose.model("HomeModel", homeSchema);
